import React, { useState, useEffect } from 'react'
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
import { setFormattedAddress } from '../../redux/slices/addressData'
// remove: import useGoogleMaps from '../../hooks/useGoogleMaps'
import useGetAutocompletePlace from '@/hooks/react-query/google-api/usePlaceAutoComplete'

const SimpleAddressSelector = ({ 
    setSearchKey,
    setPlaceId,
    setPlaceDescription,
    setPlaceDetailsEnabled 
}) => {
    const dispatch = useDispatch()
    // remove: const { isLoaded } = useGoogleMaps()
    const [inputValue, setInputValue] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [predictions, setPredictions] = useState([])
    // remove: const [loading, setLoading] = useState(false)
    // remove: const autocompleteService = useRef(null)
    // remove: const placesService = useRef(null)
    const [enabled, setEnabled] = useState(false)

    // Buscar sugestões via backend (proxy Google Places)
    const { data: placesData, isLoading } = useGetAutocompletePlace(
        inputValue,
        enabled
    )

    // Inicializar Google Places services quando a API estiver carregada
    /* useEffect(() => {
        if (isLoaded && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService()
            placesService.current = new window.google.maps.places.PlacesService(
                document.createElement('div')
            )
        }
    }, [isLoaded]) */

    // Carregar endereço salvo do localStorage quando o componente inicializar
    useEffect(() => {
        const savedLocation = localStorage.getItem('location')
        if (savedLocation && savedLocation !== 'undefined' && savedLocation !== 'null') {
            setInputValue(savedLocation)
        }
    }, [])

    // Atualiza previsões a partir do backend (Autocomplete Data API via proxy)
    useEffect(() => {
        if (!placesData) {
            setPredictions([])
            return
        }
        let tempData = []
        // Hook useGetAutocompletePlace retorna o corpo (data) diretamente.
        // Ainda assim, suportamos ambos os formatos por segurança.
        const data = (placesData && placesData.data) ? placesData.data : placesData
        if (data?.suggestions) {
            tempData = data.suggestions
                .map((item) => ({
                    place_id: item?.placePrediction?.placeId || item?.place_id,
                    description:
                        item?.placePrediction?.structuredFormat?.mainText?.text
                            ? `${item.placePrediction.structuredFormat.mainText.text}${
                                  item.placePrediction.structuredFormat.secondaryText?.text
                                      ? ', ' + item.placePrediction.structuredFormat.secondaryText.text
                                      : ''
                              }`
                            : item?.description || item?.placePrediction?.text?.text,
                }))
                .filter((x) => x.place_id && x.description)
        } else if (data?.predictions) {
            tempData = data.predictions.map((p) => ({
                place_id: p.place_id,
                description: p.description,
            }))
        } else if (Array.isArray(data)) {
            tempData = data.map((p) => ({
                place_id: p.place_id || p.id,
                description: p.description || p.formatted_address,
            }))
        }
        setPredictions(tempData || [])
    }, [placesData])

    // Autocomplete pelo backend via react-query (sem Google JS API)
    // searchPlaces removido


    const handleInputChange = (event) => {
        const value = event.target.value
        setInputValue(value)

        // Notifica o hook pai
        if (setSearchKey) {
            setSearchKey({ description: value })
        }
        if (value.trim().length > 0) {
            setEnabled(true)
            setShowSuggestions(true)
        } else {
            setEnabled(false)
            setPredictions([])
            setShowSuggestions(false)
        }
    }

    // getPlaceDetails removido: os detalhes agora são buscados pelo componente pai via proxy (useGetLocation/useGetPlaceDetails)

    const handleAddressSelect = (prediction) => {
        const selectedAddress = prediction.description
        setInputValue(selectedAddress)
        setShowSuggestions(false)

        localStorage.setItem('location', selectedAddress)
        dispatch(setFormattedAddress(selectedAddress))

        if (setPlaceId) setPlaceId(prediction.place_id)
        if (setPlaceDescription) setPlaceDescription(selectedAddress)
        if (setPlaceDetailsEnabled) setPlaceDetailsEnabled(true)

        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('addressSelected', { detail: { address: selectedAddress } }))
        }
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
                        {isLoading ? (
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
