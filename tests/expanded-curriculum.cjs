const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(hash = '#/courses', signedIn = false) {
  const listeners = {};
  const store = {};
  const calls = { quiz: [], exercise: [] };
  const nodes = {
    root: { innerHTML: '' },
    quizResult: { innerHTML: '', insertAdjacentHTML() {} },
    completeLesson: { disabled: true },
    exerciseConfirm: { checked: true },
    flash: { textContent: '' },
  };
  const document = {
    getElementById: id => nodes[id] || null,
    addEventListener: (type, fn) => (listeners[type] ||= []).push(fn),
    createElement: () => ({ setAttribute() {} }),
    body: { appendChild() {} },
  };
  const localStorage = {
    getItem: key => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: key => { delete store[key]; },
  };
  const cloud = {
    currentUser: () => signedIn ? { id: 'test-user', email: 'test@example.invalid' } : null,
    init: () => Promise.resolve(),
    gradeOfficialQuiz: (id, answers) => { calls.quiz.push({ id, answers }); return Promise.resolve({ score: 100, passed: true }); },
    confirmOfficialExercise: id => { calls.exercise.push(id); return Promise.resolve(); },
    getAssessmentStatus: () => Promise.resolve({}),
  };
  const window = { addEventListener() {}, scrollTo() {}, CAD_CLOUD: cloud };
  const context = {
    window, document, localStorage, CAD_CLOUD: cloud, navigator: {},
    location: { hash }, console, setTimeout() {}, clearTimeout() {},
    FormData: class { constructor(form) { this.answers = form.answers; } get(k) { return this.answers[Number(k.slice(1))]; } },
  };
  vm.createContext(context);
  for (const file of ['data.js', 'expanded-curriculum.js']) vm.runInContext(fs.readFileSync(file, 'utf8'), context);
  const app = fs.readFileSync('app.js', 'utf8').replace('render();\nif(typeof navigator', 'window.__testCleanWorkspace=cleanWorkspace;\nrender();\nif(typeof navigator');
  vm.runInContext(app, context);
  return { context, nodes, listeners, calls, store, lessons: window.CAD_CONTENT.lessons };
}

test('expanded lessons have explanations, exercises and complete practice quizzes', () => {
  const { lessons } = setup();
  assert.equal(lessons.length, 53);
  assert.equal(lessons.filter(l => !l.practiceOnly).length, 20);
  assert.equal(lessons.filter(l => l.practiceOnly).length, 33);
  assert.equal(new Set(lessons.map(l => l.id)).size, lessons.length);
  assert.ok(new Set(lessons.filter(l => l.practiceOnly).map(l => l.quiz.map(q => q.answer).join(''))).size > 2, 'practice answers should not all follow the same pattern');
  for (const lesson of lessons) {
    assert.ok(lesson.sections.length >= 2, `lesson ${lesson.id} lacks detailed sections`);
    assert.ok(lesson.sections.every(s => s.heading && s.text.length >= 80));
    assert.ok(lesson.steps.length >= 3, `lesson ${lesson.id} lacks guided steps`);
    assert.equal(lesson.quiz.length, 3);
    for (const q of lesson.quiz) {
      assert.equal(q.options.length, 3);
      assert.ok(['A', 'B', 'C'].includes(q.answer));
      assert.ok(q.options.every(x => typeof x === 'string' && x.length > 0));
    }
  }
});

test('worked examples and selected answers remain technically correct', () => {
  const { lessons } = setup();
  const expected = [
    ['Metric units and conversions', 'One inch is exactly how many millimeters?', '25.4 mm'],
    ['Angles, triangles, and slope', 'What is the diagonal of a 30-40 right triangle?', '50'],
    ['Tolerances and limits', 'What are the limits of 50.00 ± 0.10 mm?', '49.90 to 50.10 mm'],
    ['Clearance and interference fits', 'What is the nominal clearance for a 10.2 mm hole and 10.0 mm pin?', '0.2 mm'],
  ];
  for (const [title, question, answer] of expected) {
    const lesson = lessons.find(l => l.title === title);
    const q = lesson.quiz.find(item => item.question === question);
    assert.equal(q.options['ABC'.indexOf(q.answer)], answer, title);
  }
});

test('a new lesson renders its guidance and keeps its progress in a restored workspace', () => {
  const { nodes, context } = setup('#/learn/lesson-53');
  assert.match(nodes.root.innerHTML, /Portfolio evidence and design review/);
  assert.match(nodes.root.innerHTML, /Additional practice lesson/);
  assert.match(nodes.root.innerHTML, /Guided practice/);
  assert.match(nodes.root.innerHTML, /Check your reasoning/);
  const clean = context.window.__testCleanWorkspace({ completed: [1, 53, 53, 999], quizzes: { 53: { score: 100, passed: true }, 999: { score: 100, passed: true } } });
  assert.deepEqual(Array.from(clean.completed), [1, 53]);
  assert.equal(clean.quizzes[53].passed, true);
  assert.equal(clean.quizzes[999], undefined);
});

test('additional lessons do not call certificate assessment services', () => {
  const { listeners, calls, store, lessons } = setup('#/learn/lesson-53', true);
  const lesson = lessons.find(l => l.id === 53);
  const form = { id: 'quizForm', getAttribute: () => '53', answers: lesson.quiz.map(q => q.answer) };
  listeners.submit[0]({ target: form, preventDefault() {} });
  const button = { id: 'completeLesson', getAttribute: () => '53' };
  listeners.click[0]({ target: { closest: () => button } });
  assert.equal(calls.quiz.length, 0);
  assert.equal(calls.exercise.length, 0);
  const saved = JSON.parse(store['cad-to-career-local-v1']);
  assert.ok(saved.completed.includes(53));
  assert.equal(saved.quizzes['53'].passed, true);
});

test('the original core quiz still calls the official assessment service when signed in', () => {
  const { listeners, calls, lessons } = setup('#/learn/lesson-1', true);
  const lesson = lessons.find(l => l.id === 1);
  const form = { id: 'quizForm', getAttribute: () => '1', answers: lesson.quiz.map(q => q.answer) };
  listeners.submit[0]({ target: form, preventDefault() {} });
  assert.equal(calls.quiz.length, 1);
  assert.equal(calls.quiz[0].id, 1);
});
