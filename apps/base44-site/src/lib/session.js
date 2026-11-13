const KEY = 'draftline.session.v1';

export function readSession() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* storage can be unavailable in private mode — the code still works for this visit */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function normalizeCode(value) {
  return String(value || '').trim().toUpperCase().replace(/\s+/g, '');
}