// Service Worker for RCA PWA
const CACHE_NAME = 'rca-v1';

// Install event - cache basic assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip API requests - always go to network
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});
