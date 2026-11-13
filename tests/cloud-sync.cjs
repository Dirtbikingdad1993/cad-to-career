const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");
const {URL}=require("node:url");
const source=fs.readFileSync("cloud.js","utf8");
const users={
 "alice@example.invalid":"11111111-1111-4111-8111-111111111111",
 "bob@example.invalid":"22222222-2222-4222-8222-222222222222"
};
const workspaces=new Map();
function answer(value,status=200){return {ok:status<400,status,text:async()=>JSON.stringify(value)}}
async function mockFetch(input,opts={}){
 const url=new URL(input),path=url.pathname,method=opts.method||"GET";
 if(path==="/auth/v1/token"&&method==="POST"){
  const body=JSON.parse(opts.body||"{}"),id=users[body.email];
  if(!id)return answer({msg:"Invalid login credentials"},400);
  return answer({access_token:"jwt-"+id,refresh_token:"refresh-"+id,expires_in:3600,
    user:{id,email:body.email,email_confirmed_at:"2026-11-13T00:00:00Z"}});
 }
 const token=String(opts.headers?.Authorization||"").replace(/^Bearer /,"");
 const id=token.startsWith("jwt-")?token.slice(4):null;
 if(path==="/auth/v1/user")return id?answer({id,email:Object.keys(users).find(k=>users[k]===id),
  email_confirmed_at:"2026-11-13T00:00:00Z"}):answer({msg:"Unauthorized"},401);
 if(path==="/auth/v1/logout")return answer({});
 if(path==="/rest/v1/cloud_workspaces"&&method==="GET")
  return id?answer(workspaces.has(id)?[workspaces.get(id)]:[]):answer({msg:"Unauthorized"},401);
 if(path==="/rest/v1/cloud_workspaces"&&method==="POST"){
  if(!id)return answer({msg:"Unauthorized"},401);
  const body=JSON.parse(opts.body);
  if(body.user_id!==id)return answer({msg:"Forbidden"},403);
  const row={user_id:id,payload:body.payload,updated_at:new Date().toISOString()};
  workspaces.set(id,row);return answer([row]);
 }
 return answer({msg:"Unexpected mocked route: "+method+" "+path},404);
}
function makeDevice(){
 const values=new Map(),localStorage={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};
 const location={hash:"",pathname:"/",search:"",origin:"https://cad-to-career.vercel.app"};
 const window={location,CAD_CLOUD_CONFIG:{url:"https://mock.supabase.co",publishableKey:"sb_publishable_test"},dispatchEvent:()=>{}};
 class FakeFile extends Blob{}
 vm.runInNewContext(source,{window,location,localStorage,fetch:mockFetch,AbortController,Blob,File:FakeFile,URLSearchParams,
   setTimeout,clearTimeout,history:{replaceState:()=>{}},navigator:{onLine:true},
   CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail}},console},{timeout:3000});
 return window.CAD_CLOUD;
}
(async()=>{
 const phone=makeDevice();
 await phone.signIn("alice@example.invalid","correct-horse-battery-staple");
 await phone.saveWorkspace({completed:[1,2,3],lab:[{type:"rect",x:0,y:0,w:120,h:70}],drafts:{"2":"Spacer draft"}});
 assert.equal(workspaces.get(users["alice@example.invalid"]).payload.completed.length,3);
 await phone.signOut();
 assert.equal(phone.currentUser(),null,"logout must clear current account");

 const desktop=makeDevice();
 await desktop.signIn("alice@example.invalid","correct-horse-battery-staple");
 const resumed=await desktop.loadWorkspace();
 assert.deepEqual(Array.from(resumed.payload.completed),[1,2,3],"lesson progress must follow same account");
 assert.equal(resumed.payload.lab[0].w,120,"CAD geometry must survive login on new device");
 assert.equal(resumed.payload.drafts["2"],"Spacer draft","project notes must survive");

 const stranger=makeDevice();
 await stranger.signIn("bob@example.invalid","another-safe-password");
 assert.equal(await stranger.loadWorkspace(),null,"unrelated account must not load Alice's workspace");
 await stranger.saveWorkspace({completed:[9],lab:[]});
 assert.equal((await desktop.loadWorkspace()).payload.completed[0],1,"other account cannot overwrite Alice");
 console.log("PASS: logout, cross-device sign-in, course progress, CAD drafts and account isolation");
})().catch(error=>{console.error(error);process.exitCode=1});
