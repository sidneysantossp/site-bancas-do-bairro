import React, { useEffect } from 'react'
import { Box } from '@mui/material'
import RestaurantDetails from '../../../components/restaurant-details/RestaurantDetails'
import Meta from '../../../components/Meta'
import MainApi from '../../../api/MainApi'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setGlobalSettings } from '@/redux/slices/global'
import { checkMaintenanceMode } from '@/utils/customFunctions'

const index = ({ restaurantData, configData, error }) => {
    if (!restaurantData || error) {
        return (
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <p>Não foi possível carregar os detalhes da banca.</p>
                {error && <p>Erro: {error.message || 'Erro desconhecido'}</p>}
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
    const router = useRouter()
    const dispatch = useDispatch()

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
    }, [banca_zone_id, restaurant_zone_id])

    return (
        <>
            <Meta
                title={`${
                    restaurantData?.meta_title ?? restaurantData.name
                } - ${configData?.business_name}`}
                ogImage={`${configData?.base_urls?.restaurant_image_url}/${restaurantData?.meta_image}`}
                description={restaurantData?.meta_description}
            />
            <RestaurantDetails restaurantData={restaurantData} />
        </>
    )
}

export default index
export const getServerSideProps = async (context) => {
    const { id } = context.query
    const { req } = context
    const language = req.cookies.languageSetting || 'pt-br'
    
    console.log('Tentando carregar restaurante:', id)
    
    try {
        // Tentar buscar dados do restaurante
        let restaurantData = null
        let configData = null
        
        try {
            const data = await MainApi.get(`/api/v1/restaurants/details/${id}`)
            restaurantData = data.data
            console.log('Dados do restaurante carregados:', restaurantData?.name)
        } catch (restaurantError) {
            console.error('Erro ao buscar dados do restaurante:', restaurantError.message)
        }
        
        try {
            const configRes = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
                {
                    method: 'GET',
                    headers: {
                        'X-software-id': 33571750,
                        'X-localization': language,
                        
                    },
                }
            )
            
            if (configRes.ok) {
                configData = await configRes.json()
                console.log('Config carregado com sucesso')
            } else {
                console.error('Erro na resposta da config:', configRes.status)
            }
        } catch (configError) {
            console.error('Erro ao buscar config:', configError.message)
        }
        
        return {
            props: {
                restaurantData: restaurantData || null,
                configData: configData || null,
                error: null
            },
        }
    } catch (error) {
        console.error('Erro geral no getServerSideProps:', error)
        return {
            props: {
                restaurantData: null,
                configData: null,
                error: {
                    message: error.message || 'Erro desconhecido',
                    status: error.status || 500
                }
            },
        }
    }
}
