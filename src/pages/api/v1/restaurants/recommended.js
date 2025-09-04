// API mock para restaurantes/bancas recomendadas
export default function handler(req, res) {
    const mockRecommendedRestaurants = {
        total_size: 3,
        limit: 10,
        offset: 0,
        restaurants: [
            {
                id: 1,
                name: 'Banca do João',
                slug: 'banca-do-joao',
                logo: '/static/resturants.png',
                address: 'Rua das Bancas, 123 - Centro',
                phone: '(11) 99999-9999',
                delivery_time: '30-45 min',
                minimum_order: 25.00,
                delivery_charge: 5.00,
                avg_rating: 4.5,
                rating_count: 150,
                active: 1,
                open: 1,
                recommended: 1
            },
            {
                id: 2,
                name: 'Banca da Maria',
                slug: 'banca-da-maria',
                logo: '/static/resturants.png',
                address: 'Av. Principal, 456 - Bairro Novo',
                phone: '(11) 88888-8888',
                delivery_time: '25-40 min',
                minimum_order: 20.00,
                delivery_charge: 4.00,
                avg_rating: 4.7,
                rating_count: 200,
                active: 1,
                open: 1,
                recommended: 1
            },
            {
                id: 3,
                name: 'Banca do Pedro',
                slug: 'banca-do-pedro',
                logo: '/static/resturants.png',
                address: 'Rua do Comércio, 789 - Vila Nova',
                phone: '(11) 77777-7777',
                delivery_time: '35-50 min',
                minimum_order: 30.00,
                delivery_charge: 6.00,
                avg_rating: 4.3,
                rating_count: 120,
                active: 1,
                open: 1,
                recommended: 1
            }
        ]
    };

    // Simular delay de rede
    setTimeout(() => {
        res.status(200).json(mockRecommendedRestaurants);
    }, 100);
}