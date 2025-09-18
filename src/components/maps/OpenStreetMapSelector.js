import React, { useEffect, useRef, useState } from 'react'
import { Box, TextField, Button, Typography, CircularProgress, Alert, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useDispatch } from 'react-redux'
import { setUserLocationUpdate } from '@/redux/slices/global'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster'

const OpenStreetMapSelector = ({ onLocationSelect, onClose, initialLocation }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markerRef = useRef(null)
    
    const [address, setAddress] = useState(initialLocation || '')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [mapLoaded, setMapLoaded] = useState(false)
    const [selectedCoords, setSelectedCoords] = useState(null)

    // Coordenadas padrão (São Paulo)
    const defaultCoords = { lat: -23.5505, lng: -46.6333 }

    // Carregar Leaflet via CDN
    useEffect(() => {
        const loadLeaflet = () => {
            // Verificar se já está carregado
            if (window.L) {
                initializeMap()
                return
            }

            // Carregar CSS
            const cssLink = document.createElement('link')
            cssLink.rel = 'stylesheet'
            cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
            cssLink.crossOrigin = ''
            document.head.appendChild(cssLink)

            // Carregar JavaScript
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
            script.crossOrigin = ''
            script.onload = () => {
                initializeMap()
            }
            script.onerror = () => {
                setError('Erro ao carregar o mapa. Verifique sua conexão.')
            }
            document.head.appendChild(script)
        }

        loadLeaflet()

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    const initializeMap = () => {
        if (!window.L || !mapRef.current || mapInstanceRef.current) return

        try {
            // Criar mapa
            const map = window.L.map(mapRef.current).setView([defaultCoords.lat, defaultCoords.lng], 13)

            // Adicionar tiles do OpenStreetMap
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map)

            // Adicionar marcador inicial
            const marker = window.L.marker([defaultCoords.lat, defaultCoords.lng], {
                draggable: true
            }).addTo(map)

            // Evento de clique no mapa
            map.on('click', (e) => {
                const { lat, lng } = e.latlng
                marker.setLatLng([lat, lng])
                setSelectedCoords({ lat, lng })
                reverseGeocode(lat, lng)
            })

            // Evento de arrastar marcador
            marker.on('dragend', (e) => {
                const { lat, lng } = e.target.getLatLng()
                setSelectedCoords({ lat, lng })
                reverseGeocode(lat, lng)
            })

            mapInstanceRef.current = map
            markerRef.current = marker
            setMapLoaded(true)
            setSelectedCoords(defaultCoords)

            // Tentar obter localização atual
            getCurrentLocation()

        } catch (err) {
            console.error('Erro ao inicializar mapa:', err)
            setError('Erro ao inicializar o mapa')
        }
    }

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=pt-BR`
            )
            
            if (response.ok) {
                const data = await response.json()
                const locationName = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                setAddress(locationName)
            }
        } catch (err) {
            console.error('Erro no reverse geocoding:', err)
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        }
    }

    const getCurrentLocation = () => {
        if (!navigator.geolocation) return

        setLoading(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                const coords = { lat: latitude, lng: longitude }
                
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setView([latitude, longitude], 15)
                    markerRef.current.setLatLng([latitude, longitude])
                    setSelectedCoords(coords)
                    reverseGeocode(latitude, longitude)
                }
                setLoading(false)
            },
            (error) => {
                console.error('Erro na geolocalização:', error)
                setLoading(false)
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
        )
    }

    const searchAddress = async () => {
        if (!address.trim()) return

        setLoading(true)
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}&accept-language=pt-BR&limit=1`
            )
            
            if (response.ok) {
                const data = await response.json()
                if (data && data.length > 0) {
                    const { lat, lon, display_name } = data[0]
                    const coords = { lat: parseFloat(lat), lng: parseFloat(lon) }
                    
                    if (mapInstanceRef.current && markerRef.current) {
                        mapInstanceRef.current.setView([coords.lat, coords.lng], 15)
                        markerRef.current.setLatLng([coords.lat, coords.lng])
                        setSelectedCoords(coords)
                        setAddress(display_name)
                    }
                } else {
                    setError('Endereço não encontrado')
                }
            }
        } catch (err) {
            console.error('Erro na busca:', err)
            setError('Erro ao buscar endereço')
        }
        setLoading(false)
    }

    const handleConfirm = async () => {
        if (!selectedCoords || !address.trim()) {
            setError('Por favor, selecione uma localização no mapa')
            return
        }

        // Salvar no localStorage
        localStorage.setItem('location', address)
        localStorage.setItem('currentLatLng', JSON.stringify(selectedCoords))
        
        // Obter zona correta do backend
        try {
            const zoneResponse = await fetch(`/api/v1/config/get-zone-id?lat=${selectedCoords.lat}&lng=${selectedCoords.lng}`)
            const zoneData = await zoneResponse.json()
            
            if (zoneData.zone_ids && zoneData.zone_ids.length > 0) {
                localStorage.setItem('zoneid', JSON.stringify(zoneData.zone_ids))
                console.log('Zona obtida do backend (OpenStreetMap):', zoneData.zone_ids)
            } else {
                localStorage.setItem('zoneid', JSON.stringify([1])) // Fallback
            }
        } catch (zoneError) {
            console.error('Erro ao obter zona (OpenStreetMap):', zoneError)
            localStorage.setItem('zoneid', JSON.stringify([1])) // Fallback
        }

        // Atualizar estado global
        dispatch(setUserLocationUpdate(Date.now()))

        // Callback
        if (onLocationSelect) {
            onLocationSelect({
                address,
                coords: selectedCoords,
                zoneId: [1]
            })
        }

        CustomToaster('success', 'Localização definida com sucesso!')
        
        if (onClose) {
            onClose()
        }
    }

    return (
        <Box sx={{ p: 3, minWidth: { xs: '90vw', sm: '500px' }, maxWidth: '600px' }}>
            <Typography variant="h6" gutterBottom align="center">
                Digite seu endereço aqui ou escolha no mapa
            </Typography>

            <Stack spacing={2}>
                <TextField
                    fullWidth
                    label="Endereço"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchAddress()}
                    placeholder="Digite seu endereço completo"
                    InputProps={{
                        startAdornment: <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    }}
                />


                {error && (
                    <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                <Box
                    ref={mapRef}
                    sx={{
                        height: 400,
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: 1,
                        position: 'relative'
                    }}
                >
                    {!mapLoaded && (
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center'
                            }}
                        >
                            <CircularProgress />
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Carregando mapa...
                            </Typography>
                        </Box>
                    )}
                </Box>

                <Stack spacing={2}>
                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={loading ? <CircularProgress size={20} /> : <GpsFixedIcon />}
                        onClick={getCurrentLocation}
                        disabled={loading || !mapLoaded}
                        sx={{ 
                            py: 1.5,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                backgroundColor: theme.palette.primary.main + '10',
                            }
                        }}
                    >
                        {loading ? 'Localizando...' : 'Usar Minha Localização'}
                    </Button>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={!selectedCoords || !address.trim()}
                        sx={{ 
                            py: 1.5,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.common.white,
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                            '&:disabled': {
                                backgroundColor: theme.palette.grey[300],
                                color: theme.palette.grey[500],
                            }
                        }}
                    >
                        Selecionar Localização
                    </Button>
                </Stack>

                <Typography variant="caption" color="text.secondary" align="center">
                    Clique no mapa ou arraste o marcador para selecionar uma localização
                </Typography>
            </Stack>
        </Box>
    )
}

export default OpenStreetMapSelector
