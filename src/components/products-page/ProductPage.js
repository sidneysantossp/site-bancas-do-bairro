import { Grid, Box, Typography, Button, Stack } from '@mui/material'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { ProductsApi } from '@/hooks/react-query/config/productsApi'
import { useTranslation } from 'react-i18next'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { noFoodFoundImage } from '@/utils/LocalImages'
import { networkLimit } from '@/utils/someVariables'
import CustomShimmerForBestFood from '../CustomShimmer/CustomShimmerForBestFood'
import CustomEmptyResult from '../empty-view/CustomEmptyResult'
import GroupButtons from '../restaurant-details/foodSection/GroupButtons'
import ProductList from './ProductList'
import FoodDetailModal from '@/components/foodDetail-modal/FoodDetailModal'
import MainApi from '@/api/MainApi'

const ProductPage = ({ product_type, product, configData, restaurantData }) => {
    const { t } = useTranslation()
    const [page_limit, setPageLimit] = useState(networkLimit)
    const [offset, setOffset] = useState(1)
    const [type, setType] = useState('all')

    // Detail mode: if a `product` object is provided, render product details and skip list fetching.
    if (product) {
        const currencySymbol = configData?.currency_symbol || 'R$'
        const currencySymbolDirection = 'ltr'
        const digitAfterDecimalPoint = Number(configData?.digit_after_decimal_point ?? 2)
        const [open, setOpen] = useState(false)

        // Se vier um produto incompleto do SSR (fallback), buscamos os detalhes completos no cliente
        const needsDetails = !product?.price || !product?.image_full_url || !product?.description
        const { data: fullData } = useQuery(
            ['product-details', product?.id],
            () => MainApi.get(`/api/v1/products/details/${product.id}`),
            { enabled: Boolean(product?.id && needsDetails), retry: 1 }
        )

        const hydrated = fullData?.data || product
        const imageUrl = hydrated?.image_full_url || hydrated?.image || hydrated?.image_url
        const price = hydrated?.price
        const restaurantName = restaurantData?.name

        return (
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={8}>
                    <CustomStackFullWidth spacing={2}>
                        <Typography variant="h5" component="h1" sx={{ m: 0 }}>
                            {hydrated?.name || 'Produto'}
                        </Typography>
                        {restaurantName && (
                            <Typography variant="subtitle2" color="text.secondary">
                                {restaurantName}
                            </Typography>
                        )}
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            {imageUrl && (
                                <Box sx={{ width: 240, height: 240, borderRadius: 2, overflow: 'hidden', bgcolor: '#fafafa', border: '1px solid #eee' }}>
                                    <img src={imageUrl} alt={hydrated?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Box>
                            )}
                            <Stack spacing={1}>
                                {typeof price !== 'undefined' && (
                                    <Typography variant="h6" color="primary">
                                        {currencySymbolDirection === 'rtl'
                                            ? `${Number(price).toFixed(digitAfterDecimalPoint)} ${currencySymbol}`
                                            : `${currencySymbol} ${Number(price).toFixed(digitAfterDecimalPoint)}`}
                                    </Typography>
                                )}
                                {hydrated?.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 520 }}>
                                        {hydrated.description}
                                    </Typography>
                                )}
                                <Stack direction="row" spacing={1}>
                                    <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                                        Adicionar ao Carrinho
                                    </Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </CustomStackFullWidth>
                </Grid>
                <FoodDetailModal
                    product={hydrated}
                    open={open}
                    setOpen={setOpen}
                    handleModalClose={() => setOpen(false)}
                    currencySymbolDirection={currencySymbolDirection}
                    currencySymbol={currencySymbol}
                    digitAfterDecimalPoint={digitAfterDecimalPoint}
                />
            </Grid>
        )
    }

    // If no product_type is provided (and no product), do not attempt to fetch.
    if (!product_type) return null

    // Fetch products based on page params
    const { isLoading, isError, error, data } = useQuery(
        ['products', product_type, offset, page_limit, type],
        () => ProductsApi.products(product_type, offset, page_limit, type),
        { retry: 1, enabled: Boolean(product_type) }
    )

    if (isError) {
        return (
            <h1>{error?.message || 'Erro ao carregar página de produtos'}</h1>
        )
    }
    if (isLoading) {
        return <CustomShimmerForBestFood />
    }
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} align="center">
                    <CustomStackFullWidth
                        alignItems="center"
                        justifyContent="center"
                    >
                        <GroupButtons setType={setType} type={type} />
                    </CustomStackFullWidth>
                </Grid>
                <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    container
                    spacing={{ xs: 2, sm: 2, md: 3 }}
                >
                    {data?.data?.products.length === 0 && (
                        <CustomEmptyResult
                            image={noFoodFoundImage}
                            label={t('No Food Found') === 'No Food Found' ? 'Nenhum produto encontrado!' : t('No Food Found')}
                        />
                    )}
                    {data?.data ? (
                        <>
                            <ProductList
                                product_list={data?.data}
                                page_limit={page_limit}
                                offset={offset}
                                setOffset={setOffset}
                            />
                        </>
                    ) : (
                        <CustomShimmerForBestFood />
                    )}
                </Grid>
            </Grid>
        </>
    )
}

export default ProductPage
