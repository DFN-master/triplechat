// src/serviceWorker.js
const CACHE_NAME = "triplechat-pwa";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener('push', function (event) {
  console.log('[SW] push event received:', event);
  console.log('[SW] event.data:', event.data?.text());

  try {
    const data = event.data?.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon-128x128.png'
    });
  } catch (e) {
    console.error('[SW] erro ao interpretar payload:', e);
    self.registration.showNotification("Notificação", {
      body: event.data?.text(),
      icon: '/icons/icon-128x128.png'
    });
  }
});