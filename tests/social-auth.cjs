const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { webcrypto, createHash } = require('node:crypto');

const source = fs.readFileSync(require('node:path').join(__dirname, '../social-auth.js'), 'utf8');
const cloudSource = fs.readFileSync(require('node:path').join(__dirname, '../cloud.js'), 'utf8');

class Storage {
  constructor() { this.values = new Map(); }
  get length() { return this.values.size; }
  key(index) { return Array.from(this.values.keys())[index] ?? null; }
  getItem(key) { return this.values.has(key) ? this.values.get(key) : null; }
  setItem(key, value) { this.values.set(key, String(value)); }
  removeItem(key) { this.values.delete(key); }
}

function browser(storage, href, fetcher) {
  let assigned = null;
  let current = new URL(href);
  const location = {
    get href() { return current.href; },
    get origin() { return current.origin; },
    get hash() { return current.hash; },
    assign(value) { assigned = value; },
  };
  const history = { replaceState(_a, _b, next) { current = new URL(next, current.origin); } };
  const context = {
    console, URL, URLSearchParams, Response, Request, Headers, TextEncoder, TextDecoder, WebSocket,
    crypto: webcrypto, fetch: fetcher, sessionStorage: storage, localStorage: new Storage(),
    location, history, setTimeout, clearTimeout, setInterval, clearInterval,
    btoa: value => Buffer.from(value, 'binary').toString('base64'),
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    document: {}, navigator: {},
    CAD_CLOUD_CONFIG: { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(source, context);
  return { context, get assigned() { return assigned; }, get href() { return current.href; } };
}

test('only configured providers are offered', async () => {
  const storage = new Storage();
  const b = browser(storage, 'https://cad.example/', async (_url, options) => {
    assert.equal(options.headers.apikey, 'sb_publishable_test');
    return Response.json({ external: { google: true, azure: false, github: true, apple: false, unsupported: true } });
  });
  const enabled = await b.context.CAD_SOCIAL.enabledProviders();
  assert.deepEqual(Array.from(enabled, value => value.id), ['google', 'github']);
});

for (const provider of ['google', 'github', 'apple']) {
  test(`${provider} starts a PKCE sign-in for the selected provider`, async () => {
    const storage = new Storage();
    const b = browser(storage, 'https://cad.example/#/register', async () => { throw Error('Unexpected request.'); });
    await b.context.CAD_SOCIAL.begin(provider);
    const dest = new URL(b.assigned);
    assert.equal(dest.searchParams.get('provider'), provider);
    assert.equal(dest.searchParams.get('code_challenge_method'), 's256');
    assert.equal(dest.searchParams.has('skip_http_redirect'), false);
  });
}

test('Microsoft sign-in uses S256 PKCE and exchanges the callback once', async () => {
  const storage = new Storage();
  const first = browser(storage, 'https://cad.example/#/login', async () => { throw Error('No fetch is needed to start OAuth.'); });
  await first.context.CAD_SOCIAL.begin('azure');
  const dest = new URL(first.assigned);
  assert.equal(dest.origin, 'https://example.supabase.co');
  assert.equal(dest.pathname, '/auth/v1/authorize');
  assert.equal(dest.searchParams.get('provider'), 'azure');
  assert.equal(dest.searchParams.get('scopes'), 'email');
  assert.equal(dest.searchParams.get('redirect_to'), 'https://cad.example/');
  assert.equal(dest.searchParams.get('code_challenge_method'), 's256');
  assert.equal(dest.searchParams.has('skip_http_redirect'), false);
  const storedVerifier = JSON.parse(storage.getItem('cad-to-career-oauth-v1-code-verifier'));
  const challenge = createHash('sha256').update(storedVerifier).digest('base64url');
  assert.equal(dest.searchParams.get('code_challenge'), challenge);

  let exchanges = 0;
  const second = browser(storage, 'https://cad.example/?code=one-time-code', async (url, options) => {
    assert.match(String(url), /\/auth\/v1\/token\?grant_type=pkce$/);
    exchanges++;
    const sent = JSON.parse(options.body);
    assert.equal(sent.auth_code, 'one-time-code');
    assert.equal(sent.code_verifier, storedVerifier);
    return Response.json({ access_token: 'test-access', refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, user: { id: 'test-user', email: 'test@example.invalid' } });
  });
  assert.equal(second.context.CAD_SOCIAL.hasCallback(), true);
  const session = await second.context.CAD_SOCIAL.completeCallback();
  assert.equal(session.access_token, 'test-access');
  assert.equal(exchanges, 1);
  assert.equal(storage.length, 0);
  assert.equal(second.href, 'https://cad.example/#/login');
  assert.equal(second.context.CAD_SOCIAL.hasCallback(), false);
});

test('unknown providers and unsolicited callbacks do not start a session', async () => {
  const storage = new Storage();
  let calls = 0;
  const b = browser(storage, 'https://cad.example/?code=unrequested', async () => { calls++; throw Error('Unexpected request.'); });
  assert.equal(b.context.CAD_SOCIAL.hasCallback(), false);
  assert.equal(await b.context.CAD_SOCIAL.completeCallback(), null);
  await assert.rejects(b.context.CAD_SOCIAL.begin('untrusted'), /not supported/);
  assert.equal(calls, 0);
  assert.equal(storage.length, 0);
});

test('provider cancellation removes temporary state and callback error', async () => {
  const storage = new Storage();
  storage.setItem('cad-to-career-oauth-v1-pending', 'google');
  storage.setItem('cad-to-career-oauth-v1-code-verifier', 'temporary');
  const b = browser(storage, 'https://cad.example/#error=access_denied&error_description=no', async () => { throw Error('Unexpected request.'); });
  await assert.rejects(b.context.CAD_SOCIAL.completeCallback(), /cancelled/);
  assert.equal(storage.length, 0);
  assert.equal(b.href, 'https://cad.example/#/login');
});

test('an invalid new OAuth session does not replace the existing signed-in account', async () => {
  const storage = new Storage();
  const events = [];
  const response = (body, status = 200) => Response.json(body, { status });
  const context = {
    console, URL, URLSearchParams, Response, Blob, File, AbortController, setTimeout, clearTimeout,
    localStorage: storage, location: { origin: 'https://cad.example' },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    CAD_CLOUD_CONFIG: { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' },
    fetch: async (url, options) => {
      if (String(url).includes('grant_type=password')) return response({ access_token: 'old-access', refresh_token: 'old-refresh', expires_in: 3600, user: { id: 'old-user' } });
      if (String(url).endsWith('/auth/v1/user')) {
        if (options.headers.Authorization === 'Bearer bad-access') return response({ message: 'Invalid session' }, 401);
        if (options.headers.Authorization === 'Bearer new-access') return response({ id: 'new-user' });
      }
      throw Error('Unexpected request.');
    },
    dispatchEvent(event) { events.push(event); },
  };
  context.window = context;
  vm.createContext(context);
  vm.runInContext(cloudSource, context);
  await context.CAD_CLOUD.signIn('old@example.invalid', 'example');
  const before = storage.getItem('cad-to-career-auth-session-v1');
  await assert.rejects(context.CAD_CLOUD.acceptOAuthSession({ access_token: 'bad-access', refresh_token: 'bad-refresh' }), /Invalid session/);
  assert.equal(context.CAD_CLOUD.currentUser().id, 'old-user');
  assert.equal(storage.getItem('cad-to-career-auth-session-v1'), before);
  await context.CAD_CLOUD.acceptOAuthSession({ access_token: 'new-access', refresh_token: 'new-refresh', expires_in: 3600 });
  assert.equal(context.CAD_CLOUD.currentUser().id, 'new-user');
  assert.equal(events.at(-1).detail.user.id, 'new-user');
});
