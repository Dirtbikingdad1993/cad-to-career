const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {PGlite}=require('@electric-sql/pglite');

test('evidence policies require owned uploads and freeze submitted files against replacement',async()=>{
 const db=new PGlite();
 const alice='11111111-1111-4111-8111-111111111111',bob='22222222-2222-4222-8222-222222222222';
 const submission='33333333-3333-4333-8333-333333333333',newSubmission='44444444-4444-4444-8444-444444444444';
 const filename='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa-model.step';
 const source=`${alice}/${submission}/${filename}`;
 const drawing=`${alice}/${submission}/bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb-drawing.pdf`;
 const insertFile=(name,bucket='cad-submissions')=>db.query('insert into storage.objects(bucket_id,name) values ($1,$2)',[bucket,name]);
 const deleteFile=name=>db.query('delete from storage.objects where name=$1 returning name',[name]);
 const asUser=async id=>{
  await db.exec('reset role');
  await db.query("select set_config('request.jwt.claim.sub',$1,false)",[id]);
  await db.exec('set role authenticated');
 };
 const submit=(paths=[source,drawing],project=2)=>db.query(
  'insert into public.project_submissions(id,user_id,project_id,status,evidence_paths) values ($1,$2,$3,\'needs_review\',array[$4,$5])',
  [submission,alice,project,...paths]);
 try{
  await db.exec(`create role authenticated; create schema auth; create schema storage;
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,storage,public to authenticated;
   create table public.project_submissions(id uuid primary key,user_id uuid not null,project_id integer not null,status text not null,reviewer_id uuid,score integer,reviewed_at timestamptz,evidence_paths text[] not null);
   create table storage.objects(bucket_id text not null,name text primary key);
   alter table public.project_submissions enable row level security;
   alter table storage.objects enable row level security;
   grant select,insert on public.project_submissions to authenticated;
   grant select,insert,update,delete on storage.objects to authenticated;
   create policy "Read own project submissions" on public.project_submissions for select to authenticated using(user_id=(select auth.uid()));
   create policy "Submit owned project for review" on public.project_submissions for insert to authenticated with check(true);
   create policy "Read own evidence" on storage.objects for select to authenticated using(bucket_id='cad-submissions' and split_part(name,'/',1)=(select auth.uid())::text);
   create policy "Upload own evidence" on storage.objects for insert to authenticated with check(true);
   create policy "Remove own evidence" on storage.objects for delete to authenticated using(true);`);
  const migrations=path.join(__dirname,'../../supabase/migrations');
  const matches=fs.readdirSync(migrations).filter(name=>name.endsWith('_freeze_submission_evidence.sql'));
  assert.equal(matches.length,1);
  await db.exec(fs.readFileSync(path.join(migrations,matches[0]),'utf8'));

  await asUser(alice);
  await assert.rejects(submit(),/row-level security/,'missing uploads cannot be submitted');
  for(const name of [
   `${alice}/${submission}/../../${bob}/private.step`,
   `${alice}/${submission}/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa-%2fprivate.step`,
   `${bob}/${submission}/${filename}`,
   `${alice}/${submission}/model.step`,
  ])await assert.rejects(insertFile(name),/row-level security/);
  await assert.rejects(insertFile(source,'another-bucket'),/row-level security/);
  await insertFile(source);await insertFile(drawing);
  assert.equal((await deleteFile(drawing)).rows.length,1,'unsubmitted uploads may be removed');
  await insertFile(drawing);
  await assert.rejects(submit([source,source]),/row-level security/,'duplicate paths are not separate evidence');
  await assert.rejects(submit([source,drawing],1),/row-level security/,'Project 1 is server assessed');

  await asUser(bob);
  assert.equal((await db.query('select * from storage.objects')).rows.length,0);
  assert.equal((await deleteFile(source)).rows.length,0);
  await assert.rejects(submit(),/row-level security/);
  await asUser(alice);await submit();
  assert.equal((await deleteFile(source)).rows.length,0,'pending review freezes evidence');
  await assert.rejects(insertFile(`${alice}/${submission}/cccccccc-cccc-4ccc-8ccc-cccccccccccc-extra.png`),/row-level security/);
  assert.equal((await db.query('update storage.objects set name=$1 where name=$2 returning name',[source+'-changed',source])).rows.length,0,'overwrites remain denied');

  await db.exec("reset role; update public.project_submissions set status='approved',score=90;");
  await asUser(alice);
  assert.equal((await deleteFile(source)).rows.length,0,'approved evidence cannot be deleted and replaced');
  await assert.rejects(insertFile(`${alice}/${submission}/cccccccc-cccc-4ccc-8ccc-cccccccccccc-extra.png`),/row-level security/);

  await db.exec("reset role; update public.project_submissions set status='changes_requested';");
  await asUser(alice);
  assert.equal((await deleteFile(source)).rows.length,1,'returned evidence can be removed to reclaim space');
  await assert.rejects(insertFile(source),/row-level security/,'resubmission requires a new submission ID');
  await insertFile(`${alice}/${newSubmission}/${filename}`);
 }finally{await db.close()}
});
