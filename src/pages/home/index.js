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

    try {
        const configRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
            {
                method: 'GET',
                headers: {
                    'X-software-id': 33571750,
                    'X-server': 'server',
                    'X-localization': language,
                    origin: process.env.NEXT_CLIENT_HOST_URL,
                },
            }
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
        const landingPageRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/landing-page`,
            {
                method: 'GET',
                headers: CustomHeader,
            }
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

    const domain = req.headers.host
    const pathName = `https://${domain}${resolvedUrl}`

    return {
        props: {
            configData,
            landingPageData,
            pathName,
        },
    }
}
