import React, { useMemo, useState, useEffect } from 'react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Breadcrumbs,
  Link as MUILink,
  Button,
  Rating,
  IconButton,
  Divider,
  Chip,
  Paper,
} from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import { useTheme } from '@mui/material/styles'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import PushNotificationLayout from '@/components/PushNotificationLayout'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import useAddCartItem from '@/hooks/react-query/add-cart/useAddCartItem'
import { setCart } from '@/redux/slices/cart'
import { getGuestId } from '@/components/checkout-page/functions/getGuestUserId'
import { onErrorResponse } from '@/components/ErrorResponse'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import FoodCard from '@/components/food-card/FoodCard'
import { useGetAllProductsOfARestaurant } from '@/hooks/custom-hooks/useGetAllProductsOfARestaurant'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import StorefrontIcon from '@mui/icons-material/Storefront'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { buildProductSEOUrl, buildBancaSlug } from '@/utils/slugUtils'

const formatBRL = (value) =>
  Number(value ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

const ProductDetailPageContent = ({ product, restaurant, clientOrigin }) => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { cartList } = useSelector((state) => state.cart)
  const { mutate: addToCartMutate, isLoading: addToCartLoading } = useAddCartItem()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(
    product?.image_full_url || product?.image || 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Produto'
  )

  useEffect(() => {
    const nextMainImage = product?.image_full_url || product?.image || 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Produto'
    setSelectedImage(nextMainImage)
  }, [product?.id, product?.image_full_url, product?.image])

  const imageUrl = product?.image_full_url || product?.image || 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Produto'
  const productUrl = restaurant
    ? `${clientOrigin || ''}${buildProductSEOUrl(product, restaurant)}`
    : `${clientOrigin || ''}/produto/${product?.id}`
  const gallery = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [imageUrl]

  const currentPrice = useMemo(() => Number(product?.price ?? 0), [product])
  const originalPrice = useMemo(
    () => (product?.original_price || product?.price_before_discount || null),
    [product]
  )
  const discountPercentage = useMemo(() => {
    if (originalPrice && currentPrice && currentPrice < Number(originalPrice)) {
      return Math.round(100 - (currentPrice / Number(originalPrice)) * 100)
    }
    if (product?.discount && product?.discount_type === 'percent') return Math.round(Number(product.discount))
    if (product?.restaurant_discount) return Math.round(Number(product.restaurant_discount))
    return null
  }, [originalPrice, currentPrice, product])

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `${product.name} - Produto disponível em nossa plataforma`,
    image: imageUrl,
    sku: product.id?.toString(),
    brand: {
      '@type': 'Brand',
      name: product.restaurant_name || restaurant?.name || 'Bancas do Bairro',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BRL',
      price: currentPrice,
      availability: product.available_time_starts ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.restaurant_name || restaurant?.name || 'Bancas do Bairro',
      },
    },
  }

  if (product.avg_rating && product.rating_count > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.avg_rating,
      reviewCount: product.rating_count,
      bestRating: 5,
      worstRating: 1,
    }
  }

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: clientOrigin || '',
      },
      ...(product?.category_name
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: product.category_name,
              item: `${clientOrigin || ''}/cuisines`,
            },
          ]
        : []),
      {
        '@type': 'ListItem',
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  }

  const handleAddToCart = () => {
    const itemObject = {
      guest_id: getGuestId(),
      model: product?.available_date_starts ? 'ItemCampaign' : 'Food',
      add_on_ids: [],
      add_on_qtys: [],
      item_id: product?.id,
      price: product?.price,
      quantity: quantity,
      variations: [],
    }

    const onSuccess = (res) => {
      if (res) {
        let added = {}
        res?.forEach((it) => {
          added = {
            ...it?.item,
            cartItemId: it?.id,
            totalPrice: it?.item?.price,
            quantity: it?.quantity,
            itemBasePrice: it?.item?.price,
          }
        })
        dispatch(setCart(added))
        toast.success('Produto adicionado ao carrinho')
      }
    }

    if (Array.isArray(cartList) && cartList.length > 0) {
      const isRestaurantExist = cartList.find((item) => item.restaurant_id === product.restaurant_id)
      if (isRestaurantExist) {
        addToCartMutate(itemObject, { onSuccess, onError: onErrorResponse })
      } else {
        toast.error('Seu carrinho contém itens de outro restaurante. Limpe-o para adicionar este produto.')
      }
    } else {
      addToCartMutate(itemObject, { onSuccess, onError: onErrorResponse })
    }
  }

  const handleWhatsAppContact = () => {
    const whatsappNumber =
      product?.restaurant?.phone ||
      product?.restaurant?.whatsapp_number ||
      product?.restaurant?.contact ||
      restaurant?.phone ||
      restaurant?.whatsapp_number ||
      restaurant?.contact
    if (!whatsappNumber) {
      toast.error('Número do WhatsApp não disponível')
      return
    }

    const message = `Olá, tudo bem? Gostaria de comprar este produto: | *Nome:* ${product.name} | *Quantidade:* ${quantity}`
    const encodedMessage = encodeURIComponent(message)
    const url = `https://api.whatsapp.com/send?phone=${whatsappNumber.replace(/\D/g, '')}&text=${encodedMessage}`

    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const relatedProducts = useGetAllProductsOfARestaurant(product?.restaurant_id)
  const displayedRelated = useMemo(
    () => (Array.isArray(relatedProducts) ? relatedProducts.filter((p) => p?.id !== product?.id).slice(0, 3) : []),
    [relatedProducts, product?.id]
  )

  const sliderSettings = {
    dots: false,
    arrows: true,
    infinite: false,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 900, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  }

  return (
    <>
      <Head>
        <title>{product.name} | Bancas do Bairro</title>
        <meta name="description" content={product.description || `${product.name} - Produto disponível em nossa plataforma de delivery`} />
        <meta name="keywords" content={`${product.name}, delivery, comida, ${product.restaurant_name || ''}`} />
        <meta property="og:title" content={`${product.name} | Bancas do Bairro`} />
        <meta property="og:description" content={product.description || `${product.name} - Produto disponível em nossa plataforma`} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Bancas do Bairro" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Bancas do Bairro`} />
        <meta name="twitter:description" content={product.description || `${product.name} - Produto disponível em nossa plataforma`} />
        <meta name="twitter:image" content={imageUrl} />
        <link rel="canonical" href={productUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }} />
      </Head>

      <PushNotificationLayout>
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Paper elevation={6} sx={{ borderRadius: 3, p: { xs: 1, sm: 1.5 }, mx: 'auto', width: '100%', maxWidth: { xs: 340, sm: 400, md: 500 } }}>
                <Box
                  component="img"
                  src={selectedImage}
                  alt={product.name}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: { xs: 320, sm: 380, md: 420 },
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 2,
                    backgroundColor: theme.palette.background.default,
                    mx: 'auto',
                  }}
                />
              </Paper>

              {gallery.length > 1 && (
                <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                  {gallery.map((img, idx) => (
                    <Box
                      key={idx}
                      component="img"
                      src={img}
                      alt={`${product.name} ${idx + 1}`}
                      onClick={() => setSelectedImage(img)}
                      sx={{
                        width: 72,
                        height: 72,
                        objectFit: 'cover',
                        borderRadius: 1,
                        cursor: 'pointer',
                        border: selectedImage === img ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Grid>

            <Grid item xs={12} md={5}>
              <CustomStackFullWidth spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <IconButton onClick={() => router.back()} size="small" sx={{ p: 0.5 }}>
                    <KeyboardArrowLeftIcon fontSize="small" />
                  </IconButton>
                  <Breadcrumbs aria-label="breadcrumb" sx={{ '& .MuiBreadcrumbs-separator': { fontSize: 'inherit' } }}>
                    <Typography component={NextLink} href="/" variant="caption" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                      Início
                    </Typography>
                    {product?.category_name && (
                      <Typography component={NextLink} href="/cuisines" variant="caption" color="text.secondary" sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        {product.category_name}
                      </Typography>
                    )}
                    <Typography variant="caption" color="text.secondary">{product.name}</Typography>
                  </Breadcrumbs>
                </Stack>

                <Typography variant="h3" component="h1" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: '2rem', md: '2.5rem' } }}>
                  {product.name}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Rating value={Number(product?.avg_rating || 0)} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {Number(product?.avg_rating || 0).toFixed(1)} ({product?.rating_count || 0})
                  </Typography>
                </Stack>

                <Divider />

                {product?.restaurant_name && (
                  <Typography variant="caption" color="text.secondary">
                    Vendido e entregue por {product.restaurant_name}
                  </Typography>
                )}

                {product.description && (
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.6,
                      fontSize: { xs: '1rem', md: '1.1rem' },
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {product.description}
                  </Typography>
                )}

                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography variant="h3" color="primary" fontWeight={800} sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                      {formatBRL(currentPrice)}
                    </Typography>
                    {originalPrice && currentPrice < Number(originalPrice) && (
                      <Typography variant="body2" color="text.disabled" sx={{ textDecoration: 'line-through' }}>
                        {formatBRL(originalPrice)}
                      </Typography>
                    )}
                    {discountPercentage ? (
                      <Chip color="success" size="small" label={`${discountPercentage}% OFF`} />
                    ) : null}
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Stack direction="row" alignItems="center" sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, height: 48 }}>
                    <IconButton size="medium" onClick={() => setQuantity((q) => Math.max(1, q - 1))} sx={{ color: 'text.primary' }}>
                      −
                    </IconButton>
                    <Typography sx={{ px: 2, minWidth: 40, textAlign: 'center', fontSize: '1.1rem' }} color="text.primary">{quantity}</Typography>
                    <IconButton size="medium" onClick={() => setQuantity((q) => q + 1)} sx={{ color: 'text.primary' }}>
                      +
                    </IconButton>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={addToCartLoading}
                    sx={{ flex: 1 }}
                  >
                    {addToCartLoading ? 'Adicionando...' : 'Comprar'}
                  </Button>
                </Stack>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleWhatsAppContact}
                  startIcon={<WhatsAppIcon fontSize="small" />}
                  fullWidth
                  sx={{
                    borderColor: '#FF8C00',
                    color: '#FF8C00',
                    py: 0.4,
                    minHeight: 0,
                    fontSize: '0.9rem',
                    '&:hover': {
                      borderColor: '#FF8C00',
                      backgroundColor: 'rgba(255, 140, 0, 0.04)'
                    }
                  }}
                >
                  Comprar pelo WhatsApp
                </Button>

                <Typography variant="caption" color="text.secondary">
                  {product.available_time_starts ? 'Produto disponível hoje' : 'Produto indisponível no momento'}
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1.5 }}>
                  <Paper elevation={0} variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedUserIcon color="success" fontSize="small" />
                    <Typography variant="caption" color="text.secondary">Compra segura</Typography>
                  </Paper>
                  {product?.restaurant_name && (
                    restaurant ? (
                      <MUILink
                        component={NextLink}
                        href={`/${restaurant?.slug || buildBancaSlug(restaurant)}`}
                        underline="none"
                        sx={{ textDecoration: 'none' }}
                        aria-label={`Ver perfil da banca ${product.restaurant_name}`}
                        title={`Ver perfil da banca ${product.restaurant_name}`}
                      >
                        <Paper elevation={0} variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}>
                          <StorefrontIcon color="action" fontSize="small" />
                          <Typography variant="caption" color="text.secondary">{product.restaurant_name}</Typography>
                        </Paper>
                      </MUILink>
                    ) : (
                      <Paper elevation={0} variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StorefrontIcon color="action" fontSize="small" />
                        <Typography variant="caption" color="text.secondary">{product.restaurant_name}</Typography>
                      </Paper>
                    )
                  )}
                </Stack>
              </CustomStackFullWidth>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 4, opacity: 0.6 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
              Descrição do produto
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: { xs: '1rem', md: '1.1rem' } }}>
              {product?.description || 'Sem descrição detalhada disponível.'}
            </Typography>
          </Box>

          {displayedRelated.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h4" fontWeight={700} color="text.primary">
                  Produtos relacionados
                </Typography>
              </Stack>
              <Slider {...sliderSettings}>
                {displayedRelated.map((p) => (
                  <Box key={p.id} sx={{ px: 1 }}>
                    <FoodCard product={p} horizontal="true" hasBackGroundSection="true" />
                  </Box>
                ))}
              </Slider>
            </Box>
          )}
        </Container>
      </PushNotificationLayout>
    </>
  )
}

export default ProductDetailPageContent
