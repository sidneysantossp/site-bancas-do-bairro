import React, { useEffect, useState, forwardRef, useRef } from 'react'
import {
    Box,
    Modal as MuiModal,
    Paper,
    Typography,
    styled,
    Button,
    Autocomplete,
    TextField,
    Grid,
    useTheme,
    Fade,
    Backdrop
}
from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import CloseIcon from '@mui/icons-material/Close'
import CircularProgress from '@mui/material/CircularProgress'
import { GoogleApi } from '@/hooks/react-query/config/googleApi'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'
import Skeleton from '@mui/material/Skeleton'
import GoogleMapComponent from './GoogleMapComponent'
import { useTranslation } from 'react-i18next'
import { RTL } from '@/components/RTL/RTL'
import {
    setOpenMapDrawer,
} from '@/redux/slices/global'
import { setLocation as setReduxLocation, setUserLocationUpdate } from '@/redux/slices/addressData'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { CustomTypographyGray } from '../../error/Errors.style'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster'
import MapCustomStyle from './MapCustomStyle'

const CustomBoxWrapper = styled(Box)(({ theme }) => ({
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#ffffff',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    padding: '20px',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    height: {
        xs: '80vh',
        sm: '70vh',
        md: '75vh',
    },
    overflow: 'hidden',
    border: '1px solid rgba(0, 0, 0, 0.1)',
}))
const CssTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
        color: theme.palette.primary.main,
        background: theme.palette.neutral[100],
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
}))

const PrimaryButton = styled(LoadingButton)(({ theme }) => ({
    borderRadius: '30px',
    minWidth: '100px',
}))

