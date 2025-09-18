import React from 'react'
import { Box, Typography, Alert, Chip } from '@mui/material'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'

const GoogleMapsDebug = () => {
    const { isLoaded, loadError, isError, errorMessage } = useGoogleMaps()
    
    // Verificar variáveis de ambiente
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const hasApiKey = !!apiKey
    const apiKeyPreview = apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'Não encontrada'

    return (
        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2, m: 2 }}>
            <Typography variant="h6" gutterBottom>
                🗺️ Debug Google Maps
            </Typography>
            
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Status da API Key:
                </Typography>
                <Chip 
                    label={hasApiKey ? `Configurada: ${apiKeyPreview}` : 'Não configurada'} 
                    color={hasApiKey ? 'success' : 'error'} 
                    sx={{ mb: 1 }}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Status do Carregamento:
                </Typography>
                <Chip 
                    label={isLoaded ? 'Carregado' : 'Não carregado'} 
                    color={isLoaded ? 'success' : 'warning'} 
                    sx={{ mr: 1, mb: 1 }}
                />
                <Chip 
                    label={isError ? 'Com erro' : 'Sem erro'} 
                    color={isError ? 'error' : 'success'} 
                    sx={{ mb: 1 }}
                />
            </Box>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Erro:</strong> {errorMessage}
                    </Typography>
                </Alert>
            )}

            {loadError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        <strong>Erro de Carregamento:</strong> {loadError.message}
                    </Typography>
                </Alert>
            )}

            <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                    NODE_ENV: {process.env.NODE_ENV}<br/>
                    Variáveis verificadas: NEXT_PUBLIC_GOOGLE_MAP_KEY, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                </Typography>
            </Box>
        </Box>
    )
}

export default GoogleMapsDebug
