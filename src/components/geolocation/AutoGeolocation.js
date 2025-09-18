import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserLocationUpdate } from '@/redux/slices/global'

const AutoGeolocation = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const requestGeolocation = () => {
            // Verificar se já há localização salva
            const savedLocation = localStorage.getItem('location')
            const hasValidLocation = savedLocation && 
                                   savedLocation !== 'undefined' && 
                                   savedLocation !== 'null' && 
                                   savedLocation !== ''

            // Se não há localização válida, solicitar permissão
            if (!hasValidLocation && navigator.geolocation) {
                console.log('Solicitando permissão de geolocalização automaticamente...')
                
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords
                        
                        try {
                            // Fazer reverse geocoding
                            const response = await fetch(
                                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`
                            )
                            
                            if (response.ok) {
                                const data = await response.json()
                                const locationName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                                
                                // Salvar localização
                                localStorage.setItem('location', locationName)
                                localStorage.setItem('currentLatLng', JSON.stringify({ lat: latitude, lng: longitude }))
                                
                                // Obter zona correta do backend
                                try {
                                    const zoneResponse = await fetch(`/api/v1/config/get-zone-id?lat=${latitude}&lng=${longitude}`)
                                    const zoneData = await zoneResponse.json()
                                    
                                    if (zoneData.zone_ids && zoneData.zone_ids.length > 0) {
                                        localStorage.setItem('zoneid', JSON.stringify(zoneData.zone_ids))
                                        console.log('Zona obtida do backend:', zoneData.zone_ids)
                                    } else {
                                        localStorage.setItem('zoneid', JSON.stringify([1])) // Fallback
                                        console.log('Usando zona padrão como fallback')
                                    }
                                } catch (zoneError) {
                                    console.error('Erro ao obter zona:', zoneError)
                                    localStorage.setItem('zoneid', JSON.stringify([1])) // Fallback
                                }
                                
                                // Atualizar estado global
                                dispatch(setUserLocationUpdate(Date.now()))
                                
                                console.log('Geolocalização automática capturada:', locationName)
                            }
                        } catch (error) {
                            console.error('Erro no reverse geocoding:', error)
                            
                            // Fallback: salvar coordenadas mesmo sem endereço
                            const fallbackLocation = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                            localStorage.setItem('location', fallbackLocation)
                            localStorage.setItem('currentLatLng', JSON.stringify({ lat: latitude, lng: longitude }))
                            
                            // Tentar obter zona mesmo no fallback
                            try {
                                const zoneResponse = await fetch(`/api/v1/config/get-zone-id?lat=${latitude}&lng=${longitude}`)
                                const zoneData = await zoneResponse.json()
                                localStorage.setItem('zoneid', JSON.stringify(zoneData.zone_ids || [1]))
                            } catch {
                                localStorage.setItem('zoneid', JSON.stringify([1]))
                            }
                            
                            dispatch(setUserLocationUpdate(Date.now()))
                        }
                    },
                    (error) => {
                        console.log('Geolocalização negada ou erro:', error)
                        
                        // Garantir zona padrão mesmo sem geolocalização
                        const savedZoneId = localStorage.getItem('zoneid')
                        if (!savedZoneId || savedZoneId === 'null' || savedZoneId === 'undefined' || savedZoneId === '[]') {
                            localStorage.setItem('zoneid', JSON.stringify([1]))
                            dispatch(setUserLocationUpdate(Date.now()))
                        }
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 10000,
                        maximumAge: 300000
                    }
                )
            } else if (!hasValidLocation) {
                // Navegador não suporta geolocalização - definir zona padrão
                console.log('Geolocalização não suportada, definindo zona padrão')
                localStorage.setItem('zoneid', JSON.stringify([1]))
                dispatch(setUserLocationUpdate(Date.now()))
            }
        }

        // Executar após um pequeno delay para garantir que a página carregou
        const timer = setTimeout(requestGeolocation, 1000)
        
        return () => clearTimeout(timer)
    }, [dispatch])

    // Este componente não renderiza nada
    return null
}

export default AutoGeolocation
