/* Kotoba Path service worker.
   Strategy:
   - App shell (HTML, CSS, JS, icons): precached on install, served cache-first.
     Bump VERSION whenever shell files change so clients pick up the new build.
   - Curriculum data (data/*.json): stale-while-revalidate in a stable cache, so
     content updates arrive on the next visit without a shell version bump.
   - Fonts (Google Fonts): stale-while-revalidate. Offline before first use, the
     CSS falls back to system Japanese fonts.
   Nothing here talks to any other origin. */

const VERSION = '0.4.0';
const SHELL_CACHE = `kp-shell-${VERSION}`;
const DATA_CACHE = 'kp-data';
const FONT_CACHE = 'kp-fonts';
const KEEP = new Set([SHELL_CACHE, DATA_CACHE, FONT_CACHE]);
// On localhost, prefer the network for shell files so edits show up on reload
// without bumping VERSION. Production (GitHub Pages) stays cache-first.
const DEV = self.location.hostname === 'localhost' || self.location.hostname === '127.0.0.1';

const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/lesson.css',
  './css/speak.css',
  './js/app.js',
  './js/router.js',
  './js/store/db.js',
  './js/store/settings.js',
  './js/store/progress.js',
  './js/store/days.js',
  './js/store/backup.js',
  './js/ui/dom.js',
  './js/ui/toast.js',
  './js/ui/dialog.js',
  './js/ui/search.js',
  './js/ui/shortcuts.js',
  './js/ui/audio.js',
  './js/ui/stroke.js',
  './js/ui/tracepad.js',
  './js/ui/kanatext.js',
  './js/ui/quiz.js',
  './js/ui/pitch.js',
  './js/ui/recognizer.js',
  './js/ui/recorder.js',
  './js/engine/mora.js',
  './js/content/speaking.js',
  './js/engine/fsrs.js',
  './js/engine/scheduler.js',
  './js/engine/scaffold.js',
  './js/engine/romaji.js',
  './js/content/kana.js',
  './js/content/loader.js',
  './js/content/ids.js',
  './js/util/platform.js',
  './js/views/home.js',
  './js/views/learn.js',
  './js/views/review.js',
  './js/views/speak.js',
  './js/views/read.js',
  './js/views/progress.js',
  './js/views/settings.js',
  './js/views/about.js',
  './js/views/notfound.js',
  './js/views/orientation.js',
  './js/views/kana-stage.js',
  './js/views/lesson.js',
  './js/views/exam.js',
  './js/views/item.js',
  './js/views/speak-session.js',
  './data/index.json',
  './data/orientation.json',
  './data/kana.json',
  './data/strokes/hiragana.json',
  './data/katakana.json',
  './data/strokes/katakana.json',
  './data/speaking.json',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((n) => !KEEP.has(n)).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Navigations: serve the cached shell so the app opens offline.
  if (req.mode === 'navigate') {
    event.respondWith(DEV ? networkFirst(req, SHELL_CACHE, './index.html') : cacheFirst(req, SHELL_CACHE, './index.html'));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.includes('/data/')) {
      event.respondWith(staleWhileRevalidate(req, DATA_CACHE));
    } else if (DEV) {
      event.respondWith(networkFirst(req, SHELL_CACHE));
    } else {
      event.respondWith(cacheFirst(req, SHELL_CACHE));
    }
    return;
  }

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(staleWhileRevalidate(req, FONT_CACHE));
  }
  // Any other origin: let the browser handle it normally (there should be none).
});

async function cacheFirst(req, cacheName, fallbackKey) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req, { ignoreSearch: true });
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    if (fallbackKey) {
      const fb = await cache.match(fallbackKey);
      if (fb) return fb;
    }
    return new Response('Offline and not cached.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function networkFirst(req, cacheName, fallbackKey) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true }) || (fallbackKey && await cache.match(fallbackKey));
    return hit || new Response('Offline and not cached.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const refresh = fetch(req).then((res) => {
    if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  if (hit) {
    // Keep the worker alive until the background refresh settles.
    return hit;
  }
  const res = await refresh;
  return res || new Response('Offline and not cached.', { status: 503, headers: { 'Content-Type': 'text/plain' } });
}
