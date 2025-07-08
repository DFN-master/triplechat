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
  console.log("[SW] push event received:", event);
  if (event.data) {
    console.log("[SW] event.data:", event.data.text());

    const data = event.data.json();

    const title = data.title || "Notificação";
    const options = {
      body: data.body || "",
      icon: "/icons/icon-128x128.png", // ajuste se necessário
      // badge: "/icons/badge-72x72.png"  // opcional
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } else {
    console.log("[SW] push sem dados");
  }
});