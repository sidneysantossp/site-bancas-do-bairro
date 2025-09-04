// API mock para detalhes de restaurantes/bancas
export default function handler(req, res) {
    const { id } = req.query
    
    // Dados mock de uma banca
    const mockRestaurant = {
        id: parseInt(id),
        name: `Banca do João ${id}`,
        slug: `banca-do-joao-${id}`,
        logo: '/static/resturants.png',
        logo_full_url: '/static/resturants.png',
        address: 'Rua das Bancas, 123 - Centro',
        phone: '(11) 99999-9999',
        email: 'contato@bancadojoao.com',
        latitude: -23.5505,
        longitude: -46.6333,
        delivery_time: '30-45 min',
        minimum_order: 25.00,
        delivery_charge: 5.00,
        avg_rating: 4.5,
        rating_count: 150,
        active: 1,
        open: 1,
        cuisine: [
            { id: 1, name: 'Brasileira' },
            { id: 2, name: 'Lanches' }
        ],
        schedules: [
            {
                day: 0, // Domingo
                opening_time: '08:00:00',
                closing_time: '22:00:00'
            },
            {
                day: 1, // Segunda
                opening_time: '08:00:00',
                closing_time: '22:00:00'
            },
            {
                day: 2, // Terça
                opening_time: '08:00:00',
                closing_time: '22:00:00'
            },
            {
                day: 3, // Quarta
                opening_time: '08:00:00',
                closing_time: '22:00:00'
            },
            {
                day: 4, // Quinta
                opening_time: '08:00:00',
                closing_time: '22:00:00'
            },
            {
                day: 5, // Sexta
                opening_time: '08:00:00',
                closing_time: '23:00:00'
            },
            {
                day: 6, // Sábado
                opening_time: '08:00:00',
                closing_time: '23:00:00'
            }
        ],
        foods: [
            {
                id: 1,
                name: 'Pão de Açúcar',
                price: 8.50,
                description: 'Pão de açúcar tradicional da casa',
                image: '/static/food.png',
                category_id: 1,
                available_time_starts: '08:00:00',
                available_time_ends: '22:00:00'
            },
            {
                id: 2,
                name: 'Café com Leite',
                price: 4.50,
                description: 'Café fresquinho com leite cremoso',
                image: '/static/food.png',
                category_id: 2,
                available_time_starts: '08:00:00',
                available_time_ends: '22:00:00'
            }
        ],
        categories: [
            {
                id: 1,
                name: 'Pães e Doces',
                status: 1
            },
            {
                id: 2,
                name: 'Bebidas',
                status: 1
            }
        ]
    }
    
    // Simular diferentes bancas baseado no ID
    if (id === '2') {
        mockRestaurant.name = 'Banca da Maria 2'
        mockRestaurant.slug = 'banca-da-maria-2'
    } else if (id === '3') {
        mockRestaurant.name = 'Banca do Pedro 3'
        mockRestaurant.slug = 'banca-do-pedro-3'
    }
    
    res.status(200).json(mockRestaurant)
}