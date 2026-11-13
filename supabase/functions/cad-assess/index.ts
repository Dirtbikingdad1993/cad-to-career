// CAD to Career trusted assessment service. Deploy with verify_jwt=true.
// Service key stays only in Supabase Edge Function environment.
const BASE=Deno.env.get("SUPABASE_URL")||"";
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const QUIZ_KEYS=["ABC","ABC","CAB","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC","ABC"];
const ASSESSMENT_VERSION="foundations-v1";
function cors(req){
 const origin=req.headers.get("origin")||"";
 const allowed=origin==="https://cad-to-career.vercel.app"||/^https:\/\/cad-to-career-[a-z0-9-]+\.vercel\.app$/.test(origin)||/^http:\/\/localhost:\d+$/.test(origin);
 return {"Access-Control-Allow-Origin":allowed?origin:"https://cad-to-career.vercel.app","Vary":"Origin","Access-Control-Allow-Headers":"authorization, apikey, content-type, x-client-info","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
}
function response(req,data,status=200){return new Response(JSON.stringify(data),{status,headers:cors(req)})}
function uid(value){return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value||"")}
async function database(table,query="",method="GET",body,preference="return=representation"){
 const headers={"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,"Content-Type":"application/json"};
 if(method!=="GET")headers["Prefer"]=preference;
 const r=await fetch(BASE+"/rest/v1/"+table+query,{method,headers,body:body===undefined?undefined:JSON.stringify(body)});
 const raw=await r.text();let payload;try{payload=raw?JSON.parse(raw):null}catch(_){payload=raw}
 if(!r.ok){console.error("Database operation failed",r.status,table);throw Error("Database request failed")}
 return payload;
}
async function authenticatedUser(req){
 const auth=req.headers.get("authorization")||"";
 if(!auth.startsWith("Bearer "))throw Error("Sign in required");
 const token=auth.slice(7);
 const r=await fetch(BASE+"/auth/v1/user",{headers:{"apikey":SERVICE,"Authorization":"Bearer "+token}});
 if(!r.ok)throw Error("Invalid or expired session");
 const user=await r.json();if(!uid(user.id))throw Error("Invalid account");
 return user;
}
function evaluatePlate(shapes){
 const lines=[],tol=(a,b,t)=>typeof a==="number"&&Number.isFinite(a)&&Math.abs(a-b)<=t+1e-9;
 if(!Array.isArray(shapes)||shapes.length!==5)return {pass:false,score:0,feedback:["Exactly one rectangle and four circles are required."]};
 const rs=shapes.filter(s=>s&&s.type==="rect"),cs=shapes.filter(s=>s&&s.type==="circle");
 if(rs.length!==1||cs.length!==4)return {pass:false,score:0,feedback:["Drawing must contain exactly one rectangle and four circles."]};
 let score=0;
 const r=rs[0];
 if(tol(r.x,0,.25)&&tol(r.y,0,.25)&&tol(r.w,120,.25)&&tol(r.h,70,.25)){score+=20;lines.push("Plate geometry correct.")}
 else lines.push("Plate must be 120 × 70 mm with lower-left at (0,0), within ±0.25 mm.");
 const expected=[[15,15],[105,15],[15,55],[105,55]],used=new Set();
 for(const [x,y] of expected){
  const j=cs.findIndex((c,i)=>!used.has(i)&&tol(c.x,x,.25)&&tol(c.y,y,.25)&&tol(c.d,8,.15));
  if(j<0)lines.push("Missing or incorrect Ø8 mm hole at ("+x+","+y+").");
  else{used.add(j);score+=20}
 }
 return {score,pass:score===100,feedback:lines};
}
async function projectStatus(userId){
 const id=encodeURIComponent(userId);
 const [quizzes,lessons,projects,certificates]=await Promise.all([
  database("quiz_results","?user_id=eq."+id+"&assessment_version=eq."+ASSESSMENT_VERSION+"&select=lesson_id,score,passed,taken_at"),
  database("exercise_confirmations","?user_id=eq."+id+"&select=lesson_id,confirmed_at"),
  database("project_submissions","?user_id=eq."+id+"&select=id,project_id,status,score,submitted_at,reviewed_at&order=submitted_at.desc"),
  database("certificates","?user_id=eq."+id+"&select=id,program_code,issued_at,revoked_at,public_name")
 ]);
 return {quizzes,lessons,projects,certificates};
}
async function reviewerRole(userId){
 const rs=await database("reviewer_memberships","?user_id=eq."+encodeURIComponent(userId)+"&select=role");
 return rs?.[0]?.role||null;
}
async function projectReview(req,user,body){
 const role=await reviewerRole(user.id);
 if(!role) return response(req,{error:"Reviewer access required."},403);
 if(body.action==="review_queue"){
  const pending=await database("project_submissions","?status=eq.needs_review&project_id=gt.1&select=id,project_id,user_id,submitted_notes,evidence_paths,submitted_at&order=submitted_at.asc&limit=100");
  return response(req,{role,pending});
 }
 if(body.action!=="review")return response(req,{error:"Unsupported reviewer action"},400);
 const id=String(body.submissionId||"");
 const verdict=String(body.verdict||""),score=Number(body.score);
 if(!uid(id)||!["approved","changes_requested","rejected"].includes(verdict)||!Number.isInteger(score)||score<0||score>100)
  return response(req,{error:"Invalid review fields"},400);
 const entries=await database("project_submissions","?id=eq."+id+"&select=id,user_id,project_id,status");
 const sub=entries?.[0];
 if(!sub||sub.project_id<2||sub.status!=="needs_review")return response(req,{error:"Submission not eligible for review"},409);
 const required=sub.project_id===5?85:80;
 if(verdict==="approved"&&score<required)return response(req,{error:"Approval score must meet project rubric threshold"},400);
 const feedback=String(body.feedback||"").slice(0,2500);
 await database("project_reviews","","POST",{submission_id:id,reviewer_id:user.id,verdict,score,feedback,rubric:{"version":"rubric-v1"}});
 await database("project_submissions","?id=eq."+id,"PATCH",{status:verdict,score,reviewer_id:user.id,reviewed_at:new Date().toISOString()});
 return response(req,{ok:true,id,verdict,score});
}
async function signedReviewEvidence(req,user,body){
 const role=await reviewerRole(user.id);
 if(!role)return response(req,{error:"Reviewer access required"},403);
 const id=String(body.submissionId||""),path=String(body.path||"");
 if(!uid(id)||path.length>500)return response(req,{error:"Invalid file request"},400);
 const entries=await database("project_submissions","?id=eq."+id+"&select=id,user_id,evidence_paths");
 const submission=entries?.[0];
 if(!submission||!Array.isArray(submission.evidence_paths)||!submission.evidence_paths.includes(path)||!path.startsWith(submission.user_id+"/"))
   return response(req,{error:"File does not belong to this submission"},403);
 const signed=await fetch(BASE+"/storage/v1/object/sign/cad-submissions/"+path.split("/").map(encodeURIComponent).join("/"),{
  method:"POST",headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE,"Content-Type":"application/json"},
  body:JSON.stringify({expiresIn:300})
 });
 if(!signed.ok)return response(req,{error:"Could not open evidence"},503);
 const result=await signed.json();
 const location=String(result.signedURL||result.signedUrl||"");
 if(!location||!location.startsWith("/"))return response(req,{error:"No signed URL returned"},503);
 return response(req,{url:BASE+"/storage/v1"+location,expiresIn:300});
}

