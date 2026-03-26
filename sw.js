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
  // Force waiting service worker to become active
  self.skipWaiting();
});

// Activate: Clean up old caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
});

// Fetch: Try Network first (Live Update), fallback to Cache (Offline)
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests to avoid errors
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Only cache successful responses
        if (response && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((response) => {
          // ✅ If request exists in cache, return it
          if (response) return response;

          // 💥 If NOT in cache, show offline page for HTML requests
          if (event.request.headers.get('accept').includes('text/html')) {
            return caches.match('/offline.html');
          }
          
          return new Response('Offline content not available', {
            status: 404,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
  );
});
