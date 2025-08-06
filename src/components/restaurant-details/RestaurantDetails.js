import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack } from '@mui/material'
import TopBanner from './HeadingBannerSection/TopBanner'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CustomContainer from '../container'
import RestaurantCategoryBar from './RestaurantCategoryBar'
import { useGetAllProductsOfARestaurant } from '@/hooks/custom-hooks/useGetAllProductsOfARestaurant'
import { useGetAllCategories } from '@/hooks/custom-hooks/useGetAllCategories'
import CategoriesWiseFood from './CategoriesWiseFood'
import { isAvailable, restaurantDiscountTag } from '@/utils/customFunctions'
import RestaurentDetailsShimmer from './RestaurantShimmer/RestaurentDetailsShimmer'
import { useGetRecommendProducts } from '@/hooks/react-query/config/useGetRecommendProduct'
import { debounce } from 'lodash'
import CustomSearch from '../custom-search/CustomSearch'
import { useTranslation } from 'react-i18next'
import { useRestaurentFoodSearch } from '@/hooks/custom-hooks/useRestaurentFoodSearch'
import { usePopularFoods } from '@/hooks/react-query/restaurants/usePopularFoods'
import { useInView } from 'react-intersection-observer'
import FloatingDiscountTag from '@/components/restaurant-details/FloatingDiscountTag'

const getCombinedCategoriesAndProducts = (
    all_categories,
    all_products,
    recommendProducts,
    t
    // popularProducts
) => {
    // Verificações de segurança
    if (!Array.isArray(all_categories)) {
        console.warn('getCombinedCategoriesAndProducts: all_categories não é um array')
        return []
    }
    
    if (!Array.isArray(all_products)) {
        console.warn('getCombinedCategoriesAndProducts: all_products não é um array')
        return []
    }
    
    const allCategories = all_categories
    const allProducts = all_products



    if (allCategories?.length > 0 && allProducts?.length > 0) {
        const data = allCategories?.map((item) => {
            if (!item) {
                console.warn('Item de categoria inválido:', item)
                return { products: [] }
            }
            
            const categoryItems = allProducts?.filter(
                (product) => {
                    // Verificação de segurança para product e category_ids
                    if (!product || !product.category_ids || !Array.isArray(product.category_ids) || product.category_ids.length === 0) {
                        return false
                    }
                    return product?.category_ids[0]?.id == item?.id
                }
            )
            
            if (categoryItems && categoryItems.length > 0) {
                return {
                    ...item,
                    products: categoryItems,
                }
            } else {
                return {
                    ...item,
                    products: [],
                }
            }
        })
        
        // Filtra itens válidos
        const validData = data.filter(item => item !== null && item !== undefined)

        if (recommendProducts?.products?.length > 0) {
            const recommend = {
                id: 1233,
                name: t('Recommend Products'),
                products: recommendProducts?.products || [],
                isBgColor: true,
            }
            return [recommend, ...validData]
        } else {
            return validData
        }
    } else {
        console.info('Nenhuma categoria ou produto encontrado para combinar')
        return []
    }
}