async function issueCertificate(req,user,body){
 if(!user.email_confirmed_at)return response(req,{error:"Email verification is required."},403);
 const data=await projectStatus(user.id);
 const quizIds=new Set(data.quizzes.filter(x=>x.passed&&x.score>=80).map(x=>x.lesson_id));
 const lessonIds=new Set(data.lessons.map(x=>x.lesson_id));
 const approved=new Map();
 data.projects.filter(x=>x.status==="approved").forEach(x=>{
  const prev=approved.get(x.project_id);if(!prev||x.score>prev.score)approved.set(x.project_id,x);
 });
 if(quizIds.size<20||lessonIds.size<20||[1,2,3,4,5].some(i=>!approved.has(i))||approved.get(5).score<85)
  return response(req,{eligible:false,requirements:{verifiedQuizzes:quizIds.size,confirmedExercises:lessonIds.size,approvedProjects:approved.size,capstoneApproved:Boolean(approved.get(5)&&approved.get(5).score>=85)}},409);
 const name=String(body.publicName||"").trim();
 if(name.length<2||name.length>80)return response(req,{error:"Enter a certificate display name (2–80 characters)."},400);
 let existing=data.certificates.find(x=>x.program_code==="cad-foundations");
 if(existing)return response(req,{certificate:existing,issued:false});
 const out=await database("certificates","","POST",{user_id:user.id,program_code:"cad-foundations",public_name:name});
 return response(req,{certificate:out?.[0],issued:true});
}
Deno.serve(async(req)=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers:cors(req)});
 if(req.method!=="POST")return response(req,{error:"POST required"},405);
 if(!BASE||!SERVICE)return response(req,{error:"Assessment service unavailable"},503);
 try{
  const user=await authenticatedUser(req);
  const body=await req.json();
  if(!body||typeof body!=="object")return response(req,{error:"Invalid request"},400);
  switch(String(body.action||"")){
   case "status":return response(req,{status:await projectStatus(user.id),reviewer:await reviewerRole(user.id)});
   case "quiz":{
    const lessonId=Number(body.lessonId),answers=body.answers;
    if(!Number.isInteger(lessonId)||lessonId<1||lessonId>20||!Array.isArray(answers)||answers.length!==3||answers.some(x=>!["A","B","C"].includes(x)))
      return response(req,{error:"Invalid quiz attempt"},400);
    const expected=QUIZ_KEYS[lessonId-1],correct=answers.filter((x,i)=>x===expected[i]).length;
    const score=Math.round(correct/3*100),passed=score>=80;
    await database("quiz_results","?on_conflict=user_id,lesson_id,assessment_version","POST",
     {user_id:user.id,lesson_id:lessonId,assessment_version:ASSESSMENT_VERSION,score,passed,taken_at:new Date().toISOString()},
     "resolution=merge-duplicates,return=representation");
    return response(req,{score,passed,verified:true});
   }
   case "exercise":{
    const lessonId=Number(body.lessonId);
    if(!Number.isInteger(lessonId)||lessonId<1||lessonId>20)return response(req,{error:"Invalid lesson"},400);
    await database("exercise_confirmations","?on_conflict=user_id,lesson_id","POST",{user_id:user.id,lesson_id:lessonId},"resolution=merge-duplicates,return=representation");
    return response(req,{confirmed:true,lessonId});
   }
   case "project1":{
    const evaluation=evaluatePlate(body.shapes);
    if(evaluation.pass){
      const history=await database("project_submissions","?user_id=eq."+encodeURIComponent(user.id)+"&project_id=eq.1&status=eq.approved&select=id&limit=1");
      if(!history.length)await database("project_submissions","","POST",{user_id:user.id,project_id:1,status:"approved",score:100,submitted_notes:"Server-validated precision mounting plate · "+ASSESSMENT_VERSION,evidence_paths:[]});
    }
    return response(req,{...evaluation,verified:true});
   }
   case "review_queue":case "review":return await projectReview(req,user,body);
   case "review_file":return await signedReviewEvidence(req,user,body);
   case "issue_certificate":return await issueCertificate(req,user,body);
   default:return response(req,{error:"Unknown assessment action"},400);
  }
 }catch(error){
  const msg=String(error?.message||"");
  if(/session|Sign in required|Invalid account/.test(msg))return response(req,{error:"Please sign in again."},401);
  console.error("Assessment error",msg);
  return response(req,{error:"Assessment could not be completed. Try again."},500);
 }
});
