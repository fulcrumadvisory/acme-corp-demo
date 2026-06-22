/* Service Worker — ADC Event App */
const CACHE_NAME = 'adc-event-v1';
const PRECACHE = [
  '/acme-corp-demo/dayof/index.html',
  '/acme-corp-demo/assets/css/main.css',
  '/acme-corp-demo/assets/js/data.js',
  '/acme-corp-demo/manifest.json',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Network-first for HTML, cache-first for assets
  const url = new URL(e.request.url);
  if (url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request))
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});

// Push notification handler
self.addEventListener('push', e => {
  const data = e.data?.json() || { title: 'ADC Event Update', body: 'Check the event app for details.' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/assets/favicon.svg',
      badge: '/assets/favicon.svg',
      tag: data.tag || 'adc-event',
      data: { url: data.url || '/acme-corp-demo/dayof/index.html' },
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data?.url || '/acme-corp-demo/dayof/index.html')
  );
});
