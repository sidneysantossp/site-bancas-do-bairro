import React, { useState, useEffect, useRef } from 'react'
import { 
    TextField, 
    Paper, 
    List, 
    ListItem, 
    ListItemText,
    Box,
    InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch } from 'react-redux'
import { setLocation, setFormattedAddress } from '../../redux/slices/addressData'
import useGoogleMaps from '../../hooks/useGoogleMaps'

const SimpleAddressSelector = ({ 
    setSearchKey,
    setPlaceId,
    setPlaceDescription,
    setPlaceDetailsEnabled 
}) => {
    const dispatch = useDispatch()
    const { isLoaded } = useGoogleMaps()
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [predictions, setPredictions] = useState([])
    const [loading, setLoading] = useState(false)
    const autocompleteService = useRef(null)
    const placesService = useRef(null)

    // Inicializar Google Places services quando a API estiver carregada
    useEffect(() => {
        if (isLoaded && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService()
            placesService.current = new window.google.maps.places.PlacesService(
                document.createElement('div')
            )
        }
    }, [isLoaded])

    // Carregar endereço salvo do localStorage quando o componente inicializar
    useEffect(() => {
        const savedLocation = localStorage.getItem('location')
        if (savedLocation && savedLocation !== 'undefined' && savedLocation !== 'null') {
            setInputValue(savedLocation)
        }
    }, [])

    // Buscar sugestões da API do Google Places
    const searchPlaces = (query) => {
        if (!autocompleteService.current || !query.trim()) {
            setPredictions([])
            return
        }

        setLoading(true)
        
        const request = {
            input: query,
            componentRestrictions: { country: 'br' }, // Restringir ao Brasil
            types: ['address'], // Buscar endereços
            language: 'pt-BR'
        }

        autocompleteService.current.getPlacePredictions(request, (results, status) => {
            setLoading(false)
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setPredictions(results)
                setShowSuggestions(true)
            } else {
                setPredictions([])
                setShowSuggestions(false)
            }
        })
    }

    const handleInputChange = (event) => {
        const value = event.target.value
        setInputValue(value)
        
        // Buscar sugestões da API do Google quando há input
        if (value.trim().length > 0) {
            searchPlaces(value)
        } else {
            setPredictions([])
            setShowSuggestions(false)
        }
    }

    // Obter detalhes do lugar selecionado
    const getPlaceDetails = (placeId, description) => {
        if (!placesService.current) return

        const request = {
            placeId: placeId,
            fields: ['geometry', 'formatted_address', 'name']
        }

        placesService.current.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                const lat = place.geometry.location.lat()
                const lng = place.geometry.location.lng()
                const formattedAddress = place.formatted_address || description

                console.log('Endereço selecionado:', { lat, lng, formattedAddress })

                // Atualizar Redux
                dispatch(setLocation({ lat, lng }))
                dispatch(setFormattedAddress(formattedAddress))

                // Atualizar localStorage
                localStorage.setItem('currentLatLng', JSON.stringify({ lat, lng }))
                localStorage.setItem('location', formattedAddress)

                // Atualizar o input local para garantir persistência visual
                setInputValue(formattedAddress)

                // Notificar componentes pais
                if (setSearchKey) {
                    setSearchKey({
                        description: formattedAddress,
                        lat,
                        lng
                    })
                }
                
                if (setPlaceId) setPlaceId(placeId)
                if (setPlaceDescription) setPlaceDescription(formattedAddress)
                if (setPlaceDetailsEnabled) setPlaceDetailsEnabled(true)

                // Disparar evento customizado para notificar outros componentes
                window.dispatchEvent(new CustomEvent('addressSelected', {
                    detail: {
                        address: formattedAddress,
                        lat,
                        lng
                    }
                }))
            }
        })
    }

    const handleAddressSelect = (prediction) => {
        console.log('Predição selecionada:', prediction)
        
        // Fixar o endereço no input imediatamente
        const selectedAddress = prediction.description
        setInputValue(selectedAddress)
        setShowSuggestions(false)

        // Salvar imediatamente no localStorage para persistência
        localStorage.setItem('location', selectedAddress)

        // Obter detalhes completos do lugar
        getPlaceDetails(prediction.place_id, selectedAddress)
    }

    return (
        <Box sx={{ position: 'relative', width: '100%' }}>
            <TextField
                fullWidth
                placeholder="Pesquisar localização aqui..."
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => {
                    console.log('Input focused, showing suggestions')
                    setShowSuggestions(true)
                }}
                onBlur={(e) => {
                    // Delay hiding to allow click on suggestions
                    setTimeout(() => {
                        if (!e.currentTarget || !e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                            setShowSuggestions(false)
                        }
                    }, 150)
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color="disabled" />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        height: '45px',
                        '& fieldset': {
                            borderColor: '#EF7822',
                        },
                        '&:hover fieldset': {
                            borderColor: '#EF7822',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#EF7822',
                        },
                    },
                }}
            />
            
            {showSuggestions && (
                <Paper
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1500,
                        maxHeight: 200,
                        overflow: 'auto',
                        mt: 1,
                        boxShadow: 3
                    }}
                >
                    <List>
                        {loading ? (
                            <ListItem>
                                <ListItemText 
                                    primary="Buscando endereços..." 
                                    sx={{ color: 'gray', fontStyle: 'italic' }}
                                />
                            </ListItem>
                        ) : predictions.length > 0 ? (
                            predictions.map((prediction) => (
                                <ListItem
                                    key={prediction.place_id}
                                    button
                                    onClick={() => handleAddressSelect(prediction)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f5f5f5'
                                        },
                                        cursor: 'pointer',
                                        padding: '8px 16px'
                                    }}
                                >
                                    <ListItemText 
                                        primary={prediction.description}
                                        primaryTypographyProps={{
                                            fontSize: '14px',
                                            lineHeight: 1.4
                                        }}
                                    />
                                </ListItem>
                            ))
                        ) : inputValue.trim().length > 0 ? (
                            <ListItem>
                                <ListItemText 
                                    primary="Nenhum endereço encontrado" 
                                    sx={{ color: 'gray', fontStyle: 'italic' }}
                                />
                            </ListItem>
                        ) : null}
                    </List>
                </Paper>
            )}
        </Box>
    )
}

export default SimpleAddressSelector
