/* CAD to Career independent Supabase Auth + cloud workspace client.
   Publishable key only. No admin/service key is shipped to browsers.
   This is PRACTICE state; it does not grant verified course credit. */
(function(){
"use strict";
const config=window.CAD_CLOUD_CONFIG||{};
const url=String(config.url||"").replace(/\/$/,"");
const publishable=String(config.publishableKey||"");
const AUTH_KEY="cad-to-career-auth-session-v1";
let session=null, user=null, refreshPromise=null, recovery=false;
function storeSession(next){
  session=next;
  try{if(session)localStorage.setItem(AUTH_KEY,JSON.stringify(session));else localStorage.removeItem(AUTH_KEY)}catch(_){}
}
function emit(){window.dispatchEvent(new CustomEvent("cad-auth-change",{detail:{user:user,recovery:recovery}}))}
function errMessage(body,status){return String(body?.msg||body?.error_description||body?.message||body?.error||"Cloud request failed ("+status+").")}
async function request(path,method,body,authed,options){
  if(!url||!publishable)throw Error("Cloud configuration unavailable.");
  const headers={"apikey":publishable};
  if(body!==undefined&&!(body instanceof Blob)&&!(body instanceof File))headers["Content-Type"]="application/json";
  if(authed){let token=await accessToken();headers["Authorization"]="Bearer "+token}
  if(options?.headers)Object.assign(headers,options.headers);
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),20000);
  try{
    const res=await fetch(url+path,{method:method||"GET",headers:headers,body:body===undefined?undefined:body instanceof Blob||body instanceof File?body:JSON.stringify(body),signal:controller.signal});
    const str=await res.text(),parsed=str?(str.startsWith("{")||str.startsWith("[")?JSON.parse(str):str):null;
    if(!res.ok){const error=new Error(errMessage(parsed,res.status));error.status=res.status;throw error}
    return parsed;
  }finally{clearTimeout(timeout)}
}
function acceptToken(data){
  if(!data?.access_token||!data?.refresh_token)throw Error("Session tokens were not returned.");
  const ttl=Math.max(60,Number(data.expires_in)||3600);
  user=data.user||user;
  storeSession({access_token:data.access_token,refresh_token:data.refresh_token,expires_at:Date.now()+ttl*1000,user:user});
}
async function refresh(){
  if(refreshPromise)return refreshPromise;
  if(!session?.refresh_token)throw Error("Sign in again to sync your data.");
  const previous=session.refresh_token;
  refreshPromise=(async()=>{
    const result=await request("/auth/v1/token?grant_type=refresh_token","POST",{refresh_token:previous},false);
    acceptToken(result);
    return session.access_token;
  })();
  try{return await refreshPromise}catch(e){storeSession(null);user=null;throw e}finally{refreshPromise=null}
}
async function accessToken(){
  if(!session)throw Error("Please sign in to save online.");
  if(Date.now()>=(session.expires_at||0)-90000)return refresh();
  return session.access_token;
}
async function init(){
  try{
    const h=window.location.hash||"";
    if(h.startsWith("#access_token=")||h.includes("&access_token=")){
      const p=new URLSearchParams(h.substring(1));
      if(p.get("access_token")&&p.get("refresh_token")){
        acceptToken({access_token:p.get("access_token"),refresh_token:p.get("refresh_token"),expires_in:Number(p.get("expires_in")||3600)});
        recovery=p.get("type")==="recovery";
      }
      history.replaceState(null,"",location.pathname+location.search+(recovery?"#/reset-password":"#/dashboard"));
    }else{
      try{session=JSON.parse(localStorage.getItem(AUTH_KEY)||"null");user=session?.user||null}catch(_){session=null}
    }
    if(!session){emit();return null}
    const profile=await request("/auth/v1/user","GET",undefined,true);
    user=profile;
    storeSession({...session,user:user});
    emit();
    return user;
  }catch(e){
    console.warn("Cloud authentication could not be restored.",e.message);
    const transient=(typeof navigator!=="undefined"&&!navigator.onLine)||e.name==="AbortError"||e.message==="Failed to fetch";
    if(transient&&session?.user){user=session.user;emit();return user}
    user=null;storeSession(null);emit();return null;
  }
}
async function signIn(email,password){
  const result=await request("/auth/v1/token?grant_type=password","POST",{email,password},false);
  acceptToken(result);
  if(!user)user=await request("/auth/v1/user","GET",undefined,true);
  recovery=false;emit();return user;
}
async function signUp(email,password){
  const redirect=encodeURIComponent("https://cad-to-career.vercel.app/");
  const result=await request("/auth/v1/signup?redirect_to="+redirect,"POST",{email,password},false);
  if(result?.access_token&&result?.refresh_token){acceptToken(result);emit();return {needsVerification:false}}
  return {needsVerification:true};
}
async function signOut(){
  try{if(session)await request("/auth/v1/logout","POST",{},true)}catch(e){console.warn("Remote sign-out failed; local session cleared.",e.message)}
  user=null;recovery=false;storeSession(null);emit();
}
async function sendRecovery(email){
  return request("/auth/v1/recover?redirect_to="+encodeURIComponent("https://cad-to-career.vercel.app/"),"POST",{email},false);
}
async function changePassword(password){
  if(password.length<10)throw Error("Choose a password with at least 10 characters.");
  return request("/auth/v1/user","PUT",{password},true);
}
async function loadWorkspace(){
  if(!user)return null;
  const rows=await request("/rest/v1/cloud_workspaces?user_id=eq."+encodeURIComponent(user.id)+"&select=user_id,payload,updated_at","GET",undefined,true);
  return Array.isArray(rows)&&rows.length?rows[0]:null;
}
async function saveWorkspace(payload){
  if(!user)throw Error("Please sign in to sync.");
  if(!payload||typeof payload!=="object"||Array.isArray(payload))throw Error("Invalid workspace.");
  const rows=await request("/rest/v1/cloud_workspaces?on_conflict=user_id","POST",{user_id:user.id,payload:payload},true,{headers:{"Prefer":"resolution=merge-duplicates,return=representation"}});
  if(!Array.isArray(rows)||!rows.length)throw Error("Cloud save was not acknowledged.");
  return rows[0];
}
async function uploadEvidence(submissionId,file){
  if(!user)throw Error("Sign in to upload project evidence.");
  if(!/^[0-9a-f-]{36}$/i.test(submissionId))throw Error("Invalid submission ID");
  if(!(file instanceof File)||file.size>25*1024*1024)throw Error("Each file must be 25 MB or less.");
  const name=file.name.replace(/[^a-z0-9._-]/gi,"_").slice(0,100);
  const path=user.id+"/"+submissionId+"/"+crypto.randomUUID()+"-"+name;
  await request("/storage/v1/object/cad-submissions/"+path.split("/").map(encodeURIComponent).join("/"),"POST",file,true,{headers:{"Content-Type":file.type||"application/octet-stream","x-upsert":"false"}});
  return path;
}
async function createSubmission(projectId,notes,evidence,submissionId){
  if(!user)throw Error("Sign in to submit.");
  const rows=await request("/rest/v1/project_submissions","POST",{
    id:submissionId,user_id:user.id,project_id:projectId,status:"needs_review",
    submitted_notes:String(notes||"").slice(0,12000),evidence_paths:Array.isArray(evidence)?evidence:[]
  },true,{headers:{"Prefer":"return=representation"}});
  if(!rows?.[0]?.id)throw Error("Submission was not saved.");
  return rows[0];
}
async function listSubmissions(){
  if(!user)return [];
  return request("/rest/v1/project_submissions?select=id,project_id,status,submitted_notes,evidence_paths,score,submitted_at,reviewed_at&order=submitted_at.desc","GET",undefined,true);
}
async function getReviewInfo(){
  if(!user)return [];
  return request("/rest/v1/project_reviews?select=submission_id,score,verdict,feedback,reviewed_at","GET",undefined,true);
}

