import { createClient } from '@supabase/supabase-js';

// Keep the PKCE verifier in the tab that started sign-in. The normal learner
// session is handed to the existing cloud client only after a code exchange.
const config = window.CAD_CLOUD_CONFIG || {};
const url = String(config.url || '').replace(/\/$/, '');
const key = String(config.publishableKey || '');
const storageKey = 'cad-to-career-oauth-v1';
const pendingKey = `${storageKey}-pending`;
const providers = Object.freeze({ google: 'Google', azure: 'Microsoft', github: 'GitHub', apple: 'Apple' });
let client;

function clearTemporaryState() {
  // The SDK may create flow-specific verifier slots as well as a session.
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const name = sessionStorage.key(i);
    if (name === storageKey || name?.startsWith(`${storageKey}-`)) sessionStorage.removeItem(name);
  }
}

function oauthClient() {
  if (!url || !key) throw new Error('Cloud sign-in is not configured.');
  if (!client) client = createClient(url, key, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storage: window.sessionStorage,
      storageKey,
    },
  });
  return client;
}

async function enabledProviders() {
  if (!url || !key) return [];
  const response = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, cache: 'no-store' });
  if (!response.ok) throw new Error('Could not check sign-in options.');
  const settings = await response.json();
  return Object.entries(providers).filter(([id]) => settings?.external?.[id] === true)
    .map(([id, label]) => ({ id, label }));
}

async function begin(provider) {
  if (!Object.prototype.hasOwnProperty.call(providers, provider)) throw new Error('This sign-in option is not supported.');
  // Fail rather than starting a flow that cannot be completed safely.
  try { sessionStorage.setItem(pendingKey, provider); }
  catch (_) { throw new Error('Enable browser storage to use this sign-in option.'); }
  try {
    const options = { redirectTo: `${location.origin}/`, skipBrowserRedirect: true };
    if (provider === 'azure') options.scopes = 'email';
    const { data, error } = await oauthClient().auth.signInWithOAuth({ provider, options });
    if (error) throw error;
    const destination = new URL(data?.url);
    const authHost = new URL(url);
    if (destination.origin !== authHost.origin || destination.pathname !== '/auth/v1/authorize') {
      throw new Error('Could not start secure sign-in.');
    }
    if (destination.searchParams.get('code_challenge_method') !== 's256') {
      throw new Error('Secure sign-in is not supported by this browser.');
    }
    // The SDK's skip option suppresses its own navigation and also asks the
    // Auth server for JSON. This is a top-level navigation, so follow redirects.
    destination.searchParams.delete('skip_http_redirect');
    location.assign(destination.href);
  } catch (error) {
    clearTemporaryState();
    throw error;
  }
}

function hasCallback() {
  try { if (!sessionStorage.getItem(pendingKey)) return false; }
  catch (_) { return false; }
  const params = new URL(location.href).searchParams;
  const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
  return params.has('code') || params.has('error') || hash.has('error');
}

async function completeCallback() {
  if (!hasCallback()) return null;
  const incoming = new URL(location.href);
  const code = incoming.searchParams.get('code');
  try {
    if (!code) throw new Error('Sign-in was cancelled or could not be completed.');
    const { data, error } = await oauthClient().auth.exchangeCodeForSession(code);
    if (error || !data?.session?.access_token || !data?.session?.refresh_token) {
      throw new Error('Sign-in could not be completed. Please try again.');
    }
    return data.session;
  } finally {
    clearTemporaryState();
    incoming.searchParams.delete('code');
    incoming.searchParams.delete('error');
    incoming.searchParams.delete('error_code');
    incoming.searchParams.delete('error_description');
    history.replaceState(null, '', incoming.pathname + incoming.search + '#/login');
  }
}

window.CAD_SOCIAL = { enabledProviders, begin, hasCallback, completeCallback };
