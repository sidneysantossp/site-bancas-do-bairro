import { useEffect } from 'react'
import { useRouter } from 'next/router'
import MainApi from '@/api/MainApi'
import { buildProductSEOUrl } from '@/utils/slugUtils'
import { CircularProgress, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/material'

const RedirectProduto = () => {
  const router = useRouter()
  const theme = useTheme()
  const { id, slug } = router.query

  useEffect(() => {
    const redirectToSEOUrl = async () => {
      if (!id) return

      try {
        // Buscar dados do produto
        const response = await MainApi.get(`/api/v1/products/${id}`)
        const product = response.data

        if (product && product.restaurant) {
          // Gerar URL SEO-friendly
          const seoUrl = buildProductSEOUrl(product, product.restaurant)
          
          // Redirecionar com status 301 (permanente)
          router.replace(seoUrl)
        } else {
          // Se não conseguir obter dados da banca, redirecionar para URL antiga
          router.replace(`/produto/${slug || id}`)
        }
      } catch (error) {
        console.error('Erro ao buscar produto para redirecionamento:', error)
        // Em caso de erro, redirecionar para URL antiga
        router.replace(`/produto/${slug || id}`)
      }
    }

    redirectToSEOUrl()
  }, [id, slug, router])

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      gap={2}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" color="text.secondary">
        Redirecionando para a página do produto...
      </Typography>
    </Box>
  )
}

export default RedirectProduto

// Esta página não precisa de getServerSideProps pois o redirecionamento
// é feito no lado do cliente para ter acesso aos dados da API