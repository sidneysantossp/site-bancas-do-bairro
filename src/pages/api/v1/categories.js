// API mock para categorias
export default function handler(req, res) {
    const mockCategories = [
        {
            id: 1,
            name: 'Açaí e Vitaminas',
            image: '/static/icons/acai.svg',
            image_full_url: '/static/icons/acai.svg',
            parent_id: 0,
            position: 1,
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            priority: 1,
            module_id: 1,
            module_type: 'food',
            translations: [
                {
                    id: 1,
                    translationable_type: 'App\\Models\\Category',
                    translationable_id: 1,
                    locale: 'pt-br',
                    key: 'name',
                    value: 'Açaí e Vitaminas'
                }
            ],
            storage: [
                {
                    id: 1,
                    data_type: 'category',
                    data_id: 1,
                    key: 'image',
                    value: 'category/acai.png'
                }
            ]
        },
        {
            id: 2,
            name: 'Sanduíches',
            image: '/static/icons/sandwich.svg',
            image_full_url: '/static/icons/sandwich.svg',
            parent_id: 0,
            position: 2,
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            priority: 2,
            module_id: 1,
            module_type: 'food',
            translations: [
                {
                    id: 2,
                    translationable_type: 'App\\Models\\Category',
                    translationable_id: 2,
                    locale: 'pt-br',
                    key: 'name',
                    value: 'Sanduíches'
                }
            ],
            storage: [
                {
                    id: 2,
                    data_type: 'category',
                    data_id: 2,
                    key: 'image',
                    value: 'category/sandwich.png'
                }
            ]
        },
        {
            id: 3,
            name: 'Bebidas',
            image: '/static/icons/drinks.svg',
            image_full_url: '/static/icons/drinks.svg',
            parent_id: 0,
            position: 3,
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            priority: 3,
            module_id: 1,
            module_type: 'food',
            translations: [
                {
                    id: 3,
                    translationable_type: 'App\\Models\\Category',
                    translationable_id: 3,
                    locale: 'pt-br',
                    key: 'name',
                    value: 'Bebidas'
                }
            ],
            storage: [
                {
                    id: 3,
                    data_type: 'category',
                    data_id: 3,
                    key: 'image',
                    value: 'category/drinks.png'
                }
            ]
        },
        {
            id: 4,
            name: 'Salgados',
            image: '/static/icons/snacks.svg',
            image_full_url: '/static/icons/snacks.svg',
            parent_id: 0,
            position: 4,
            status: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            priority: 4,
            module_id: 1,
            module_type: 'food',
            translations: [
                {
                    id: 4,
                    translationable_type: 'App\\Models\\Category',
                    translationable_id: 4,
                    locale: 'pt-br',
                    key: 'name',
                    value: 'Salgados'
                }
            ],
            storage: [
                {
                    id: 4,
                    data_type: 'category',
                    data_id: 4,
                    key: 'image',
                    value: 'category/snacks.png'
                }
            ]
        }
    ];

    // Simular delay de rede
    setTimeout(() => {
        res.status(200).json({ data: mockCategories });
    }, 100);
}