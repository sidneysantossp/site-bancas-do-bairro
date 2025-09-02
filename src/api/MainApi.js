import axios from 'axios'

// Base URL strategy:
// - Browser: use same-origin (''), then hit Next.js rewrites (proxy) to avoid CORS
// - SSR/Node: use NEXT_PUBLIC_BASE_URL (external API) or NEXT_CLIENT_HOST_URL, or localhost:3020 as last resort
const isBrowser = typeof window !== 'undefined'
const ssrFallback = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_CLIENT_HOST_URL || 'http://localhost:3020'
export const baseUrl = isBrowser ? '' : ssrFallback

const MainApi = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
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

    // Normalizar URL: remover espaços e garantir barra inicial para rotas relativas
    if (config?.url && !/^https?:\/\//i.test(config.url)) {
        const trimmed = String(config.url).trim()
        config.url = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
    }

    // Latitude/Longitude apenas se forem números válidos
    const lat = currentLocation?.lat
    const lng = currentLocation?.lng
    if (typeof lat === 'number' && isFinite(lat)) config.headers.latitude = lat
    if (typeof lng === 'number' && isFinite(lng)) config.headers.longitude = lng

    // Sanitizar zoneId: aceitar número ou array não vazio de números
    const normalizedZoneHeader = (() => {
        if (!rawZoneId || rawZoneId === 'null' || rawZoneId === 'undefined' || rawZoneId === '[]') return undefined
        if (typeof rawZoneId === 'string' && rawZoneId.trim() === '') return undefined
        try {
            const parsed = JSON.parse(rawZoneId)
            if (Array.isArray(parsed) && parsed.length > 0) {
                const nums = parsed
                    .map((n) => Number(n))
                    .filter((n) => Number.isFinite(n) && n > 0)
                if (nums.length > 0) return JSON.stringify(nums)
                return undefined
            }
            const asNum = Number(parsed)
            if (!Number.isNaN(asNum) && asNum > 0) return String(asNum)
            if (typeof parsed === 'string' && parsed.trim().length > 0) return parsed
        } catch (e) {
            const asNum = Number(rawZoneId)
            if (!Number.isNaN(asNum) && asNum > 0) return String(asNum)
        }
        return undefined
    })()
    // Previous: if (normalizedZoneHeader) config.headers.zoneId = normalizedZoneHeader
    if (normalizedZoneHeader) {
        config.headers.zoneId = normalizedZoneHeader
        config.headers['zone-id'] = normalizedZoneHeader
        config.headers['zone_id'] = normalizedZoneHeader
    } else {
        // Fallback: garantir zoneId padrão para evitar erro "ID da zona necessário"
        // Permitir configuração via variável de ambiente: NEXT_PUBLIC_DEFAULT_ZONE_ID ou NEXT_PUBLIC_DEFAULT_ZONE_IDS
        const envDefault = process.env.NEXT_PUBLIC_DEFAULT_ZONE_ID || process.env.NEXT_PUBLIC_DEFAULT_ZONE_IDS
        let defaultZoneValue
        if (envDefault) {
            try {
                const parsed = JSON.parse(envDefault)
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const nums = parsed.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0)
                    if (nums.length > 0) defaultZoneValue = JSON.stringify(nums)
                } else {
                    const asNum = Number(parsed)
                    defaultZoneValue = !Number.isNaN(asNum) && asNum > 0 ? String(asNum) : String(parsed)
                }
            } catch (_) {
                const parts = String(envDefault)
                    .split(',')
                    .map((s) => Number(s.trim()))
                    .filter((n) => Number.isFinite(n) && n > 0)
                if (parts.length > 1) defaultZoneValue = JSON.stringify(parts)
                else if (parts.length === 1) defaultZoneValue = String(parts[0])
            }
        }
        const defaultZone = defaultZoneValue || JSON.stringify([1])
        config.headers.zoneId = defaultZone
        config.headers['zone-id'] = defaultZone
        config.headers['zone_id'] = defaultZone
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('zoneid')
                if (!saved || saved === 'null' || saved === 'undefined' || saved === '[]') {
                    localStorage.setItem('zoneid', defaultZone)
                }
            } catch (_) {}
        }
    }

    if (token) config.headers.authorization = `Bearer ${token}`
    if (language) config.headers['X-localization'] = language

    // NÃO definir cabeçalhos proibidos pelo navegador (Origin/Referer/Host)
    // O navegador já envia automaticamente o Origin quando necessário.
    // if (hostname) config.headers['origin'] = hostname // REMOVIDO

    config.headers['X-software-id'] = software_id

    return config
})
export default MainApi
