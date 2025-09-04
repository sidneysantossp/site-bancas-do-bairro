import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MainApi from '@/api/MainApi'
import { useQuery } from 'react-query'
import { onSingleErrorResponse } from '@/components/ErrorResponse'
import { getServerSideProps as getGlobalServerSideProps } from '@/pages/_app'
import ProductPage from '@/components/products-page/ProductPage'
import Meta from '@/components/Meta'
import { CircularProgress, Box } from '@mui/material'

// Helper para gerar slug de produto
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

// Helper para gerar slug de banca
const buildBancaSlug = (restaurant) => {
  const id = restaurant?.id
  const name = restaurant?.name || 'banca'
  const slug = name
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
  return id ? `${slug}-${id}` : slug
}

// Helper para extrair ID do slug
const extractIdFromSlug = (slug) => {
  if (!slug) return null
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  return /^\d+$/.test(lastPart) ? lastPart : null
}

const ProductPageSEO = ({ configData }) => {
  const router = useRouter()
  const { bancaSlug, produtoSlug } = router.query
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

      if (produtoSlug !== expectedProductSlug || bancaSlug !== expectedBancaSlug) {
        // Redirecionar para a URL correta
        router.replace(`/banca/${expectedBancaSlug}/produto/${expectedProductSlug}`)
        return
      }

      setProduct(productInfo)
      setRestaurant(restaurantInfo)
      setLoading(false)
    }
  }, [productData, restaurantData, produtoSlug, bancaSlug, router])

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
  const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3007'}/banca/${bancaSlug}/produto/${produtoSlug}`

  return (
    <>
      <Meta
        title={`${product.name} - ${restaurant.name} | Bancas do Bairro`}
        description={product.description || `${product.name} - Produto disponível na ${restaurant.name}`}
        keywords={`${product.name}, ${restaurant.name}, delivery, bancas do bairro`}
        ogImage={product.image_full_url}
        canonicalUrl={canonicalUrl}
      />
      <ProductPage product={product} configData={configData} />
    </>
  )
}

export async function getServerSideProps(context) {
  const { bancaSlug, produtoSlug } = context.query
  
  // Extrair IDs dos slugs
  const productId = extractIdFromSlug(produtoSlug)
  const restaurantId = extractIdFromSlug(bancaSlug)
  
  if (!productId || !restaurantId) {
    return {
      notFound: true,
    }
  }

  try {
    // Buscar configurações globais
    const globalProps = await getGlobalServerSideProps(context)
    
    // Verificar se o produto e a banca existem
    const [productResponse, restaurantResponse] = await Promise.all([
      MainApi.get(`/api/v1/products/details/${productId}`),
      MainApi.get(`/api/v1/restaurants/details/${restaurantId}`)
    ])

    const product = productResponse.data
    const restaurant = restaurantResponse.data

    // Verificar se o produto pertence à banca
    if (product.restaurant_id !== restaurant.id) {
      return {
        notFound: true,
      }
    }

    // Verificar se os slugs estão corretos
    const expectedProductSlug = buildProductSlug(product)
    const expectedBancaSlug = buildBancaSlug(restaurant)

    if (produtoSlug !== expectedProductSlug || bancaSlug !== expectedBancaSlug) {
      return {
        redirect: {
          destination: `/banca/${expectedBancaSlug}/produto/${expectedProductSlug}`,
          permanent: true,
        },
      }
    }

    return {
      props: {
        ...globalProps.props,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default ProductPageSEO