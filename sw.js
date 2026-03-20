const CACHE_NAME = 'sdel-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/manifest.json',
  '/offline.html',
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
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          // ✅ If request exists in cache, return it
          if (response) return response;

          // 💥 If NOT in cache, show offline page
          return caches.match('/offline.html');
        });
      })
  );
});
