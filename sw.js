const CACHE_NAME = 'sdel-v1';
const API_CACHE_NAME = 'sdel-api-v1';

// Your original assets + more
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/homies.html',
  '/feed',
  '/cbt',
  '/market',
  '/dms',
  '/manifest.json',
  '/converted-image.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/offline.html'  // Create this for better offline UX
];

// ===== INSTALL: Cache core files (YOUR ORIGINAL CODE) =====
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  self.skipWaiting(); // Forces new SW to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => console.log('Core assets cached'))
  );
});

// ===== FETCH: Network first (YOUR ORIGINAL LOGIC) =====
self.addEventListener('fetch', (event) => {
  // Special handling for API calls (optional)
  if (event.request.url.includes('/api/')) {
    event.respondWith(handleApiFetch(event.request));
  } else {
    // Your original fetch logic for pages/assets
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
          return caches.match(event.request)
            .then(cached => cached || caches.match('/offline.html'));
        })
    );
  }
});

// ===== API HANDLING (for background sync) =====
async function handleApiFetch(request) {
  try {
    // Try network first
    const response = await fetch(request);
    // Cache successful API responses
    if (response.status === 200) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // If offline, return cached API response
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Return offline JSON for failed API calls
    return new Response(JSON.stringify({
      offline: true,
      message: "You're offline. Showing cached data."
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// ===== BACKGROUND SYNC (NEW) =====
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPendingPosts());
  }
  
  if (event.tag === 'sync-likes') {
    event.waitUntil(syncPendingLikes());
  }
});

async function syncPendingPosts() {
  try {
    // Get pending posts from IndexedDB (you'll implement this)
    const pendingPosts = await getPendingPosts();
    
    for (const post of pendingPosts) {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
      
      if (response.ok) {
        await removePendingPost(post.id);
        // Notify user
        self.registration.showNotification('Post uploaded!', {
          body: 'Your post is now live',
          icon: '/icons/icon-192.png'
        });
      }
    }
  } catch (error) {
    console.log('Sync failed, will retry later:', error);
  }
}

async function syncPendingLikes() {
  // Similar pattern for likes/comments
  console.log('Syncing pending likes...');
}

// ===== PERIODIC SYNC (NEW) =====
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic sync triggered:', event.tag);
  
  if (event.tag === 'update-feed') {
    event.waitUntil(updateFeedCache());
  }
  
  if (event.tag === 'update-cbt-questions') {
    event.waitUntil(updateCbtCache());
  }
});

async function updateFeedCache() {
  try {
    const response = await fetch('/api/feed');
    const feedData = await response.json();
    
    const cache = await caches.open('feed-cache');
    cache.put('/api/feed', new Response(JSON.stringify(feedData)));
    
    console.log('Feed updated in background');
  } catch (error) {
    console.log('Periodic sync failed:', error);
  }
}

async function updateCbtCache() {
  // Preload CBT questions when phone is idle/charging
  try {
    const response = await fetch('/api/cbt/questions');
    const cache = await caches.open('cbt-cache');
    cache.put('/api/cbt/questions', response);
    console.log('CBT questions updated');
  } catch (error) {
    console.log('CBT update failed');
  }
}

// ===== PUSH NOTIFICATIONS (NEW) =====
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let data = { title: 'Thesdel', body: 'New update!', url: '/' };
  
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'open',
        title: 'Open'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// ===== NOTIFICATION CLICK HANDLER =====
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// ===== ACTIVATE: Clean up old caches =====
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Claim clients immediately
      clients.claim(),
      
      // Delete old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
    ])
  );
});

// ===== HELPER FUNCTIONS (you'll implement these with IndexedDB) =====
async function getPendingPosts() {
  // Implement with IndexedDB to store posts when offline
  return [];
}

async function removePendingPost(id) {
  // Implement with IndexedDB to remove synced posts
  console.log('Removed post:', id);
      }
