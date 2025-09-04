import MainApi from '../../../api/MainApi'
import { useQuery } from 'react-query'

export const categoryList = async () => {
    const { data } = await MainApi.get('/api/v1/categories')
    console.log({ data })
    return data
}
export const useGetCategory = (onSuccessHandler) => {
    return useQuery('category-list', () => categoryList(), {
        onSuccess: onSuccessHandler,
    })
}
