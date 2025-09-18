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
import Meta from '@/components/Meta'
import PushNotificationLayout from '@/components/PushNotificationLayout'
// Removendo dependências não importadas
import axios from 'axios'
import toast from 'react-hot-toast'

import { useDispatch, useSelector } from 'react-redux'
import useAddCartItem from '@/hooks/react-query/add-cart/useAddCartItem'
import { setCart } from '@/redux/slices/cart'
import { getGuestId } from '@/components/checkout-page/functions/getGuestUserId'
import { onErrorResponse } from '@/components/ErrorResponse'
// Novo: carrossel e cards
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import FoodCard from '@/components/food-card/FoodCard'
import { useGetAllProductsOfARestaurant } from '@/hooks/custom-hooks/useGetAllProductsOfARestaurant'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import StorefrontIcon from '@mui/icons-material/Storefront'
import LockIcon from '@mui/icons-material/Lock'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { generateSEOMetaTags, buildProductSEOUrl } from '@/utils/slugUtils'
import { getCachedRedirect, setCachedRedirect, setCachedNoRedirect } from '@/utils/redirectCache'

// Helper para formato BRL
const formatBRL = (value) =>
  Number(value ?? 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })

// Novo helper: extrai um nome legível a partir do slug/routeParam
const titleFromRouteParam = (raw) => {
  const s = decodeURIComponent(String(raw || '').trim())
  const withoutTrailingId = s.replace(/-?\d+$/,'')
  const words = withoutTrailingId.replace(/[-_]+/g, ' ').trim()
  if (!words) return 'Produto'
  return words
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const ProductPage = ({ product, error, clientOrigin, routeParam }) => {
  const router = useRouter()
  const theme = useTheme()
  const dispatch = useDispatch()
  const { cartList } = useSelector((state) => state.cart)
  const { mutate: addToCartMutate, isLoading: addToCartLoading } = useAddCartItem()
  const { id } = router.query

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(
    product?.image_full_url || product?.image || 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Produto'
  )

  // Garante que a imagem principal sincronize quando o produto/URL mudar (navegação cliente)
  useEffect(() => {
    const nextMainImage = product?.image_full_url || product?.image || 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Produto'
    setSelectedImage(nextMainImage)
  }, [product?.id, product?.image_full_url, product?.image])
  const imageUrl = product?.image_full_url || product?.image || 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Produto'
  // Construir URL canônica SEO-friendly
  const productUrl = product?.restaurant
    ? `${clientOrigin}${buildProductSEOUrl(product, product.restaurant)}`
    : `${clientOrigin}/produto/${routeParam || product.id}`
  const gallery = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [imageUrl]

  // Atualiza a imagem selecionada quando o produto muda (evita manter imagem do produto anterior)
  useEffect(() => {
    setSelectedImage(imageUrl)
  }, [imageUrl])

  // Cálculos de preço e desconto
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

  // Schema JSON-LD para SEO
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description || `${product.name} - Produto disponível em nossa plataforma`,
    image: imageUrl,
    sku: product.id?.toString(),
    brand: {
      '@type': 'Brand',
      name: product.restaurant_name || 'Bancas do Bairro',
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'BRL',
      price: currentPrice,
      availability: product.available_time_starts
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.restaurant_name || 'Bancas do Bairro',
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
        item: clientOrigin,
      },
      ...(product?.category_name
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: product.category_name,
              item: `${clientOrigin}/cuisines`,
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

  // Add to cart handler (mínimo viável)
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
      const isRestaurantExist = cartList.find(
        (item) => item.restaurant_id === product.restaurant_id
      )
      if (isRestaurantExist) {
        addToCartMutate(itemObject, { onSuccess, onError: onErrorResponse })
      } else {
        toast.error(
          'Seu carrinho contém itens de outro restaurante. Limpe-o para adicionar este produto.'
        )
      }
    } else {
      addToCartMutate(itemObject, { onSuccess, onError: onErrorResponse })
    }
  }

  const handleWhatsAppContact = () => {
    const whatsappNumber = product?.restaurant?.phone || product?.restaurant?.whatsapp_number || product?.restaurant?.contact
    if (!whatsappNumber) {
      toast.error('Número do WhatsApp não disponível')
      return
    }
    
    const message = `Olá! Vim através do site Bancas do Bairro e tenho interesse no produto: ${product.name}. Poderia me ajudar?`
    const encodedMessage = encodeURIComponent(message)
    const url = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodedMessage}`
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  // Relacionados por restaurante
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

  // Identificadores para perfil da banca (slug ou id) e zona, quando disponíveis
  const bancaSlugOrId =
    product?.restaurant_slug ||
    product?.restaurant?.slug ||
    product?.restaurant_id ||
    product?.restaurantId ||
    product?.restaurant?.id ||
    null
  const bancaZoneId = product?.zone_id || product?.restaurant_zone_id || product?.restaurant?.zone_id || null

  return (
    <>
      <Head>
        <title>{product.name} | Bancas do Bairro</title>
        <meta
          name="description"
          content={
            product.description ||
            `${product.name} - Produto disponível em nossa plataforma de delivery`
          }
        />
        <meta
          name="keywords"
          content={`${product.name}, delivery, comida, ${product.restaurant_name || ''}`}
        />
        {/* Open Graph */}
        <meta property="og:title" content={`${product.name} | Bancas do Bairro`} />
        <meta
          property="og:description"
          content={
            product.description || `${product.name} - Produto disponível em nossa plataforma`
          }
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={productUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Bancas do Bairro" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} | Bancas do Bairro`} />
        <meta
          name="twitter:description"
          content={
            product.description || `${product.name} - Produto disponível em nossa plataforma`
          }
        />
        <meta name="twitter:image" content={imageUrl} />
        {/* Canonical URL */}
        <link rel="canonical" href={productUrl} />
        {/* Product JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        {/* Breadcrumb JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
        />
      </Head>

      <PushNotificationLayout>
        <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 10 }, pb: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            {/* Galeria do Produto */}
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
                        border:
                          selectedImage === img
                            ? `2px solid ${theme.palette.primary.main}`
                            : `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  ))}
                </Stack>
              )}
            </Grid>

            {/* Bloco de Compra */}
            <Grid item xs={12} md={5}>
              <CustomStackFullWidth spacing={2}>
                {/* Breadcrumbs com botão de voltar */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <IconButton 
                    onClick={() => router.back()} 
                    size="small" 
                    sx={{ p: 0.5 }}
                  >
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

                {/* Quantidade e Botão Comprar */}
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

                {/* Botão WhatsApp */}
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleWhatsAppContact}
                  startIcon={<WhatsAppIcon />}
                  fullWidth
                  sx={{
                    borderColor: '#FF8C00',
                    color: '#FF8C00',
                    py: 1,
                    '&:hover': {
                      borderColor: '#FF8C00',
                      backgroundColor: 'rgba(255, 140, 0, 0.04)'
                    }
                  }}
                >
                  Comprar pelo WhatsApp
                </Button>
 
                 {/* Selo de disponibilidade */}
                 <Typography variant="caption" color="text.secondary">
                   {product.available_time_starts ? 'Produto disponível hoje' : 'Produto indisponível no momento'}
                 </Typography>
 
                 {/* Mini cards com compra segura e banca */}
                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 1.5 }}>
                   <Paper elevation={0} variant="outlined" sx={{ px: 1.5, py: 1, borderRadius: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                     <VerifiedUserIcon color="success" fontSize="small" />
                     <Typography variant="caption" color="text.secondary">Compra segura</Typography>
                   </Paper>
                   {product?.restaurant_name && (
                     bancaSlugOrId ? (
                       <MUILink
                         component={NextLink}
                         href={`/${bancaSlugOrId}`}
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

          {/* Descrição completa */}
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 4, opacity: 0.6 }} />
            <Typography variant="h4" fontWeight={700} gutterBottom color="text.primary">
              Descrição do produto
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ whiteSpace: 'pre-line', fontSize: { xs: '1rem', md: '1.1rem' } }}>
              {product?.description || 'Sem descrição detalhada disponível.'}
            </Typography>
          </Box>

          {/* Produtos relacionados */}
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

export async function getServerSideProps({ params, req, resolvedUrl }) {
    const raw = params?.id
    
    // Verificar cache de redirecionamento primeiro
    const cachedRedirect = getCachedRedirect(raw)
    if (cachedRedirect) {
        return {
            redirect: {
                destination: cachedRedirect,
                permanent: true,
            },
        }
    }
    
    const match = String(raw || '').match(/(\d+)(?!.*\d)/)
    const numericId = match ? match[1] : null
    const idForApi = numericId || raw
    const friendlyName = titleFromRouteParam(raw)
    
    // Simular dados de produto para demonstração (fallback)
    const mockProduct = {
        id: numericId ? parseInt(numericId) : raw,
        name: friendlyName,
        description: 'Descrição detalhada do produto com informações importantes sobre sua composição e benefícios.',
        price: (Math.random() * 50 + 5).toFixed(2),
        image: 'https://via.placeholder.com/400x300/4CAF50/white?text=' + encodeURIComponent(friendlyName),
        images: [
            'https://via.placeholder.com/400x300/4CAF50/white?text=' + encodeURIComponent(friendlyName),
            'https://via.placeholder.com/400x300/2196F3/white?text=Imagem+2',
            'https://via.placeholder.com/400x300/FF9800/white?text=Imagem+3'
        ],
        restaurant_name: 'Banca do João',
        restaurant_id: 1,
        restaurant_slug: 'banca-do-joao',
        category_name: 'Frutas e Vegetais',
        avg_rating: (Math.random() * 2 + 3).toFixed(1),
        rating_count: Math.floor(Math.random() * 100 + 10),
        veg: Math.random() > 0.5 ? 1 : 0,
        halal: Math.random() > 0.7 ? 1 : 0,
        available_time_starts: '08:00:00',
        available_time_ends: '18:00:00'
    }
    
    const hostname = req.headers.host
    const protocol = req.headers['x-forwarded-proto'] || 'http'
    const clientOrigin = process.env.NEXT_CLIENT_HOST_URL || `${protocol}://${hostname}`

    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
        
        // Se baseUrl for uma API real, tentar fazer a requisição
        if (baseUrl && !baseUrl.includes('127.0.0.1:3014') && !baseUrl.includes('localhost:3014')) {
            const response = await axios.get(`${baseUrl}/api/v1/products/details/${idForApi}`, {
                headers: {
                    'zone-id': JSON.stringify([1]),
                    'X-software-id': 33571750,
                    // 'origin': clientOrigin, // REMOVIDO: não definir manualmente
                    'X-localization': 'pt-br'
                },
                timeout: 5000 // 5 segundos timeout
            })

            // Aceitar múltiplos formatos de payload (objeto direto, {data: {...}}, array)
            const respData = response?.data
            let product = null
            if (Array.isArray(respData)) {
                product = respData[0]
            } else if (respData && typeof respData === 'object') {
                if (respData.data && typeof respData.data === 'object') {
                    product = Array.isArray(respData.data) ? respData.data[0] : respData.data
                } else {
                    product = respData
                }
            }

            if (product && typeof product === 'object') {
                // Se o nome vier vazio ou genérico, substitui pelo nome derivado do slug
                const isGeneric = typeof product.name === 'string' && /^produto\s*\d*$/i.test(product.name.trim())
                product = { ...product, name: product?.name && !isGeneric ? product.name : friendlyName }
                
                // Verificar se a URL atual é a URL SEO-friendly correta
                if (product.restaurant || product.restaurant_id) {
                    const correctSEOUrl = buildProductSEOUrl(product, product.restaurant || { id: product.restaurant_id, slug: product.restaurant_slug })
                    const currentPath = resolvedUrl
                    
                    // Se não estamos na URL SEO-friendly correta, redirecionar
                    if (currentPath !== correctSEOUrl) {
                        // Armazenar no cache para futuras requisições
                        setCachedRedirect(raw, correctSEOUrl)
                        
                        return {
                            redirect: {
                                destination: correctSEOUrl,
                                permanent: true, // 301 redirect
                            },
                        }
                    } else {
                        // URL está correta, marcar no cache como não precisando redirecionamento
                        setCachedNoRedirect(raw)
                    }
                }
                
                return {
                    props: {
                        product,
                        error: null,
                        clientOrigin,
                        routeParam: raw,
                    },
                }
            }
        }
    } catch (error) {
        console.log('API não disponível, usando dados simulados:', error.message)
    }
    
    // Para dados simulados, também verificar redirecionamento SEO
    if (mockProduct.restaurant_id && mockProduct.restaurant_slug) {
        const correctSEOUrl = buildProductSEOUrl(mockProduct, { id: mockProduct.restaurant_id, slug: mockProduct.restaurant_slug })
        const currentPath = resolvedUrl
        
        // Se não estamos na URL SEO-friendly correta, redirecionar
        if (currentPath !== correctSEOUrl) {
            // Armazenar no cache para futuras requisições
            setCachedRedirect(raw, correctSEOUrl)
            
            return {
                redirect: {
                    destination: correctSEOUrl,
                    permanent: true, // 301 redirect
                },
            }
        } else {
            // URL está correta, marcar no cache como não precisando redirecionamento
            setCachedNoRedirect(raw)
        }
    }
    
    // Retornar dados simulados como fallback
    return {
        props: {
            product: mockProduct,
            error: null,
            clientOrigin,
            routeParam: raw,
        }
    }
}

export default ProductPage