const MapModal = ({
    open,
    handleClose,
    locationAndZoneAfterClick,
    redirectUrl,
}) => {
    const theme = useTheme()
    const router = useRouter()
    const { t } = useTranslation()
    const [searchKey, setSearchKey] = useState('')
    // Texto exibido no campo do Autocomplete (controlado)
    const [inputValue, setInputValue] = useState('')
    const [enabled, setEnabled] = useState(false)
    const [locationEnabled, setLocationEnabled] = useState(false)
    const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false)
    const [placeId, setPlaceId] = useState('')
    const [location, setLocation] = useState(null)
    const [zoneId, setZoneId] = useState(undefined)
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
        useState(false)
    const [locationLoading, setLocationLoading] = useState(false)
    const [currentLocation, setCurrentLocation] = useState({})
    const [rerenderMap, setRerenderMap] = useState(false)
    const [currentLocationValue, setCurrentLocationValue] = useState({
        description: ''
    })
    // Evitar múltiplas navegações/redirecionamentos
    const didRedirectRef = useRef(false)
    
    // Debug: Verificar valor inicial
    console.log('currentLocationValue inicial:', currentLocationValue)
    
    // Limpar localStorage de valores inválidos e configurar campo inicial
    useEffect(() => {
        if (open) {
            console.log('Modal aberto - verificando localStorage')
            const savedLocation = localStorage.getItem('location')
            console.log('Valor do localStorage:', savedLocation)
            
            // Limpar valores inválidos do localStorage
            if (!savedLocation || savedLocation === 'undefined' || savedLocation === 'null' || savedLocation === '') {
                console.log('Removendo valor inválido do localStorage')
                localStorage.removeItem('location')
                setSearchKey('')
                setCurrentLocationValue({ description: '' })
                setInputValue('')
            } else {
                try {
                    // Quando houver um endereço salvo válido, preencher o campo
                    setCurrentLocationValue({ description: savedLocation })
                    setInputValue(savedLocation)
                } catch (error) {
                    console.error('Erro ao processar valor salvo:', error)
                }
            }
        }
    }, [open])
    const [loadingAuto, setLoadingAuto] = useState(false)
    const dispatch = useDispatch()
    const { geoLocation, openMapDrawer, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    )

    const { data: places, isLoading: placesIsLoading } = useQuery(
        ['places', searchKey],
        async () => GoogleApi.placeApiAutocomplete(searchKey),
        {
            enabled: !!searchKey && enabled,
            onError: (error) => {
                console.error('Erro ao buscar endereços:', error)
            },
        }
    )

    useEffect(() => {
        if (places) {
            setLoadingAuto(false)
        }
    }, [places])

    const {
        data: geoCodeResults,
        refetch: refetchGeoCode,
        isLoading: isGeoCodeLoading,
    } = useQuery(
        ['geocode-api', location],
        async () => GoogleApi.geoCodeApi(location),
        {
            enabled: false,
            onSuccess: (response) => {
                setLocationLoading(false)
                try {
                    if (response?.data?.results?.length > 0) {
                        const headerAddress = {
                            description: response?.data?.results[0]?.formatted_address || '',
                        }
                        setCurrentLocationValue(headerAddress)
                    }
                } catch (error) {
                    // Tratar erro silenciosamente
                    console.error('Erro ao processar dados de geocode:', error)
                }
            },
            onError: (error) => {
                setLocationLoading(false)
                console.error('Erro ao obter geocode:', error)
            },
        }
    )

    const { data, refetch, isLoading: isPlaceLoading } = useQuery(
        ['placeDetails', placeId],
        async () => GoogleApi.placeApiDetails(placeId),
        {
            enabled: false,
            onSuccess: (res) => {
                const result = res?.data?.result
                const newLatLng = {
                    lat: result?.geometry?.location?.lat,
                    lng: result?.geometry?.location?.lng,
                }
                setLocation(newLatLng)
                // Atualizar direto no localStorage
                if (result?.formatted_address) {
                    localStorage.setItem('location', result.formatted_address)
                    setCurrentLocationValue({ description: result.formatted_address })
                    setInputValue(result.formatted_address)
                }
                setLocationLoading(false)
            },
            onError: (error) => {
                setLocationLoading(false)
                console.error('Erro em placeDetails:', error)
            },
        }
    )

    const predictions = places?.data?.predictions

    useEffect(() => {
        if (placeId && placeDetailsEnabled) {
            refetch()
        }
    }, [placeId, placeDetailsEnabled])

    useEffect(() => {
        if (location && locationEnabled) {
            refetchGeoCode()
        }
    }, [location, locationEnabled])

    useEffect(() => {
        if (data && locationEnabled && !didRedirectRef.current) {
            const formattedAddress = data?.data?.result?.formatted_address
            
            dispatch(setUserLocationUpdate(true))
            
            if (formattedAddress) {
                localStorage.setItem('location', formattedAddress)
            }
            if (location?.lat && location?.lng) {
                localStorage.setItem('currentLatLng', JSON.stringify({
                    lat: location.lat,
                    lng: location.lng
                }))
            }
            if (zoneId) {
                localStorage.setItem('zoneid', zoneId)
            }

            // Marcar como processado para evitar loop
            didRedirectRef.current = true
            
            if (redirectUrl) {
                router.push({ pathname: '/home' }, undefined, { shallow: true })
            }
            handleClose()
        }
    }, [data, locationEnabled])

    const handleAgreeLocation = () => {
        setIsLoadingCurrentLocation(true)
        if (navigator?.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    try {
                        // Verificar se position e position.coords existem
                        if (position && position.coords) {
                            const newCurrentLocation = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude,
                            }
                            setCurrentLocation(newCurrentLocation)
                            setLocation(newCurrentLocation)
                            
                            // Atualizar também no localStorage para persistência
                            localStorage.setItem('currentLatLng', JSON.stringify(newCurrentLocation))
                            
                            // Fazer geocodificação reversa para obter o endereço
                            if (window.google && window.google.maps && window.google.maps.Geocoder) {
                                const geocoder = new window.google.maps.Geocoder()
                                geocoder.geocode(
                                    { location: newCurrentLocation },
                                    (results, status) => {
                                        if (status === 'OK' && results[0]) {
                                            const address = results[0].formatted_address
                                            
                                            // Atualizar com o endereço real
                                            localStorage.setItem('location', address)
                                            setCurrentLocationValue({
                                                description: address
                                            })
                                            
                                            // Forçar atualização do campo de busca
                                            setSearchKey(address)
                                            
                                            console.log('Endereço definido:', address)
                                            console.log('currentLocationValue atualizado:', { description: address })
                                            

                                        } else {

                                            // Fallback se a geocodificação falhar
                                            const locationDescription = 'Minha localização atual'
                                            localStorage.setItem('location', locationDescription)
                                            setCurrentLocationValue({
                                                description: locationDescription
                                            })
                                            setSearchKey(locationDescription)
                                        }
                                    }
                                )
                            } else {

                                // Fallback se o Google Maps não estiver carregado
                                const locationDescription = 'Minha localização atual'
                                localStorage.setItem('location', locationDescription)
                                setCurrentLocationValue({
                                    description: locationDescription
                                })
                                setSearchKey(locationDescription)
                            }
                            
                            // Ativar o recurso de localização
                            setLocationEnabled(true)
                            
                            dispatch(setReduxLocation(newCurrentLocation))
                        } else {
                            throw new Error('Dados de posição inválidos')
                        }
                    } catch (err) {
                        console.error('Erro ao processar geolocalização:', err?.message || err)
                        toast.error(err?.message || 'Erro ao processar sua localização.')
                    } finally {
                        setIsLoadingCurrentLocation(false)
                    }
                },
                (error) => {
                    console.error('Erro de geolocalização:', error)
                    setIsLoadingCurrentLocation(false)
                    
                    // Mensagens de erro mais específicas baseadas no código do erro
                    let errorMessage = 'Localização não encontrada.'
                    if (error.code === 1) {
                        errorMessage = 'Permissão de localização negada.'
                    } else if (error.code === 2) {
                        errorMessage = 'Localização indisponível.'
                    } else if (error.code === 3) {
                        errorMessage = 'Tempo limite excedido para obter localização.'
                    }
                    
                    toast.error(errorMessage)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            )
        } else {
            setIsLoadingCurrentLocation(false)
            toast.error('A geolocalização não é suportada pelo seu navegador.')
        }
    }
    const handleLocationSelection = (value) => {
        if (value) {
            setCurrentLocationValue(value)
            setPlaceId(value?.place_id)
        }
        setLoadingAuto(false)
    }
    const handleLocationSet = (values) => {
        setLocation(values)
    }
    const handlePickLocationOnClick = () => {
        if (location) {
            // Salvar dados da localização
            if (zoneId) {
                localStorage.setItem('zoneid', zoneId)
            }
            
            // Usar o endereço do currentLocationValue ou um padrão
            const locationAddress = currentLocationValue?.description || 
                                  localStorage.getItem('location') || 
                                  'Localização selecionada'
            
            localStorage.setItem('location', locationAddress)
            localStorage.setItem('currentLatLng', JSON.stringify(location))
            
            // Atualizar Redux
            dispatch(setUserLocationUpdate(!userLocationUpdate))
            
            // Mostrar notificação de sucesso
            CustomToaster('success', 'Nova localização foi definida.')
            
            // Fechar modal primeiro
            handleClose()
            
            // Redirecionar após um pequeno delay para garantir que o modal feche
            setTimeout(() => {
                if (redirectUrl) {
                    if (redirectUrl?.query === undefined) {
                        router.push({ pathname: redirectUrl?.pathname })
                    } else {
                        router.push({
                            pathname: redirectUrl?.pathname,
                            query: {
                                restaurantType: redirectUrl?.query,
                            },
                        })
                    }
                } else {
                    router.push('/home')
                }
            }, 100)
        } else {
            // Se não há localização selecionada, mostrar erro
            toast.error('Por favor, selecione uma localização no mapa.')
        }
    }

    return (
        <MuiModal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableAutoFocus={true}
            closeAfterTransition={true}
            slots={{
                backdrop: Backdrop,
            }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={open}>
                <div>
                    <MapCustomStyle />
                    <CustomBoxWrapper>
                <Grid container spacing={1}>
                    <Grid item md={12}>
                        <Typography
                            fontWeight="600"
                            fontSize={{ xs: '14px', sm: '16px' }}
                            color={theme.palette.neutral[1000]}
                        >
                            Digite seu endereço ou escolha no mapa
                        </Typography>
                        <Typography
                            fontSize={{ xs: '12px', sm: '14px' }}
                            color={theme.palette.neutral[1000]}
                        >
                            Compartilhar sua localização exata melhora a precisão das entregas e garante que os produtos cheguem até você com facilidade.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                        <Paper sx={{ outline: 'none' }}>
                            {loadingAuto ? (
                                <Skeleton
                                    width="100%"
                                    height="55px"
                                    variant="rectangular"
                                />
                            ) : (
                                <Autocomplete
                                    fullWidth
                                    freeSolo
                                    id="combo-box-demo"
                                    getOptionLabel={(option) => {
                                        // Garantindo que nunca mostre undefined
                                        if (!option) return ''
                                        if (typeof option === 'string') return option === 'undefined' ? '' : option
                                        if (option.description === 'undefined') return ''
                                        return option?.description || ''
                                    }}
                                    options={predictions || []}
                                    onChange={(event, value) => {
                                        if (value) {
                                            if (
                                                value !== '' &&
                                                typeof value === 'string'
                                            ) {
                                                setLoadingAuto(true)
                                                const value = predictions[0]
                                                handleLocationSelection(value)
                                            } else {
                                                handleLocationSelection(value)
                                            }
                                            setPlaceDetailsEnabled(true)
                                        }
                                    }}
                                    clearOnBlur={false}
                                    // Controla o texto do input separadamente para evitar 'undefined'
                                    value={null}
                                    inputValue={inputValue}
                                    onInputChange={(event, newInputValue) => {
                                        const safe = newInputValue === 'undefined' || newInputValue === 'null' ? '' : newInputValue
                                        setInputValue(safe)
                                        setSearchKey(safe)
                                        setEnabled(!!safe)
                                    }}
                                    loading={placesIsLoading}
                                    loadingText="Buscando sugestões..."
                                    renderInput={(params) => (
                                        <CssTextField
                                            label={null}
                                            {...params}
                                            placeholder="Pesquise seu endereço aqui..."
                                            InputProps={{
                                                ...params.InputProps,
                                                style: {
                                                    ...params.InputProps.style,
                                                },
                                            }}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    setSearchKey(e.target.value)
                                                }
                                            }}
                                        />
                                    )}
                                />
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}>
                        <LoadingButton
                            sx={{
                                fontSize: { xs: '13px', sm: '14px' },
                                width: '100%',
                                padding: { xs: '12px', sm: '13.5px' },
                                color: (theme) =>
                                    theme.palette.whiteContainer.main,
                            }}
                            onClick={() => handleAgreeLocation()}
                            startIcon={<GpsFixedIcon />}
                            loadingPosition="start"
                            variant="contained"
                            loading={isLoadingCurrentLocation}
                        >
                            Usar Localização Atual
                        </LoadingButton>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <Box
                            sx={{
                                width: '100%',
                                height: { xs: '310px', sm: '400px' },
                            }}
                        >
                            <GoogleMapComponent
                                setDisablePickButton={() => {}}
                                setLocationEnabled={setLocationEnabled}
                                setLocation={setLocation}
                                setCurrentLocation={setCurrentLocation}
                                locationLoading={locationLoading}
                                location={
                                    location
                                        ? location
                                        : {
                                              lat: -22.9068467,
                                              lng: -43.1728965,
                                          }
                                }
                                setPlaceDetailsEnabled={setPlaceDetailsEnabled}
                                placeDetailsEnabled={placeDetailsEnabled}
                                locationEnabled={locationEnabled}
                                setPlaceDescription={(address) => {
                                    if (address && address !== 'undefined' && address !== 'null') {
                                        const headerAddress = { description: address }
                                        setCurrentLocationValue(headerAddress)
                                        setInputValue(address)
                                        localStorage.setItem('location', address)
                                    }
                                }}
                                setZoneId={setZoneId}
                                setPlaceName={() => {}}
                                setLocationType={() => {}}
                                rerenderMap={rerenderMap}
                                setRerenderMap={setRerenderMap}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12}>
                        <CustomStackFullWidth
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={1}
                        >
                            <Button
                                variant="outlined"
                                onClick={() => handleClose()}
                                startIcon={<CloseIcon />}
                            >
                                Cancelar
                            </Button>
                            <PrimaryButton
                                aria-label="picklocation"
                                disabled={locationLoading}
                                variant="contained"
                                onClick={() => handlePickLocationOnClick()}
                            >
                                Selecionar Localização
                            </PrimaryButton>
                        </CustomStackFullWidth>
                    </Grid>
                </Grid>
                </CustomBoxWrapper>
                </div>
            </Fade>
        </MuiModal>
    )
}

export default MapModal
