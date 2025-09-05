import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserLocationUpdate } from '@/redux/slices/global'
import { GoogleApi } from '@/hooks/react-query/config/googleApi'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'

const DEFAULT_LOCATION_LABEL = 'São Paulo, SP - Brasil'
// Constrói a zona padrão a partir das variáveis de ambiente, com fallback para [1]
const getEnvDefaultZoneString = () => {
    const envDefault = process.env.NEXT_PUBLIC_DEFAULT_ZONE_ID || process.env.NEXT_PUBLIC_DEFAULT_ZONE_IDS
    if (!envDefault) return undefined
    try {
        const parsed = JSON.parse(envDefault)
        if (Array.isArray(parsed) && parsed.length > 0) {
            const nums = parsed.map((n) => Number(n)).filter((n) => Number.isFinite(n) && n > 0)
            if (nums.length > 0) return JSON.stringify(nums)
        } else {
            const asNum = Number(parsed)
            return !Number.isNaN(asNum) && asNum > 0 ? String(asNum) : String(parsed)
        }
    } catch (_) {
        const parts = String(envDefault)
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n) && n > 0)
        if (parts.length > 1) return JSON.stringify(parts)
        else if (parts.length === 1) return String(parts[0])
    }
    return undefined
}
const DEFAULT_ZONE_STRING = getEnvDefaultZoneString() || JSON.stringify([1])
const FALLBACK_LOCATION_LABEL = 'Minha localização atual'

