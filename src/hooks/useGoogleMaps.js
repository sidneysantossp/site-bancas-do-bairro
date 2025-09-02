import { useJsApiLoader } from '@react-google-maps/api'

// Configuração centralizada do Google Maps API
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY?.trim()
const GOOGLE_MAPS_CONFIG = {
    id: 'google-map-script',
    googleMapsApiKey: apiKey || '',
    language: 'pt-BR', // Português brasileiro
    region: 'BR', // Região Brasil
    // "geocoding" não é uma biblioteca válida do JS API. Usamos as válidas abaixo.
    libraries: ['places', 'geometry'], // Bibliotecas necessárias
}

// Hook centralizado para o Google Maps API
export const useGoogleMaps = () => {
    // Sempre chamar o hook do loader para manter a ordem de hooks estável
    const { isLoaded, loadError } = useJsApiLoader(GOOGLE_MAPS_CONFIG)

    const missingKey = !apiKey
    const synthesizedError = missingKey
        ? new Error('Missing NEXT_PUBLIC_GOOGLE_MAP_KEY. Defina a variável de ambiente e habilite o faturamento no projeto do Google Cloud.')
        : undefined

    // Sinalizadores e mensagens de erro mais explícitos
    const isError = Boolean(loadError) || missingKey
    const errorMessage = loadError?.message || synthesizedError?.message

    // Se a chave estiver ausente, forçar isLoaded a false para evitar tentativas de uso da API
    return {
        isLoaded: missingKey ? false : isLoaded,
        loadError: loadError || synthesizedError,
        isError,
        errorMessage,
    }
}

export default useGoogleMaps
