import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import api from '../src/services/api'

// import * as serviceWorkerRegistration from './pwa/serviceWorkerRegistration';

import App from "./App";

ReactDOM.render(
	<CssBaseline>
		<App />
	</CssBaseline>,
	document.getElementById("root")
);

// Registra o service worker
//serviceWorkerRegistration.register();
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/custom-sw.js')
      .then(reg => console.log('SW registrado', reg))
      .catch(err => console.error('Erro ao registrar SW:', err));
  });
}


// Notificação no PWA
async function subscribeUserToPush() {
	if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
		console.warn("Push notifications não são suportadas neste navegador.");
		return;
	}

	const permission = await Notification.requestPermission();
	if (permission !== "granted") {
		console.warn("Permissão para notificações negada.");
		return;
	}

	const registration = await navigator.serviceWorker.ready;

	const subscription = await registration.pushManager.subscribe({
		userVisibleOnly: true,
		applicationServerKey: urlBase64ToUint8Array('BJZXTIvGada8sUzE0mrLGh09_W8vTqpx_MtmoRcDiTVpW84awh2Fvx1N8OmX1BXDr9X5X3K5rtEKq7EApGsjpHc')
	});

	console.log("Subscription gerada:", subscription);

	await api.post("/pushnotification/save-subscription", {
		data: JSON.stringify(subscription)
});
}

// Função auxiliar para converter a VAPID key
function urlBase64ToUint8Array(base64String) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
	const rawData = window.atob(base64);
	return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}



// Verificação de PWA + envio para Service Worker
const checkPWAStatus = () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SET_DISPLAY_MODE',
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
      url: window.location.href
    });
  }
};

// Executa quando o SW estiver pronto
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then(() => {
    checkPWAStatus();
  });
}

// Também executa quando o display mode muda
window.matchMedia('(display-mode: standalone)').addListener(checkPWAStatus);



// Chamar a função
subscribeUserToPush();