async function assess(action,payload){
 if(!user)throw Error("Sign in to submit assessed work.");
 const data=await request("/functions/v1/cad-assess","POST",Object.assign({action},payload||{}),true);
 return data;
}
async function askTutor(message,context,history){return request("/functions/v1/cad-help","POST",{message,context,history},true)}
async function officialStatus(){return assess("status")}
async function getOfficialQuestions(lessonId){return assess("quiz_questions",{lessonId})}
async function gradeOfficialQuiz(lessonId,responses){return assess("quiz_submit",{lessonId,responses})}
async function confirmOfficialExercise(lessonId){return assess("exercise",{lessonId})}
async function gradeOfficialGeometry(shapes){return assess("project1",{shapes})}
async function loadReviewQueue(){return assess("review_queue")}
async function reviewProject(submissionId,verdict,score,feedback){return assess("review",{submissionId,verdict,score,feedback})}
async function issueCertificate(publicName){return assess("issue_certificate",{publicName})}
async function signedEvidence(submissionId,path){return assess("review_file",{submissionId,path})}
async function verifyCertificate(id){return request("/functions/v1/cad-verify?id="+encodeURIComponent(id),"GET",undefined,false)}

window.CAD_CLOUD={init,signIn,signUp,signOut,sendRecovery,changePassword,loadWorkspace,saveWorkspace,askTutor,
  uploadEvidence,createSubmission,listSubmissions,getReviewInfo,assess,officialStatus,getOfficialQuestions,gradeOfficialQuiz,confirmOfficialExercise,gradeOfficialGeometry,loadReviewQueue,reviewProject,issueCertificate,verifyCertificate,signedEvidence,
  currentUser:()=>user,isRecovering:()=>recovery,configured:()=>Boolean(url&&publishable)};
})();