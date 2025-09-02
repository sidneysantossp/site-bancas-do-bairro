import Homes from '../../components/home/Homes'
import Meta from '../../components/Meta'
import HomeGuard from '../../components/home-guard/HomeGuard'
import { CustomHeader } from '@/api/Headers'

const HomePage = ({ configData, landingPageData, pathName }) => {
    return (
        <>
            <Meta
                title={configData?.business_name}
                ogImage={`${configData?.base_urls?.react_landing_page_images}/${landingPageData?.banner_section_full?.banner_section_img_full}`}
                pathName={pathName}
            />
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
    const apiBase = process.env.NEXT_PUBLIC_BASE_URL || origin

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
        const configRes = await fetchWithTimeout(
            `${apiBase}/api/v1/config`,
            {
                method: 'GET',
                headers: {
                    'X-software-id': 33571750,
                    'X-server': 'server',
                    'X-localization': language,
                    // origin removido
                    Accept: 'application/json',
                },
            },
            10000
        )

        if (configRes.ok) {
            configData = await configRes.json()
        } else {
            console.error(
                'Error fetching config data:',
                configRes.status,
                configRes.statusText
            )
        }
    } catch (error) {
        console.error('Error in config data fetch:', error)
    }

    try {
        const landingPageRes = await fetchWithTimeout(
            `${apiBase}/api/v1/landing-page`,
            {
                method: 'GET',
                headers: {
                    ...CustomHeader,
                    'X-localization': language,
                    // origin removido
                    Accept: 'application/json',
                },
            },
            10000
        )

        if (landingPageRes.ok) {
            landingPageData = await landingPageRes.json()
        } else {
            console.error(
                'Error fetching landing page data:',
                landingPageRes.status,
                landingPageRes.statusText
            )
        }
    } catch (error) {
        console.error('Error in landing page data fetch:', error)
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
