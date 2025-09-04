// API mock para lista de anúncios
export default function handler(req, res) {
    const mockAdvertisements = {
        total_size: 3,
        limit: 10,
        offset: 0,
        advertisements: [
            {
                id: 1,
                title: 'Banca Premium - Destaque seu negócio',
                description: 'Apareça em primeiro lugar nas buscas e aumente suas vendas',
                image: '/static/ads/premium-ad.jpg',
                restaurant_id: null,
                add_type: 'video_promotion',
                video_attachment: null,
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                start_time: '00:00:00',
                end_time: '23:59:59',
                pause: 0,
                status: 1,
                created_at: '2024-01-01T00:00:00.000000Z',
                updated_at: '2024-01-01T00:00:00.000000Z',
                priority: 1,
                is_rating_active: 0,
                rating: null,
                review_count: 0,
                translations: [
                    {
                        id: 1,
                        translationable_type: 'App\\Models\\Advertisement',
                        translationable_id: 1,
                        locale: 'pt-br',
                        key: 'title',
                        value: 'Banca Premium - Destaque seu negócio'
                    }
                ],
                storage: [
                    {
                        id: 1,
                        data_type: 'advertisement',
                        data_id: 1,
                        key: 'image',
                        value: 'advertisement/premium-ad.jpg'
                    }
                ]
            },
            {
                id: 2,
                title: 'App Bancas do Bairro - Baixe Agora',
                description: 'Peça delivery direto pelo app e ganhe desconto na primeira compra',
                image: '/static/ads/app-download.jpg',
                restaurant_id: null,
                add_type: 'video_promotion',
                video_attachment: null,
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                start_time: '00:00:00',
                end_time: '23:59:59',
                pause: 0,
                status: 1,
                created_at: '2024-01-01T00:00:00.000000Z',
                updated_at: '2024-01-01T00:00:00.000000Z',
                priority: 2,
                is_rating_active: 0,
                rating: null,
                review_count: 0,
                translations: [
                    {
                        id: 2,
                        translationable_type: 'App\\Models\\Advertisement',
                        translationable_id: 2,
                        locale: 'pt-br',
                        key: 'title',
                        value: 'App Bancas do Bairro - Baixe Agora'
                    }
                ],
                storage: [
                    {
                        id: 2,
                        data_type: 'advertisement',
                        data_id: 2,
                        key: 'image',
                        value: 'advertisement/app-download.jpg'
                    }
                ]
            },
            {
                id: 3,
                title: 'Cadastre sua Banca',
                description: 'Seja um parceiro e venda seus produtos online',
                image: '/static/ads/register-store.jpg',
                restaurant_id: null,
                add_type: 'video_promotion',
                video_attachment: null,
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                start_time: '00:00:00',
                end_time: '23:59:59',
                pause: 0,
                status: 1,
                created_at: '2024-01-01T00:00:00.000000Z',
                updated_at: '2024-01-01T00:00:00.000000Z',
                priority: 3,
                is_rating_active: 0,
                rating: null,
                review_count: 0,
                translations: [
                    {
                        id: 3,
                        translationable_type: 'App\\Models\\Advertisement',
                        translationable_id: 3,
                        locale: 'pt-br',
                        key: 'title',
                        value: 'Cadastre sua Banca'
                    }
                ],
                storage: [
                    {
                        id: 3,
                        data_type: 'advertisement',
                        data_id: 3,
                        key: 'image',
                        value: 'advertisement/register-store.jpg'
                    }
                ]
            }
        ]
    };

    // Simular delay de rede
    setTimeout(() => {
        res.status(200).json(mockAdvertisements);
    }, 100);
}