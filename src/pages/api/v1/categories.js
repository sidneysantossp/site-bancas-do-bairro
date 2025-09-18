// API que busca categorias do backend de produção
export default async function handler(req, res) {
    const backendUrl = 'https://admin.guiadasbancas.com.br'
    
    try {
        console.log('Buscando categorias do backend de produção...')
        
        const response = await fetch(`${backendUrl}/api/v1/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'NextJS-API/1.0',
                'zoneId': JSON.stringify([1]),
                'zone-id': JSON.stringify([1]),
                'zone_id': JSON.stringify([1]),
                'X-software-id': '33571750',
            },
        })

        if (!response.ok) {
            console.error('Erro ao buscar categorias:', response.status, response.statusText)
            // Fallback para dados mock em caso de erro
            return res.status(200).json({ data: getMockCategories() })
        }

        const data = await response.json()
        console.log('Categorias obtidas com sucesso:', data?.length || 'N/A')
        
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro na requisição de categorias:', error.message)
        // Fallback para dados mock em caso de erro
        res.status(200).json({ data: getMockCategories() })
    }
}

// Dados mock como fallback
function getMockCategories() {
    return [
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
    ]
}