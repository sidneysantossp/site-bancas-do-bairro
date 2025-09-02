import React, { useState } from 'react'
import { CustomFoodCardNew } from './FoodCard.style'
import CustomImageContainer from '../CustomImageContainer'
import {
    IconButton,
    Tooltip,
    Typography,
    useMediaQuery,
    Box,
    Stack,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import VagSvg from '../foodDetail-modal/VagSvg'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { CustomOverlayBox } from '@/styled-components/CustomStyles.style'
import { getReviewCount, isAvailable } from '@/utils/customFunctions'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import VisibilityIcon from '@mui/icons-material/Visibility'
import StartPriceView from '../foodDetail-modal/StartPriceView'
import { RTL } from '../RTL/RTL'
import { t } from 'i18next'
import FoodRating from './FoodRating'
import AfterAddToCart from './AfterAddToCart'
import CircularLoader from '../loader/CircularLoader'
import { useSelector } from 'react-redux'
import CustomPopover from '../custom-popover/CustomPopover'
import CustomPopoverWithItem from '../custom-popover/CustomPopoverWithItem'
import WishListImage from '../../assets/images/WishListImage'
import DeleteIcon from '../../assets/images/icons/DeleteIcon'
import HalalSvg from '@/components/food-card/HalalSvg'
import { useRouter } from 'next/router'

// Helper local de slug
const buildProductSlug = (product) => {
    const id = product?.id
    const name = product?.name || 'produto'
    const slug = name
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    return id ? `${slug}-${id}` : slug
}

const HorizontalFoodCard = (props) => {
    const {
        isShop,
        product,
        imageUrl,
        isInList,
        languageDirection,
        addToFavorite,
        deleteWishlistItem,
        available_time_starts,
        available_time_ends,
        handleFoodDetailModal,
        handleBadge,
        addToCart,
        isInCart,
        getQuantity,
        incrOpen,
        setIncrOpen,
        handleClickQuantityButton,
        addToCartLoading,
        isRestaurantDetails,
        inWishListPage = 'false',
        horizontal,
    } = props
    const theme = useTheme()
    const router = useRouter()
    const [anchorEl, setAnchorEl] = useState(null)
    const { global } = useSelector((state) => state.globalSettings)
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    let currencySymbol
    let currencySymbolDirection
    let digitAfterDecimalPoint

    if (global) {
        currencySymbol = global.currency_symbol
        currencySymbolDirection = global.currency_symbol_direction
        digitAfterDecimalPoint = global.digit_after_decimal_point
    }
    const handleClick = (e) => {
        deleteWishlistItem(product?.id, e)
    }
    const handleClickDelete = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event) => {
        setAnchorEl(null)
    }
    const handleViewProduct = (e) => {
        e.stopPropagation()
        if (product?.id) {
            const slug = buildProductSlug(product)
            router.push(`/produto/${slug}`)
        }
    }
    return (
        <>
            <RTL direction={languageDirection}>
                <CustomFoodCardNew
                    horizontal
                    onClick={handleFoodDetailModal}
                    background={theme.palette.cardBackground1}
                    width="100%"
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        width="100%"
                        sx={{ overflow: 'hidden' }}
                    >
                        <Stack
                            position="relative"
                            sx={{
                                transition: `${theme.transitions.create(
                                    ['background-color', 'transform'],
                                    {
                                        duration:
                                            theme.transitions.duration.standard,
                                    }
                                )}`,
                                marginLeft:
                                    languageDirection === 'rtl' &&
                                    '.8rem !important',
                                '&:hover': {
                                    transform: 'scale(1.04)',
                                },
                            }}
                        >
                            <CustomImageContainer
                                src={imageUrl}
                                width="115px"
                                smWidth="95px"
                                smHeight="95px"
                                height="95px"
                                borderRadius="3px"
                                objectFit="cover"
                                onClick={handleViewProduct}
                                sx={{ cursor: 'pointer' }}
                            />

                            {!isAvailable(
                                available_time_starts,
                                available_time_ends
                            ) ? (
                                <CustomOverlayBox>
                                    <Typography align="center" variant="h5">
                                        Indisponível
                                    </Typography>
                                </CustomOverlayBox>
                            ) : (
                                <Stack
                                    position="absolute"
                                    top="10%"
                                    left="0"
                                    zIndex="1"
                                >
                                    {handleBadge(
                                        product,
                                        currencySymbol,
                                        currencySymbolDirection,
                                        digitAfterDecimalPoint,
                                        product?.available_date_ends
                                    )}
                                </Stack>
                            )}
                        </Stack>
                        <Stack gap="7px" sx={{ flex: 1, minWidth: 0 }}>
                            <Stack>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    spacing={0.5}
                                >
                                    <Typography
                                        fontSize="14px"
                                        fontWeight="500"
                                        noWrap
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            cursor: 'pointer',
                                        }}
                                        color={theme.palette.neutral[1200]}
                                        component="h3"
                                        onClick={handleViewProduct}
                                    >
                                        {product?.name}
                                    </Typography>
                                    {global?.toggle_veg_non_veg ? (
                                        <VagSvg
                                            color={
                                                Number(product?.veg) === 0
                                                    ? theme.palette.nonVeg
                                                    : theme.palette.success
                                                          .light
                                            }
                                        />
                                    ) : null}

                                    {product?.halal_tag_status === 1 &&
                                        product?.is_halal === 1 && (
                                            <Tooltip
                                                arrow
                                                title={t(
                                                    'This is a halal food'
                                                )}
                                            >
                                                <IconButton
                                                    sx={{ padding: '0px' }}
                                                >
                                                    <HalalSvg />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                </Stack>
                                {!isShop && (
                                    <Typography
                                        variant="subtitle2"
                                        fontSize="12px"
                                        fontWeight={400}
                                        color={theme.palette.neutral[400]}
                                        mt="-3px"
                                        component="h4"
                                    >
                                        {product?.restaurant_name}
                                    </Typography>
                                )}
                            </Stack>
                            <Stack flexDirection="row" gap="5px">
                                <Typography
                                    fontSize={{ xs: '12px', md: '14px' }}
                                    fontWeight={400}
                                    color={theme.palette.text.secondary}
                                >
                                    {getReviewCount(product?.rating_count)}
                                </Typography>
                                {(product?.avg_rating !== 0 &&
                                    isRestaurantDetails &&
                                    !isSmall) ||
                                (!isRestaurantDetails &&
                                    product?.avg_rating !== 0) ? (
                                    <FoodRating
                                        product_avg_rating={product?.avg_rating}
                                    />
                                ) : (
                                    ''
                                )}
                            </Stack>
                            <StartPriceView
                                data={product}
                                handleBadge={handleBadge}
                                available_date_ends={product?.available_date_ends}
                            />
                        </Stack>
                    </Stack>
                </CustomFoodCardNew>
            </RTL>
        </>
    )
}

export default HorizontalFoodCard
