import { useRouter } from 'next/router'
import { useEffect, useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { setGlobalSettings } from '@/redux/slices/global'
import { checkMaintenanceMode } from '@/utils/customFunctions'
import RestaurantDetails from '@/components/restaurant-details/RestaurantDetails'
import { getServerSideProps as getGlobalServerSideProps } from '@/pages/_app'
import MainApi from '@/api/MainApi'
import axios from 'axios'
import { extractIdFromSlug, buildBancaSlug } from '@/utils/slugUtils'
import { getCachedRedirect, setCachedRedirect, setCachedNoRedirect } from '@/utils/redirectCache'
import { Box } from '@mui/material'

// Utilitário local para tentar buscar restaurante por diferentes variantes do nome
async function searchRestaurantByNameVariants(base, rawSlug) {
  const trimmedBase = base.replace(/\/$/, '')
  const variants = Array.from(
    new Set([
      rawSlug,
      rawSlug?.replace(/-/g, ' '),
      decodeURIComponent(rawSlug || ''),
      decodeURIComponent(rawSlug || '').replace(/-/g, ' '),
    ].filter(Boolean))
  )

  for (const name of variants) {
    try {
      const url = `${trimmedBase}/api/v1/restaurants/get-restaurants/all?filter_data=&name=${encodeURIComponent(
        name
      )}&offset=1&limit=1&veg=0&non_veg=0&delivery=0&takeaway=0&avg_rating=0`
      const resp = await axios.get(url, { timeout: 10000 })
      const found = resp?.data?.restaurants?.[0]
      if (found?.id) return found
    } catch (e) {
      // tenta próxima variante
    }
  }
  return null
}

const BancaPage = ({ restaurantData, configData, error }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [clientData, setClientData] = useState(null)
  const [clientError, setClientError] = useState(null)
  const [clientLoading, setClientLoading] = useState(false)

  const retryFetch = useCallback(async () => {
    try {
      setClientLoading(true)
      setClientError(null)
      const slug = router.query?.bancaSlug
      const id = extractIdFromSlug(slug)

      // 1) Se já temos ID no slug, buscar detalhes direto
      if (id) {
        const resp = await MainApi.get(`/api/v1/restaurants/details/${id}`)
        setClientData(resp.data)
        // Se o slug canônico difere, ajustar rota no cliente
        const expected = buildBancaSlug(resp.data)
        if (slug !== expected) {
          router.push(`/${expected}`, undefined, { shallow: true })
        }
        return
      }

      // 2) Sem ID no slug: tentar resolver por variantes do nome
      const base = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/$/, '')
      const found = await searchRestaurantByNameVariants(base, slug)
      if (found?.id) {
        const detailsResp = await MainApi.get(`/api/v1/restaurants/details/${found.id}`)
        setClientData(detailsResp.data)
        const expected = buildBancaSlug(detailsResp.data)
        if (slug !== expected) {
          router.replace(`/${expected}`)
        }
      } else {
        throw new Error('Banca não encontrada pelo nome informado')
      }
    } catch (e) {
      setClientError(e)
    } finally {
      setClientLoading(false)
    }
  }, [router.query?.bancaSlug])

  // Se houve erro no SSR, tentar automaticamente buscar no cliente
  useEffect(() => {
    if (error && !clientData && !clientLoading) {
      retryFetch()
    }
  }, [error, clientData, clientLoading, retryFetch])

  // Detectar mudanças na rota e recarregar dados
  useEffect(() => {
    if (router.query?.bancaSlug && router.isReady) {
      // Limpar dados anteriores quando a rota muda
      setClientData(null)
      setClientError(null)
      
      // Se não temos dados do SSR ou houve erro, buscar no cliente
      if (!restaurantData || error) {
        retryFetch()
      }
    }
  }, [router.query?.bancaSlug, router.isReady, retryFetch])

  if (!restaurantData || error) {
    // Se a busca no cliente já conseguiu os dados, renderize diretamente sem banner de erro
    if (clientData) {
      return <RestaurantDetails restaurantData={clientData} configData={configData} />
    }
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <p>Não foi possível carregar os detalhes da banca.</p>
        {error && <p>Erro: {error.message || 'Erro desconhecido'}</p>}
        <Box sx={{ mt: 2 }}>
          <button onClick={retryFetch} disabled={clientLoading}>
            {clientLoading ? 'Carregando...' : 'Tentar novamente'}
          </button>
        </Box>
        {clientError && (
          <p style={{ color: 'crimson' }}>
            Falha ao tentar novamente: {clientError.message || 'Erro desconhecido'}
          </p>
        )}
      </Box>
    )
  }

  // Validação adicional dos dados do restaurante
  if (!restaurantData.id || !restaurantData.name) {
    return (
      <Box sx={{ textAlign: 'center', p: 2 }}>
        <p>Dados da banca incompletos.</p>
      </Box>
    )
  }

  const { banca_zone_id, restaurant_zone_id } = router.query
  let zoneId = undefined
  if (typeof window !== 'undefined') {
    zoneId = localStorage.getItem('zoneid')
  }

  useEffect(() => {
    dispatch(setGlobalSettings(configData))
  }, [])

  useEffect(() => {
    if (configData) {
      if (checkMaintenanceMode(configData)) {
        router.push('/maintenance')
      }
    }
  }, [configData, router])

  useEffect(() => {
    if (!zoneId) {
      const z = banca_zone_id ?? restaurant_zone_id
      if (z !== undefined && z !== null && z !== '') {
        localStorage.setItem('zoneid', JSON.stringify([Number(z)]))
      }
    }
  }, [banca_zone_id, restaurant_zone_id, zoneId])

  return (
    <RestaurantDetails restaurantData={restaurantData} configData={configData} />
  )
}

