/* CAD to Career help assistant.
   Public navigation and course guidance work offline. Live AI, when configured,
   is handled through the authenticated Supabase Edge Function. Chat isn't stored. */
(function(){
"use strict";
if(document.getElementById("cad-help-launcher"))return;
const app=window.CAD_CONTENT||{lessons:[],projects:[]};
const practice=Array.isArray(window.CAD_PRACTICE_PROJECTS)?window.CAD_PRACTICE_PROJECTS:[];
const links=[
 {keys:/\b(sign ?in|log ?in|login)\b/i,route:"#/login",label:"Open sign in",text:"Use Sign in to access an existing account. A verified account can restore your lessons and drawings across devices."},
 {keys:/\b(register|sign ?up|create (an? )?account)\b/i,route:"#/register",label:"Open registration",text:"Create a free account from the registration page. Email confirmation is required; public signup emails may be temporarily rate-limited until the sending provider is configured."},
 {keys:/\b(password|forgot|reset)\b/i,route:"#/forgot-password",label:"Reset password",text:"Choose Forgot password to request a reset email. The reset link should return to the public CAD to Career website."},
 {keys:/\b(cloud|sync|offline|save (my |the )?(work|progress)|backup|export progress)\b/i,route:"#/settings",label:"Open settings",text:"Signed-in lesson progress and CAD drawings save locally and synchronize to your private cloud workspace when connected. In Settings you can save online, download a backup, or sign out. Offline changes sync after reconnection; keep the app installed until Cloud saved appears."},
 {keys:/\b(certificate|credential|verified|certification)\b/i,route:"#/certificate",label:"View certificate requirements",text:"The free CAD Foundations certificate requires separately verified quizzes, practice confirmations, project evidence and authorized reviews. Completing extra practice projects does not grant verified credit. The credential is platform-issued, not an accredited license."},
 {keys:/\b(portfolio|submission|evidence|reviewer|submit a project)\b/i,route:"#/portfolio",label:"Open portfolio",text:"Your Portfolio shows assessed projects, submission evidence and review status. The five certification-track projects are separate from the additional self-reviewed challenges."},
 {keys:/\b(dashboard|progress|completed lesson)\b/i,route:"#/dashboard",label:"Open dashboard",text:"Your Dashboard displays lesson confirmations and quiz practice. Check your cloud status before switching devices."},
 {keys:/\b(project|challenge|build something|make something)\b/i,route:"#/projects",label:"Browse projects",text:"Browse five assessed portfolio projects and twelve additional guided challenges, with CAD requirements, steps, deliverables and self-checks."},
 {keys:/\b(2d lab|cad lab|drawing tool|draw|geometry editor)\b/i,route:"#/lab/2d",label:"Open CAD drawing lab",text:"Use the 2D CAD Lab to draw rectangles and circles, enter measurements, edit geometry and export a drawing as SVG or JSON. The lab is not a full replacement for desktop CAD."},
 {keys:/\b(lesson|course|where (do|should) i start|start learning|beginner)\b/i,route:"#/courses",label:"Browse lessons",text:"Begin with the first CAD Foundations lesson, then work through the 53 lessons in order. Practice is free and works from a phone; desktop CAD is recommended for detailed modeling."}
];
function clean(s){return String(s||"").replace(/\s+/g," ").trim()}
function words(s){return clean(s).toLowerCase().replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(w=>w.length>2&&!/^(what|when|where|how|the|and|for|with|can|does|from|about|help|find|show|want|need|make|this|that|please|project|lesson)$/.test(w))}
function matchContent(question){
 const raw=question.toLowerCase(),terms=words(question);
 if(!terms.length)return null;
 const items=[...app.lessons.map(l=>({kind:"lesson",title:l.title,detail:l.body||"",group:l.unit||"",route:"#/learn/"+l.slug})),
 ...app.projects.map(p=>({kind:"assessed project",title:p.title,detail:p.brief||"",group:(p.skills||[]).join(" "),route:"#/projects/"+p.id})),
 ...practice.map(p=>({kind:"practice project",title:p.title,detail:p.brief||"",group:p.track||"",route:"#/projects/practice/"+p.slug}))];
 const scored=items.map(item=>{
  const title=item.title.toLowerCase(),all=(title+" "+item.group).toLowerCase();
  const titleHits=terms.filter(t=>title.includes(t)).length;
  const hits=terms.filter(t=>all.includes(t)).length;
  const nameExact=raw.includes(title);
  return {item,score:(nameExact?20:0)+titleHits*3+hits};
 }).sort((a,b)=>b.score-a.score);
 const best=scored[0];
 if(!best||best.score<4||best.score<((scored[1]?.score||0)+2) && !raw.includes(best.item.title.toLowerCase()))return null;
 return {text:"I found "+best.item.kind+" “"+best.item.title+".” "+clean(best.item.detail).slice(0,440)+(best.item.detail.length>440?"…":""),label:"Open "+best.item.kind,route:best.item.route};
}
function guidedReply(question){
 const q=clean(question).toLowerCase();
 if(!q)return {text:"Type a question or select an example below.",route:"#/courses",label:"Browse lessons"};
 if(/\b(units?|millimeters?|mm|inches?|convert|dimension|tolerance|datum)\b/.test(q)){
  const specific=matchContent(question);if(specific)return specific;
  return {text:"Start every drawing by setting units. Use a clear origin (datum), dimension sizes and locations, then verify tolerances. The course has examples for measurement and dimensioning.",route:"#/courses",label:"Find measurement lessons"};
 }
 const found=matchContent(question);if(found)return found;
 for(const link of links)if(link.keys.test(question))return {text:link.text,route:link.route,label:link.label};
 if(/\b(start|home|overview)\b/.test(q))return {text:"The Overview page starts your learning path. You can also use the navigation menu to open Courses, Projects, Dashboard, Portfolio and the 2D Lab.",route:"#/",label:"Open overview"};
 return {text:"I can help locate lessons, projects, your dashboard, the CAD lab, certificates and account settings. Ask about a specific topic or use the shortcuts below. For open-ended explanations, sign in and use the AI tutor when it is configured.",route:"#/courses",label:"Browse CAD courses"};
}
const shell=document.createElement("div");shell.className="cad-help-shell";
shell.innerHTML='<button id="cad-help-launcher" type="button" aria-controls="cad-help-panel" aria-expanded="false" aria-label="Open CAD to Career help"><span aria-hidden="true">?</span><span>Help</span></button><section id="cad-help-panel" class="cad-help-panel" role="dialog" aria-labelledby="cad-help-heading" aria-modal="false" hidden><header class="cad-help-header"><div><strong id="cad-help-heading">CAD Learning Assistant</strong><small id="cad-help-mode">Course and navigation guide</small></div><button id="cad-help-close" class="cad-help-close" type="button" aria-label="Close help">×</button></header><div id="cad-help-log" class="cad-help-log" role="log" aria-live="polite" aria-relevant="additions"></div><div class="cad-help-suggestions" id="cad-help-suggestions"><button type="button" data-help-prompt="Where do I start learning CAD?">Start learning</button><button type="button" data-help-prompt="Show me projects">Projects</button><button type="button" data-help-prompt="How does cloud save work?">Saving progress</button><button type="button" data-help-prompt="Where is the 2D CAD Lab?">Drawing lab</button></div><form id="cad-help-form" class="cad-help-form"><label for="cad-help-input" class="sr-only">Ask a question</label><input id="cad-help-input" type="text" maxlength="800" autocomplete="off" placeholder="Ask about CAD or the app…" required/><button id="cad-help-send" type="submit">Send</button></form><div class="cad-help-disclaimer">Guidance may need checking against CAD references. Do not share passwords, private files or personal information here. No chat history is saved.</div></section>';
document.body.appendChild(shell);
const launcher=shell.querySelector("#cad-help-launcher"),panel=shell.querySelector("#cad-help-panel"),close=shell.querySelector("#cad-help-close");
const form=shell.querySelector("#cad-help-form"),input=shell.querySelector("#cad-help-input"),log=shell.querySelector("#cad-help-log"),mode=shell.querySelector("#cad-help-mode"),send=shell.querySelector("#cad-help-send");
let busy=false,aiUnavailable=false;
const history=[];
function message(role,body,link){
 const row=document.createElement("div");row.className="cad-help-message "+(role==="user"?"cad-help-user":"cad-help-assistant");
 const label=document.createElement("small");label.textContent=role==="user"?"You":"CAD to Career";
 const text=document.createElement("p");text.textContent=clean(body);
 row.append(label,text);
 if(link&&/^#\/[a-z0-9\/-]*$/i.test(link.route||"")){
  const a=document.createElement("a");a.href=link.route;a.textContent=link.label||"Open page";
  a.addEventListener("click",()=>setOpen(false));row.appendChild(a);
 }
 log.appendChild(row);log.scrollTop=log.scrollHeight;
}
function setOpen(open){
 panel.hidden=!open;launcher.setAttribute("aria-expanded",String(open));
 if(open){if(!log.childElementCount)message("assistant","Ask me where to find something, how to use a feature, or for help with CAD lessons and projects.");input.focus()}
 else launcher.focus();
}
async function ask(question){
 if(busy)return;const q=clean(question);if(!q)return;
 input.value="";message("user",q);send.disabled=true;busy=true;mode.textContent="Finding an answer…";
 const fallback=guidedReply(q);let usedAI=false,aiText="";
 try{
  if(navigator.onLine!==false&&!aiUnavailable&&window.CAD_CLOUD?.currentUser?.()&&typeof window.CAD_CLOUD.askTutor==="function"){
   const lesson=app.lessons.find(l=>location.hash==="#/learn/"+l.slug);
   const context={route:location.hash.slice(0,100),lessonTitle:lesson?.title||"",lessonText:lesson?.body?.slice(0,650)||""};
   const response=await window.CAD_CLOUD.askTutor(q,context,history.slice(-4));
   if(response&&typeof response.answer==="string"&&response.answer.trim()){
    aiText=response.answer;message("assistant",aiText,{route:fallback.route,label:fallback.label});
    usedAI=true;mode.textContent="AI tutor available";
   }
  }
 }catch(e){
  if([404,503].includes(e?.status)){aiUnavailable=true;mode.textContent="Guide mode · AI setup pending"}
  else if(e?.status===429)mode.textContent="Guide mode · AI request limit reached";
  else mode.textContent="Guide mode · online AI unavailable";
 }
 if(!usedAI){
  message("assistant",fallback.text,{route:fallback.route,label:fallback.label});
  if(!window.CAD_CLOUD?.currentUser?.()&&!aiUnavailable)mode.textContent="Guide mode · sign in for AI";
  else if(mode.textContent==="Finding an answer…")mode.textContent="Guide mode · navigation and lessons";
 }
 history.push({role:"user",content:q},{role:"assistant",content:usedAI?aiText.slice(0,500):fallback.text.slice(0,300)});
 if(history.length>8)history.splice(0,history.length-8);
 send.disabled=false;busy=false;input.focus();
}
launcher.addEventListener("click",()=>setOpen(panel.hidden));
close.addEventListener("click",()=>setOpen(false));
form.addEventListener("submit",e=>{e.preventDefault();ask(input.value)});
shell.querySelectorAll("[data-help-prompt]").forEach(b=>b.addEventListener("click",()=>ask(b.getAttribute("data-help-prompt"))));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)setOpen(false)});
window.CAD_ASSISTANT={open:()=>setOpen(true),ask:q=>{setOpen(true);return ask(q)}};
})();