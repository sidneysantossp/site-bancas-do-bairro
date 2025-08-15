import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUserLocationUpdate } from '@/redux/slices/global'

const ForceGeolocation = () => {
    const dispatch = useDispatch()

    const setDefaultZone = () => {
        // Definir zona padrão (ID 1) como fallback
        localStorage.setItem('zoneid', JSON.stringify([1]))
        localStorage.setItem('location', 'São Paulo, SP - Brasil')
        dispatch(setUserLocationUpdate(true))
        console.log('Zona padrão definida: ID 1')
    }

    const handleGeolocationSuccess = (position) => {
        const { latitude, longitude } = position.coords
        
        // Salvar coordenadas
        const coords = { lat: latitude, lng: longitude }
        localStorage.setItem('currentLatLng', JSON.stringify(coords))
        
        // Fazer reverse geocoding para obter endereço
        if (window.google && window.google.maps) {
            const geocoder = new window.google.maps.Geocoder()
            const latlng = { lat: latitude, lng: longitude }
            
            geocoder.geocode({ location: latlng }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const address = results[0].formatted_address
                    localStorage.setItem('location', address)
                    
                    // Definir zona baseada na localização (por enquanto usar zona 1)
                    localStorage.setItem('zoneid', JSON.stringify([1]))
                    dispatch(setUserLocationUpdate(true))
                    
                    console.log('Localização obtida:', address)
                } else {
                    console.log('Erro no geocoding, usando zona padrão')
                    setDefaultZone()
                }
            })
        } else {
            // Se Google Maps não estiver disponível, usar zona padrão
            console.log('Google Maps não disponível, usando zona padrão')
            setDefaultZone()
        }
    }

    const handleGeolocationError = (error) => {
        console.log('Erro na geolocalização:', error.message)
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log('Permissão de localização negada. Usando localização padrão.')
                break
            case error.POSITION_UNAVAILABLE:
                console.log('Localização indisponível. Usando localização padrão.')
                break
            case error.TIMEOUT:
                console.log('Timeout na localização. Usando localização padrão.')
                break
            default:
                console.log('Erro na localização. Usando localização padrão.')
                break
        }
        
        // Usar zona padrão em caso de erro
        setDefaultZone()
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
            console.log('Geolocalização não suportada. Usando localização padrão.')
            setDefaultZone()
        }
    }

    useEffect(() => {
        // Verificar se já existe zona e localização válidas
        const existingZoneId = localStorage.getItem('zoneid')
        const existingLocation = localStorage.getItem('location')
        
        // Se não há zona ou localização, ou se são inválidas, forçar geolocalização
        if (!existingZoneId || 
            !existingLocation || 
            existingZoneId === 'null' || 
            existingZoneId === 'undefined' ||
            existingLocation === 'null' ||
            existingLocation === 'undefined' ||
            existingLocation === '') {
            
            console.log('Zona ou localização inválida, forçando geolocalização...')
            
            // Pequeno delay para garantir que a página carregou
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
