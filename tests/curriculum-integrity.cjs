const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const curriculumContext = { window: {} };
vm.runInNewContext(fs.readFileSync('data.js', 'utf8'), curriculumContext, { timeout: 2000 });
const lessons = curriculumContext.window.CAD_CONTENT.lessons;
const server = fs.readFileSync('supabase/functions/cad-assess/index.ts', 'utf8');
const match = server.match(/const QUIZ_KEYS\s*=\s*(\[[^\]]+\])/);
assert.ok(match, 'Server quiz keys must be present');
const serverKeys = JSON.parse(match[1]);

test('every lesson uses the same answer key in practice and verified grading', () => {
  assert.equal(serverKeys.length, lessons.length);
  for (const lesson of lessons) {
    const localKey = lesson.quiz.map(question => question.answer).join('');
    assert.equal(serverKeys[lesson.id - 1], localKey, `Lesson ${lesson.id} differs between graders`);
  }
});

test('corrected CAD questions award the technically correct answers', () => {
  const expected = new Map([
    [14, 'Controlling dimensions consistently'],
    [16, 'A neutral geometry format'],
    [18, 'Form readability'],
    [20, 'An authorized reviewer'],
  ]);
  for (const [id, answer] of expected) {
    const question = lessons.find(lesson => lesson.id === id).quiz[1];
    assert.equal(question.options['ABC'.indexOf(question.answer)], answer, `Lesson ${id}, question 2`);
  }
});

test('the assessment HTTP handler grades corrected answers and rejects the old wrong answers', async () => {
  let handler;
  const writes = [];
  const studentId = '11111111-1111-4111-8111-111111111111';
  const sandbox = {
    URL, Request, Response, Headers, TextDecoder, console,
    Deno: {
      env: { get: name => name === 'SUPABASE_URL' ? 'https://test.supabase.co' : name === 'SUPABASE_SERVICE_ROLE_KEY' ? 'test-key' : '' },
      serve: fn => { handler = fn; },
    },
    fetch: async (url, options = {}) => {
      if (String(url).endsWith('/auth/v1/user')) return Response.json({ id: studentId, email_confirmed_at: '2026-01-01T00:00:00Z' });
      if (String(url).includes('/rest/v1/quiz_results') && options.method === 'POST') {
        writes.push(JSON.parse(options.body));
        return Response.json([writes.at(-1)]);
      }
      throw new Error('Unexpected network request in assessment test');
    },
  };
  vm.runInNewContext(server, sandbox, { timeout: 2000 });
  for (const lessonId of [14, 16, 18, 20]) {
    for (const [answers, expectedPass] of [[['A', 'A', 'C'], true], [['A', 'B', 'C'], false]]) {
      const req = new Request('https://test.example/functions/v1/cad-assess', {
        method: 'POST', headers: { Authorization: 'Bearer test-token', 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'quiz', lessonId, answers }),
      });
      const response = await handler(req);
      const result = await response.json();
      assert.equal(response.status, 200);
      assert.equal(result.passed, expectedPass, `Lesson ${lessonId}: ${answers.join('')}`);
      assert.equal(writes.at(-1).user_id, studentId);
    }
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
