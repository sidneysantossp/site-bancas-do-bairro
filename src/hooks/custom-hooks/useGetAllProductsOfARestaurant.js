import { ProductApis } from '../react-query/config/productsApi'
import { useQuery } from 'react-query'
import { useEffect } from 'react'

export const useGetAllProductsOfARestaurant = (id) => {
    const restaurant_id = id
    const category_id = 0
    const type = 'all'
    const offset = 1
    const page_limit = 1000
    
    const { data, refetch, isLoading, error } = useQuery(
        ['latest-food', restaurant_id, category_id, type, offset, page_limit],
        () => {
            // Verificação de segurança para restaurant_id
            if (!restaurant_id) {
                console.warn('useGetAllProductsOfARestaurant: restaurant_id is required')
                return Promise.resolve({ data: { products: [] } })
            }
            
            return ProductApis.latestFood({
                restaurant_id,
                category_id,
                type,
                offset,
                page_limit,
            })
        },
        {
            enabled: !!restaurant_id, // Só executa se restaurant_id existir
            retry: 3,
            retryDelay: 1000,
            onError: (error) => {
                console.error('Erro ao carregar produtos do restaurante:', error)
                // Tratamento silencioso de erros 500
                if (error?.response?.status === 500) {
                    console.warn('Erro 500 - servidor indisponível temporariamente')
                    // Verifica se é o erro específico do foreach PHP
                    if (error?.response?.data?.message?.includes('foreach()') || 
                        error?.response?.data?.includes('foreach()')) {
                        console.warn('Erro PHP: foreach() com valor null - backend precisa ser corrigido')
                    }
                }
            },
            staleTime: 5 * 60 * 1000, // 5 minutos
            cacheTime: 10 * 60 * 1000, // 10 minutos
        }
    )
    
    const handleApiCall = async () => {
        try {
            await refetch()
        } catch (error) {
            console.error('Erro ao refetch produtos:', error)
        }
    }
    
    useEffect(() => {
        if (restaurant_id) {
            handleApiCall()
        }
    }, [restaurant_id])

    // Verificações de segurança para dados nulos
    if (error) {
        console.warn('Erro no hook useGetAllProductsOfARestaurant:', error)
        return []
    }
    
    if (!data?.data) {
        return []
    }
    
    return data?.data?.products || []
}
