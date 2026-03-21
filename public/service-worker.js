// Service Worker for offline support and caching
// Security-hardened cache strategies with content validation

const CACHE_NAME = 'chula-english-v1';
const CACHE_EXPIRATION = {
  images: 31536000000,    // 1 year in ms
  pdfs: 604800000,        // 7 days in ms
  html: 0,                // No cache
  js_css: 31536000000,    // 1 year
};

const urlsToCache = [
  '/',
  '/index.html',
  '/logo.png',
  '/inforgraphic.png',
];

// Helper: Check if cached response is still valid
function isCacheValid(response, expirationTime) {
  if (!response || !response.headers) {
    return false;
  }

  const cacheControl = response.headers.get('Cache-Control');
  const dateHeader = response.headers.get('Date');

  // If response has Cache-Control: no-cache or max-age=0, don't use cache
  if (cacheControl && (cacheControl.includes('no-cache') || cacheControl.includes('max-age=0'))) {
    return false;
  }

  // Check expiration time
  if (expirationTime > 0 && dateHeader) {
    const cacheTime = new Date(dateHeader).getTime();
    const now = Date.now();
    if (now - cacheTime > expirationTime) {
      return false;
    }
  }

  return true;
}

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.log('Cache addAll error:', err);
        // Don't fail if some resources can't be cached
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (security: same-origin only)
  if (!request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip chrome extensions and browser requests
  if (request.url.startsWith('chrome-extension://') || request.url.startsWith('moz-extension://')) {
    return;
  }

  // PDFs - network first with cache fallback
  // Allows downloads on slow connections, caches result for offline
  if (request.url.includes('.pdf')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Validate response status and content type
          if (response.status === 200) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('pdf')) {
              const cache = caches.open(CACHE_NAME);
              cache.then(c => c.put(request, response.clone()));
            }
          }
          return response;
        })
        .catch(() => {
          // Return cached PDF if available
          return caches.match(request)
            .then(cachedResponse => {
              if (cachedResponse && isCacheValid(cachedResponse, CACHE_EXPIRATION.pdfs)) {
                return cachedResponse;
              }
              // Return offline page
              return caches.match('/index.html');
            });
        })
    );
    return;
  }

  // Images (PNG, WebP, JPG) - cache first with network fallback
  // Fastest loading from cache, security: validate content type
  if (/\.(png|webp|jpg|jpeg|gif|svg)$/i.test(request.url)) {
    event.respondWith(
      caches.match(request).then(response => {
        // Return cached if valid
        if (response && isCacheValid(response, CACHE_EXPIRATION.images)) {
          return response;
        }

        return fetch(request)
          .then(response => {
            // Security: Validate response
            if (!response || response.status !== 200) {
              return response;
            }

            // Validate content type is actually an image
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('image')) {
              console.warn('Invalid content-type for image:', contentType);
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            // Return cached version or placeholder
            return caches.match('/index.html');
          });
      })
    );
    return;
  }

  // Static assets (JS, CSS) - cache first with network fallback
  if (/\.(js|css)$/i.test(request.url)) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response && isCacheValid(response, CACHE_EXPIRATION.js_css)) {
          return response;
        }

        return fetch(request)
          .then(response => {
            if (!response || response.status !== 200) {
              return response;
            }

            // Validate content type
            const contentType = response.headers.get('content-type');
            const isValidType = (request.url.includes('.js') && contentType && contentType.includes('javascript')) ||
                               (request.url.includes('.css') && contentType && contentType.includes('css'));

            if (!isValidType && !request.url.includes('.js') && !request.url.includes('.css')) {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
            return response;
          })
          .catch(() => {
            return caches.match('/index.html');
          });
      })
    );
    return;
  }

  // HTML pages - network first with cache fallback
  // Ensures latest content when online
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request)
            .then(response => response || caches.match('/index.html'))
            .catch(() => caches.match('/404.html'));
        })
    );
    return;
  }

  // Default: cache first strategy with validation
  event.respondWith(
    caches.match(request).then(response => {
      if (response && isCacheValid(response, CACHE_EXPIRATION.js_css)) {
        return response;
      }

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match('/index.html')
            .catch(() => caches.match('/404.html'));
        });
    })
  );
});