const ForceGeolocation = () => {
    const dispatch = useDispatch()
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)

    const router = useRouter()
    const didRedirectRef = useRef(false)

    // Estado de carregamento do Google Maps JS API
    const { isLoaded: isGoogleLoaded } = useGoogleMaps()

    const toggleLocationUpdate = () =>
        dispatch(setUserLocationUpdate(!userLocationUpdate))

    const redirectToHomeOnce = () => {
        if (didRedirectRef.current) return
        didRedirectRef.current = true
        try {
            const path = typeof window !== 'undefined' ? window.location.pathname : undefined
            if (path !== '/home') {
                router.push('/home')
            }
        } catch (e) {
            console.log('Falha ao redirecionar para /home:', e)
        }
    }

    const setDefaultZone = () => {
        // Definir zona padrão (ID 1) e um rótulo amigável de localização
        localStorage.setItem('zoneid', DEFAULT_ZONE_STRING)
        // Garantir que HomeGuard libere o conteúdo mesmo sem endereço real resolvido
        try {
            const existingLocation = localStorage.getItem('location')
            if (!existingLocation || existingLocation === 'null' || existingLocation === 'undefined' || existingLocation.trim() === '') {
                localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
            }
        } catch (_) {}
        toggleLocationUpdate()
        console.log('Zona padrão definida (com rótulo de localização de fallback)')
    }

    const reverseGeocodeOSM = async (latitude, longitude) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
                latitude
            )}&lon=${encodeURIComponent(longitude)}&accept-language=pt-BR`
            // Não definir cabeçalhos proibidos pelo navegador (ex: User-Agent)
            const res = await fetch(url)
            if (!res.ok) throw new Error('OSM reverse geocode HTTP error')
            const data = await res.json()
            const address = data?.display_name
            if (address && typeof address === 'string') {
                localStorage.setItem('location', address)
                localStorage.setItem('zoneid', DEFAULT_ZONE_STRING)
                toggleLocationUpdate()
                console.log('Endereço obtido via OSM:', address)
                redirectToHomeOnce()
                return true
            }
        } catch (err) {
            console.log('Falha no fallback OSM:', err)
        }
        return false
    }

    // Fallback baseado no IP (quando usuário bloqueia ou navegador não suporta geolocalização)
    const ipGeolocationFallback = async () => {
        try {
            const res = await fetch('https://ipapi.co/json/')
            if (!res.ok) throw new Error('IP geolocation HTTP error')
            const data = await res.json()
            const latitude = parseFloat(data?.latitude)
            const longitude = parseFloat(data?.longitude)
            if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
                console.log('Localização aproximada via IP obtida:', {
                    latitude,
                    longitude,
                })
                await handleGeolocationSuccess({
                    coords: { latitude, longitude },
                })
                return true
            }
        } catch (e) {
            console.log('Falha no geolocation por IP:', e)
        }
        return false
    }

    const handleGeolocationSuccess = async (position) => {
        const { latitude, longitude } = position.coords
        
        // Salvar coordenadas
        const coords = { lat: latitude, lng: longitude }
        localStorage.setItem('currentLatLng', JSON.stringify(coords))
        
        try {
            // Tentar via API backend (não depende do script do Google Maps no cliente)
            const [geoRes, zoneRes] = await Promise.all([
                GoogleApi.geoCodeApi(coords),
                GoogleApi.getZoneId(coords),
            ])

            const address =
                geoRes?.data?.results?.[0]?.formatted_address ||
                geoRes?.data?.formatted_address

            if (address) {
                localStorage.setItem('location', address)
            }

            const zoneRaw = zoneRes?.data?.zone_id
            const zone = Array.isArray(zoneRaw)
                ? zoneRaw
                : zoneRaw
                ? [zoneRaw]
                : null
            if (zone && zone.length > 0) {
                localStorage.setItem('zoneid', JSON.stringify(zone))
            } else {
                localStorage.setItem('zoneid', DEFAULT_ZONE_STRING)
            }

            toggleLocationUpdate()
            console.log('Localização obtida via API:', address)
            redirectToHomeOnce()
        } catch (e) {
            console.log(
                'Falha ao obter endereço/zone via API, tentando Geocoder do Google Maps como fallback',
                e
            )
            // Fazer reverse geocoding usando Google Maps JS API como fallback
            if (
                isGoogleLoaded &&
                typeof window !== 'undefined' &&
                window.google &&
                window.google.maps
            ) {
                try {
                    // Em versões recentes da API, é necessário importar a biblioteca de geocoding explicitamente
                    if (typeof window.google.maps.importLibrary === 'function') {
                        const geocodingLib = await window.google.maps.importLibrary('geocoding')
                        // Preferir classe retornada pela lib (evita "is not a constructor")
                        const GeocoderClass = geocodingLib?.Geocoder || window.google.maps.Geocoder
                        if (typeof GeocoderClass === 'function') {
                            const geocoder = new GeocoderClass()
                            const latlng = { lat: latitude, lng: longitude }

                            geocoder.geocode({ location: latlng }, async (results, status) => {
                                if (status === 'OK' && results && results[0]) {
                                    const address = results[0].formatted_address
                                    localStorage.setItem('location', address)

                                    // Definir zona baseada na localização (por enquanto usar zona 1)
                                    localStorage.setItem('zoneid', DEFAULT_ZONE_STRING)
                                    toggleLocationUpdate()

                                    console.log('Localização obtida:', address)
                                    redirectToHomeOnce()
                                } else {
                                    console.log('Erro no geocoding do Google, tentando OSM...')
                                    const ok = await reverseGeocodeOSM(latitude, longitude)
                                    if (!ok) {
                                        console.log('OSM também falhou, usando zona padrão')
                                        // Não salvar coordenadas como texto no campo 'location'; usar rótulo amigável
                                        localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
                                        setDefaultZone()
                                        redirectToHomeOnce()
                                    }
                                }
                            })
                            return
                        }
                    }

                    // Fallback para classe global caso importLibrary não defina módulo
                    if (window.google.maps.Geocoder && typeof window.google.maps.Geocoder === 'function') {
                        const geocoder = new window.google.maps.Geocoder()
                        const latlng = { lat: latitude, lng: longitude }

                        geocoder.geocode({ location: latlng }, async (results, status) => {
                            if (status === 'OK' && results && results[0]) {
                                const address = results[0].formatted_address
                                localStorage.setItem('location', address)

                                // Definir zona baseada na localização (por enquanto usar zona 1)
                                localStorage.setItem('zoneid', DEFAULT_ZONE_STRING)
                                toggleLocationUpdate()

                                console.log('Localização obtida:', address)
                                redirectToHomeOnce()
                            } else {
                                console.log('Erro no geocoding do Google, tentando OSM...')
                                const ok = await reverseGeocodeOSM(latitude, longitude)
                                if (!ok) {
                                    console.log('OSM também falhou, usando zona padrão')
                                    // Não salvar coordenadas como texto no campo 'location'; usar rótulo amigável
                                    localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
                                    setDefaultZone()
                                    redirectToHomeOnce()
                                }
                            }
                        })
                    } else {
                        console.log('Geocoder indisponível após importLibrary; tentando OSM...')
                        const ok = await reverseGeocodeOSM(latitude, longitude)
                        if (!ok) {
                            console.log('OSM falhou, usando zona padrão')
                            // Não salvar coordenadas como texto no campo 'location'; usar rótulo amigável
                            localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
                            setDefaultZone()
                            redirectToHomeOnce()
                        }
                    }
                } catch (errGeocode) {
                    console.log('Falha ao carregar/usar Geocoder do Google:', errGeocode)
                    const ok = await reverseGeocodeOSM(latitude, longitude)
                    if (!ok) {
                        console.log('OSM falhou, usando zona padrão')
                        // Não salvar coordenadas como texto no campo 'location'; usar rótulo amigável
                        localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
                        setDefaultZone()
                        redirectToHomeOnce()
                    }
                }
            } else {
                // Se Google Maps não estiver disponível, tentar OSM antes do padrão
                console.log('Google Maps não disponível, tentando OSM...')
                const ok = await reverseGeocodeOSM(latitude, longitude)
                if (!ok) {
                    console.log('OSM falhou, usando zona padrão')
                    // Não salvar coordenadas como texto no campo 'location'; usar rótulo amigável
                    localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
                    setDefaultZone()
                    redirectToHomeOnce()
                }
            }
        }
    }

    const handleGeolocationError = async (error) => {
        console.log('Erro na geolocalização:', error?.message)
        
        switch (error?.code) {
            case error?.PERMISSION_DENIED:
                console.log('Permissão de localização negada. Tentando localização aproximada via IP...')
                break
            case error?.POSITION_UNAVAILABLE:
                console.log('Localização indisponível. Tentando localização aproximada via IP...')
                break
            case error?.TIMEOUT:
                console.log('Timeout na localização. Tentando localização aproximada via IP...')
                break
            default:
                console.log('Erro na localização. Tentando localização aproximada via IP...')
                break
        }
        
        // Tentar fallback por IP. Se ainda falhar, usar zona padrão
        const usedIp = await ipGeolocationFallback()
        if (!usedIp) {
            setDefaultZone()
        }
    }

    const requestGeolocation = () => {
        if (navigator.geolocation) {
            console.log('Solicitando geolocalização...')
            
            navigator.geolocation.getCurrentPosition(
                handleGeolocationSuccess,
                handleGeolocationError,
                {
                    enableHighAccuracy: false, // Mais rápido, menos preciso
                    timeout: 5000, // Reduzido para 5 segundos
                    maximumAge: 300000 // 5 minutos
                }
            )
        } else {
            console.log('Geolocalização não suportada pelo navegador')
            // Tentar geolocalização aproximada por IP antes do fallback padrão
            ipGeolocationFallback().then((ok) => {
                if (!ok) setDefaultZone()
            })
        }
    }

    useEffect(() => {
        // Verificar se já existe zona e localização válidas
        const existingZoneId = localStorage.getItem('zoneid')
        const existingLocation = localStorage.getItem('location')
        const existingCoords = localStorage.getItem('currentLatLng')

        // Semeia zona padrão e rótulo de localização caso inválidos/ausentes para evitar falhas em chamadas iniciais de API
        const hasValidZoneId = !!existingZoneId && existingZoneId !== 'null' && existingZoneId !== 'undefined' && existingZoneId !== '[]' && existingZoneId.trim() !== ''
        const hasValidLocation = !!existingLocation && existingLocation !== 'null' && existingLocation !== 'undefined' && existingLocation.trim() !== ''
        
        if (!hasValidZoneId || !hasValidLocation) {
            console.log('Definindo zona e localização padrão imediatamente...')
            localStorage.setItem('zoneid', DEFAULT_ZONE_STRING)
            localStorage.setItem('location', FALLBACK_LOCATION_LABEL)
            toggleLocationUpdate()
            
            // Tentar geolocalização em background, mas não bloquear a UI
            setTimeout(() => {
                requestGeolocation()
            }, 2000)
            return
        }

        const isDefaultLocation = existingLocation === DEFAULT_LOCATION_LABEL || existingLocation === DEFAULT_LOCATION_LABEL
        const hasCoords = !!existingCoords && existingCoords !== 'null' && existingCoords !== 'undefined'
        
        // Se não temos coordenadas reais, tentar obter em background
        if (!hasCoords || isDefaultLocation) {
            console.log('Tentando melhorar localização em background...')
            setTimeout(() => {
                requestGeolocation()
            }, 3000)
        } else {
            console.log('Zona e localização já existem:', { existingZoneId, existingLocation })
        }
    }, [])

    // Este componente não renderiza nada visível
    return null
}

export default ForceGeolocation