export async function getServerSideProps(context) {
  const { bancaSlug } = context.query

  // Verificar cache de redirecionamento primeiro
  const cachedRedirect = getCachedRedirect(bancaSlug)
  if (cachedRedirect) {
    return {
      redirect: { destination: cachedRedirect, permanent: true },
    }
  }

  // Extrair ID do slug da banca
  let restaurantId = extractIdFromSlug(bancaSlug)

  if (!restaurantId) {
    // Fallback: tentar resolver por variantes do nome
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const found = await searchRestaurantByNameVariants(base, bancaSlug)
      if (found?.id) {
        const expectedBancaSlug = buildBancaSlug(found)
        setCachedRedirect(bancaSlug, `/${expectedBancaSlug}`)
        return {
          redirect: { destination: `/${expectedBancaSlug}`, permanent: true },
        }
      }
    } catch (e) {
      // ignora e segue para renderização com fallback no cliente
    }

    // Em vez de retornar notFound (que mostra a página 404 e impede o fallback no cliente),
    // renderizamos a página com erro para permitir a tentativa de busca no cliente.
    try {
      const globalProps = await getGlobalServerSideProps(context)
      return {
        props: {
          ...globalProps.props,
          restaurantData: null,
          error: { message: 'Banca não encontrada pelo slug sem ID. Tentando resolver no cliente.' },
        },
      }
    } catch (e) {
      return {
        props: {
          restaurantData: null,
          configData: null,
          error: { message: 'Falha ao preparar página. Tentando resolver no cliente.' },
        },
      }
    }
  }

  try {
    // Obter configurações globais primeiro (sempre funciona)
    const globalProps = await getGlobalServerSideProps(context)

    // Tentar buscar dados da banca com fallback
    let restaurant = null
    try {
      // SSR: usar axios direto para evitar cabeçalhos/zone automáticos do MainApi que podem causar 500
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const url = `${base.replace(/\/$/, '')}/api/v1/restaurants/details/${restaurantId}`
      const restaurantResponse = await axios.get(url, { timeout: 10000 })
      restaurant = restaurantResponse.data

      // Verificar se o slug está correto e redirecionar se necessário
      const expectedBancaSlug = buildBancaSlug(restaurant)
      if (bancaSlug !== expectedBancaSlug) {
        setCachedRedirect(bancaSlug, `/${expectedBancaSlug}`)
        return { redirect: { destination: `/${expectedBancaSlug}`, permanent: true } }
      } else {
        setCachedNoRedirect(bancaSlug)
      }
    } catch (apiError) {
      console.error('API indisponível, renderizando com dados limitados:', apiError)
      restaurant = { id: restaurantId, name: 'Banca Temporariamente Indisponível', slug: bancaSlug }
    }

    return {
      props: {
        ...globalProps.props,
        restaurantData: restaurant,
        error: restaurant.name === 'Banca Temporariamente Indisponível' ? { message: 'Backend temporariamente indisponível' } : null,
      },
    }
  } catch (error) {
    console.error('Erro crítico ao processar página da banca:', error)
    return {
      props: {
        configData: null,
        restaurantData: { id: restaurantId, name: 'Erro ao Carregar Banca', slug: bancaSlug },
        error: { message: 'Erro interno do servidor' },
      },
    }
  }
}

export default BancaPage