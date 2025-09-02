import { initializeApp, getApps, getApp } from 'firebase/app'
import {
    getMessaging,
    getToken,
    onMessage,
    isSupported,
} from 'firebase/messaging'
import { getAuth } from 'firebase/auth'

// Habilita Firebase para fluxos de Auth (OTP)
const FIREBASE_ENABLED = true

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

if (FIREBASE_ENABLED) {
    try {
        firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp()
        messaging = (async () => {
            try {
                const isSupportedBrowser = await isSupported()
                if (isSupportedBrowser) {
                    return getMessaging(firebaseApp)
                }
                return null
            } catch (err) {
                console.warn('Firebase messaging não disponível:', err)
                return null
            }
        })()
    } catch (err) {
        console.warn('Firebase inicialização falhou:', err)
        firebaseApp = null
        messaging = null
    }
} else {
    console.log('Firebase desabilitado - funcionalidade de notificações não disponível')
}

export const fetchToken = async (setFcmToken) => {
    if (!FIREBASE_ENABLED || !messaging) {
        console.log('Firebase desabilitado - token não disponível')
        setFcmToken && setFcmToken()
        return Promise.resolve()
    }
    
    return getToken(await messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    })
        .then((currentToken) => {
            if (currentToken) {
                setFcmToken(currentToken)
            } else {
                setFcmToken()
            }
        })
        .catch((err) => {
            console.error(err)
        })
}

export const onMessageListener = async () => {
    if (!FIREBASE_ENABLED || !messaging) {
        console.log('Firebase desabilitado - listener não disponível')
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
