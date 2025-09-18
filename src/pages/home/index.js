import Homes from '../../components/home/Homes'
import Meta from '../../components/Meta'
import HomeGuard from '../../components/home-guard/HomeGuard'
import { CustomHeader } from '@/api/Headers'
import AutoGeolocation from '../../components/geolocation/AutoGeolocation'
// import ApiTest from '../../components/debug/ApiTest'
// import GoogleMapsDebug from '../../components/debug/GoogleMapsDebug'

const HomePage = ({ configData, landingPageData, pathName }) => {
    return (
        <>
            <Meta
                title={configData?.business_name}
                ogImage={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.banner_section_full?.banner_section_img_full}`}
                pathName={pathName}
            />
            <AutoGeolocation />
            <Homes configData={configData} />
        </>
    )
}
HomePage.getLayout = (page) => <HomeGuard>{page}</HomeGuard>

export default HomePage

export const getServerSideProps = async ({ req, resolvedUrl }) => {
    const language = req.cookies.languageSetting

    let configData = null
    let landingPageData = null

    // Detectar origem/protocolo do request para headers e metadados coerentes
    const domain = req.headers.host
    const protocol = req.headers['x-forwarded-proto'] || (domain?.includes('localhost') ? 'http' : 'https')
    const origin = `${protocol}://${domain}`
    const apiBase = origin

    // Utilitário de fetch com timeout para evitar travar a renderização no SSR
    const fetchWithTimeout = async (url, options = {}, timeoutMs = 10000) => {
        const controller = new AbortController()
        const id = setTimeout(() => controller.abort(), timeoutMs)
        try {
            const res = await fetch(url, { ...options, signal: controller.signal })
            return res
        } finally {
            clearTimeout(id)
        }
    }

    try {
        const { default: configHandler } = await import('../api/v1/config')
        let tmp = null
        const mockReq = { cookies: { languageSetting: language } }
        const mockRes = {
            status: () => mockRes,
            json: (data) => {
                tmp = data
                return mockRes
            },
        }
        await configHandler(mockReq, mockRes)
        configData = tmp
    } catch (error) {
        console.error('Error loading config mock:', error)
    }

    try {
        const { default: landingHandler } = await import(
            '../api/v1/react-landing-page'
        )
        let tmpLanding = null
        const mockReq = { query: {} }
        const mockRes = {
            status: () => mockRes,
            json: (data) => {
                tmpLanding = data
                return mockRes
            },
        }
        await landingHandler(mockReq, mockRes)
        landingPageData = tmpLanding
    } catch (error) {
        console.error('Error loading landing page mock:', error)
        // Fallback para /api/v1/landing-page
        try {
            const { default: fallbackHandler } = await import(
                '../api/v1/landing-page'
            )
            let tmpLanding = null
            const mockReq = { query: {} }
            const mockRes = {
                status: () => mockRes,
                json: (data) => {
                    tmpLanding = data
                    return mockRes
                },
            }
            await fallbackHandler(mockReq, mockRes)
            landingPageData = tmpLanding
        } catch (fallbackError) {
            console.error(
                'Error loading landing page fallback mock:',
                fallbackError
            )
        }
    }
    // Fallbacks para evitar tela em branco quando as APIs externas não respondem a tempo
    if (!configData) {
        configData = {
            business_name: 'Bancas do Bairro',
            base_urls: { react_landing_page_images: '' },
        }
    }
    if (!landingPageData) {
        landingPageData = {
            banner_section_full: { banner_section_img_full: '' },
        }
    }

    const pathName = `${origin}${resolvedUrl}`

    return {
        props: {
            configData,
            landingPageData,
            pathName,
        },
    }
}
