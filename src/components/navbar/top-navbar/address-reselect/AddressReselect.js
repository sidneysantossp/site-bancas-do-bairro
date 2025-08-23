import React, { useEffect, useRef, useState } from 'react'
import { Box, Grid, IconButton, Popover, Stack, Typography } from '@mui/material'
import AddLocationIcon from '@mui/icons-material/AddLocation'
import RoomIcon from '@mui/icons-material/Room'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useRouter } from 'next/router'
import MapModal from '@/components/landingpage/google-map/MapModal'
import { useTranslation } from 'react-i18next'
import AddressReselectPopover from './AddressReselectPopover'
import { toast } from 'react-hot-toast'
import { styled } from '@mui/material/styles'
import { useGeolocated } from 'react-geolocated'
import { useDispatch, useSelector } from 'react-redux'
import { setOpenMapDrawer, setUserLocationUpdate } from '@/redux/slices/global'
import { setClearCart } from '@/redux/slices/cart'

export const AddressTypographyGray = styled(Typography)(({ theme }) => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: '1',
    WebkitBoxOrient: 'vertical',
    maxWidth: '189px',
    marginInlineStart: '5px',
    wordBreak: 'break-all',
    color: theme.palette.neutral[1000],
    fontSize: '13px',
}))
const AddressReselect = ({ location }) => {
    const [mapOpen, setMapOpen] = useState(false)
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const { openMapDrawer, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    )
    const [address, setAddress] = useState(null)
    const [displayLocation, setDisplayLocation] = useState('')
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const anchorRef = useRef(null)

    // Efeito para tratar a exibição da localização e garantir zona válida
    useEffect(() => {
        // Verificar e garantir que sempre há uma zona válida
        const ensureValidZone = () => {
            const savedZoneId = localStorage.getItem('zoneid');
            if (!savedZoneId || savedZoneId === 'null' || savedZoneId === 'undefined' || savedZoneId === '[]') {
                console.log('Definindo zona padrão (ID: 1) para permitir carregamento das bancas');
                localStorage.setItem('zoneid', JSON.stringify([1]));
                dispatch(setUserLocationUpdate(!userLocationUpdate));
                return true; // Indica que zona foi definida
            }
            return false; // Zona já existe
        };

        // Se location existir e não for undefined/null
        if (location && location !== 'undefined' && location !== '') {
            setDisplayLocation(location);
            ensureValidZone();
        } else {
            // Verificar se há uma localização salva no localStorage
            const savedLocation = localStorage.getItem('location');
            if (savedLocation && savedLocation !== 'undefined' && savedLocation !== 'null' && savedLocation !== '') {
                setDisplayLocation(savedLocation);
                ensureValidZone();
            } else {
                // Sem localização válida - definir padrão
                console.log('Sem localização válida, definindo localização e zona padrão');
                setDisplayLocation('São Paulo, SP - Brasil');
                localStorage.setItem('location', 'São Paulo, SP - Brasil');
                localStorage.setItem('zoneid', JSON.stringify([1]));
                dispatch(setUserLocationUpdate(!userLocationUpdate));
            }
        }
    }, [location, userLocationUpdate, dispatch]);

    useEffect(() => {
        if (address) {
            localStorage.setItem('location', address?.address)
            const values = { lat: address?.lat, lng: address?.lng }
            localStorage.setItem('currentLatLng', JSON.stringify(values))
            if (address.zone_ids && address.zone_ids.length > 0) {
                const value = [address.zone_ids]
                localStorage.setItem('zoneid', JSON.stringify(address.zone_ids))
                toast.success(t('Nova localização de entrega selecionada.'))
                handleClosePopover()
                dispatch(setClearCart())
                dispatch(setUserLocationUpdate(!userLocationUpdate))
                router.push('/')
            }
        }
    }, [address])

    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
            isGeolocationEnabled: true,
        })
    const handleClosePopover = () => {
        dispatch(setOpenMapDrawer(false))
        setMapOpen(false)
    }
    const handleClickToLandingPage = () => {
        if (router.pathname === '/') {
            setOpen(true)
        } else {
            dispatch(setOpenMapDrawer(true))
        }
    }

    const handleModalClose = () => setOpen(false)
    const handleClose = () => {
        setOpen(false)
        if (router.pathname !== '/') {
            handleModalClose()
        }
    }

    return (
        <>
            {displayLocation ? (
                <Stack
                    sx={{
                        color: (theme) => theme.palette.neutral[1000],
                        cursor: 'pointer',
                    }}
                    direction="row"
                    onClick={handleClickToLandingPage}
                    ref={anchorRef}
                    alignItems="center"
                    spacing={0.5}
                >
                    <RoomIcon
                        fontSize="small"
                        color="primary"
                        style={{ width: '16px', height: '16px' }}
                    />
                    <AddressTypographyGray align="left">
                        {displayLocation && displayLocation !== 'undefined' && displayLocation !== 'null' && displayLocation !== '' ? displayLocation : 'Selecione sua Localização'}
                    </AddressTypographyGray>
                    <KeyboardArrowDownIcon />
                </Stack>
            ) : (
                <Stack
                    direction="row"
                    onClick={handleClickToLandingPage}
                    alignItems="center"
                    gap="5px"
                    sx={{
                        cursor: 'pointer',
                        color: (theme) => theme.palette.neutral[1000],
                    }}
                >
                    <RoomIcon
                        fontSize="small"
                        color="primary"
                        style={{ width: '16px', height: '16px' }}
                    />
                    <AddressTypographyGray align="left">
                        {'Selecione sua Localização'}
                    </AddressTypographyGray>
                    <KeyboardArrowDownIcon />
                </Stack>
            )}
            <AddressReselectPopover
                anchorEl={anchorRef.current}
                onClose={handleClosePopover}
                open={openMapDrawer}
                t={t}
                address={address}
                setAddress={setAddress}
                mapOpen={mapOpen}
                setMapOpen={setMapOpen}
                coords={coords}
            />
            {open && <MapModal open={open} handleClose={handleClose} />}
        </>
    )
}

AddressReselect.propTypes = {}

export default AddressReselect
