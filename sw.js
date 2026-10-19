/* ORPHEUS service worker.
   The app opens from the saved copy, so it starts instantly and works with no connection.
   A new version downloads in the background and waits. Nothing changes until you tap Update. */
const VERSION = '1.8.2';
const CACHE = 'orpheus-' + VERSION;
const ICONS = 'orpheus-icons'; // the icon you picked in Settings; survives updates
const FILES = ['./', 'index.html', 'covers.js', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE && k !== ICONS).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
  // the page sends the chosen icon; Android and desktop Chrome/Edge pick it up for the installed app
  if (e.data && e.data.type === 'SET_ICONS') {
    e.waitUntil(caches.open(ICONS).then(async c => {
      for (const [name, url] of Object.entries(e.data.icons || {})) {
        const blob = await (await fetch(url)).blob();
        await c.put(new URL(name, self.registration.scope).href, new Response(blob, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'no-cache' } }));
      }
    }));
  }
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).origin !== self.location.origin) return;

  // Opening the app: always the saved copy of this version (instant, works offline).
  if (e.request.mode === 'navigate') {
    e.respondWith(
      caches.match('index.html', { cacheName: CACHE })
        .then(hit => hit || caches.match('./', { cacheName: CACHE }))
        .then(hit => hit || fetch(e.request))
    );
    return;
  }

  if (/\/(icon-192|icon-512|apple-touch-icon)\.png$/.test(new URL(e.request.url).pathname)) {
    e.respondWith(
      caches.match(e.request, { ignoreSearch: true, cacheName: ICONS })
        .then(hit => hit || caches.match(e.request, { ignoreSearch: true, cacheName: CACHE }))
        .then(hit => hit || fetch(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true, cacheName: CACHE })
      .then(hit => hit || fetch(e.request))
  );
});
