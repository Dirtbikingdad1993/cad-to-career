const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {webcrypto}=require('node:crypto');

const learner='11111111-1111-4111-8111-111111111111';
const reviewer='22222222-2222-4222-8222-222222222222';
const submissionId='33333333-3333-4333-8333-333333333333';
const fileId='44444444-4444-4444-8444-444444444444';
const validPath=`${learner}/${submissionId}/${fileId}-source.FCStd`;

function service(evidencePath=validPath,hasRole=true){
 let handler;const signed=[];
 const fetcher=async(input,init={})=>{
  const url=new URL(input);
  if(url.pathname==='/auth/v1/user')return Response.json({id:reviewer});
  if(url.pathname==='/rest/v1/reviewer_memberships')return Response.json(hasRole?[{role:'reviewer'}]:[]);
  if(url.pathname==='/rest/v1/project_submissions')return Response.json([{id:submissionId,user_id:learner,evidence_paths:[evidencePath]}]);
  if(url.pathname.startsWith('/storage/v1/object/sign/cad-submissions/')){
   signed.push({url:url.toString(),body:JSON.parse(init.body)});
   return Response.json({signedURL:'/object/sign/cad-submissions/'+validPath+'?token=synthetic-test-token'});
  }
  throw Error('Unexpected backend request');
 };
 vm.runInNewContext(fs.readFileSync('supabase/functions/cad-assess/index.ts','utf8'),{
  Deno:{env:{get:key=>key==='SUPABASE_URL'?'https://backend.test':'synthetic-key'},serve:fn=>handler=fn},
  fetch:fetcher,Response,URL,crypto:webcrypto,TextEncoder,TextDecoder,Uint8Array,console,
 });
 const request=(body,raw=false)=>handler(new Request('https://edge.test/cad-assess',{
  method:'POST',headers:{authorization:'Bearer synthetic-token','content-type':'application/json'},body:raw?body:JSON.stringify(body),
 }));
 return {request,signed};
}

test('review links only sign the exact owner, submission and generated filename',async()=>{
 const good=service();
 const result=await good.request({action:'review_file',submissionId,path:validPath});
 assert.equal(result.status,200);
 assert.equal(good.signed.length,1);
 assert.equal(good.signed[0].body.expiresIn,300);
 for(const path of [
  `${learner}/${submissionId}/../../${reviewer}/private.step`,
  `${learner}/${submissionId}/${fileId}-%2e%2e%2fsecret.step`,
  `${learner}/${submissionId}/${fileId}-file%252fsecret.step`,
  `${learner}/${reviewer}/${fileId}-source.step`,
  `${reviewer}/${submissionId}/${fileId}-source.step`,
  `${learner}/${submissionId}/${fileId}-folder\\file.step`,
  `${learner}/${submissionId}/model.step`,
 ]){
  const bad=service(path);
  assert.equal((await bad.request({action:'review_file',submissionId,path})).status,403,path);
  assert.equal(bad.signed.length,0,'invalid paths must not reach Storage');
 }
 const outsider=service(validPath,false);
 assert.equal((await outsider.request({action:'review_file',submissionId,path:validPath})).status,403);
 assert.equal(outsider.signed.length,0);
});

test('malformed and oversized assessment bodies fail with bounded client errors',async()=>{
 const s=service();
 for(const body of ['{', '[]', 'null'])assert.equal((await s.request(body,true)).status,400);
 const oversized=JSON.stringify({action:'review_file',feedback:'x'.repeat(17000)});
 assert.equal((await s.request(oversized,true)).status,413);
 // Multibyte text is measured in bytes, even without a Content-Length header.
 assert.equal((await s.request({action:'review_file',feedback:'🙂'.repeat(5000)})).status,413);
 assert.equal(s.signed.length,0);
});
