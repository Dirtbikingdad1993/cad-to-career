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

test('changes to public files trigger builds while unrelated app changes are skipped', () => {
  const fs = require('node:fs');
  const os = require('node:os');
  const { execFileSync, spawnSync } = require('node:child_process');
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const dir = fs.mkdtempSync(join(os.tmpdir(), 'cad-build-check-'));
  const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'ignore' });
  const commit = message => { git('add', '.'); git('-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '-qm', message); };
  try {
    git('init', '-q');
    fs.writeFileSync(join(dir, 'index.html'), 'initial');
    commit('initial');
    for (const path of ['expanded-curriculum.js', 'verify.css', 'scripts/build-public.mjs', 'pilot/index.html', 'resources/technical-references.html']) {
      const target = join(dir, path);
      fs.mkdirSync(require('node:path').dirname(target), { recursive: true });
      fs.writeFileSync(target, 'changed');
      commit(path);
      assert.equal(spawnSync('sh', ['-c', config.ignoreCommand], { cwd: dir }).status, 1, `Vercel would ignore ${path}`);
    }
    fs.mkdirSync(join(dir, 'apps/base44-site'), { recursive: true });
    fs.writeFileSync(join(dir, 'apps/base44-site/package.json'), '{}');
    commit('unrelated app');
    assert.equal(spawnSync('sh', ['-c', config.ignoreCommand], { cwd: dir }).status, 0);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
