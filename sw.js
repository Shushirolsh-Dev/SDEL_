const CACHE_NAME = 'sdel-v1';

// We've updated this to use your specific filename
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/manifest.json',
  '/converted-image.png'
];

// Install: Cache the core files immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Fetch: Try Network first (Live Update), fallback to Cache (Offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If network is successful, update the cache with the new version
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        // If offline, serve from cache
        return caches.match(event.request);
      })
  );
});
