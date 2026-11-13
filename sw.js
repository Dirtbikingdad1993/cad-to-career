/* CAD to Career offline support. Learning state remains in browser localStorage. */
const CACHE = 'cad-to-career-offline-v4';
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js', '/data.js', '/cloud-config.js', '/cloud.js', '/social-auth.js', '/icon.svg', '/manifest.webmanifest', '/privacy.html', '/terms.html', '/resources/phone-to-desktop-roadmap.md', '/resources/project-1-brief.md', '/resources/project-2-brief.md', '/resources/project-3-brief.md', '/resources/project-4-brief.md', '/resources/project-5-brief.md'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names => Promise.all(names.filter(name => name !== CACHE).map(name => caches.delete(name)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  // A one-time OAuth code must not be stored in the offline cache.
  if (new URL(event.request.url).searchParams.has('code')) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && (response.type === 'basic' || response.type === 'default')) {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
    }
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || (event.request.mode === 'navigate' ? caches.match('/') : Response.error()))));
});

