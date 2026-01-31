const CACHE_NAME = 'attendance-app-v1';
const urlsToCache = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  // Prevent SSRF by only caching same-origin requests
  const url = new URL(event.request.url);
  
  // Only handle GET requests for same-origin
  if (url.origin !== self.location.origin || event.request.method !== 'GET') {
    return;
  }
  
  // Whitelist allowed protocols
  if (!['http:', 'https:'].includes(url.protocol)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(cacheNames => Promise.all(cacheNames.map(cacheName => cacheName !== CACHE_NAME ? caches.delete(cacheName) : null))));
});
