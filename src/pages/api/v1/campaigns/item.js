// API mock para campanhas
export default function handler(req, res) {
    const mockCampaigns = {
        total_size: 2,
        limit: 10,
        offset: 0,
        campaigns: [
            {
                id: 1,
                title: 'Semana do Açaí',
                description: 'Todos os açaís com 25% de desconto durante toda a semana',
                image: '/static/campaigns/acai-week.jpg',
                start_date: '2024-01-15',
                end_date: '2024-01-21',
                start_time: '00:00:00',
                end_time: '23:59:59',
                status: 1,
                admin_id: 1,
                restaurant_id: null,
                category_id: 1,
                product_id: null,
                discount_type: 'percent',
                discount_amount: 25.00,
                min_purchase: 15.00,
                max_discount: 10.00,
                limit: 100,
                created_at: '2024-01-01T00:00:00.000000Z',
                updated_at: '2024-01-01T00:00:00.000000Z',
                translations: [
                    {
                        id: 1,
                        translationable_type: 'App\\Models\\Campaign',
                        translationable_id: 1,
                        locale: 'pt-br',
                        key: 'title',
                        value: 'Semana do Açaí'
                    },
                    {
                        id: 2,
                        translationable_type: 'App\\Models\\Campaign',
                        translationable_id: 1,
                        locale: 'pt-br',
                        key: 'description',
                        value: 'Todos os açaís com 25% de desconto durante toda a semana'
                    }
                ],
                storage: [
                    {
                        id: 1,
                        data_type: 'campaign',
                        data_id: 1,
                        key: 'image',
                        value: 'campaign/acai-week.jpg'
                    }
                ],
                restaurants: [
                    {
                        id: 1,
                        name: 'Banca do João',
                        slug: 'banca-do-joao'
                    },
                    {
                        id: 3,
                        name: 'Banca do Pedro',
                        slug: 'banca-do-pedro'
                    }
                ]
            },
            {
                id: 2,
                title: 'Frete Grátis Fim de Semana',
                description: 'Delivery gratuito para pedidos acima de R$ 25 aos sábados e domingos',
                image: '/static/campaigns/free-weekend.jpg',
                start_date: '2024-01-01',
                end_date: '2024-12-31',
                start_time: '00:00:00',
                end_time: '23:59:59',
                status: 1,
                admin_id: 1,
                restaurant_id: null,
                category_id: null,
                product_id: null,
                discount_type: 'free_delivery',
                discount_amount: 0.00,
                min_purchase: 25.00,
                max_discount: 15.00,
                limit: null,
                created_at: '2024-01-01T00:00:00.000000Z',
                updated_at: '2024-01-01T00:00:00.000000Z',
                translations: [
                    {
                        id: 3,
                        translationable_type: 'App\\Models\\Campaign',
                        translationable_id: 2,
                        locale: 'pt-br',
                        key: 'title',
                        value: 'Frete Grátis Fim de Semana'
                    },
                    {
                        id: 4,
                        translationable_type: 'App\\Models\\Campaign',
                        translationable_id: 2,
                        locale: 'pt-br',
                        key: 'description',
                        value: 'Delivery gratuito para pedidos acima de R$ 25 aos sábados e domingos'
                    }
                ],
                storage: [
                    {
                        id: 2,
                        data_type: 'campaign',
                        data_id: 2,
                        key: 'image',
                        value: 'campaign/free-weekend.jpg'
                    }
                ],
                restaurants: [
                    {
                        id: 1,
                        name: 'Banca do João',
                        slug: 'banca-do-joao'
                    },
                    {
                        id: 2,
                        name: 'Banca da Maria',
                        slug: 'banca-da-maria'
                    },
                    {
                        id: 3,
                        name: 'Banca do Pedro',
                        slug: 'banca-do-pedro'
                    }
                ]
            }
        ]
    };

    // Simular delay de rede
    setTimeout(() => {
        res.status(200).json(mockCampaigns);
    }, 100);
}