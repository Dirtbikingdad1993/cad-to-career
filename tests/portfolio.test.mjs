import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {verification, imageChoices, imageType, publicProject} from '../supabase/functions/cad-portfolio/core.mjs';
import {createHandler} from '../supabase/functions/cad-portfolio/handler.mjs';

const alice='11111111-1111-4111-8111-111111111111', bob='22222222-2222-4222-8222-222222222222';
const reviewer='33333333-3333-4333-8333-333333333333', plateId='44444444-4444-4444-8444-444444444444';
const partId='55555555-5555-4555-8555-555555555555', pendingId='66666666-6666-4666-8666-666666666666';
const path=alice+'/'+partId+'/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa-preview.png';
const date='2026-01-01T00:00:00Z';
const plate={id:plateId,user_id:alice,project_id:1,status:'approved',score:100,reviewer_id:null,submitted_at:date,submitted_notes:'Server-validated precision mounting plate · foundations-v1',evidence_paths:[]};
const part={id:partId,user_id:alice,project_id:2,status:'approved',score:90,reviewer_id:reviewer,submitted_at:date,submitted_notes:'private notes',evidence_paths:[path,alice+'/'+partId+'/model.step']};
const review={submission_id:partId,reviewer_id:reviewer,score:90,verdict:'approved',reviewed_at:date};
const png=new Uint8Array([137,80,78,71,13,10,26,10,1,2,3]);

test('verification cannot be claimed from editable text, self-review, stale or mismatched reviews',async()=>{
 assert.equal((await verification(plate,[])).kind,'geometry');
 assert.match((await verification(plate,[])).scope,/Authorship/);
 assert.equal(await verification({...plate,submitted_notes:'pretend'},[]),null);
 assert.equal((await verification(part,[review])).kind,'human');
 assert.equal(await verification(part,[]),null);
 assert.equal(await verification({...part,user_id:reviewer},[review]),null);
 assert.equal(await verification({...part,score:91},[review]),null);
 assert.equal(await verification({...part,status:'changes_requested'},[review]),null);
 assert.equal(await verification({...part,project_id:5,score:84},[{...review,score:84}]),null);
 assert.equal((await verification({...part,project_id:5,score:85},[{...review,score:85}])).kind,'human');
});
test('cover choices require the owner and submission path and image magic is checked',()=>{
 const traversal=alice+'/'+partId+'/../../'+bob+'/private.png';
 const encoded=alice+'/'+partId+'/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa-%2e%2e%2fprivate.png';
 assert.deepEqual(imageChoices({...part,evidence_paths:[path,bob+'/'+partId+'/bad.png',alice+'/'+pendingId+'/bad.jpg',alice+'/'+partId+'/file.svg',traversal,encoded]}),[{path,name:'preview.png'}]);
 assert.equal(imageType(png),'image/png');assert.equal(imageType(new Uint8Array([255,216,255,0])),'image/jpeg');
 assert.equal(imageType(new TextEncoder().encode('<svg>')),null);
});
function mockBackend(){
 const db={portfolio_profiles:[],portfolio_entries:[],project_submissions:[{...plate},{...part},{...part,id:pendingId,status:'needs_review',score:null,reviewer_id:null,evidence_paths:[]}],project_reviews:[{...review}]};
 let bytes=png, publicAllowed=true, userAllowed=true;
 const fetcher=async (input,init={})=>{
  const u=new URL(input), method=init.method||'GET';
  if(u.pathname.endsWith('/rpc/cad_portfolio_public_quota'))return Response.json(publicAllowed);
  if(u.pathname.endsWith('/rpc/cad_portfolio_user_quota'))return Response.json(userAllowed);
  if(u.pathname==='/auth/v1/user'){
   const token=init.headers.Authorization; const id=token==='Bearer alice-token'?alice:token==='Bearer bob-token'?bob:null;
   return id?Response.json({id}):new Response('',{status:401});
  }
  if(u.pathname.startsWith('/storage/v1/'))return new Response(bytes,{headers:{'content-length':String(bytes.length)}});
  const table=u.pathname.split('/').pop(), data=db[table];if(!data)throw Error('unknown table '+table);
  const match=row=>[...u.searchParams].every(([k,v])=>{
   if(['select','order','limit'].includes(k))return true;
   if(v.startsWith('eq.'))return String(row[k])===v.slice(3);
   if(v.startsWith('in.('))return v.slice(4,-1).split(',').includes(String(row[k]));
   throw Error('unknown filter '+k+' '+v);
  });
  if(method==='GET')return Response.json(data.filter(match));
  if(method==='POST'){
   const row=JSON.parse(init.body);if(table==='portfolio_profiles')row.public_id=randomUUID();data.push(row);return Response.json([row]);
  }
  if(method==='PATCH'){
   const rows=data.filter(match);for(const row of rows)Object.assign(row,JSON.parse(init.body));return Response.json(rows);
  }
  if(method==='DELETE'){const rows=data.filter(match);db[table]=data.filter(x=>!match(x));return Response.json(rows);}
  throw Error('unknown method');
 };
 return {db,fetcher,setImage:data=>bytes=data,setPublicAllowed:value=>publicAllowed=value,setUserAllowed:value=>userAllowed=value};
}
const post=(handler,token,body)=>handler(new Request('https://edge.test/cad-portfolio',{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(body)}));
const get=(handler,id,cover)=>handler(new Request('https://edge.test/cad-portfolio?id='+id+(cover?'&cover='+cover:'')));
const read=async response=>({status:response.status,body:await response.json()});

