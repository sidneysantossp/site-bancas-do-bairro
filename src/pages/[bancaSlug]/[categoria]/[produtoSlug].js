import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainApi from '@/api/MainApi'
import { useQuery } from 'react-query'
import { onSingleErrorResponse } from '@/components/ErrorResponse'
import { getServerSideProps as getGlobalServerSideProps } from '@/pages/_app'
import ProductDetailPageContent from '@/components/product-detail/ProductDetailPageContent'
import Meta from '@/components/Meta'
import { CircularProgress, Box } from '@mui/material'
import { 
  buildProductSlug, 
  buildBancaSlug, 
  extractIdFromSlug,
  generateSEOMetaTags 
} from '@/utils/slugUtils'

const ProductPageSEO = ({ configData }) => {
  const router = useRouter()
  const { bancaSlug, categoria, produtoSlug } = router.query
  const [product, setProduct] = useState(null)
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Extrair IDs dos slugs
  const productId = extractIdFromSlug(produtoSlug)
  const restaurantId = extractIdFromSlug(bancaSlug)

  // Buscar dados do produto
  const { data: productData, isLoading: productLoading, error: productError } = useQuery(
    ['product', productId],
    () => MainApi.get(`/api/v1/products/details/${productId}`),
    {
      enabled: !!productId,
      onError: onSingleErrorResponse,
      retry: 1,
    }
  )

  // Buscar dados da banca
  const { data: restaurantData, isLoading: restaurantLoading, error: restaurantError } = useQuery(
    ['restaurant', restaurantId],
    () => MainApi.get(`/api/v1/restaurants/details/${restaurantId}`),
    {
      enabled: !!restaurantId,
      onError: onSingleErrorResponse,
      retry: 1,
    }
  )

  useEffect(() => {
    if (productData && restaurantData) {
      const productInfo = productData.data
      const restaurantInfo = restaurantData.data

      // Verificar se o produto pertence à banca
      if (productInfo.restaurant_id !== restaurantInfo.id) {
        setError('Produto não encontrado nesta banca')
        setLoading(false)
        return
      }

      // Verificar se os slugs estão corretos
      const expectedProductSlug = buildProductSlug(productInfo)
      const expectedBancaSlug = buildBancaSlug(restaurantInfo)
      const expectedCategoria = productInfo.category_name ? 
        productInfo.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'produtos'

      if (produtoSlug !== expectedProductSlug || 
          bancaSlug !== expectedBancaSlug || 
          categoria !== expectedCategoria) {
        // Redirecionar para a URL correta
        router.replace(`/${expectedBancaSlug}/${expectedCategoria}/${expectedProductSlug}`)
        return
      }

      setProduct(productInfo)
      setRestaurant(restaurantInfo)
      setLoading(false)
    }
  }, [productData, restaurantData, produtoSlug, bancaSlug, categoria, router])

  useEffect(() => {
    if (productError || restaurantError) {
      setError('Produto ou banca não encontrados')
      setLoading(false)
    }
  }, [productError, restaurantError])

  // Redirecionamento para 404 se não encontrar IDs nos slugs
  useEffect(() => {
    if (!productId || !restaurantId) {
      router.push('/404')
    }
  }, [productId, restaurantId, router])

  if (loading || productLoading || restaurantLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product || !restaurant) {
    router.push('/404')
    return null
  }

  // URL canônica SEO-friendly
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3007'}/${bancaSlug}/${categoria}/${produtoSlug}`

  // Gerar meta tags SEO
  const seoMetaTags = generateSEOMetaTags(product, restaurant)

  return (
    <>
      <Meta
        title={`${product.name} - ${restaurant.name} | Bancas do Bairro`}
        description={seoMetaTags.description}
        keywords={seoMetaTags.keywords}
        canonicalUrl={canonicalUrl}
        image={product.image || restaurant.logo}
      />
      <ProductDetailPageContent
        product={product}
        restaurant={restaurant}
        clientOrigin={process.env.NEXT_CLIENT_HOST_URL || ''}
      />
    </>
  )
}

export async function getServerSideProps(context) {
  const { bancaSlug, categoria, produtoSlug } = context.query
  
  // Extrair IDs dos slugs
  const productId = extractIdFromSlug(produtoSlug)
  const restaurantId = extractIdFromSlug(bancaSlug)
  
  if (!productId || !restaurantId) {
    return {
      notFound: true,
    }
  }

  try {
    // Obter configurações globais primeiro
    const globalProps = await getGlobalServerSideProps(context)
    
    // Tentar buscar dados com fallback para evitar crash
    let product = null
    let restaurant = null
    
    try {
      const [productResponse, restaurantResponse] = await Promise.all([
        MainApi.get(`/api/v1/products/details/${productId}`),
        MainApi.get(`/api/v1/restaurants/details/${restaurantId}`)
      ])

      product = productResponse.data
      restaurant = restaurantResponse.data

      // Verificar se o produto pertence à banca
      if (product.restaurant_id !== restaurant.id) {
        return {
          notFound: true,
        }
      }

      // Verificar se os slugs estão corretos e redirecionar se necessário
      const expectedProductSlug = buildProductSlug(product)
      const expectedBancaSlug = buildBancaSlug(restaurant)
      const expectedCategoria = product.category_name ? 
        product.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'produtos'

      if (produtoSlug !== expectedProductSlug || 
          bancaSlug !== expectedBancaSlug || 
          categoria !== expectedCategoria) {
        return {
          redirect: {
            destination: `/${expectedBancaSlug}/${expectedCategoria}/${expectedProductSlug}`,
            permanent: true, // 301 redirect
          },
        }
      }
    } catch (apiError) {
      console.error('API indisponível para produto/banca:', apiError)
      // Criar objetos mínimos para evitar crash
      product = {
        id: productId,
        name: 'Produto Temporariamente Indisponível',
        restaurant_id: restaurantId
      }
      restaurant = {
        id: restaurantId,
        name: 'Banca Temporariamente Indisponível'
      }
    }
    
    return {
      props: {
        ...globalProps.props,
        product,
        restaurant,
      },
    }
  } catch (error) {
    console.error('Erro crítico ao processar página do produto:', error)
    // Fallback para evitar crash total
    return {
      props: {
        configData: null,
        product: {
          id: productId,
          name: 'Erro ao Carregar Produto',
          restaurant_id: restaurantId
        },
        restaurant: {
          id: restaurantId,
          name: 'Erro ao Carregar Banca'
        },
      },
    }
  }
}

export default ProductPageSEO