import { initializeApp, getApps, getApp } from 'firebase/app'
import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from 'firebase/messaging'
import { getAuth } from 'firebase/auth'

// Habilita Firebase (Auth sempre; Messaging apenas quando suportado)
const FIREBASE_ENABLED = (
    (process.env.NEXT_PUBLIC_FIREBASE_ENABLED || '').toString().toLowerCase() === 'true'
)

// Checagens de capacidade do navegador/ambiente para Web Push/Messaging
const isBrowser = typeof window !== 'undefined'
const isLocalhost = isBrowser && (/^(localhost|127\.0\.0\.1)$/).test(window.location.hostname)
const isSecureContext = isBrowser && (window.isSecureContext || isLocalhost)
const hasServiceWorker = isBrowser && 'serviceWorker' in navigator
const hasPushManager = isBrowser && 'PushManager' in window
const hasNotification = isBrowser && 'Notification' in window

const canInitMessaging = () => {
    if (!isBrowser) return false
    if (!isSecureContext) return false // HTTPS é obrigatório (exceto localhost)
    if (!hasServiceWorker || !hasPushManager || !hasNotification) return false
    return true
}

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDVd22dcPNS0bzR4hAKJ1iHDYfLDflZLh0',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'guia-das-bancas-42427.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'guia-das-bancas-42427',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'guia-das-bancas-42427.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '484179386302',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:484179386302:web:d0288fe19563b097d0a3ef',
}

let firebaseApp = null
let messaging = null

// Inicializa SEMPRE o Firebase App para permitir recursos como Auth, mesmo se
// as notificações estiverem desabilitadas
try {
    firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
} catch (err) {
    console.warn('Firebase inicialização falhou:', err)
    firebaseApp = null
}

// Inicializa Messaging apenas quando habilitado e suportado
if (FIREBASE_ENABLED) {
    messaging = (async () => {
        try {
            // Garante que só seguimos em frente quando ambiente e navegador suportam
            if (!canInitMessaging()) {
                console.log('[Firebase] Messaging desativado: contexto inseguro ou APIs ausentes (ServiceWorker/Push/Notification).')
                return null
            }
            const supported = await isSupported()
            if (!supported) {
                console.log('[Firebase] Messaging desativado: navegador não é suportado pelo SDK.')
                return null
            }
            if (!firebaseApp) return null
            return getMessaging(firebaseApp)
        } catch (err) {
            console.warn('[Firebase] Messaging indisponível:', err)
            return null
        }
    })()
} else {
    console.log('Firebase (Messaging) desabilitado - funcionalidade de notificações não disponível')
}

export const fetchToken = async (setFcmToken) => {
    if (!FIREBASE_ENABLED) {
        console.log('[Firebase] Desabilitado - token não disponível')
        setFcmToken && setFcmToken()
        return Promise.resolve()
    }
    if (!canInitMessaging()) {
        console.log('[Firebase] Messaging não inicializado: requer HTTPS (ou localhost) e suporte a ServiceWorker/Push/Notification.')
        setFcmToken && setFcmToken()
        return Promise.resolve()
    }
    if (!messaging) {
        console.log('[Firebase] Messaging não disponível no ambiente atual')
        setFcmToken && setFcmToken()
        return Promise.resolve()
    }

    try {
        const msg = await messaging
        if (!msg) {
            setFcmToken && setFcmToken()
            return
        }
        // Solicita permissão de notificação (necessário em muitos navegadores)
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            try {
                const perm = await Notification.requestPermission()
                if (perm !== 'granted') {
                    console.log('[Firebase] Permissão de notificação não concedida')
                    setFcmToken && setFcmToken()
                    return
                }
            } catch (_) {}
        }
        // Garante que o service worker de messaging esteja registrado
        let registration
        try {
            registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        } catch (e) {
            console.warn('[Firebase] Falha ao registrar service worker de messaging:', e)
        }
        const currentToken = await getToken(msg, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
        })
        if (currentToken) {
            setFcmToken && setFcmToken(currentToken)
        } else {
            setFcmToken && setFcmToken()
        }
    } catch (err) {
        console.error('[Firebase] Erro ao obter token FCM:', err)
        setFcmToken && setFcmToken()
    }
}

export const onMessageListener = async () => {
    if (!FIREBASE_ENABLED) {
        console.log('[Firebase] Desabilitado - listener não disponível')
        return Promise.resolve(null)
    }
    if (!canInitMessaging() || !messaging) {
        console.log('[Firebase] Messaging não disponível para listener no ambiente atual')
        return Promise.resolve(null)
    }

    return new Promise((resolve) =>
        (async () => {
            const messagingResolve = await messaging
            if (messagingResolve) {
                onMessage(messagingResolve, (payload) => {
                    resolve(payload)
                })
            } else {
                resolve(null)
            }
        })()
    )
}
export const auth = firebaseApp ? getAuth(firebaseApp) : null
