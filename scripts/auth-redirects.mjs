#!/usr/bin/env node
/**
 * CAD to Career Auth URL bootstrap.
 *
 * Run from local shell or GitHub Actions using a project-scoped Supabase
 * Management API token. This script NEVER manages or prints SMTP secrets.
 *
 * SUPABASE_MANAGEMENT_PAT=<scoped token> node scripts/auth-redirects.mjs check
 * SUPABASE_MANAGEMENT_PAT=<scoped token> node scripts/auth-redirects.mjs configure
 *
 * Required token permissions:
 *   check: auth_config_read
 *   configure: auth_config_read, auth_config_write, project_admin_write
 *
 * Redirects are merged, never replace unrelated entries. Email confirmations
 * remain enabled; no bypass of verification and no fabricated users.
 */
const PROJECT="kcerxxauczxydmexcdly";
const SITE="https://cad-to-career.vercel.app";
const REQUIRED=[SITE+"/**","http://localhost:8000/**"];
const action=process.argv[2]||"check";
const token=process.env.SUPABASE_MANAGEMENT_PAT;
if (!["check","configure"].includes(action)) throw Error("Use 'check' or 'configure'.");
if (!token) throw Error("Missing SUPABASE_MANAGEMENT_PAT: create a project-scoped token in your Supabase account and store it only in protected GitHub Actions secrets or your local shell.");
const endpoint="https://api.supabase.com/v1/projects/"+PROJECT+"/config/auth";
const headers={Authorization:"Bearer "+token,Accept:"application/json"};
async function request(method,body) {
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),20000);
  try {
    const res=await fetch(endpoint,{
      method,headers:body?{...headers,"Content-Type":"application/json"}:headers,
      body:body?JSON.stringify(body):undefined,
      signal:controller.signal
    });
    if(!res.ok) throw Error("Supabase Management API "+method+" failed (HTTP "+res.status+"). Verify scoped token permissions and project ownership.");
    return await res.json();
  }finally{clearTimeout(timer)}
}
function redirectList(raw){return String(raw||"").split(",").map(x=>x.trim()).filter(Boolean)}
function report(settings) {
  const urls=redirectList(settings.uri_allow_list);
  const matchSite=settings.site_url===SITE;
  const hasAll=REQUIRED.every(url=>urls.includes(url));
  const confirmed=settings.mailer_autoconfirm===false;
  console.log(JSON.stringify({
    project:PROJECT,
    site_url_correct:matchSite,
    required_redirects_present:hasAll,
    email_confirmation_enabled:confirmed,
    email_provider_configured:Boolean(settings.smtp_host),
    public_signup_disabled:settings.disable_signup===true
  },null,2));
  return matchSite&&hasAll&&confirmed;
}
let settings=await request("GET");
if(action==="configure"){
  const merged=[...new Set([...redirectList(settings.uri_allow_list),...REQUIRED])];
  const payload={site_url:SITE,uri_allow_list:merged.join(","),mailer_autoconfirm:false,mailer_otp_exp:3600};
  // Do not alter SMTP, provider credentials, signup permission or OAuth settings.
  await request("PATCH",payload);
  settings=await request("GET");
}
if(!report(settings)){console.error("Auth URLs / confirmations need attention. Configure with the scoped token or check the Supabase dashboard.");process.exitCode=1}
else console.log("Auth redirect and confirmation settings verified. Public SMTP delivery must be verified separately.");
