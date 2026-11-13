// Public, read-only certificate verification. No student email exposed.
const BASE=Deno.env.get("SUPABASE_URL")||"";
const SERVICE=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"";
const headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"content-type","Content-Type":"application/json","Cache-Control":"no-store"};
function reply(value,status=200){return new Response(JSON.stringify(value),{status,headers})}
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response(null,{status:204,headers});
 if(req.method!=="GET")return reply({error:"GET required"},405);
 if(!BASE||!SERVICE)return reply({error:"Verification unavailable"},503);
 const id=new URL(req.url).searchParams.get("id")||"";
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))return reply({valid:false},200);
 try{
  const r=await fetch(BASE+"/rest/v1/certificates?id=eq."+encodeURIComponent(id)+"&select=id,public_name,program_code,issued_at,revoked_at",{headers:{"apikey":SERVICE,"Authorization":"Bearer "+SERVICE}});
  if(!r.ok)return reply({error:"Verification temporarily unavailable"},503);
  const data=await r.json(),cert=data?.[0];
  if(!cert)return reply({valid:false});
  return reply({valid:cert.revoked_at===null,revoked:Boolean(cert.revoked_at),id:cert.id,name:cert.public_name,program:"CAD Foundations",issuedAt:cert.issued_at});
 }catch(_){return reply({error:"Verification temporarily unavailable"},503)}
});
