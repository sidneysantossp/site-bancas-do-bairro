import { WrapperForApp } from '@/App.style'
import { SettingsConsumer, SettingsProvider } from '@/contexts/settings-context'
import { store } from '@/redux/store'
import { CacheProvider } from '@emotion/react'
import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import nProgress from 'nprogress'
import { useEffect, useMemo, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
// Carregar Devtools apenas no cliente para evitar falhas no SSR
const ReactQueryDevtoolsLazy = dynamic(
    () => import('react-query/devtools').then((m) => m.ReactQueryDevtools),
    { ssr: false }
)
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import DynamicFavicon from '../components/favicon/DynamicFavicon'
import FloatingCardManagement from '../components/floating-cart/FloatingCardManagement'
import Navigation from '../components/navbar'
import ScrollToTop from '../components/scroll-top/ScrollToTop'
import '../language/i18n'
import '../styles/global.css'
import '../styles/nprogress.css'
import { createTheme } from '../theme/index'
import createEmotionCache from '../utils/create-emotion-cache'
import ForceGeolocation from '../components/geolocation/ForceGeolocation'
// Adiciona inicialização do Firebase Messaging no cliente
// (useEffect já está importado acima)
import { initMessagingAndGetToken, onForegroundMessage } from '../lib/firebaseClient'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)
export const currentVersion = process.env.NEXT_PUBLIC_SITE_VERSION
const clientSideEmotionCache = createEmotionCache()

function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
    const { t } = useTranslation()
    const getLayout = Component.getLayout ?? ((page) => page)
    // cria uma única instância do QueryClient por ciclo de vida da app
    const queryClient = useMemo(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        cacheTime: 5 * 60 * 1000,
                        refetchOnWindowFocus: false,
                        retry: 1,
                    },
                },
            }),
        []
    )
    const router = useRouter()
    const [viewFooter, setViewFooter] = useState(false)
    const Footer = dynamic(() => import('../components/footer/Footer'), {
        ssr: false,
    })
    useEffect(() => {
        const userLanguage = localStorage.getItem('language')
        if (!userLanguage) {
            localStorage.setItem('language', i18n.language)
        }
    }, [])

    useEffect(() => {
        const userLanguage = localStorage.getItem('language')
        // Normaliza e força pt-br quando apropriado
        const normalizedRaw = userLanguage?.toLowerCase().replace('_', '-')
        let lang
        if (!normalizedRaw) {
            lang = 'pt-br'
        } else if (normalizedRaw === 'en' || normalizedRaw?.startsWith('en-')) {
            // Se estiver salvo como inglês (inclui variações en-xx), forçamos para pt-br nesta instalação
            lang = 'pt-br'
        } else if (normalizedRaw === 'pt' || normalizedRaw.startsWith('pt-')) {
            lang = 'pt-br'
        } else {
            lang = normalizedRaw
        }
        i18n.changeLanguage(lang)
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('lang', lang)
        }
        if (lang !== userLanguage) {
            localStorage.setItem('language', lang)
        }
        setViewFooter(true)
    }, [])

    // Inicializa FCM no cliente: registra SW, pede permissão e obtém token
    useEffect(() => {
        let unsubscribe = () => {}
        ;(async () => {
            try {
                const token = await initMessagingAndGetToken()
                if (token) {
                    // TODO: Enviar token ao seu backend se necessário
                    // await fetch('/api/save-fcm-token', { method: 'POST', body: JSON.stringify({ token }) })
                    console.log('FCM token obtido:', token)
                }
                unsubscribe = onForegroundMessage((payload) => {
                    console.log('FCM foreground message:', payload)
                })
            } catch (e) {
                console.warn('FCM não inicializado:', e)
            }
        })()
        return () => {
            try { unsubscribe() } catch {}
        }
    }, [])

    let persistor = persistStore(store)

    let zoneid = undefined
    if (typeof window !== 'undefined') {
        zoneid = JSON.parse(localStorage.getItem('zoneid'))
    }

    useEffect(() => {
        if (!currentVersion) return
        const storedVersion = localStorage.getItem('appVersion')
        if (storedVersion !== currentVersion) {
            localStorage.clear()
            localStorage.setItem('appVersion', currentVersion)
            // Evita navegação dura para a mesma URL: apenas recarrega a página
            // para carregar os novos assets sem router.push para '/'
            window.location.reload()
        }
    }, [])

    return (
        <CacheProvider value={emotionCache}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <SettingsProvider>
                        <SettingsConsumer>
                            {(value) => (
                                <ThemeProvider
                                    theme={createTheme({
                                        direction: value.settings.direction,
                                        responsiveFontSizes:
                                            value.settings.responsiveFontSizes,
                                        mode: value.settings.theme,
                                    })}
                                >
                                    <CssBaseline />
                                    <Toaster />
                                    <Head>
                                        <title>{t('Loading...')}</title>
                                    </Head>
                                    <WrapperForApp pathname={router.pathname}>
                                        <ScrollToTop />
                                        {router.pathname !== '/maintenance' && (
                                            <Navigation />
                                        )}
                                        <DynamicFavicon />
                                        <ForceGeolocation />

                                        <Box
                                            sx={{
                                                minHeight: '100vh',
                                                mt: {
                                                    xs:
                                                        router.pathname === '/' ||
                                                        router.pathname ===
                                                        '/home'
                                                            ? '2.5rem'
                                                            : '2rem',
                                                    md:
                                                        router.pathname === '/'
                                                            ? zoneid
                                                                ? '4rem'
                                                                : '2rem'
                                                            : '4rem',
                                                },
                                            }}
                                        >
                                            {router.pathname !== '/' &&
                                                router.pathname !==
                                                    '/checkout' &&
                                                router.pathname !== '/chat' && (
                                                    <FloatingCardManagement
                                                        zoneid={zoneid}
                                                    />
                                                )}
                                            {getLayout(
                                                <Component {...pageProps} />
                                            )}
                                        </Box>
                                        {viewFooter &&
                                            router.pathname !==
                                                '/maintenance' && (
                                                <Footer
                                                    languageDirection={
                                                        value?.settings
                                                            ?.direction
                                                    }
                                                />
                                            )}
                                    </WrapperForApp>
                                </ThemeProvider>
                            )}
                        </SettingsConsumer>
                    </SettingsProvider>
                </Provider>
                {process.env.NODE_ENV !== 'production' && (
                    <ReactQueryDevtoolsLazy
                        initialIsOpen={false}
                        position="bottom-right"
                    />
                )}
            </QueryClientProvider>
        </CacheProvider>
    )
}

export default App
