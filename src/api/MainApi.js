import axios from 'axios'
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

const MainApi = axios.create({
    baseURL: baseUrl,
})

MainApi.interceptors.request.use(function (config) {
    let rawZoneId = undefined
    let token = undefined
    let language = undefined
    let currentLocation = undefined
    const software_id = 33571750
    let hostname = process.env.NEXT_CLIENT_HOST_URL

    if (typeof window !== 'undefined') {
        rawZoneId = localStorage.getItem('zoneid')
        token = localStorage.getItem('token')
        language = localStorage.getItem('language')
        try {
            currentLocation = JSON.parse(localStorage.getItem('currentLatLng'))
        } catch (e) {
            currentLocation = undefined
        }
        // Preferir a origem do navegador quando disponível (inclui protocolo)
        if (window?.location?.origin) {
            hostname = window.location.origin
        }
    }

    // Latitude/Longitude apenas se forem números válidos
    const lat = currentLocation?.lat
    const lng = currentLocation?.lng
    if (typeof lat === 'number' && isFinite(lat)) config.headers.latitude = lat
    if (typeof lng === 'number' && isFinite(lng)) config.headers.longitude = lng

    // Sanitizar zoneId: aceitar número ou array não vazio de números
    const normalizedZoneHeader = (() => {
        if (!rawZoneId || rawZoneId === 'null' || rawZoneId === 'undefined' || rawZoneId === '[]') return undefined
        try {
            const parsed = JSON.parse(rawZoneId)
            if (Array.isArray(parsed) && parsed.length > 0) {
                const nums = parsed.map((n) => Number(n)).filter((n) => !Number.isNaN(n))
                if (nums.length > 0) return JSON.stringify(nums)
                return undefined
            }
            const asNum = Number(parsed)
            if (!Number.isNaN(asNum)) return String(asNum)
            if (typeof parsed === 'string' && parsed.trim().length > 0) return parsed
        } catch (e) {
            const asNum = Number(rawZoneId)
            if (!Number.isNaN(asNum)) return String(asNum)
        }
        return undefined
    })()
    if (normalizedZoneHeader) config.headers.zoneId = normalizedZoneHeader

    if (token) config.headers.authorization = `Bearer ${token}`
    if (language) config.headers['X-localization'] = language
    if (hostname) config.headers['origin'] = hostname
    config.headers['X-software-id'] = software_id

    return config
})
export default MainApi