test('owner opt-in, independent verification, image consent, link rotation, and unpublish are enforced server-side',async()=>{
 const b=mockBackend(), h=createHandler({base:'https://db.test',service:'secret',fetcher:b.fetcher});
 assert.equal((await post(h,'nope',{action:'load'})).status,401);
 const profile=await read(await post(h,'alice-token',{action:'save_profile',displayName:'Alice',headline:'Designer',bio:'My work',isPublic:false}));
 const id=profile.body.profile.public_id;
 assert.equal((await get(h,id)).status,404);
 const settings={action:'save_entry',submissionId:partId,title:'Bracket',summary:'A design',process:'Measured twice',tools:'FreeCAD',coverPath:path,isPublic:true};
 assert.equal((await post(h,'bob-token',settings)).status,404);
 assert.equal((await post(h,'alice-token',{...settings,submissionId:pendingId,coverPath:''})).status,409);
 assert.equal((await post(h,'alice-token',{...settings,coverPath:bob+'/'+partId+'/private.png'})).status,400);
 b.setImage(new TextEncoder().encode('<svg onload=alert(1)>'));
 assert.equal((await post(h,'alice-token',settings)).status,400);
 b.setImage(png);
 assert.equal((await post(h,'alice-token',settings)).status,200);
 assert.equal((await get(h,id)).status,404);
 await post(h,'alice-token',{action:'save_profile',displayName:'Alice',headline:'Designer',bio:'My work',isPublic:true});
 const visible=await read(await get(h,id));
 assert.equal(visible.status,200);assert.equal(visible.body.projects.length,1);
 assert.equal(visible.body.projects[0].verification.kind,'human');assert.equal(visible.body.projects[0].hasCover,true);
 const raw=JSON.stringify(visible.body);assert.ok(!raw.includes('private notes'));assert.ok(!raw.includes(path));assert.ok(!raw.includes(alice));assert.ok(!raw.includes(reviewer));
 const image=await get(h,id,partId);assert.equal(image.status,200);assert.equal(image.headers.get('content-type'),'image/png');assert.equal(image.headers.get('cache-control'),'no-store');
 assert.deepEqual(new Uint8Array(await image.arrayBuffer()),png);
 b.db.project_reviews[0].verdict='rejected';
 assert.equal((await read(await get(h,id))).body.projects.length,0);
 assert.equal((await get(h,id,partId)).status,404);
 b.db.project_reviews[0].verdict='approved';
 const rotated=await read(await post(h,'alice-token',{action:'rotate_link'}));const newId=rotated.body.profile.public_id;
 assert.notEqual(id,newId);assert.equal((await get(h,id)).status,404);assert.equal((await get(h,newId)).status,200);
 await post(h,'alice-token',{action:'save_profile',displayName:'Alice',headline:'Designer',bio:'My work',isPublic:false});
 assert.equal((await get(h,newId)).status,404);assert.equal((await get(h,newId,partId)).status,404);
 assert.equal((await post(h,'bob-token',{action:'delete_entry',submissionId:partId})).status,200);
 assert.equal(b.db.portfolio_entries.length,1);
 assert.equal((await post(h,'alice-token',{action:'delete_entry',submissionId:partId})).status,200);
 assert.equal(b.db.portfolio_entries.length,0);assert.equal(b.db.project_submissions.length,3);
});

