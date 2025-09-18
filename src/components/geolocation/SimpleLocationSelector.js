import React, { useState, useEffect } from 'react'
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Stack,
    IconButton
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useDispatch } from 'react-redux'
import { setUserLocationUpdate } from '@/redux/slices/global'

const SimpleLocationSelector = ({ onLocationSelect, onClose }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [currentLocation, setCurrentLocation] = useState(null)

    // Carregar localização atual do localStorage
    useEffect(() => {
        const savedLocation = localStorage.getItem('location')
        const savedCoords = localStorage.getItem('currentLatLng')
        
        if (savedLocation && savedLocation !== 'null' && savedLocation !== 'undefined') {
            setAddress(savedLocation)
        }
        
        if (savedCoords && savedCoords !== 'null' && savedCoords !== 'undefined') {
            try {
                setCurrentLocation(JSON.parse(savedCoords))
            } catch (e) {
                console.error('Erro ao parsear coordenadas:', e)
            }
        }
    }, [])

    // Função para obter localização via geolocalização do navegador
    const getCurrentLocation = () => {
        setLoading(true)
        setError(null)

        if (!navigator.geolocation) {
            setError('Geolocalização não é suportada pelo seu navegador')
            setLoading(false)
            return
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                const coords = { lat: latitude, lng: longitude }
                
                try {
                    // Tentar reverse geocoding via OpenStreetMap (gratuito)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`
                    )
                    
                    if (response.ok) {
                        const data = await response.json()
                        const locationName = data.display_name || 'Localização atual'
                        
                        setAddress(locationName)
                        setCurrentLocation(coords)
                        
                        // Salvar no localStorage
                        localStorage.setItem('location', locationName)
                        localStorage.setItem('currentLatLng', JSON.stringify(coords))
                        localStorage.setItem('zoneid', JSON.stringify([1])) // Zona padrão
                        
                        setError(null)
                    } else {
                        throw new Error('Erro ao obter endereço')
                    }
                } catch (err) {
                    console.error('Erro no reverse geocoding:', err)
                    // Usar coordenadas como fallback
                    const fallbackAddress = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
                    setAddress(fallbackAddress)
                    setCurrentLocation(coords)
                    
                    localStorage.setItem('location', fallbackAddress)
                    localStorage.setItem('currentLatLng', JSON.stringify(coords))
                    localStorage.setItem('zoneid', JSON.stringify([1]))
                }
                
                setLoading(false)
            },
            (error) => {
                console.error('Erro na geolocalização:', error)
                let errorMessage = 'Erro ao obter localização'
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permissão de localização negada'
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Localização indisponível'
                        break
                    case error.TIMEOUT:
                        errorMessage = 'Timeout na localização'
                        break
                }
                
                setError(errorMessage)
                setLoading(false)
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 300000
            }
        )
    }

    // Função para confirmar a localização
    const handleConfirm = () => {
        if (!address.trim()) {
            setError('Por favor, digite um endereço ou use sua localização atual')
            return
        }

        // Salvar localização
        localStorage.setItem('location', address)
        localStorage.setItem('zoneid', JSON.stringify([1])) // Zona padrão
        
        if (currentLocation) {
            localStorage.setItem('currentLatLng', JSON.stringify(currentLocation))
        }

        // Atualizar estado global
        dispatch(setUserLocationUpdate(Date.now()))
        
        // Callback para o componente pai
        if (onLocationSelect) {
            onLocationSelect({
                address,
                coords: currentLocation,
                zoneId: [1]
            })
        }

        // Fechar modal
        if (onClose) {
            onClose()
        }
    }

    return (
        <Box sx={{ p: 3, minWidth: 300 }}>
            <Typography variant="h6" gutterBottom align="center">
                Digite seu endereço aqui ou escolha no mapa
            </Typography>

            <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Endereço"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Digite seu endereço completo"
                    InputProps={{
                        startAdornment: <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    }}
                />

                {error && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        {error}
                    </Alert>
                )}

                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={loading ? <CircularProgress size={20} /> : <GpsFixedIcon />}
                    onClick={getCurrentLocation}
                    disabled={loading}
                    sx={{ mt: 2 }}
                >
                    {loading ? 'Obtendo localização...' : 'Usar Localização Atual'}
                </Button>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleConfirm}
                    disabled={!address.trim() || loading}
                    sx={{ 
                        mt: 2,
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        }
                    }}
                >
                    Selecionar
                </Button>
            </Stack>
        </Box>
    )
}

export default SimpleLocationSelector
