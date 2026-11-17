const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const curriculumContext = { window: {} };
vm.runInNewContext(fs.readFileSync('data.js', 'utf8'), curriculumContext, { timeout: 2000 });
const lessons = curriculumContext.window.CAD_CONTENT.lessons;
const server = fs.readFileSync('supabase/functions/cad-assess/index.ts', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');
const migration = fs.readFileSync('supabase/migrations/20261117103000_private_official_quiz.sql', 'utf8');

test('practice answer keys never count as official verification', () => {
  assert.equal(lessons.length, 20);
  assert.ok(lessons.every(l => l.quiz.length === 3 && l.quiz.every(q => /^[ABC]$/.test(q.answer))));
  assert.ok(app.includes('officialExamForm'), 'separate official form missing');
  assert.ok(app.includes('getOfficialQuestions'), 'server-delivered official questions missing');
  assert.ok(!app.includes('gradeOfficialQuiz(id,[fd.get("q0")'), 'practice answers must not be submitted as official');
  assert.ok(!server.includes('QUIZ_KEYS'), 'public edge source must not contain official answer keys');
  assert.ok(!server.includes('case "quiz":{'), 'legacy automatic passing path must not exist');
  assert.match(server, /foundations-v2-private/);
  assert.match(server, /rpc\/cad_grade_private_quiz/);
  assert.match(migration, /revoke all on function public\.cad_grade_private_quiz/);
  assert.match(migration, /to service_role/);
});

test('the official quiz endpoint returns question text and options but no answers', async () => {
  let handler;
  const studentId='11111111-1111-4111-8111-111111111111';
  const items=[
    {key:'L01-Q1',question:'An independent knowledge check about CAD and geometry?',options:['Choice A','Choice B','Choice C']},
    {key:'L01-Q2',question:'An independent knowledge check about dimensional tolerance?',options:['Choice A','Choice B','Choice C']},
    {key:'L01-Q3',question:'An independent knowledge check about design intent?',options:['Choice A','Choice B','Choice C']}
  ];
  const writes=[];
  const sandbox = {
    URL,Request,Response,Headers,TextDecoder,Uint8Array,console,
    Deno:{
      env:{get:name=> name==='SUPABASE_URL'?'https://test.supabase.co':name==='SUPABASE_SERVICE_ROLE_KEY'?'service-key':''},
      serve:fn=>{handler=fn}
    },
    fetch:async (url,options={})=>{
      if(String(url).endsWith('/auth/v1/user'))return Response.json({id:studentId,email_confirmed_at:'2026-01-01T00:00:00Z'});
      if(String(url).includes('/rest/v1/rpc/cad_list_private_quiz'))return Response.json(items);
      if(String(url).includes('/rest/v1/rpc/cad_grade_private_quiz')){
        const payload=JSON.parse(options.body);writes.push(payload);
        return Response.json({score:100,passed:true,verified:true,remainingToday:4});
      }
      throw Error('Unexpected request: '+String(url));
    }
  };
  vm.runInNewContext(server,sandbox,{timeout:2500});
  const call=async body=>{
    const request=new Request('https://test.example/functions/v1/cad-assess',{
      method:'POST',headers:{Authorization:'Bearer example-token','Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const result=await handler(request);return {status:result.status,payload:await result.json()};
  };
  const questions=await call({action:'quiz_questions',lessonId:1});
  assert.equal(questions.status,200);
  assert.equal(questions.payload.questions.length,3);
  assert.ok(questions.payload.questions.every(q=>!('answer' in q)&&!('correct_index' in q)));
  assert.equal(questions.payload.assessmentVersion,'foundations-v2-private');
  const legacy=await call({action:'quiz',lessonId:1,answers:['A','B','C']});
  assert.equal(legacy.status,410,'old exposed practice answers must not issue official credit');
  assert.equal(writes.length,0);
  const responses=items.map((q,i)=>({key:q.key,choice:i}));
  const graded=await call({action:'quiz_submit',lessonId:1,responses});
  assert.equal(graded.status,200);assert.equal(graded.payload.passed,true);
  assert.equal(writes.length,1);
  assert.equal(writes[0].p_user_id,studentId);
  assert.equal(writes[0].p_lesson_id,1);
  assert.equal(writes[0].p_responses.length,3);
  assert.ok(!JSON.stringify(questions.payload).includes('correct_index'));
});

test('guest practice still reports technically correct local answers', () => {
  const expected = new Map([
    [14, 'Controlling dimensions consistently'],
    [16, 'A neutral geometry format'],
    [18, 'Form readability'],
    [20, 'An authorized reviewer'],
  ]);
  for (const [id, answer] of expected) {
    const question=lessons.find(l=>l.id===id).quiz[1];
    assert.equal(question.options['ABC'.indexOf(question.answer)],answer);
  }
});

// Exercise the real edge-function eligibility routine with isolated in-memory
// records. These checks do not create accounts or issue live credentials.
const start = server.indexOf('async function issueCertificate(');
const end = server.indexOf('\nDeno.serve(', start);
assert.ok(start >= 0 && end > start, 'Certificate eligibility routine must be present');
const issueSource = server.slice(start, end);
const user = { id: 'student-1', email_confirmed_at: '2026-01-01T00:00:00Z' };
function completeRecords() {
  return {
    quizzes: Array.from({ length: 20 }, (_, i) => ({ lesson_id: i + 1, passed: true, score: 100 })),
    lessons: Array.from({ length: 20 }, (_, i) => ({ lesson_id: i + 1 })),
    projects: Array.from({ length: 5 }, (_, i) => ({ project_id: i + 1, status: 'approved', score: 90 })),
    certificates: [],
  };
}
function issuer(records) {
  const writes = [];
  const sandbox = {
    projectStatus: async id => { assert.equal(id, user.id); return records; },
    database: async (table, _query, method, payload) => {
      writes.push({ table, method, payload });
      return [{ id: 'example-certificate', ...payload }];
    },
    response: (_req, body, status = 200) => ({ body, status }),
  };
  vm.runInNewContext(issueSource + '\nthis.issue = issueCertificate;', sandbox, { timeout: 2000 });
  return { issue: sandbox.issue, writes };
}

test('unverified email cannot issue a certificate', async () => {
  const { issue, writes } = issuer(completeRecords());
  const result = await issue({}, { ...user, email_confirmed_at: null }, { publicName: 'Test Student' });
  assert.equal(result.status, 403);
  assert.equal(writes.length, 0);
});

test('missing verified coursework or an insufficient capstone cannot issue a certificate', async () => {
  for (const modify of [
    records => records.quizzes.pop(),
    records => records.lessons.pop(),
    records => { records.projects[4].score = 84; },
    records => { records.projects[1].status = 'needs_review'; },
  ]) {
    const records = completeRecords(); modify(records);
    const { issue, writes } = issuer(records);
    const result = await issue({}, user, { publicName: 'Test Student' });
    assert.equal(result.status, 409);
    assert.equal(writes.length, 0);
  }
});

test('a complete verified record issues only to the authenticated owner', async () => {
  const { issue, writes } = issuer(completeRecords());
  const result = await issue({}, user, { publicName: 'Test Student' });
  assert.equal(result.status, 200);
  assert.equal(result.body.issued, true);
  assert.equal(writes.length, 1);
  assert.equal(writes[0].table, 'certificates');
  assert.equal(writes[0].payload.user_id, user.id);
});