test('a server-checked plate saves a digest and exact geometry without learner metadata',async()=>{
 const {readFileSync}=await import('node:fs');
 const vm=await import('node:vm');
 const {webcrypto}=await import('node:crypto');
 const stored=[{...plate}];let handler;
 const fetcher=async(url,init={})=>{
  if(url.includes('/auth/v1/user'))return Response.json({id:alice});
  if(url.includes('/rest/v1/project_submissions')){
   if(init.method==='GET')return Response.json(stored);
   if(init.method==='POST'){const row={...JSON.parse(init.body),id:'99999999-9999-4999-8999-999999999999',submitted_at:date,reviewer_id:null};stored.push(row);return Response.json([row]);}
  }
  throw Error('unexpected call');
 };
 vm.runInNewContext(readFileSync('supabase/functions/cad-assess/index.ts','utf8'),{Deno:{env:{get:()=> 'test'},serve:fn=>handler=fn},Response,fetch:fetcher,crypto:webcrypto,TextEncoder,Uint8Array,console});
 const shapes=[{type:'rect',x:0,y:0,w:120,h:70,privateNote:'do not save'},...[{x:15,y:15},{x:105,y:15},{x:15,y:55},{x:105,y:55}].map(p=>({type:'circle',...p,d:8,id:'local-id'}))];
 const request=()=>new Request('https://test.invalid',{method:'POST',headers:{authorization:'Bearer learner','content-type':'application/json'},body:JSON.stringify({action:'project1',shapes})});
 const result=await (await handler(request())).json();
 assert.equal(result.evidenceSaved,true);assert.equal(stored.length,2);
 const check=await verification(stored[1],[]);
 assert.equal(check.evidence.validator,'foundations-v1');assert.equal(check.evidence.snapshot.shapes.length,5);
 assert.ok(!stored[1].submitted_notes.includes('privateNote'));assert.ok(!stored[1].submitted_notes.includes('local-id'));
 assert.match(check.evidence.sha256,/^[0-9a-f]{64}$/);
 const {createHash}=await import('node:crypto');assert.equal(createHash('sha256').update(JSON.stringify(check.evidence.snapshot)).digest('hex'),check.evidence.sha256);
 const shown=await publicProject({is_public:true,user_id:alice,submission_id:stored[1].id,title:'Plate'},stored[1],[]);assert.equal(shown.verification.evidence.snapshot.shapes.length,5);
 await handler(request());assert.equal(stored.length,2,'the same drawing should reuse its existing record');
 const tampered=JSON.parse(stored[1].submitted_notes);const snapshot=JSON.parse(tampered.snapshot);snapshot.shapes[0].w=200;tampered.snapshot=JSON.stringify(snapshot);
 assert.equal(await verification({...stored[1],submitted_notes:JSON.stringify(tampered)},[]),null);
 const old=await verification(plate,[]);assert.equal(old.evidence,null);assert.match(old.scope,/did not retain/);
 assert.equal(await publicProject({is_public:true,user_id:alice,submission_id:plateId},plate,[]),null,'legacy records cannot be published without retained geometry');
});


test('shared and account quotas fail closed with retry guidance',async()=>{
 const b=mockBackend(),h=createHandler({base:'https://db.test',service:'secret',fetcher:b.fetcher});
 b.setPublicAllowed(false);const blocked=await get(h,plateId);assert.equal(blocked.status,429);assert.equal(blocked.headers.get('retry-after'),'60');
 b.setPublicAllowed(true);b.setUserAllowed(false);assert.equal((await post(h,'alice-token',{action:'load'})).status,429);
 b.setUserAllowed(true);const huge=await post(h,'alice-token',{action:'save_profile',displayName:'x'.repeat(17000)});assert.equal(huge.status,400);
});
