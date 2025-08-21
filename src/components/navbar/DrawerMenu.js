import LockIcon from '@mui/icons-material/Lock'
import MenuIcon from '@mui/icons-material/Menu'
import { Button, IconButton, Stack, Typography, alpha } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Router, { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AuthModal from '../auth'
import CollapsableMenu from './CollapsableMenu'
import { ButtonContainer, CustomDrawer } from './Navbar.style'

import { setWelcomeModal } from '@/redux/slices/utils'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { CategoryApi } from '@/hooks/react-query/config/categoryApi'
import { RestaurantsApi } from '@/hooks/react-query/config/restaurantApi'
import { useGetCuisines } from '@/hooks/react-query/cuisines/useGetCuisines'
import { setClearCart } from '@/redux/slices/cart'
import { setCuisines, setFeaturedCategories } from '@/redux/slices/storedData'
import { removeToken } from '@/redux/slices/userToken'
import { clearWishList } from '@/redux/slices/wishList'
import {
    CustomLink,
    CustomStackFullWidth,
} from '@/styled-components/CustomStyles.style'
import { logoutSuccessFull } from '@/utils/ToasterMessages'
import { onErrorResponse } from '../ErrorResponse'
import { RTL } from '../RTL/RTL'
import { getToken } from '../checkout-page/functions/getGuestUserId'
import { CustomTypography } from '../custom-tables/Tables.style'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import ThemeSwitches from './top-navbar/ThemeSwitches'
import i18n from '@/language/i18n'

const DrawerMenu = ({ zoneid, cartListRefetch }) => {
    const [forSignup, setForSignup] = useState('')
    const [modalFor, setModalFor] = useState('sign-in')
    const { featuredCategories, cuisines } = useSelector(
        (state) => state.storedData
    )
    // Removido: const { countryCode, language } = useSelector((state) => state.languageChange)
    const { t } = useTranslation()
    const translateOrFallback = (key, fallback) => {
        const translated = t(key)
        return translated === key ? fallback : translated
    }
    const router = useRouter()
    const dispatch = useDispatch()
    const [openDrawer, setOpenDrawer] = useState(false)
    const token = getToken()
    const [authModalOpen, setOpen] = useState(false)
    const [langTick, setLangTick] = useState(0)
    const handleOpenAuthModal = (page) => {
        setModalFor(page)
        setOpen(true)
        setForSignup(page)
    }

    // force re-render when language changes to ensure Drawer texts update
    useEffect(() => {
        const handler = () => setLangTick((v) => v + 1)
        i18n.on('languageChanged', handler)
        return () => i18n.off('languageChanged', handler)
    }, [])

    const handleCloseAuthModal = () => {
        setOpen(false)
        setForSignup('sign-in')
    }

    const handleLogout = async () => {
        try {
            await localStorage.removeItem('token')
            dispatch(removeToken())
            setOpenDrawer(false)
            let a = []
            dispatch(clearWishList(a))
            dispatch(setClearCart())
            dispatch(setWelcomeModal(false))
            await cartListRefetch()
            CustomToaster('success', logoutSuccessFull)
            if (router.pathname === '/') {
                router.push('/')
            } else {
                router.push('/home')
            }
        } catch (err) {}
    }

    const toggleDrawer = (openDrawer) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }
        // Sincroniza o idioma do i18n no momento de abrir o Drawer
        if (openDrawer && typeof window !== 'undefined') {
            try {
                const userLanguage = localStorage.getItem('language')
                if (userLanguage) {
                    let normalized = userLanguage.toLowerCase().replace('_', '-')
                    const lang =
                        normalized === 'pt' || normalized.startsWith('pt-')
                            ? 'pt-br'
                            : normalized
                    if (i18n.language !== lang) {
                        i18n.changeLanguage(lang)
                    }
                }
            } catch (e) {}
        }
        setOpenDrawer(openDrawer)
    }
    const searchKey = ''

    const { data: categoryData, refetch: categoryApiRefetch } = useQuery(
        ['category'],
        () => CategoryApi.categories(searchKey),
        {
            enabled: false,
            staleTime: 1000 * 60 * 8,
            onError: onErrorResponse,
            cacheTime: 8 * 60 * 1000,
        }
    )
    const { data: popularRestuarants, refetch: restaurantApiRefetch } =
        useQuery(
            ['restaurants/popular'],
            () => RestaurantsApi?.popularRestaurants(),
            { enabled: false }
        )
    useEffect(() => {
        if (zoneid) {
            if (featuredCategories?.length === 0) {
                categoryApiRefetch()
            }
            restaurantApiRefetch()
        }
    }, [zoneid])

    const { data, refetch } = useGetCuisines()
    useEffect(() => {
        if (typeof window === 'undefined') return
        const userLanguage = localStorage.getItem('language')
        if (userLanguage) {
            let normalized = userLanguage.toLowerCase().replace('_', '-')
            const lang =
                normalized === 'pt' || normalized.startsWith('pt-')
                    ? 'pt-br'
                    : normalized
            if (i18n.language !== lang) {
                i18n.changeLanguage(lang)
            }
        }
    }, [])

    useEffect(() => {
        if (cuisines?.length === 0) {
            refetch()
        }
    }, [])

    useEffect(() => {
        if (categoryData) {
            dispatch(setFeaturedCategories(categoryData?.data))
        }
        if (data) {
            dispatch(setCuisines(data?.Cuisines))
        }
    }, [categoryData, data])
    const collapsableMenu = {
        cat: {
            text: 'Categories',
            displayText: translateOrFallback('Categories', 'Categorias'),
            items: featuredCategories?.map((item) => item),
            path: '/category',
        },
        res: {
            text: 'Restaurants',
            displayText: translateOrFallback('Restaurants', 'Bancas perto de mim'),
            items: popularRestuarants?.data?.map((i) => i),
            path: '/banca',
        },
        cuisine: {
            text: 'Cuisines',
            displayText: translateOrFallback('Cuisines', 'Os mais buscados'),
            items: cuisines?.map((i) => i),
            path: '/cuisines',
        },
        profile: {
            text: 'Profile',
            displayText: translateOrFallback('Profile', 'Perfil'),
        },
    }
    let location = undefined
    if (typeof window !== 'undefined') {
        location = localStorage.getItem('location')
    }
    let languageDirection = undefined
    if (typeof window !== 'undefined') {
        languageDirection = localStorage.getItem('direction')
    }

    const handleRoute = (path) => {
        router.push(`/${path}`)
        setOpenDrawer(false)
    }
    const handleRouteToUserInfo = () => {
        Router.push(
            {
                pathname: '/info',
                query: { page: 'profile' },
            },
            undefined,
            { shallow: true }
        )
        setOpenDrawer(false)
    }
    const menuList = () => (
        <RTL direction={languageDirection ? languageDirection : 'ltr'}>
            <Box
                sx={{ width: 'auto', paddingInline: '10px', height: '100%' }}
                role="presentation"
                onKeyDown={toggleDrawer(false)}
            >
                <Stack height="100%">
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <ListItemButton
                            sx={{
                                marginTop: location ? '20px' : '10px',
                                borderBottom: location && '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),
                            }}
                        >
                            {location && (
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {translateOrFallback('Home', 'Início')}
                                        </Typography>
                                    }
                                    onClick={() => handleRoute('home')}
                                />
                            )}
                        </ListItemButton>

                        {location && (
                            <>
                                <CollapsableMenu
                                    value={collapsableMenu.cat}
                                    setOpenDrawer={setOpenDrawer}
                                    toggleDrawers={toggleDrawer}
                                    pathName="/category"
                                />
                                <CollapsableMenu
                                    value={collapsableMenu.res}
                                    setOpenDrawer={setOpenDrawer}
                                    toggleDrawers={toggleDrawer}
                                    pathName="/banca"
                                />
                                <CollapsableMenu
                                    value={collapsableMenu.cuisine}
                                    setOpenDrawer={setOpenDrawer}
                                    toggleDrawers={toggleDrawer}
                                    pathName="/cuisines"
                                />
                                <ListItemButton
                                    sx={{
                                        borderBottom: '1px solid',
                                        borderBottomColor: (theme) =>
                                            alpha(
                                                theme.palette.neutral[300],
                                                0.3
                                            ),
                                        '&:hover': {
                                            backgroundColor: 'primary.main',
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{ fontSize: '12px' }}
                                            >
                                                {translateOrFallback('Profile', 'Perfil')}
                                            </Typography>
                                        }
                                        onClick={handleRouteToUserInfo}
                                    />
                                </ListItemButton>
                            </>
                        )}

                        <ListItemButton
                            sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),
                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {translateOrFallback('Terms & Conditions', 'Termos e Condições')}
                                    </Typography>
                                }
                                onClick={() =>
                                    handleRoute('terms-and-conditions')
                                }
                            />
                        </ListItemButton>
                        <ListItemButton
                            sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),

                                '&:hover': {
                                    backgroundColor: 'primary.main',
                                },
                            }}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {translateOrFallback('Privacy Policy', 'Política de Privacidade')}
                                    </Typography>
                                }
                                onClick={() => handleRoute('privacy-policy')}
                            />
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {translateOrFallback('Theme Mode', 'Modo do Tema')}
                                    </Typography>
                                }
                            />
                            <ThemeSwitches noText />
                        </ListItemButton>
                        {/* Removido o seletor de idioma no mobile */}
                     </List>
                    <ButtonContainer>
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 3, mb: 1, borderRadius: '5px' }}
                            onClick={() => handleLogout()}
                        >
                            {t('Logout')}
                        </Button>
                    </ButtonContainer>
                </Stack>
            </Box>
        </RTL>
    )

    const withOutLogin = () => (
        <RTL direction={languageDirection}>
            <Box
                sx={{ width: 'auto', paddingInline: '10px', height: '100%' }}
                role="presentation"
                onKeyDown={toggleDrawer(false)}
            >
                <Stack height="100%">
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                    >
                        <>
                            <ListItemButton
                                sx={{
                                    marginTop: location ? '20px' : '10px',
                                    borderBottom: location && '1px solid',
                                    borderBottomColor: (theme) =>
                                        alpha(theme.palette.neutral[300], 0.3),
                                }}
                            >
                                {location && (
                                    <ListItemText
                                        primary={
                                            <Typography
                                                sx={{ fontSize: '12px' }}
                                            >
                                                {translateOrFallback('Home', 'Início')}
                                            </Typography>
                                        }
                                        onClick={() => handleRoute('home')}
                                    />
                                )}
                            </ListItemButton>
                            {location && (
                                <>
                                    <CollapsableMenu
                                        value={collapsableMenu.cat}
                                        setOpenDrawer={setOpenDrawer}
                                        toggleDrawers={toggleDrawer}
                                        pathName="/category"
                                        />
                                        <CollapsableMenu
                                            value={collapsableMenu.res}
                                            setOpenDrawer={setOpenDrawer}
                                            toggleDrawers={toggleDrawer}
                                            pathName="/banca"
                                        />
                                        <CollapsableMenu
                                            value={collapsableMenu.cuisine}
                                            setOpenDrawer={setOpenDrawer}
                                            toggleDrawers={toggleDrawer}
                                            pathName="/cuisines"
                                        />
                                </>
                            )}

                            <ListItemButton
                                sx={{
                                    borderBottom: '1px solid',
                                    borderBottomColor: (theme) =>
                                        alpha(theme.palette.neutral[300], 0.3),
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {translateOrFallback('Terms & Conditions', 'Termos e Condições')}
                                        </Typography>
                                    }
                                    onClick={() =>
                                        handleRoute('terms-and-conditions')
                                    }
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{
                                    borderBottom: '1px solid',
                                    borderBottomColor: (theme) =>
                                        alpha(theme.palette.neutral[300], 0.3),
                                    '&:hover': {
                                        backgroundColor: 'primary.main',
                                    },
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {translateOrFallback('Privacy Policy', 'Política de Privacidade')}
                                        </Typography>
                                    }
                                    onClick={() =>
                                        handleRoute('privacy-policy')
                                    }
                                />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemText
                                    primary={
                                        <Typography sx={{ fontSize: '12px' }}>
                                            {translateOrFallback('Theme Mode', 'Modo do Tema')}
                                        </Typography>
                                    }
                                />
                                <ThemeSwitches noText />
                            </ListItemButton>
                            {/* Removido o seletor de idioma no mobile */}
                        </>
                    </List>
                    <ButtonContainer marginBottom="50px">
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ mt: 0, mb: 1, borderRadius: '5px' }}
                            startIcon={<LockIcon />}
                            onClick={() => handleOpenAuthModal('sign-in')}
                        >
                            {translateOrFallback('My Account', 'Minha Conta')}
                        </Button>
                        <CustomStackFullWidth
                            direction="row"
                            alignItems="center"
                            justifyContent="center"
                            spacing={0.5}
                            marginTop="1rem"
                        >
                            <CustomTypography fontSize="14px">
                                {translateOrFallback("Don't have an account?", 'Ainda não tem conta?')}
                            </CustomTypography>
                            <CustomLink
                                onClick={() => {
                                    handleOpenAuthModal('sign-up')
                                }}
                                variant="body2"
                            >
                                {translateOrFallback('Sign In', 'Entrar')}
                            </CustomLink>
                        </CustomStackFullWidth>
                    </ButtonContainer>
                </Stack>
            </Box>
        </RTL>
    )

    return (
        <Box>
            {authModalOpen && (
                <AuthModal
                    open={authModalOpen}
                    handleClose={handleCloseAuthModal}
                    forSignup={forSignup}
                    modalFor={modalFor}
                    setModalFor={setModalFor}
                    cartListRefetch={cartListRefetch}
                />
            )}
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={toggleDrawer(!openDrawer)}
                sx={{
                    color: (theme) => theme.palette.primary.main,
                    paddingRight: '0px',
                    paddingLeft: languageDirection === 'rtl' && '0px',
                }}
            >
                <MenuIcon />
            </IconButton>
            <RTL direction={languageDirection}>
                <CustomDrawer
                    anchor="right"
                    open={openDrawer}
                    onClose={toggleDrawer(false)}
                >
                    {token ? menuList() : withOutLogin()}
                </CustomDrawer>
            </RTL>
        </Box>
    )
}

export default DrawerMenu
