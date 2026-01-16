const CACHE_NAME = 'medical-predictor-v1';
const MODEL_CACHE = 'model-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/models/browser_model_fixed.json'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== MODEL_CACHE) {
            console.log('🧹 Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event with offline fallback
self.addEventListener('fetch', (event) => {
  // Cache model file for offline use
  if (event.request.url.includes('/models/')) {
    event.respondWith(
      caches.open(MODEL_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            console.log('📦 Serving model from cache');
            return response;
          }
          return fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          }).catch(() => {
            // If network fails and no cache, return a 200 with fallback
            return new Response(JSON.stringify({
              n_estimators: 50,
              n_features: 24,
              trees: [],
              isFallback: true
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        });
      })
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        // Return offline page for HTML requests
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});