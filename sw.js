// Money Plan phone app: opens offline and updates itself. Your numbers never go through
// here; they go straight between the app and your private GitHub space.
// Only caches named money-plan-* are touched, so Back Catalog (same github.io address) is safe.
const VERSION = '1.0.4-3680480e';
const CACHE = 'money-plan-' + VERSION;
const FILES = ["./","app.js","fonts/schibsted-grotesk-latin-400-normal.woff2","fonts/schibsted-grotesk-latin-500-normal.woff2","fonts/schibsted-grotesk-latin-600-normal.woff2","fonts/schibsted-grotesk-latin-700-normal.woff2","fonts/schibsted-grotesk-latin-ext-400-normal.woff2","fonts/schibsted-grotesk-latin-ext-500-normal.woff2","fonts/schibsted-grotesk-latin-ext-600-normal.woff2","fonts/schibsted-grotesk-latin-ext-700-normal.woff2","fonts/young-serif-latin-400-normal.woff2","fonts/young-serif-latin-ext-400-normal.woff2","icons/apple-touch-icon.png","icons/favicon-64.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png","index.html","manifest.webmanifest","register-sw.js","styles.css"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('money-plan-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.open(CACHE).then((c) => c.match('./').then((r) => r || c.match('index.html'))).then((r) => r || fetch(req)));
    return;
  }
  e.respondWith(caches.open(CACHE).then((c) => c.match(req, { ignoreSearch: true })).then((hit) => hit || fetch(req)));
});
