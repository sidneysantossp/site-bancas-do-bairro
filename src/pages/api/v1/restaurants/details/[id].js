// API mock para detalhes de restaurantes/bancas
export default function handler(req, res) {
    const { id } = req.query
    
    // Base de dados das bancas (correspondente à listagem)
    const bancasData = {
        1: {
            id: 1,
            name: 'Banca do Povo',
            slug: 'banca-do-povo',
            logo: '/static/restaurants/banca-povo-logo.jpg',
            logo_full_url: '/static/restaurants/banca-povo-logo.jpg',
            cover_photo: '/static/restaurants/banca-povo-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-povo-cover.jpg',
            address: 'Rua das Palmeiras, 123 - Vila Madalena, São Paulo - SP',
            phone: '(67) 99999-1111',
            email: 'contato@bancadopovo.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '30-45',
            minimum_order: 15.00,
            delivery_charge: 3.00,
            avg_rating: 4.8,
            rating_count: 89,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 1,
            non_veg: 0,
            free_delivery: true,
            take_away: true,
            delivery: true,
            featured: 1,
            announcement: 1,
            announcement_message: 'Promoção especial: 20% off em açaís!',
            meta_title: 'Banca do Povo - Açaí e Vitaminas',
            meta_description: 'Os melhores açaís e vitaminas da região'
        },
        2: {
            id: 2,
            name: 'Banca Princesa Ló',
            slug: 'banca-princesa-lo',
            logo: '/static/restaurants/banca-princesa-logo.jpg',
            logo_full_url: '/static/restaurants/banca-princesa-logo.jpg',
            cover_photo: '/static/restaurants/banca-princesa-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-princesa-cover.jpg',
            address: 'Av. Afonso Pena, 456 - Centro, Campo Grande - MS',
            phone: '(67) 99999-2222',
            email: 'contato@bancaprincesalo.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '25-40',
            minimum_order: 20.00,
            delivery_charge: 5.00,
            avg_rating: 4.6,
            rating_count: 127,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 0,
            non_veg: 1,
            free_delivery: false,
            take_away: true,
            delivery: true,
            featured: 1,
            announcement: 1,
            announcement_message: 'Novo: Sanduíche vegano disponível!',
            meta_title: 'Banca Princesa Ló - Sanduíches Artesanais',
            meta_description: 'Sanduíches artesanais frescos e saborosos'
        },
        3: {
            id: 3,
            name: 'Banca 24 de Maio',
            slug: 'banca-24-de-maio',
            logo: '/static/restaurants/banca-24maio-logo.jpg',
            logo_full_url: '/static/restaurants/banca-24maio-logo.jpg',
            cover_photo: '/static/restaurants/banca-24maio-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-24maio-cover.jpg',
            address: 'Rua 24 de Maio, 789 - Amambaí, Campo Grande - MS',
            phone: '(67) 99999-3333',
            email: 'contato@banca24maio.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '15-25',
            minimum_order: 12.00,
            delivery_charge: 0.00,
            avg_rating: 4.3,
            rating_count: 64,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 1,
            non_veg: 0,
            free_delivery: true,
            take_away: true,
            delivery: true,
            featured: 0,
            announcement: 0,
            announcement_message: null,
            meta_title: 'Banca 24 de Maio - Bebidas Geladas',
            meta_description: 'Bebidas geladas e refrescantes para todos os gostos'
        },
        4: {
            id: 4,
            name: 'Frying Nemo',
            slug: 'frying-nemo',
            logo: '/static/restaurants/frying-nemo-logo.jpg',
            logo_full_url: '/static/restaurants/frying-nemo-logo.jpg',
            cover_photo: '/static/restaurants/frying-nemo-cover.jpg',
            cover_photo_full_url: '/static/restaurants/frying-nemo-cover.jpg',
            address: 'Rua da Consolação, 321 - Centro, Campo Grande - MS',
            phone: '(67) 99999-4444',
            email: 'contato@fryingnemo.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '35-50',
            minimum_order: 18.00,
            delivery_charge: 3.00,
            avg_rating: 4.9,
            rating_count: 142,
            active: 1,
            open: 0, // Fechada
            zone_id: 1,
            veg: 1,
            non_veg: 1,
            free_delivery: false,
            take_away: true,
            delivery: true,
            featured: 1,
            announcement: 1,
            announcement_message: 'Almoço executivo disponível de segunda a sexta!',
            meta_title: 'Frying Nemo - Comida Caseira',
            meta_description: 'Comida caseira feita com carinho e ingredientes frescos'
        },
        5: {
            id: 5,
            name: 'The Great Impasta',
            slug: 'the-great-impasta',
            logo: '/static/restaurants/great-impasta-logo.jpg',
            logo_full_url: '/static/restaurants/great-impasta-logo.jpg',
            cover_photo: '/static/restaurants/great-impasta-cover.jpg',
            cover_photo_full_url: '/static/restaurants/great-impasta-cover.jpg',
            address: 'Rua Teodoro Sampaio, 654 - Centro, Campo Grande - MS',
            phone: '(67) 99999-5555',
            email: 'contato@greatimpasta.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '20-30',
            minimum_order: 10.00,
            delivery_charge: 0.00,
            avg_rating: 4.2,
            rating_count: 53,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 0,
            non_veg: 1,
            free_delivery: true,
            take_away: true,
            delivery: true,
            featured: 0,
            announcement: 0,
            announcement_message: null,
            meta_title: 'The Great Impasta - Lanches Rápidos',
            meta_description: 'Lanches rápidos e saborosos para matar a fome'
        },
        6: {
            id: 6,
            name: 'The Capital Grill',
            slug: 'the-capital-grill',
            logo: '/static/restaurants/capital-grill-logo.jpg',
            logo_full_url: '/static/restaurants/capital-grill-logo.jpg',
            cover_photo: '/static/restaurants/capital-grill-cover.jpg',
            cover_photo_full_url: '/static/restaurants/capital-grill-cover.jpg',
            address: 'Rua Haddock Lobo, 987 - Centro, Campo Grande - MS',
            phone: '(67) 99999-6666',
            email: 'contato@capitalgrill.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '25-35',
            minimum_order: 8.00,
            delivery_charge: 2.50,
            avg_rating: 4.7,
            rating_count: 98,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 1,
            non_veg: 0,
            free_delivery: false,
            take_away: true,
            delivery: true,
            featured: 1,
            announcement: 1,
            announcement_message: 'Novos sabores de brigadeiro gourmet!',
            meta_title: 'The Capital Grill - Doces e Sobremesas',
            meta_description: 'Doces artesanais e sobremesas irresistíveis'
        },
        7: {
            id: 7,
            name: 'Vintage Kitchen',
            slug: 'vintage-kitchen',
            logo: '/static/restaurants/vintage-kitchen-logo.jpg',
            logo_full_url: '/static/restaurants/vintage-kitchen-logo.jpg',
            cover_photo: '/static/restaurants/vintage-kitchen-cover.jpg',
            cover_photo_full_url: '/static/restaurants/vintage-kitchen-cover.jpg',
            address: 'Rua Vintage, 123 - Centro, Campo Grande - MS',
            phone: '(67) 99999-7777',
            email: 'contato@vintagekitchen.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '40-55',
            minimum_order: 25.00,
            delivery_charge: 4.00,
            avg_rating: 4.4,
            rating_count: 67,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 0,
            non_veg: 1,
            free_delivery: false,
            take_away: true,
            delivery: true,
            featured: 1,
            announcement: 1,
            announcement_message: 'Menu especial de fim de semana!',
            meta_title: 'Vintage Kitchen - Cozinha Retrô',
            meta_description: 'Pratos clássicos com toque moderno'
        },
        8: {
            id: 8,
            name: 'Banca do Ícaro',
            slug: 'banca-do-icaro',
            logo: '/static/restaurants/banca-icaro-logo.jpg',
            logo_full_url: '/static/restaurants/banca-icaro-logo.jpg',
            cover_photo: '/static/restaurants/banca-icaro-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-icaro-cover.jpg',
            address: 'Rua do Ícaro, 456 - Jardim dos Estados, Campo Grande - MS',
            phone: '(67) 99999-8888',
            email: 'contato@bancadoicaro.com',
            latitude: -20.4697,
            longitude: -54.6201,
            delivery_time: '20-35',
            minimum_order: 16.00,
            delivery_charge: 0.00,
            avg_rating: 4.7,
            rating_count: 112,
            active: 1,
            open: 1,
            zone_id: 1,
            veg: 1,
            non_veg: 1,
            free_delivery: true,
            take_away: true,
            delivery: true,
            featured: 1,
            announcement: 1,
            announcement_message: 'Experimente nosso prato especial da casa!',
            meta_title: 'Banca do Ícaro - Especialidades Locais',
            meta_description: 'Sabores únicos e especialidades da região'
        }
    }
    
    const restaurantId = parseInt(id)
    const mockRestaurant = bancasData[restaurantId] || bancasData[1] // Fallback para banca 1
    
    // Adicionar dados comuns a todas as bancas
    mockRestaurant.cuisine = [
        { id: 1, name: 'Brasileira' },
        { id: 2, name: 'Lanches' }
    ]
    
    mockRestaurant.schedules = [
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
        ]
    
    mockRestaurant.foods = [
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
    ]
    
    mockRestaurant.categories = [
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
    
    res.status(200).json(mockRestaurant)
}