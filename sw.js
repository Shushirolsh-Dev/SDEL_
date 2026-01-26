const CACHE_NAME = 'sdel-v1';
const ASSETS_TO_CACHE = [
  '/dashboard.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
  // Add your CSS and JS file paths here too!
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

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
      .catch(() => caches.match(event.request))
  );
});
