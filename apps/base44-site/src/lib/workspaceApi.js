import { base44 } from '@/api/base44Client';

function unwrap(res) {
  if (res && typeof res === 'object' && 'data' in res) return res.data;
  return res;
}

async function invoke(fn, payload) {
  try {
    const res = await base44.functions.invoke(fn, payload);
    const data = unwrap(res);
    if (data && data.error) throw new Error(typeof data.error === 'string' ? data.error : data.error.message);
    return data;
  } catch (err) {
    const details = err.response?.data || err.data;
    const text = typeof details?.error === 'string' ? details.error :
      details?.error?.message || details?.detail || details?.message;
    throw new Error(text || err.message || 'The workspace request failed.');
  }
}

export function studentAction(action, payload = {}) {
  return invoke('studentWorkspace', { action, ...payload });
}

export function reviewerAction(action, payload = {}) {
  return invoke('reviewerConsole', { action, ...payload });
}