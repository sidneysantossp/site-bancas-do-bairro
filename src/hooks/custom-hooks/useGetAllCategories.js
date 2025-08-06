import { useQuery } from 'react-query'
import { CategoryApi } from '../react-query/config/categoryApi'
import { onErrorResponse } from '@/components/ErrorResponse'
import { useEffect } from 'react'

export const useGetAllCategories = (searchKey) => {
    const { data, refetch, error, isLoading } = useQuery(
        ['category', searchKey],
        () => CategoryApi.categories(searchKey),
        {
            retry: 3,
            retryDelay: 1000,
            onError: (error) => {
                console.error('Erro ao carregar categorias:', error)
                // Tratamento silencioso de erros 500
                if (error?.response?.status === 500) {
                    console.warn('Erro 500 - servidor indisponível temporariamente')
                } else {
                    onErrorResponse(error)
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
            console.error('Erro ao refetch categorias:', error)
        }
    }
    
    useEffect(() => {
        handleApiCall()
    }, [])
    
    // Verificações de segurança
    if (error) {
        console.warn('Erro no hook useGetAllCategories:', error)
        return []
    }
    
    if (!data?.data) {
        return []
    }
    
    return Array.isArray(data?.data) ? data.data : []
}
