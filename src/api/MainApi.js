import axios from 'axios'

// Base URL strategy:
// - Browser: use NEXT_PUBLIC_BASE_URL if available, otherwise use same-origin proxy
// - SSR/Node: use NEXT_PUBLIC_BASE_URL (external API) or fallback
const isBrowser = typeof window !== 'undefined'

// Ensure trailing slash when a base URL is provided to avoid wrong URL resolution
const normalizeBaseUrl = (url) => {
    if (!url) return ''
    try {
        // Using WHATWG URL for validation; we only care to ensure it ends with '/'
        // so relative paths like 'api/v1/..' resolve correctly with axios/new URL()
        // Examples:
        //  - 'http://host/path'      => 'http://host/path/'
        //  - 'http://host'           => 'http://host/'
        //  - 'http://host/path/'     => unchanged
        //  - ''                       => ''
        // If URL constructor throws (invalid), fall back to simple check
        // eslint-disable-next-line no-new
        new URL(url)
        return url.endsWith('/') ? url : `${url}/`
    } catch (_) {
        return url && !url.endsWith('/') ? `${url}/` : url
    }
}

// Estratégia simplificada: sempre usar APIs locais mock quando em desenvolvimento
const productionBackend = process.env.NEXT_PUBLIC_BASE_URL
const isDevelopment = process.env.NODE_ENV === 'development'

// Em desenvolvimento, usar sempre APIs locais para evitar CORS
const browserUrl = (isDevelopment || !productionBackend) ? '' : normalizeBaseUrl(productionBackend)
const ssrFallback = productionBackend ? normalizeBaseUrl(productionBackend) : normalizeBaseUrl(
    process.env.NEXT_CLIENT_HOST_URL || 'http://localhost:3020'
)
export const baseUrl = isBrowser ? browserUrl : ssrFallback

const MainApi = axios.create({
    baseURL: baseUrl,
    timeout: 30000, // Aumentado para 30 segundos
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

MainApi.interceptors.request.use(function (config) {
    console.log('API Request:', config.baseURL, config.url)
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

    // Normalizar URL - sempre usar APIs locais em desenvolvimento
    if (config?.url && !/^https?:\/\//i.test(config.url)) {
        const trimmed = String(config.url).trim()
        
        if (isDevelopment || !productionBackend) {
            // Desenvolvimento: usar APIs locais do Next.js
            config.url = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
        } else {
            // Produção: conexão direta ao backend
            config.url = trimmed.replace(/^\/+/, '')
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
            if (!Number.isNaN(asNum) && asNum > 0) return JSON.stringify([asNum])
            if (typeof parsed === 'string' && parsed.trim().length > 0) {
                // Tentar separar por vírgula e normalizar
                const parts = String(parsed)
                    .split(',')
                    .map((s) => Number(s.trim()))
                    .filter((n) => Number.isFinite(n) && n > 0)
                if (parts.length > 0) return JSON.stringify(parts)
            }
        } catch (e) {
            const asNum = Number(rawZoneId)
            if (!Number.isNaN(asNum) && asNum > 0) return JSON.stringify([asNum])
        }
        return undefined
    })()
    // Previous: if (normalizedZoneHeader) config.headers.zoneId = normalizedZoneHeader
    if (normalizedZoneHeader) {
        config.headers.zoneId = normalizedZoneHeader
        config.headers['zone-id'] = normalizedZoneHeader
        config.headers['zone_id'] = normalizedZoneHeader
    } else {
        // Fallback: garantir zoneId padrão como ARRAY JSON para evitar erro de count() no backend PHP
        // Permitir configuração via variável de ambiente: NEXT_PUBLIC_DEFAULT_ZONE_ID ou NEXT_PUBLIC_DEFAULT_ZONE_IDS
        const envDefault = process.env.NEXT_PUBLIC_DEFAULT_ZONE_ID || process.env.NEXT_PUBLIC_DEFAULT_ZONE_IDS
        let defaultZoneArray = []
        if (envDefault) {
            try {
                const parsed = JSON.parse(envDefault)
                if (Array.isArray(parsed)) {
                    defaultZoneArray = parsed
                        .map((n) => Number(n))
                        .filter((n) => Number.isFinite(n) && n > 0)
                } else {
                    const asNum = Number(parsed)
                    if (Number.isFinite(asNum) && asNum > 0) defaultZoneArray = [asNum]
                }
            } catch (_) {
                const parts = String(envDefault)
                    .split(',')
                    .map((s) => Number(s.trim()))
                    .filter((n) => Number.isFinite(n) && n > 0)
                if (parts.length > 0) defaultZoneArray = parts
            }
        }
        const defaultZone = JSON.stringify(defaultZoneArray.length > 0 ? defaultZoneArray : [1])
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

// Interceptor de resposta para debugging
MainApi.interceptors.response.use(
    function (response) {
        // Log de sucesso para debugging
        console.log('API Success:', response.config.url, response.status)
        return response
    },
    function (error) {
        // Log de erro para debugging
        console.error('API Error:', error.config?.url, error.response?.status, error.message)
        return Promise.reject(error)
    }
)

export default MainApi
