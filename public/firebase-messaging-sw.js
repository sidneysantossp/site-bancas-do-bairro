/* Firebase Cloud Messaging Service Worker */
/*
  Como funciona:
  - Tentamos carregar opcionalmente /firebase-config-sw.js, que pode definir self.FIREBASE_CONFIG
  - Se não existir, usamos um objeto de configuração com placeholders
  - É necessário definir pelo menos "messagingSenderId"
*/

try {
  // Opcional: permita definir as chaves sem versionar neste repositório
  // Crie public/firebase-config-sw.js com: self.FIREBASE_CONFIG = { ... }
  importScripts('/firebase-config-sw.js')
} catch (e) {
  // Sem problemas se o arquivo não existir
}

// Carrega SDK compat (v9) para uso no Service Worker
// Alinha com a versão instalada no projeto (firebase@^11.2.0)
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.2.0/firebase-messaging-compat.js')

const FALLBACK_CONFIG = {
  // Preencha pelo menos o messagingSenderId do seu projeto
  // Você também pode incluir apiKey, authDomain, projectId, storageBucket e appId
  messagingSenderId: 'COLOQUE_SEU_MESSAGING_SENDER_ID_AQUI'
}

const firebaseConfig = (typeof self !== 'undefined' && self.FIREBASE_CONFIG) ? self.FIREBASE_CONFIG : FALLBACK_CONFIG

try {
  firebase.initializeApp(firebaseConfig)
} catch (err) {
  // Evita erro "app/duplicate-app" em hot reload durante dev
  // e loga apenas em caso de falha real de inicialização
  if (!/already exists/.test(err?.message || '')) {
    console.warn('Firebase SW: falha ao inicializar', err)
  }
}

let messaging
try {
  messaging = firebase.messaging()
} catch (err) {
  console.warn('Firebase SW: messaging indisponível', err)
}

// Recebe mensagens em segundo plano
if (messaging && typeof messaging.onBackgroundMessage === 'function') {
  messaging.onBackgroundMessage((payload) => {
    const notification = payload?.notification || {}
    const title = notification.title || 'Nova notificação'
    const options = {
      body: notification.body || '',
      icon: notification.icon || '/icons/icon-192x192.png',
      data: payload?.data || {},
      // Badge opcional: '/icons/badge-72x72.png'
    }

    self.registration.showNotification(title, options)
  })
}

// Foca/abre o app quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const targetUrl = event.notification?.data?.click_action || '/'
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        const origin = (self.location && self.location.origin) || ''
        for (const client of clientList) {
          try {
            if (client.url && client.url.startsWith(origin) && 'focus' in client) {
              return client.focus()
            }
          } catch (_) {}
        }
        if (self.clients.openWindow) {
          // Garantir que abrimos apenas URLs relativas ao app
          const url = String(targetUrl || '/')
          const finalUrl = url.startsWith('http') ? origin : url
          return self.clients.openWindow(finalUrl)
        }
        return undefined
      })
  )
})
