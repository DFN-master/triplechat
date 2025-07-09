// This is a custom service worker for the TripleChat PWA
const CACHE_NAME = "triplechat-pwa";
const urlsToCache = ["/", "/index.html"];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // força o novo SW a ser ativado imediatamente
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // toma o controle das abas
      caches.keys().then(keys =>
        Promise.all(keys.map(key => caches.delete(key))) // limpa caches antigos
      )
    ])
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});


// Evento de push
self.addEventListener('push', async function (event) {
  // Verifica se a janela está em primeiro plano
  const windowClients = await clients.matchAll({ type: 'window' });
  const isWindowFocused = windowClients.some(client => client.focused);

  if (isWindowFocused) {
    console.log('Janela em foco - Notificação suprimida');
    return; // Não mostra notificação se o usuário já está no site
  }

  const payload = event.data?.json() || {
    title: 'Nova Mensagem',
    body: 'Você recebeu uma nova notificação'
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: `${payload.contact}: ${payload.lastMessage}`,
      icon: '/icons/icon-128x128.png',
      badge: '/icons/favicon-96x96.png',
      vibrate: [200, 100, 200],
      data: { url: payload.url },
      requireInteraction: true, // Mantém a notificação visível até que o usuário interaja
      // Ações personalizadas para a notificação
      // Permite que o usuário abra ou feche a notificação
      actions: [
        { action: 'open', title: 'Abrir' },
        { action: 'close', title: 'Fechar' }
      ],
      tag: payload.title, // Garante que notificações com o mesmo título sejam atualizadas
      renotify: true,
    })
    // .then(() => {
    //   setTimeout(() => {
    //     self.registration.getNotifications()
    //       .then(notifications => {
    //         notifications.forEach(notification => {
    //           if (notification.title === payload.title) {
    //             notification.close();
    //           }
    //         });
    //       });
    //   }, 7000);
    // })
  );
});

// Variável para armazenar se o app está em modo standalone
// Isso é usado para verificar se o app está rodando como PWA ou em uma aba normal do navegador
let appIsStandalone = false;

// Define o modo de exibição do app com base na variável
self.addEventListener('message', (event) => {
  if (event.data.type === 'SET_DISPLAY_MODE') {
    appIsStandalone = event.data.isStandalone;
  }
});


// Evento de clique na notificação
// Fecha a notificação imediatamente e abre a URL associada
// Se a janela já estiver aberta, traz para o foco; caso contrário, abre uma nova
self.addEventListener('notificationclick', function (event) {
  event.notification.close(); // Fecha a notificação imediatamente

  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({
      type: appIsStandalone ? 'window' : 'all', // Modifica o comportamento se for PWA
      includeUncontrolled: true // Inclui janelas não controladas por este Service Worker
    }).then(windowClients => {
      // Verifica se já existe uma janela com esta URL
      const existingClient = windowClients.find(client =>
        client.url === urlToOpen ||
        client.url.startsWith(urlToOpen)
      );

      if (existingClient) {
        // Janela existe: traz para o foco
        return existingClient.focus();
      } else {
        // Janela não existe: abre nova
        return clients.openWindow(urlToOpen);
      }
    })
  );
});