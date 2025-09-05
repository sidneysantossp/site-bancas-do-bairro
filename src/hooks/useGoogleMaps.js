import { useJsApiLoader } from '@react-google-maps/api'

// Configuração centralizada do Google Maps API
// Suporta ambas variáveis: NEXT_PUBLIC_GOOGLE_MAP_KEY (preferida) e NEXT_PUBLIC_GOOGLE_MAPS_API_KEY (legada)
const apiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)?.trim()

// Em desenvolvimento, usar um id de script derivado da configuração atual
// para evitar o erro "Loader must not be called again with different options"
// quando a aba já carregou o script com outra chave/opções.
const isProd = process.env.NODE_ENV === 'production'
// Gerar um sufixo estável e não-revelador da chave (soma simples de char codes)
const keyHash = (() => {
    if (!apiKey) return 'nokey'
    let sum = 0
    for (let i = 0; i < apiKey.length; i++) sum = (sum + apiKey.charCodeAt(i)) % 9973
    return String(sum)
})()
const SCRIPT_ID = isProd ? 'google-map-script' : `google-map-script-dev-${keyHash}`

const GOOGLE_MAPS_CONFIG = {
    id: SCRIPT_ID,
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
