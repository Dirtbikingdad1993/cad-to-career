const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('public pages do not rely on styles blocked by the production CSP', () => {
  const config = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  const headers = config.headers.flatMap(rule => rule.headers);
  const csp = headers.find(header => header.key.toLowerCase() === 'content-security-policy')?.value;
  assert.ok(csp, 'production CSP must exist');
  const styleSources = csp.split(';').map(part => part.trim()).find(part => part.startsWith('style-src '));
  assert.ok(styleSources && !styleSources.includes("'unsafe-inline'"), 'inline styles must stay disabled');
  for (const file of ['index.html', 'app.js', 'expanded-curriculum.js', 'lesson-guides.js', 'verify.html', 'privacy.html', 'terms.html', 'pilot/index.html', 'resources/technical-references.html']) {
    const source = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(source, /<style(?:\s|>)/i, `${file} contains a blocked inline stylesheet`);
    assert.doesNotMatch(source, /\sstyle\s*=\s*["']/i, `${file} contains a blocked style attribute`);
  }
  const verify = fs.readFileSync('verify.html', 'utf8');
  assert.match(verify, /href="\/verify\.css"/);
  assert.ok(fs.existsSync('verify.css'), 'certificate verifier stylesheet must be shipped');
});
