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
  self.skipWaiting();
});

// Activate: Take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch: Try Network first, fallback to Cache
self.addEventListener('fetch', (event) => {
  // Only handle requests from our origin
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Return offline page for HTML requests
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
        
        return new Response('Offline', { status: 404 });
      })
  );
});
