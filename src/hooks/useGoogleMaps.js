import { useJsApiLoader } from '@react-google-maps/api'

// Configuração centralizada do Google Maps API
const GOOGLE_MAPS_CONFIG = {
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY,
    language: 'pt-BR', // Português brasileiro
    region: 'BR', // Região Brasil
    libraries: ['places'] // Bibliotecas necessárias
}

// Hook centralizado para o Google Maps API
export const useGoogleMaps = () => {
    const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_CONFIG)
    
    return {
        isLoaded,
        loadError
    }
}

export default useGoogleMaps
