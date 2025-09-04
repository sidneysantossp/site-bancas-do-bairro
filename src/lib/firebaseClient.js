// Inicialização do Firebase no cliente (browser)
// Usa SDK modular v9

import { initializeApp, getApps } from 'firebase/app'
import { getMessaging, isSupported, getToken, onMessage } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDVd22dcPNS0bzR4hAKJ1iHDYfLDflZLh0',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'guia-das-bancas-42427.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'guia-das-bancas-42427',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'guia-das-bancas-42427.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '484179386302',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:484179386302:web:d0288fe19563b097d0a3ef',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

const isBrowser = typeof window !== 'undefined'
const isLocalhost = isBrowser && (/^(localhost|127\.0\.0\.1)$/).test(window.location.hostname)
const isSecureContext = isBrowser && (window.isSecureContext || isLocalhost)
const hasSW = isBrowser && 'serviceWorker' in navigator
const hasPush = isBrowser && 'PushManager' in window
const hasNotification = isBrowser && 'Notification' in window

export function initFirebaseApp() {
  if (!isBrowser) return null
  return getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
}

export async function initMessagingAndGetToken() {
  if (!isBrowser) return null
  if (!isSecureContext || !hasSW || !hasPush || !hasNotification) {
    console.log('FCM: contexto inseguro ou APIs ausentes (ServiceWorker/Push/Notification). Mensageria desativada.')
    return null
  }
  const supported = await isSupported().catch(() => false)
  if (!supported) {
    console.warn('FCM: navegador não suportado pelo SDK de Messaging')
    return null
  }

  const app = initFirebaseApp()
  const messaging = getMessaging(app)

  // Registra o service worker padrão do Next na raiz pública
  const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

  // VAPID key pública — idealmente usar NEXT_PUBLIC_FIREBASE_VAPID_KEY
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || ''
  if (!vapidKey) {
    console.warn('FCM: defina NEXT_PUBLIC_FIREBASE_VAPID_KEY para obter o token')
  }

  try {
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration })
    return token || null
  } catch (e) {
    console.error('FCM: erro ao obter token', e)
    return null
  }
}

export function onForegroundMessage(callback) {
  if (!isBrowser) return () => {}
  if (!isSecureContext || !hasPush || !hasNotification) return () => {}
  const app = initFirebaseApp()
  const messaging = getMessaging(app)
  return onMessage(messaging, (payload) => callback(payload))
}