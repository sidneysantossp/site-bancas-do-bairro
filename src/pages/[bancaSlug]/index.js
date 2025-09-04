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
            if (!id) throw new Error('ID de banca inválido no slug')
            const resp = await MainApi.get(`/api/v1/restaurants/details/${id}`)
            setClientData(resp.data)
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
        <RestaurantDetails 
            restaurantData={restaurantData} 
            configData={configData} 
        />
    )
}

export async function getServerSideProps(context) {
    const { bancaSlug } = context.query
    
    // Verificar cache de redirecionamento primeiro
    const cachedRedirect = getCachedRedirect(bancaSlug)
    if (cachedRedirect) {
        return {
            redirect: {
                destination: cachedRedirect,
                permanent: true,
            },
        }
    }
    
    // Extrair ID do slug da banca
    const restaurantId = extractIdFromSlug(bancaSlug)
    
    if (!restaurantId) {
        return {
            notFound: true,
        }
    }

    try {
        // Obter configurações globais primeiro (sempre funciona)
        const globalProps = await getGlobalServerSideProps(context)
        
        // Tentar buscar dados da banca com fallback
        let restaurant = null
        try {
            // SSR: usar axios direto para evitar cabeçalhos/zone automáticos do MainApi que podem causar 500
            const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost/admin-bancas-do-bairro'
            const url = `${base.replace(/\/$/, '')}/api/v1/restaurants/details/${restaurantId}`
            const restaurantResponse = await axios.get(url, { timeout: 10000 })
            restaurant = restaurantResponse.data

            // Verificar se o slug está correto e redirecionar se necessário
            const expectedBancaSlug = buildBancaSlug(restaurant)
            
            if (bancaSlug !== expectedBancaSlug) {
                // Armazenar no cache para futuras requisições
                setCachedRedirect(bancaSlug, `/${expectedBancaSlug}`)
                
                return {
                    redirect: {
                        destination: `/${expectedBancaSlug}`,
                        permanent: true, // 301 redirect
                    },
                }
            } else {
                // Slug está correto, marcar no cache como não precisando redirecionamento
                setCachedNoRedirect(bancaSlug)
            }
        } catch (apiError) {
            console.error('API indisponível, renderizando com dados limitados:', apiError)
            // Criar objeto mínimo para evitar crash
            restaurant = {
                id: restaurantId,
                name: 'Banca Temporariamente Indisponível',
                slug: bancaSlug
            }
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
        // Fallback para evitar crash total
        return {
            props: {
                configData: null,
                restaurantData: {
                    id: restaurantId,
                    name: 'Erro ao Carregar Banca',
                    slug: bancaSlug
                },
                error: { message: 'Erro interno do servidor' },
            },
        }
    }
}

export default BancaPage