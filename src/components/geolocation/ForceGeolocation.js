import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setUserLocationUpdate } from '@/redux/slices/global'
import { GoogleApi } from '@/hooks/react-query/config/googleApi'

const DEFAULT_LOCATION_LABEL = 'São Paulo, SP - Brasil'
const DEFAULT_ZONE_ARRAY_STRING = JSON.stringify([1])

const ForceGeolocation = () => {
    const dispatch = useDispatch()
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)

    const toggleLocationUpdate = () =>
        dispatch(setUserLocationUpdate(!userLocationUpdate))

    const setDefaultZone = () => {
        // Definir zona padrão (ID 1) como fallback
        localStorage.setItem('zoneid', JSON.stringify([1]))
        localStorage.setItem('location', DEFAULT_LOCATION_LABEL)
        toggleLocationUpdate()
        console.log('Zona padrão definida: ID 1')
    }

    const reverseGeocodeOSM = async (latitude, longitude) => {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
                latitude
            )}&lon=${encodeURIComponent(longitude)}&accept-language=pt-BR`
            const res = await fetch(url, {
                headers: {
                    'User-Agent': 'site-bancas-do-bairro/1.0',
                },
            })
            if (!res.ok) throw new Error('OSM reverse geocode HTTP error')
            const data = await res.json()
            const address = data?.display_name
            if (address && typeof address === 'string') {
                localStorage.setItem('location', address)
                localStorage.setItem('zoneid', JSON.stringify([1]))
                toggleLocationUpdate()
                console.log('Endereço obtido via OSM:', address)
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
                localStorage.setItem('zoneid', JSON.stringify([1]))
            }

            toggleLocationUpdate()
            console.log('Localização obtida via API:', address)
        } catch (e) {
            console.log(
                'Falha ao obter endereço/zone via API, tentando Geocoder do Google Maps como fallback',
                e
            )
            // Fazer reverse geocoding usando Google Maps JS API como fallback
            if (window.google && window.google.maps) {
                const geocoder = new window.google.maps.Geocoder()
                const latlng = { lat: latitude, lng: longitude }
                
                geocoder.geocode({ location: latlng }, async (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const address = results[0].formatted_address
                        localStorage.setItem('location', address)
                        
                        // Definir zona baseada na localização (por enquanto usar zona 1)
                        localStorage.setItem('zoneid', JSON.stringify([1]))
                        toggleLocationUpdate()
                        
                        console.log('Localização obtida:', address)
                    } else {
                        console.log('Erro no geocoding do Google, tentando OSM...')
                        const ok = await reverseGeocodeOSM(latitude, longitude)
                        if (!ok) {
                            console.log('OSM também falhou, usando zona padrão')
                            setDefaultZone()
                        }
                    }
                })
            } else {
                // Se Google Maps não estiver disponível, tentar OSM antes do padrão
                console.log('Google Maps não disponível, tentando OSM...')
                const ok = await reverseGeocodeOSM(latitude, longitude)
                if (!ok) {
                    console.log('OSM falhou, usando zona padrão')
                    setDefaultZone()
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
                    enableHighAccuracy: true,
                    timeout: 10000,
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

        const isDefaultLocation = existingLocation === DEFAULT_LOCATION_LABEL
        const isDefaultZone = existingZoneId === DEFAULT_ZONE_ARRAY_STRING
        const hasCoords = !!existingCoords && existingCoords !== 'null' && existingCoords !== 'undefined'
        
        // Forçar geolocalização se:
        // - não houver coordinates salvas, OU
        // - a localização seja o fallback padrão, OU
        // - a zona seja a padrão [1]
        if (!hasCoords || isDefaultLocation || isDefaultZone) {
            console.log('Forçando geolocalização por ausência de coords ou valores padrão...')
            // Pequeno delay para garantir que a página carregou
            setTimeout(() => {
                requestGeolocation()
            }, 1000)
        } else if (!existingZoneId || !existingLocation || existingZoneId === 'null' || existingZoneId === 'undefined' || existingLocation === 'null' || existingLocation === 'undefined' || existingLocation === '') {
            console.log('Zona ou localização inválida, forçando geolocalização...')
            setTimeout(() => {
                requestGeolocation()
            }, 1000)
        } else {
            console.log('Zona e localização já existem:', { existingZoneId, existingLocation })
        }
    }, [])

    // Este componente não renderiza nada visível
    return null
}

export default ForceGeolocation
