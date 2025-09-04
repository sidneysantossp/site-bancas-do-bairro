// API mock para banners
export default function handler(req, res) {
    const mockBanners = [
        {
            id: 1,
            title: 'Promoção Açaí',
            type: 'promotional',
            image: '/static/banners/acai-promo.jpg',
            data: {
                restaurant_id: 1,
                category_id: 1,
                product_id: null
            },
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            translations: [
                {
                    id: 1,
                    translationable_type: 'App\\Models\\Banner',
                    translationable_id: 1,
                    locale: 'pt-br',
                    key: 'title',
                    value: 'Promoção Açaí - 20% OFF'
                }
            ],
            storage: [
                {
                    id: 1,
                    data_type: 'banner',
                    data_id: 1,
                    key: 'image',
                    value: 'banner/acai-promo.jpg'
                }
            ]
        },
        {
            id: 2,
            title: 'Novos Sanduíches',
            type: 'promotional',
            image: '/static/banners/sandwich-new.jpg',
            data: {
                restaurant_id: 2,
                category_id: 2,
                product_id: null
            },
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            translations: [
                {
                    id: 2,
                    translationable_type: 'App\\Models\\Banner',
                    translationable_id: 2,
                    locale: 'pt-br',
                    key: 'title',
                    value: 'Novos Sanduíches Artesanais'
                }
            ],
            storage: [
                {
                    id: 2,
                    data_type: 'banner',
                    data_id: 2,
                    key: 'image',
                    value: 'banner/sandwich-new.jpg'
                }
            ]
        },
        {
            id: 3,
            title: 'Delivery Grátis',
            type: 'promotional',
            image: '/static/banners/free-delivery.jpg',
            data: {
                restaurant_id: null,
                category_id: null,
                product_id: null
            },
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            translations: [
                {
                    id: 3,
                    translationable_type: 'App\\Models\\Banner',
                    translationable_id: 3,
                    locale: 'pt-br',
                    key: 'title',
                    value: 'Delivery Grátis - Pedidos acima de R$ 30'
                }
            ],
            storage: [
                {
                    id: 3,
                    data_type: 'banner',
                    data_id: 3,
                    key: 'image',
                    value: 'banner/free-delivery.jpg'
                }
            ]
        }
    ];

    // Simular delay de rede
    setTimeout(() => {
        res.status(200).json(mockBanners);
    }, 100);
}