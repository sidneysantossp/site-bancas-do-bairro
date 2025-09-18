import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Box, Container, Typography, Button, Grid, Card, CardMedia, CardContent, Chip, Stack, CircularProgress } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MainApi from '@/api/MainApi'
import { extractIdFromSlug } from '@/utils/slugUtils'
import CustomContainer from '@/components/container'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'

const FoodPage = ({ foodData, configData, error }) => {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [clientData, setClientData] = useState(null)
  const [clientError, setClientError] = useState(null)
  const [clientLoading, setClientLoading] = useState(false)

  const retryFetch = useCallback(async () => {
    try {
      setClientLoading(true)
      setClientError(null)
      const slug = router.query?.foodSlug
      const id = extractIdFromSlug(slug)

      if (id) {
        const resp = await MainApi.get(`/api/v1/foods/details/${id}`)
        setClientData(resp.data)
        return
      }

      setClientError(new Error('ID do produto não encontrado no slug'))
    } catch (e) {
      setClientError(e)
    } finally {
      setClientLoading(false)
    }
  }, [router.query?.foodSlug])

  // Iniciar busca imediatamente se não há dados do SSR
  useEffect(() => {
    if (router.isReady && router.query?.foodSlug) {
      if (!foodData && !clientData && !clientLoading) {
        retryFetch()
      }
    }
  }, [router.isReady, router.query?.foodSlug, foodData, clientData, clientLoading, retryFetch])

  // Detectar mudanças na rota e recarregar dados
  useEffect(() => {
    if (router.query?.foodSlug && router.isReady) {
      // Limpar dados anteriores quando a rota muda
      setClientData(null)
      setClientError(null)
      
      // Se não temos dados do SSR, buscar no cliente
      if (!foodData) {
        retryFetch()
      }
    }
  }, [router.query?.foodSlug, router.isReady, retryFetch])

  const currentFood = clientData || foodData

  // Mostrar loading enquanto busca dados no cliente
  if (clientLoading && !currentFood) {
    return (
      <CustomContainer>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh',
          p: 4 
        }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Carregando produto...
          </Typography>
        </Box>
      </CustomContainer>
    )
  }

  // Só mostrar erro se realmente não conseguiu carregar e não está tentando no cliente
  if (!currentFood && !clientLoading && (error || clientError)) {
    return (
      <CustomContainer>
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Produto não encontrado
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            {error?.message || clientError?.message || 'Não foi possível carregar os detalhes do produto.'}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              onClick={() => router.push('/')}
            >
              Voltar ao Início
            </Button>
            <Button 
              variant="outlined" 
              onClick={retryFetch} 
              disabled={clientLoading}
            >
              {clientLoading ? 'Carregando...' : 'Tentar Novamente'}
            </Button>
          </Stack>
        </Box>
      </CustomContainer>
    )
  }

  // Se não tem dados ainda, mas está tentando buscar, mostrar loading
  if (!currentFood) {
    return (
      <CustomContainer>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '50vh',
          p: 4 
        }}>
          <CircularProgress size={48} sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Carregando produto...
          </Typography>
        </Box>
      </CustomContainer>
    )
  }

  return (
    <CustomContainer>
      <CustomStackFullWidth spacing={3} sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Imagem do Produto */}
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height={isMobile ? "300" : "400"}
                image={currentFood.image_full_url || currentFood.image || '/static/food-placeholder.jpg'}
                alt={currentFood.name}
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>

          {/* Detalhes do Produto */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  {currentFood.name}
                </Typography>
                
                {currentFood.description && (
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {currentFood.description}
                  </Typography>
                )}
              </Box>

              {/* Preço */}
              <Box>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  R$ {parseFloat(currentFood.price || 0).toFixed(2)}
                </Typography>
              </Box>

              {/* Tags */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {currentFood.veg === 1 && (
                  <Chip label="Vegetariano" color="success" size="small" />
                )}
                {currentFood.non_veg === 1 && (
                  <Chip label="Não Vegetariano" color="error" size="small" />
                )}
                {currentFood.category_name && (
                  <Chip label={currentFood.category_name} variant="outlined" size="small" />
                )}
              </Stack>

              {/* Informações Adicionais */}
              <Box>
                {currentFood.available_time_starts && currentFood.available_time_ends && (
                  <Typography variant="body2" color="text.secondary">
                    Disponível: {currentFood.available_time_starts} - {currentFood.available_time_ends}
                  </Typography>
                )}
                
                {currentFood.restaurant_name && (
                  <Typography variant="body2" color="text.secondary">
                    Restaurante: {currentFood.restaurant_name}
                  </Typography>
                )}
              </Box>

              {/* Botões de Ação */}
              <Stack direction={isMobile ? "column" : "row"} spacing={2} sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  size="large"
                  fullWidth={isMobile}
                  onClick={() => {
                    // Aqui você pode adicionar lógica para adicionar ao carrinho
                    alert('Funcionalidade de adicionar ao carrinho será implementada')
                  }}
                >
                  Adicionar ao Carrinho
                </Button>
                
                <Button 
                  variant="outlined" 
                  size="large"
                  fullWidth={isMobile}
                  onClick={() => router.back()}
                >
                  Voltar
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </CustomStackFullWidth>
    </CustomContainer>
  )
}

export async function getServerSideProps(context) {
  const { foodSlug } = context.query

  // Extrair ID do slug do produto
  const foodId = extractIdFromSlug(foodSlug)

  if (!foodId) {
    // Em vez de retornar erro, retornar props vazias para o cliente tentar
    return {
      props: {
        foodData: null,
        configData: null,
        error: null, // Não mostrar erro imediatamente
      },
    }
  }

  try {
    // Buscar dados do produto usando axios direto (mais rápido que fetch)
    const axios = require('axios')
    const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const url = `${base.replace(/\/$/, '')}/api/v1/foods/details/${foodId}`
    
    const foodResponse = await axios.get(url, { 
      timeout: 5000, // 5 segundos de timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    return {
      props: {
        foodData: foodResponse.data,
        configData: null,
        error: null,
      },
    }
  } catch (error) {
    console.error('SSR falhou para produto, deixando cliente tentar:', error.message)
    
    // Em vez de mostrar erro, deixar o cliente tentar buscar
    return {
      props: {
        foodData: null,
        configData: null,
        error: null, // Não mostrar erro do SSR
      },
    }
  }
}

export default FoodPage
