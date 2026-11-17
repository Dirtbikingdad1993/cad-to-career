const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');

test('database quotas cap traffic, reset, isolate accounts and deny client access',async()=>{
 const db=new PGlite();
 try{
  await db.exec('create role anon; create role authenticated; create role service_role; create schema auth; create table auth.users(id uuid primary key)');
  await db.exec(fs.readFileSync(path.join(__dirname,'../../supabase/migrations/20261115083905_portfolio_rate_limits.sql'),'utf8'));
  const alice='11111111-1111-4111-8111-111111111111',bob='22222222-2222-4222-8222-222222222222';
  await db.query('insert into auth.users values ($1),($2)',[alice,bob]);
  let result=await db.query('select count(*) filter (where public.cad_portfolio_public_quota()) as allowed from generate_series(1,605)');
  assert.equal(Number(result.rows[0].allowed),600);
  await db.exec("update public.portfolio_public_quota set window_started_at=clock_timestamp()-interval '61 seconds'");
  assert.equal((await db.query('select public.cad_portfolio_public_quota() as allowed')).rows[0].allowed,true);
  result=await db.query('select count(*) filter (where public.cad_portfolio_user_quota($1)) as allowed from generate_series(1,65)',[alice]);
  assert.equal(Number(result.rows[0].allowed),60);
  assert.equal((await db.query('select public.cad_portfolio_user_quota($1) as allowed',[bob])).rows[0].allowed,true);
  assert.equal((await db.query("select has_function_privilege('anon','public.cad_portfolio_public_quota()','EXECUTE') as value")).rows[0].value,false);
  assert.equal((await db.query("select has_table_privilege('authenticated','public.portfolio_user_quota','SELECT') as value")).rows[0].value,false);
  await db.query('delete from auth.users where id=$1',[alice]);
  assert.equal(Number((await db.query('select count(*) as n from public.portfolio_user_quota where user_id=$1',[alice])).rows[0].n),0);
 }finally{await db.close()}
});
