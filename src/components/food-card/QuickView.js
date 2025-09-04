import React from 'react'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { IconButton, Tooltip, styled, useTheme } from '@mui/material'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import { useTranslation } from 'react-i18next'
import AfterAddToCart from './AfterAddToCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useRouter } from 'next/router'
import { buildProductSEOUrl } from '@/utils/slugUtils'

const PrimaryToolTip = ({ theme, children, text }) => {
    return (
        <Tooltip
            title={text}
            arrow
            placement="top"
            componentsProps={{
                tooltip: {
                    sx: {
                        bgcolor: theme.palette.primary.main,
                        '& .MuiTooltip-arrow': {
                            color: theme.palette.primary.main,
                        },
                    },
                },
            }}
        >
            {children}
        </Tooltip>
    )
}

const IconButtonStyled = styled(IconButton)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(2px)',
    borderRadius: '4px',
    padding: '4px',
    color: theme.palette.primary.main,
    height: '36px',
    width: '36px',
    marginInlineEnd: '6px',
    '&:hover': {
        backgroundColor: theme.palette.primary.main,
        border: `0.5px solid ${theme.palette.neutral[100]}`,
        color: theme.palette.whiteContainer.main,
    },
}))



const QuickView = (props) => {
    const {
        id,
        isInList,
        quickViewHandleClick,
        noQuickview,
        noWishlist,
        addToWishlistHandler,
        removeFromWishlistHandler,
        isInCart,
        product,
        getQuantity,
        handleClickQuantityButton,
        setIncrOpen,
        incrOpen,
        addToCart,
        horizontal,
    } = props
    const theme = useTheme()
    const { t } = useTranslation()
    const router = useRouter()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? (fallback ?? key) : translated
    }

    const openFullPage = (e) => {
        e.stopPropagation()
        if (product?.id && product?.restaurant) {
            const seoUrl = buildProductSEOUrl(product, product.restaurant)
            router.push(seoUrl)
        } else if (product?.id) {
            // Fallback para URL antiga se não tiver dados da banca
            const slug = `${product.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${product.id}`
            router.push(`/produto/${slug}`)
        } else if (id) {
            router.push(`/produto/${id}`)
        }
    }

    return (
        <CustomStackFullWidth
            direction="row"
            alignItems="center"
            justifyContent="center"
            height="100%"
        >
            {!noQuickview && (
                <>
                    <PrimaryToolTip theme={theme} text={tt('Quick View','Visualizar')}>
                        <IconButtonStyled onClick={(e) => quickViewHandleClick(e)}>
                            <RemoveRedEyeIcon />
                        </IconButtonStyled>
                    </PrimaryToolTip>
                    <PrimaryToolTip theme={theme} text={tt('Open full page','Abrir página completa')}>
                        <IconButtonStyled onClick={openFullPage}>
                            <OpenInNewIcon />
                        </IconButtonStyled>
                    </PrimaryToolTip>
                </>
            )}
            {!noWishlist && !product?.available_date_ends && (
                <>
                    {isInList(id) ? (
                        <PrimaryToolTip
                            theme={theme}
                            text="Remove from wishlist"
                        >
                            <IconButtonStyled
                                onClick={(e) =>
                                    removeFromWishlistHandler(id, e)
                                }
                            >
                                <FavoriteIcon />
                            </IconButtonStyled>
                        </PrimaryToolTip>
                    ) : (
                        <PrimaryToolTip theme={theme} text={tt('Add to wishlist','Favoritos')}>
                            <IconButtonStyled
                                onClick={(e) => addToWishlistHandler(e)}
                            >
                                <FavoriteBorderIcon />
                            </IconButtonStyled>
                        </PrimaryToolTip>
                    )}
                </>
            )}

            {!isInCart ? (
                <PrimaryToolTip
                    theme={theme}
                    text={
                        product?.item_stock === 0 &&
                        product?.stock_type !== 'unlimited'
                            ? 'Indisponível'
                            : 'Comprar'
                    }
                >
                    <IconButtonStyled onClick={(e) => addToCart(e)}>
                        <AddShoppingCartIcon />
                    </IconButtonStyled>
                </PrimaryToolTip>
            ) : (
                <AfterAddToCart
                    isInCart={isInCart}
                    product={product}
                    getQuantity={getQuantity}
                    handleClickQuantityButton={handleClickQuantityButton}
                    setIncrOpen={setIncrOpen}
                    incrOpen={incrOpen}
                    horizontal={horizontal}
                />
            )}
        </CustomStackFullWidth>
    )
}

export default QuickView
