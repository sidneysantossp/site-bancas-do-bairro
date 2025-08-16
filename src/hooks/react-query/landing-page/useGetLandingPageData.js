import MainApi from '../../../api/MainApi'
import { useQuery } from 'react-query'

export const landingPagedata = async () => {
    try {
        const { data } = await MainApi.get('/api/v1/react-landing-page')
        return data
    } catch (error) {
        // Fallback para backends que não possuem o endpoint react-landing-page
        const { data } = await MainApi.get('/api/v1/landing-page')
        return data
    }
}
export const useGetLandingPageData = (onSuccessHandler) => {
    return useQuery('landing_page_data', () => landingPagedata(), {
        onSuccess: onSuccessHandler,
        enabled:false
    })
}
