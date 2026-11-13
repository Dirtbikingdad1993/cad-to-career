const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

// Exercise the actual browser grader without launching a DOM or saving user data.
const source = fs.readFileSync('app.js', 'utf8');
const renderCall = source.lastIndexOf('\nrender();');
assert.ok(renderCall >= 0, 'Expected browser app entry point was not found');
const instrumented = source.slice(0, renderCall) + '\nwindow.__geometryTest = { gradeProject1 };' + source.slice(renderCall + '\nrender();'.length);
const sandbox = {
  window: { CAD_CONTENT: { lessons: [], projects: [], software: [] }, addEventListener() {} },
  document: { getElementById() { return {}; }, addEventListener() {} },
  localStorage: { getItem() { return null; } },
  location: { hash: '#/' },
  console,
};
vm.runInNewContext(instrumented, sandbox, { timeout: 2000 });
const grade = sandbox.window.__geometryTest.gradeProject1;
function validDrawing() {
  return [
    { type: 'rect', x: 0, y: 0, w: 120, h: 70 },
    { type: 'circle', x: 15, y: 15, d: 8 },
    { type: 'circle', x: 105, y: 15, d: 8 },
    { type: 'circle', x: 15, y: 55, d: 8 },
    { type: 'circle', x: 105, y: 55, d: 8 },
  ];
}
test('valid drawing passes regardless of entity order', () => {
  assert.equal(grade(validDrawing()).pass, true);
  assert.equal(grade(validDrawing().reverse()).pass, true);
});
test('stated tolerance boundaries are inclusive', () => {
  const shapes = validDrawing();
  shapes[0].w = 120.25;
  shapes[1].d = 8.15;
  assert.equal(grade(shapes).pass, true);
});
test('dimensions outside tolerance and misplaced holes fail', () => {
  const tooLarge = validDrawing(); tooLarge[1].d = 8.151;
  assert.equal(grade(tooLarge).pass, false);
  const misplaced = validDrawing(); misplaced[2].x = 104;
  assert.equal(grade(misplaced).pass, false);
});
test('duplicate holes and extra shapes cannot pass', () => {
  const duplicate = validDrawing(); duplicate[4] = { ...duplicate[3] };
  assert.equal(grade(duplicate).pass, false);
  const extra = validDrawing(); extra.push({ type: 'circle', x: 50, y: 35, d: 8 });
  assert.equal(grade(extra).pass, false);
});
test('malformed input and non-finite coordinates produce a failure, not a crash', () => {
  assert.equal(grade(null).pass, false);
  const badShape = validDrawing(); badShape[1] = null;
  assert.doesNotThrow(() => grade(badShape));
  assert.equal(grade(badShape).pass, false);
  const invalid = validDrawing(); invalid[1].x = Infinity;
  assert.equal(grade(invalid).pass, false);
});