const RestaurantDetails = ({ restaurantData, configData }) => {
    const { t } = useTranslation()
    const [data, setData] = useState([])
    const [allFoods, setAllFoods] = useState([])
    const [page_limit, setPageLimit] = useState(50)
    const [offset, SetOffSet] = useState(1)
    const [selectedId, setSelectedId] = useState(null)
    const [isFirstRender, setIsFirstRender] = useState(true)
    const [showComponent, setShowComponent] = useState(true)
    const [checkFilter, setCheckFilter] = useState(false)
    const [filterKey, setFilterKey] = useState({})
    const [searchKey, setSearchKey] = useState('')
    const restaurantId = restaurantData?.id
    const allProducts = useGetAllProductsOfARestaurant(restaurantId)
    const allCategories = useGetAllCategories()
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const refs = useRef([])
    const restaurantCategoryIds = restaurantData?.category_ids
    const { ref, inView } = useInView()
    const handleOnSuccess = (res) => {
        setAllFoods(res?.data?.products)
    }

    const searchFood = useRestaurentFoodSearch(
        restaurantId,
        searchKey,
        handleOnSuccess
    )
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowComponent(false)
        }, 15000)
        return () => clearTimeout(timer)
    }, [])
    useEffect(() => {
        if (searchKey === '') {
            // Verificação de segurança para allProducts
            if (Array.isArray(allProducts)) {
                setAllFoods(allProducts)
            } else {
                console.warn('allProducts não é um array válido:', allProducts)
                setAllFoods([])
            }
        }
    }, [allProducts, searchKey])

    const clickedOnCategoryRef = useRef(false)

    ///RECOMMEND PRODUCTS API
    const {
        data: recommendProducts,
        refetch: refetchRecommend,
        isRefetching,
        isLoading,
    } = useGetRecommendProducts({ restaurantId, page_limit, offset, searchKey })
    const { data: popularProducts, refetch: refetchPopular } = usePopularFoods({
        restaurantId,
        page_limit,
        offset,
        searchKey,
    })
    useEffect(() => {
        if (restaurantId) {
            refetchRecommend()
            refetchPopular()
        }
    }, [restaurantId, searchKey])
    useEffect(() => {
        setSearchKey('')
        setSelectedId(null)
    }, [restaurantId])

    useEffect(() => {
        // Verificações de segurança antes de combinar dados
        if (!Array.isArray(allCategories)) {
            console.warn('allCategories não é um array válido:', allCategories)
            return
        }
        
        if (!Array.isArray(allFoods)) {
            console.warn('allFoods não é um array válido:', allFoods)
            return
        }
        
        let combined = getCombinedCategoriesAndProducts(
            allCategories,
            allFoods,
            recommendProducts,
            t
        )

        if (recommendProducts?.products?.length > 0) {
            const recommend = {
                id: 1233,
                name: t('Recommend Products'),
                products: recommendProducts?.products || [],
                isBgColor: true,
            }
            combined = [recommend, ...combined]
        }

        if (Array.isArray(combined)) {
            const hasProducts = combined?.filter(
                (item) => item?.products?.length > 0
            )
            setData(hasProducts || [])
        } else {
            console.warn('combined data não é um array válido:', combined)
            setData([])
        }
        
        setIsFirstRender(false)
    }, [allFoods, allCategories, recommendProducts])

    const handleFocusedSection = debounce((val) => {
        setSelectedId(val?.id)
        if (!isFirstRender) {
            if (!clickedOnCategoryRef.current) {
                setSelectedId(val?.id)
            }
            clickedOnCategoryRef.current = false
        }
    }, 300)
    const handleClick = (val) => {
        //setClickedCategory(val)
        setSelectedId(val)

        clickedOnCategoryRef.current = true
        // setClickedOnCategory(true)
    }

    useEffect(() => {
        if (refs.current.length > 0) {
            if (selectedId) {
                refs.current[selectedId]?.scrollIntoView({
                    behavior: 'smooth',
                })
            }
        }
    }, [selectedId])

    const handleFilter = () => {
        setCheckFilter((prevState) => !prevState)
    }

    useEffect(() => {
        handleFilteredData()
    }, [checkFilter])

    const handleFilteredData = () => {
        const combined = getCombinedCategoriesAndProducts(
            allCategories,
            allFoods,
            restaurantCategoryIds,
            recommendProducts,
            t
            // popularProducts
        )

        const filterData = combined?.map((item) => {
            return {
                ...item,
                products: item?.products?.filter((foods) => {
                    const isDiscountMatch = filterKey?.discount
                        ? foods?.discount > 0
                        : true
                    const isNonVegMatch = filterKey?.nonVeg
                        ? foods?.veg === 0
                        : true
                    const isVegMatch = filterKey?.veg ? foods?.veg === 1 : true
                    const isAvailableMatch = filterKey?.currentlyAvailable
                        ? isAvailable(
                              foods?.available_time_starts,
                              foods?.available_time_ends
                          )
                        : true

                    return (
                        isDiscountMatch &&
                        isNonVegMatch &&
                        isVegMatch &&
                        isAvailableMatch
                    )
                }),
            }
        })

        const hasProducts = filterData?.filter(
            (item) => item?.products?.length > 0
        )
        setData(hasProducts)
    }

    const handleSearchResult = async (values) => {
        if (values === '') {
            setSearchKey('')
            //setIsSearch('')
        } else {
            setSearchKey(values)
            //  setIsSearch('search')
        }
    }
    const restaurantDiscount = restaurantDiscountTag(
        restaurantData?.discount,
        restaurantData?.free_delivery
    )

    return (
        <CustomContainer sx={{ mb: { xs: '7px', md: '0' } }}>
            <CustomStackFullWidth
                pb={isSmall ? '1rem' : '3rem'}
                paddingTop={{ xs: '10px', md: '70px' }}
            >
                {restaurantData && <TopBanner details={restaurantData} />}
                <CustomStackFullWidth>
                    {!isFirstRender && (
                        <>
                            <RestaurantCategoryBar
                                handleFilter={handleFilter}
                                filterKey={filterKey}
                                setFilterKey={setFilterKey}
                                data={data}
                                selectedId={selectedId}
                                handleClick={handleClick}
                                isSmall={isSmall}
                                handleSearchResult={handleSearchResult}
                                searchKey={searchKey}
                            />
                            {!isSmall && (
                                <Stack
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.neutral[1800],
                                        position: 'sticky',
                                        zIndex: 998,
                                        maxWidth: '100%',
                                        width: '50%',
                                        alignSelf: 'flex-end',
                                        marginTop: '1.4rem',
                                        top: {
                                            xs: '199px',
                                            sm: '270px',
                                            md: '233px',
                                        },
                                    }}
                                >
                                    <CustomSearch
                                        //key={reRenderSearch}
                                        handleSearchResult={handleSearchResult}
                                        label={t('Search foods')}
                                        //isLoading={isLoadingSearchFood}
                                        searchFrom="restaurantDetails"
                                        selectedValue={searchKey}
                                        backgroundColor={
                                            theme.palette.neutral[200]
                                        }
                                        borderRadius="10px"
                                    />
                                </Stack>
                            )}
                            {data?.map((item, index) => {
                                return (
                                    <Box
                                        sx={{ position: 'relative' }}
                                        key={index}
                                    >
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '-340px',
                                            }}
                                            ref={(el) =>
                                                (refs.current[item?.id] = el)
                                            }
                                        />
                                        <CategoriesWiseFood
                                            disRef={ref}
                                            data={item}
                                            handleFocusedSection={
                                                handleFocusedSection
                                            }
                                            indexNumber={index}
                                            restaurantDiscount={
                                                restaurantDiscount
                                            }
                                            hasFreeDelivery={
                                                restaurantData?.free_delivery
                                            }
                                        />
                                    </Box>
                                )
                            })}
                            {data?.length === 0 && (
                                <>
                                    {showComponent ? (
                                        <RestaurentDetailsShimmer
                                            showComponent={showComponent}
                                        />
                                    ) : (
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: '300px',
                                                textAlign: 'center',
                                                padding: '2rem',
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    fontSize: '4rem',
                                                    marginBottom: '1rem',
                                                    opacity: 0.5,
                                                }}
                                            >
                                                🍽️
                                            </Box>
                                            <Box
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem',
                                                    color: theme.palette.text.primary,
                                                }}
                                            >
                                                Nenhum produto encontrado
                                            </Box>
                                            <Box
                                                sx={{
                                                    fontSize: '0.9rem',
                                                    color: theme.palette.text.secondary,
                                                    marginBottom: '1.5rem',
                                                }}
                                            >
                                                Este restaurante ainda não possui produtos cadastrados ou há um problema temporário no servidor.
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    gap: '1rem',
                                                    flexDirection: { xs: 'column', sm: 'row' },
                                                }}
                                            >
                                                <Box
                                                    component="button"
                                                    onClick={() => {
                                                        console.log('Tentando recarregar produtos...')
                                                        // Força um refetch dos dados
                                                        if (typeof allProducts?.refetch === 'function') {
                                                            allProducts.refetch()
                                                        }
                                                        // Recarrega a página como fallback
                                                        setTimeout(() => {
                                                            window.location.reload()
                                                        }, 2000)
                                                    }}
                                                    sx={{
                                                        backgroundColor: theme.palette.primary.main,
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '0.75rem 1.5rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        fontWeight: 'bold',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.primary.dark,
                                                        },
                                                    }}
                                                >
                                                    🔄 Tentar Novamente
                                                </Box>
                                                <Box
                                                    component="button"
                                                    onClick={() => {
                                                        window.history.back()
                                                    }}
                                                    sx={{
                                                        backgroundColor: 'transparent',
                                                        color: theme.palette.text.secondary,
                                                        border: `1px solid ${theme.palette.divider}`,
                                                        borderRadius: '8px',
                                                        padding: '0.75rem 1.5rem',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        '&:hover': {
                                                            backgroundColor: theme.palette.action.hover,
                                                        },
                                                    }}
                                                >
                                                    ← Voltar
                                                </Box>
                                            </Box>
                                        </Box>
                                    )}
                                </>
                            )}
                        </>
                    )}
                    {!inView && restaurantDiscount && (
                        <FloatingDiscountTag
                            resDiscount={restaurantData?.discount}
                            freeDelivery={restaurantData?.free_delivery}
                            restaurantDiscount={restaurantDiscount}
                        />
                    )}
                </CustomStackFullWidth>
            </CustomStackFullWidth>
        </CustomContainer>
    )
}

export default RestaurantDetails
