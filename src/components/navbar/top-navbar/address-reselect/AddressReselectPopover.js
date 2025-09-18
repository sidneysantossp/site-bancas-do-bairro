import React, { useState } from 'react'
import { Button, Drawer, Typography, useTheme, Stack } from '@mui/material'
import DeliveryAddress from '../../../checkout-page/DeliveryAddress'
import { CustomButtonPrimary } from '@/styled-components/CustomButtons.style'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import CloseIcon from '@mui/icons-material/Close'
import MapWithSearchBox from '../../../google-map/MapWithSearchBox'
import OpenStreetMapSelector from '../../../maps/OpenStreetMapSelector'
import { useGoogleMaps } from '@/hooks/useGoogleMaps'
import { getToken } from '../../../checkout-page/functions/getGuestUserId'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useDispatch, useSelector } from 'react-redux'
import { useGetLocation } from '@/utils/custom-hook/useGetLocation'
import { AnimationDots } from '../../../products-page/AnimationDots'
import IconButton from '@mui/material/IconButton'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'
import { setLocation } from '@/redux/slices/addressData'
import { useQuery } from 'react-query'
import { GoogleApi } from '@/hooks/react-query/config/googleApi'
import { setUserLocationUpdate } from '@/redux/slices/global'
import { RTL } from '../../../RTL/RTL'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster'

const AddressReselectPopover = (props) => {
    const token = getToken()
    const theme = useTheme()
    const dispatch = useDispatch()
    const [rerenderMap, setRerenderMap] = useState(false)
    const { isLoaded: googleMapsLoaded, isError: googleMapsError } = useGoogleMaps()
    const {
        coords,
        anchorEl,
        setMapOpen,
        mapOpen,
        onClose,
        open,
        t,
        address,
        setAddress,
        ...other
    } = props
    const { geoCodeLoading } = useGetLocation(coords)
    const { location, formatted_address, zoneId } = useSelector(
        (state) => state.addressData
    )
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)
    const languageDirection = localStorage.getItem('direction')
    const handleSuccess = () => {
        if (getToken()) {
            if (!mapOpen && open) {
                getLocation()
            }
        } else {
            if (mapOpen && open) {
                getLocation()
            }
        }
    }

    const { refetch: refetchCurrentLocation } = useQuery(
        ['geocode-api', location],
        async () => GoogleApi.geoCodeApi(location),
        {
            onSuccess: handleSuccess,
        }
    )

    const getLocation = () => {
        if (zoneId && formatted_address && location) {
            localStorage.setItem('zoneid', zoneId)
            localStorage.setItem('location', formatted_address)
            localStorage.setItem('currentLatLng', JSON.stringify(location))
            CustomToaster('success', 'New location has been set.')
            setAddress(null)
            dispatch(setUserLocationUpdate(!userLocationUpdate))
            onClose()
        }
    }
    const setUserCurrentLocation = async () => {
        if (coords) {
            dispatch(
                setLocation({
                    lat: coords?.latitude,
                    lng: coords?.longitude,
                })
            )
            if (zoneId) {
                localStorage.setItem('zoneid', zoneId)
            }
            await refetchCurrentLocation()
            setRerenderMap((prvMap) => !prvMap)
        }
    }

    const handleOpenStreetMapSelect = (locationData) => {
        CustomToaster('success', 'Nova localização definida com sucesso!')
        onClose()
    }

    return (
        <>
            <RTL direction={languageDirection}>
                <Drawer
                    anchor="left"
                    open={open}
                    onClose={onClose}
                    variant="temporary"
                    sx={{
                        zIndex: '1300',
                        minWidth: { xs: '95vw', sm: '60vw', md: '50vw' },
                    }}
                >
                    <CustomStackFullWidth
                        spacing={2.5}
                        paddingInline="1.4rem"
                        position="relative"
                        sx={{
                            minWidth: { xs: '95vw', sm: '60vw', md: '40vw' },
                        }}
                        pb="1.4rem"
                    >
                        <IconButton
                            onClick={onClose}
                            className="closebtn"
                            sx={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                            }}
                        >
                            <CloseIcon sx={{ fontSize: '16px' }} />
                        </IconButton>

                        <Typography
                            paddingTop={{ xs: '20px', md: '40px' }}
                            fontWeight="600"
                            textAlign="center"
                        >
                            {token && !mapOpen ? (
                                <>
                                    {'Selecione dos endereços salvos'}{' '}
                                    {/* <br /> */}
                                    {'ou escolha no mapa'}
                                </>
                            ) : (
                                'Digite seu endereço aqui ou escolha no mapa'
                            )}
                        </Typography>
                        {token && !mapOpen ? (
                            <CustomStackFullWidth
                                justifyContent="center"
                                alignItems="center"
                            >
                                <DeliveryAddress
                                    setAddress={setAddress}
                                    address={address}
                                    hideAddressSelectionField="true"
                                    renderOnNavbar="true"
                                    token={token}
                                    //handleAddressSetSuccess={handleAddressSetSuccess}
                                />
                                <Button
                                    startIcon={<AddCircleOutlineIcon />}
                                    sx={{
                                        alignItems: 'flex-start',
                                        marginBottom: '1rem',
                                    }}
                                    onClick={setUserCurrentLocation}
                                >
                                    {'Usar Localização Atual'}
                                </Button>
                                <CustomButtonPrimary
                                    paddingLeft="25px"
                                    paddingRight="25px"
                                    paddingTop="10px"
                                    paddingBottom="10px"
                                    maxWidth="200px"
                                    onClick={() => setMapOpen(true)}
                                >
                                    {'Escolher no Mapa'}
                                </CustomButtonPrimary>
                            </CustomStackFullWidth>
                        ) : (
                            <CustomStackFullWidth
                                position="relative"
                                justifyContent="center"
                                alignItems="center"
                            >
                                {/* Sempre usar OpenStreetMap por enquanto até Google Maps ser configurado */}
                                <OpenStreetMapSelector
                                    onLocationSelect={handleOpenStreetMapSelect}
                                    onClose={onClose}
                                    initialLocation={localStorage.getItem('location') || ''}
                                />
                                {/* Remover botões do Google Maps quando usando OpenStreetMap */}
                            </CustomStackFullWidth>
                        )}
                    </CustomStackFullWidth>
                </Drawer>
            </RTL>
        </>
    )
}

AddressReselectPopover.propTypes = {}

export default AddressReselectPopover
