const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');

test('the real review transaction requires membership, excludes self-review and prevents duplicate decisions',async()=>{
 const db=new PGlite();
 try{
  await db.exec(`create role anon; create role authenticated; create role service_role;
   create table public.reviewer_memberships(user_id uuid primary key, role text not null);
   create table public.project_submissions(id uuid primary key,user_id uuid not null,project_id int not null,status text not null,score int,reviewer_id uuid,reviewed_at timestamptz);
   create table public.project_reviews(submission_id uuid not null,reviewer_id uuid not null,score int not null,verdict text not null,rubric jsonb not null,feedback text not null);`);
  await db.exec(fs.readFileSync(path.join(__dirname,'../../supabase/migrations/0005_atomic_review_decisions.sql'),'utf8'));
  const learner='11111111-1111-4111-8111-111111111111',reviewer='22222222-2222-4222-8222-222222222222',outsider='33333333-3333-4333-8333-333333333333';
  const project='44444444-4444-4444-8444-444444444444',capstone='55555555-5555-4555-8555-555555555555';
  await db.query("insert into public.reviewer_memberships values ($1,'reviewer'),($2,'reviewer')",[learner,reviewer]);
  await db.query("insert into public.project_submissions(id,user_id,project_id,status) values ($1,$3,2,'needs_review'),($2,$3,5,'needs_review')",[project,capstone,learner]);
  const decide=(submission,who,score)=>db.query("select public.cad_finish_review($1,$2,'approved',$3,'checked')",[submission,who,score]);
  await assert.rejects(decide(project,outsider,90),/membership required/);
  await assert.rejects(decide(project,learner,90),/cannot approve own work/);
  await assert.rejects(decide(capstone,reviewer,84),/below approval threshold/);
  assert.equal(Number((await db.query('select count(*) as n from public.project_reviews')).rows[0].n),0);
  await decide(project,reviewer,90);
  await assert.rejects(decide(project,reviewer,90),/not reviewable/);
  assert.equal(Number((await db.query('select count(*) as n from public.project_reviews')).rows[0].n),1);
  const result=await db.query('select status,score,reviewer_id from public.project_submissions where id=$1',[project]);
  assert.deepEqual(result.rows[0],{status:'approved',score:90,reviewer_id:reviewer});
  assert.equal((await db.query("select has_function_privilege('authenticated','public.cad_finish_review(uuid,uuid,text,integer,text)','EXECUTE') as value")).rows[0].value,false);
 }finally{await db.close()}
});
