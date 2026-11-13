const { test } = require('node:test');
const assert = require('node:assert/strict');
const { existsSync, readdirSync } = require('node:fs');
const { join } = require('node:path');

test('public build contains learner assets but excludes repository and backend files', () => {
  const root = 'vercel-output';
  for (const file of ['index.html', 'app.js', 'data.js', 'expanded-curriculum.js', 'styles.css', 'sw.js',
    'verify.html', 'verify.css', 'pilot/index.html', 'pilot/styles.css',
    'resources/project-1-brief.md', 'resources/technical-references.html']) {
    assert.ok(existsSync(join(root, file)), `missing public asset ${file}`);
  }
  for (const path of ['.github', '.git', 'supabase', 'docs', 'tests', 'scripts', 'apps']) {
    assert.ok(!existsSync(join(root, path)), `private repository path exposed: ${path}`);
  }
  assert.ok(readdirSync(root).length > 0, 'build output must not be empty');
});
