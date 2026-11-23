const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { safeUrl, safeEmail } = require('../support.js');

test('support page only links to allowlisted https payment hosts', () => {
  assert.equal(safeUrl('https://buy.stripe.com/abc123'), 'https://buy.stripe.com/abc123');
  assert.equal(safeUrl('https://github.com/sponsors/example'), 'https://github.com/sponsors/example');
  assert.equal(safeUrl('http://buy.stripe.com/abc'), null);
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('https://evil.example/stripe'), null);
  assert.equal(safeUrl('https://buy.stripe.com.evil.example/x'), null);
  assert.equal(safeUrl(''), null);
  assert.ok(safeUrl('https://billing.stripe.com/p/login/abc'));
  assert.equal(safeEmail('team@example.org'), 'team@example.org');
  assert.equal(safeEmail('bad"@x.org'), null);
});

test('funding config is public-safe and keeps lessons free', () => {
  const src = fs.readFileSync('funding-config.js', 'utf8');
  assert.doesNotMatch(src, /sk_(live|test)_|rk_(live|test)_|whsec_/, 'never commit Stripe secret keys');
  const sandbox = { window: {} };
  vm.runInNewContext(src, sandbox);
  const cfg = sandbox.window.CAD_FUNDING;
  assert.ok(Array.isArray(cfg.monthly) && cfg.monthly.length > 0);
  for (const tier of cfg.monthly) {
    assert.ok(tier.amount > 0 && tier.name && tier.perks);
    assert.ok(tier.url === '' || safeUrl(tier.url), `tier ${tier.id} url must be an allowlisted https link`);
    assert.doesNotMatch(tier.perks, /certificate|credential|unlock|exclusive lesson/i, 'support must not buy credentials or content');
  }
  const html = fs.readFileSync('support.html', 'utf8');
  assert.match(html, /funding-config\.js/);
  assert.match(html, /never unlocks or speeds up a credential/);
  assert.doesNotMatch(html, /<script>(?!<\/script>)/, 'no inline scripts (CSP script-src self)');
});

test('support page is reachable from the app and included in the public build', () => {
  assert.match(fs.readFileSync('app.js', 'utf8'), /"\/support","Support us"/);
  assert.match(fs.readFileSync('scripts/build-public.mjs', 'utf8'), /'support\.html', 'support\.js', 'funding-config\.js'/);
  assert.match(fs.readFileSync('sitemap.xml', 'utf8'), /\/support</);
});
