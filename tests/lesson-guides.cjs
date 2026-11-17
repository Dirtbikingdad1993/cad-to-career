const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadCurriculum(withGuides) {
  const context = { window: {} };
  vm.createContext(context);
  for (const file of ['data.js', 'expanded-curriculum.js', ...(withGuides ? ['lesson-guides.js'] : [])]) {
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  }
  return context.window.CAD_CONTENT.lessons;
}

test('every lesson has its own substantive teaching, example, practice, and self-check', () => {
  const lessons = loadCurriculum(true);
  assert.equal(lessons.length, 53);
  const examples = new Set();
  for (const lesson of lessons) {
    const guide = lesson.guide;
    assert.ok(guide, `lesson ${lesson.id} is missing its guide`);
    for (const field of ['concept', 'application', 'example', 'question', 'answer', 'mistake']) {
      assert.ok(typeof guide[field] === 'string' && guide[field].trim().length >= 20, `lesson ${lesson.id} is missing ${field}`);
    }
    assert.ok(guide.concept.length > 150 && guide.application.length > 150 && guide.example.length > 150, `lesson ${lesson.id} needs more explanation`);
    assert.ok(Array.isArray(guide.steps) && guide.steps.length >= 4 && guide.steps.every(step => step.length >= 30), `lesson ${lesson.id} needs actionable steps`);
    examples.add(guide.example);
  }
  assert.equal(examples.size, 53, 'examples must be specific to each lesson');
});

test('added teaching does not change lesson identities, quizzes, or certificate tracks', () => {
  const before = loadCurriculum(false);
  const after = loadCurriculum(true);
  const assessment = lessons => JSON.stringify(lessons.map(({ id, slug, unit, practiceOnly, quiz }) => ({ id, slug, unit, practiceOnly, quiz })));
  assert.equal(assessment(after), assessment(before));
  assert.equal(after.filter(lesson => !lesson.practiceOnly).length, 20);
  assert.equal(after.filter(lesson => lesson.practiceOnly).length, 33);
});

test('representative worked calculations and practice instructions are present', () => {
  const lessons = loadCurriculum(true);
  const find = id => lessons.find(lesson => lesson.id === id).guide;
  assert.match(find(4).example, /radius 4 mm/);
  assert.match(find(14).example, /32\.5 mm/);
  assert.match(find(24).example, /50 mm/);
  assert.match(find(37).example, /0\.20 to 0\.40 mm/);
  assert.match(find(38).example, /39\.7 mm.*40\.3 mm/);
  assert.match(find(52).answer, /Six/);
});

test('lesson guide is loaded and available offline in the published build', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.indexOf('/expanded-curriculum.js') < html.indexOf('/lesson-guides.js'));
  assert.ok(html.indexOf('/lesson-guides.js') < html.indexOf('/app.js'));
  assert.match(fs.readFileSync('sw.js', 'utf8'), /'\/lesson-guides\.js'/);
  assert.ok(fs.existsSync('vercel-output/lesson-guides.js'));
});
