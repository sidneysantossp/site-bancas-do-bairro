// API mock para listar todos os restaurantes/bancas
export default function handler(req, res) {
    const { offset = 1, limit = 12, filter_data = 'all', name = '', veg = 0, discount = 0, non_veg = 0, top_rated = 0 } = req.query

    const mockRestaurants = [
        {
            id: 1,
            name: 'Banca do João - Açaí e Vitaminas',
            phone: '(11) 99999-1111',
            email: 'joao@bancadojoao.com',
            logo: '/static/restaurants/banca-joao-logo.jpg',
            logo_full_url: '/static/restaurants/banca-joao-logo.jpg',
            latitude: '-23.550520',
            longitude: '-46.633308',
            address: 'Rua das Palmeiras, 123 - Vila Madalena, São Paulo - SP',
            coverage: 5,
            minimum_order: 15.00,
            comission: 0,
            schedule_order: true,
            status: 1,
            vendor_id: 1,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            free_delivery: true,
            rating: [1, 2, 3, 4, 5],
            cover_photo: 'restaurants/banca-joao-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-joao-cover.jpg',
            delivery: true,
            take_away: true,
            item_section: 1,
            tax: 0,
            zone_id: 1,
            reviews_section: 1,
            active: 1,
            off_day: '',
            gst_status: 0,
            gst_code: '',
            self_delivery_system: 1,
            pos_system: 0,
            minimum_shipping_charge: 0,
            delivery_time: '30-45',
            veg: 1,
            non_veg: 0,
            order_count: 150,
            total_order: 150,
            module_id: 1,
            order_place_to_schedule_interval: 0,
            featured: 1,
            per_km_shipping_charge: 0,
            prescription_order: 0,
            slug: 'banca-do-joao-acai-vitaminas',
            maximum_shipping_charge: null,
            cutlery: 0,
            meta_title: 'Banca do João - Açaí e Vitaminas',
            meta_description: 'Os melhores açaís e vitaminas da região',
            meta_image: 'meta-images/banca-joao.jpg',
            announcement: 1,
            announcement_message: 'Promoção especial: 20% off em açaís!',
            qr_code: null,
            additional_data: null,
            additional_documents: null,
            restaurant_model: 'commission',
            restaurant_sub_model: null,
            avg_rating: 4.8,
            rating_count: 89,
            positive_rating: 85,
            open: 1,
            active_coupons: [],
            characteristics: [],
            schedules: [
                {
                    id: 1,
                    restaurant_id: 1,
                    day: 0,
                    opening_time: '08:00:00',
                    closing_time: '22:00:00'
                }
            ],
            discount: {
                id: 1,
                discount: 20,
                discount_type: 'percent',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            },
            cuisines: [
                {
                    id: 1,
                    name: 'Açaí e Vitaminas',
                    image: 'cuisines/acai.png'
                }
            ],
            foods_count: 25
        },
        {
            id: 2,
            name: 'Banca da Maria - Sanduíches Artesanais',
            phone: '(11) 99999-2222',
            email: 'maria@bancadamaria.com',
            logo: '/static/restaurants/banca-maria-logo.jpg',
            logo_full_url: '/static/restaurants/banca-maria-logo.jpg',
            latitude: '-23.561684',
            longitude: '-46.625378',
            address: 'Av. Paulista, 456 - Bela Vista, São Paulo - SP',
            coverage: 8,
            minimum_order: 20.00,
            comission: 0,
            schedule_order: true,
            status: 1,
            vendor_id: 2,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            free_delivery: false,
            rating: [1, 2, 3, 4, 5],
            cover_photo: 'restaurants/banca-maria-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-maria-cover.jpg',
            delivery: true,
            take_away: true,
            item_section: 1,
            tax: 0,
            zone_id: 1,
            reviews_section: 1,
            active: 1,
            off_day: '',
            gst_status: 0,
            gst_code: '',
            self_delivery_system: 1,
            pos_system: 0,
            minimum_shipping_charge: 5.00,
            delivery_time: '25-40',
            veg: 0,
            non_veg: 1,
            order_count: 203,
            total_order: 203,
            module_id: 1,
            order_place_to_schedule_interval: 0,
            featured: 1,
            per_km_shipping_charge: 2.50,
            prescription_order: 0,
            slug: 'banca-da-maria-sanduiches-artesanais',
            maximum_shipping_charge: 15.00,
            cutlery: 1,
            meta_title: 'Banca da Maria - Sanduíches Artesanais',
            meta_description: 'Sanduíches artesanais frescos e saborosos',
            meta_image: 'meta-images/banca-maria.jpg',
            announcement: 1,
            announcement_message: 'Novo: Sanduíche vegano disponível!',
            qr_code: null,
            additional_data: null,
            additional_documents: null,
            restaurant_model: 'commission',
            restaurant_sub_model: null,
            avg_rating: 4.6,
            rating_count: 127,
            positive_rating: 115,
            open: 1,
            active_coupons: [],
            characteristics: [],
            schedules: [
                {
                    id: 2,
                    restaurant_id: 2,
                    day: 0,
                    opening_time: '07:00:00',
                    closing_time: '23:00:00'
                }
            ],
            discount: null,
            cuisines: [
                {
                    id: 2,
                    name: 'Sanduíches',
                    image: 'cuisines/sandwich.png'
                }
            ],
            foods_count: 18
        },
        {
            id: 3,
            name: 'Banca do Pedro - Bebidas Geladas',
            phone: '(11) 99999-3333',
            email: 'pedro@bancadopedro.com',
            logo: '/static/restaurants/banca-pedro-logo.jpg',
            logo_full_url: '/static/restaurants/banca-pedro-logo.jpg',
            latitude: '-23.533773',
            longitude: '-46.625290',
            address: 'Rua Augusta, 789 - Consolação, São Paulo - SP',
            coverage: 6,
            minimum_order: 12.00,
            comission: 0,
            schedule_order: true,
            status: 1,
            vendor_id: 3,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            free_delivery: true,
            rating: [1, 2, 3, 4, 5],
            cover_photo: 'restaurants/banca-pedro-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-pedro-cover.jpg',
            delivery: true,
            take_away: true,
            item_section: 1,
            tax: 0,
            zone_id: 1,
            reviews_section: 1,
            active: 1,
            off_day: '',
            gst_status: 0,
            gst_code: '',
            self_delivery_system: 1,
            pos_system: 0,
            minimum_shipping_charge: 0,
            delivery_time: '15-25',
            veg: 1,
            non_veg: 0,
            order_count: 98,
            total_order: 98,
            module_id: 1,
            order_place_to_schedule_interval: 0,
            featured: 0,
            per_km_shipping_charge: 0,
            prescription_order: 0,
            slug: 'banca-do-pedro-bebidas-geladas',
            maximum_shipping_charge: null,
            cutlery: 0,
            meta_title: 'Banca do Pedro - Bebidas Geladas',
            meta_description: 'Bebidas geladas e refrescantes para todos os gostos',
            meta_image: 'meta-images/banca-pedro.jpg',
            announcement: 0,
            announcement_message: null,
            qr_code: null,
            additional_data: null,
            additional_documents: null,
            restaurant_model: 'commission',
            restaurant_sub_model: null,
            avg_rating: 4.3,
            rating_count: 64,
            positive_rating: 58,
            open: 1,
            active_coupons: [],
            characteristics: [],
            schedules: [
                {
                    id: 3,
                    restaurant_id: 3,
                    day: 0,
                    opening_time: '09:00:00',
                    closing_time: '21:00:00'
                }
            ],
            discount: {
                id: 2,
                discount: 15,
                discount_type: 'percent',
                start_date: '2024-01-01',
                end_date: '2024-06-30'
            },
            cuisines: [
                {
                    id: 3,
                    name: 'Bebidas',
                    image: 'cuisines/bebidas.png'
                }
            ],
            foods_count: 32
        },
        {
            id: 4,
            name: 'Banca da Ana - Comida Caseira',
            phone: '(11) 99999-4444',
            email: 'ana@bancadaana.com',
            logo: '/static/restaurants/banca-ana-logo.jpg',
            logo_full_url: '/static/restaurants/banca-ana-logo.jpg',
            latitude: '-23.574729',
            longitude: '-46.623614',
            address: 'Rua da Consolação, 321 - República, São Paulo - SP',
            coverage: 7,
            minimum_order: 18.00,
            comission: 0,
            schedule_order: true,
            status: 1,
            vendor_id: 4,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            free_delivery: false,
            rating: [1, 2, 3, 4, 5],
            cover_photo: 'restaurants/banca-ana-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-ana-cover.jpg',
            delivery: true,
            take_away: true,
            item_section: 1,
            tax: 0,
            zone_id: 1,
            reviews_section: 1,
            active: 1,
            off_day: 'Sunday',
            gst_status: 0,
            gst_code: '',
            self_delivery_system: 1,
            pos_system: 0,
            minimum_shipping_charge: 3.00,
            delivery_time: '35-50',
            veg: 1,
            non_veg: 1,
            order_count: 176,
            total_order: 176,
            module_id: 1,
            order_place_to_schedule_interval: 0,
            featured: 1,
            per_km_shipping_charge: 1.50,
            prescription_order: 0,
            slug: 'banca-da-ana-comida-caseira',
            maximum_shipping_charge: 12.00,
            cutlery: 1,
            meta_title: 'Banca da Ana - Comida Caseira',
            meta_description: 'Comida caseira feita com carinho e ingredientes frescos',
            meta_image: 'meta-images/banca-ana.jpg',
            announcement: 1,
            announcement_message: 'Almoço executivo disponível de segunda a sexta!',
            qr_code: null,
            additional_data: null,
            additional_documents: null,
            restaurant_model: 'commission',
            restaurant_sub_model: null,
            avg_rating: 4.9,
            rating_count: 142,
            positive_rating: 138,
            open: 1,
            active_coupons: [],
            characteristics: [],
            schedules: [
                {
                    id: 4,
                    restaurant_id: 4,
                    day: 0,
                    opening_time: '06:00:00',
                    closing_time: '20:00:00'
                }
            ],
            discount: null,
            cuisines: [
                {
                    id: 4,
                    name: 'Comida Caseira',
                    image: 'cuisines/caseira.png'
                }
            ],
            foods_count: 28
        },
        {
            id: 5,
            name: 'Banca do Carlos - Lanches Rápidos',
            phone: '(11) 99999-5555',
            email: 'carlos@bancadocarlos.com',
            logo: '/static/restaurants/banca-carlos-logo.jpg',
            logo_full_url: '/static/restaurants/banca-carlos-logo.jpg',
            latitude: '-23.557499',
            longitude: '-46.662415',
            address: 'Rua Teodoro Sampaio, 654 - Pinheiros, São Paulo - SP',
            coverage: 4,
            minimum_order: 10.00,
            comission: 0,
            schedule_order: true,
            status: 1,
            vendor_id: 5,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            free_delivery: true,
            rating: [1, 2, 3, 4, 5],
            cover_photo: 'restaurants/banca-carlos-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-carlos-cover.jpg',
            delivery: true,
            take_away: true,
            item_section: 1,
            tax: 0,
            zone_id: 1,
            reviews_section: 1,
            active: 1,
            off_day: '',
            gst_status: 0,
            gst_code: '',
            self_delivery_system: 1,
            pos_system: 0,
            minimum_shipping_charge: 0,
            delivery_time: '20-30',
            veg: 0,
            non_veg: 1,
            order_count: 87,
            total_order: 87,
            module_id: 1,
            order_place_to_schedule_interval: 0,
            featured: 0,
            per_km_shipping_charge: 0,
            prescription_order: 0,
            slug: 'banca-do-carlos-lanches-rapidos',
            maximum_shipping_charge: null,
            cutlery: 0,
            meta_title: 'Banca do Carlos - Lanches Rápidos',
            meta_description: 'Lanches rápidos e saborosos para matar a fome',
            meta_image: 'meta-images/banca-carlos.jpg',
            announcement: 0,
            announcement_message: null,
            qr_code: null,
            additional_data: null,
            additional_documents: null,
            restaurant_model: 'commission',
            restaurant_sub_model: null,
            avg_rating: 4.2,
            rating_count: 53,
            positive_rating: 47,
            open: 1,
            active_coupons: [],
            characteristics: [],
            schedules: [
                {
                    id: 5,
                    restaurant_id: 5,
                    day: 0,
                    opening_time: '10:00:00',
                    closing_time: '22:00:00'
                }
            ],
            discount: {
                id: 3,
                discount: 10,
                discount_type: 'percent',
                start_date: '2024-01-01',
                end_date: '2024-03-31'
            },
            cuisines: [
                {
                    id: 5,
                    name: 'Lanches',
                    image: 'cuisines/lanches.png'
                }
            ],
            foods_count: 15
        },
        {
            id: 6,
            name: 'Banca da Lucia - Doces e Sobremesas',
            phone: '(11) 99999-6666',
            email: 'lucia@bancadalucia.com',
            logo: '/static/restaurants/banca-lucia-logo.jpg',
            logo_full_url: '/static/restaurants/banca-lucia-logo.jpg',
            latitude: '-23.548943',
            longitude: '-46.638818',
            address: 'Rua Haddock Lobo, 987 - Cerqueira César, São Paulo - SP',
            coverage: 5,
            minimum_order: 8.00,
            comission: 0,
            schedule_order: true,
            status: 1,
            vendor_id: 6,
            created_at: '2024-01-01T00:00:00.000000Z',
            updated_at: '2024-01-01T00:00:00.000000Z',
            free_delivery: false,
            rating: [1, 2, 3, 4, 5],
            cover_photo: 'restaurants/banca-lucia-cover.jpg',
            cover_photo_full_url: '/static/restaurants/banca-lucia-cover.jpg',
            delivery: true,
            take_away: true,
            item_section: 1,
            tax: 0,
            zone_id: 1,
            reviews_section: 1,
            active: 1,
            off_day: '',
            gst_status: 0,
            gst_code: '',
            self_delivery_system: 1,
            pos_system: 0,
            minimum_shipping_charge: 2.50,
            delivery_time: '25-35',
            veg: 1,
            non_veg: 0,
            order_count: 134,
            total_order: 134,
            module_id: 1,
            order_place_to_schedule_interval: 0,
            featured: 1,
            per_km_shipping_charge: 1.00,
            prescription_order: 0,
            slug: 'banca-da-lucia-doces-sobremesas',
            maximum_shipping_charge: 8.00,
            cutlery: 0,
            meta_title: 'Banca da Lucia - Doces e Sobremesas',
            meta_description: 'Doces artesanais e sobremesas irresistíveis',
            meta_image: 'meta-images/banca-lucia.jpg',
            announcement: 1,
            announcement_message: 'Novos sabores de brigadeiro gourmet!',
            qr_code: null,
            additional_data: null,
            additional_documents: null,
            restaurant_model: 'commission',
            restaurant_sub_model: null,
            avg_rating: 4.7,
            rating_count: 98,
            positive_rating: 91,
            open: 1,
            active_coupons: [],
            characteristics: [],
            schedules: [
                {
                    id: 6,
                    restaurant_id: 6,
                    day: 0,
                    opening_time: '08:00:00',
                    closing_time: '20:00:00'
                }
            ],
            discount: {
                id: 4,
                discount: 25,
                discount_type: 'percent',
                start_date: '2024-01-01',
                end_date: '2024-12-31'
            },
            cuisines: [
                {
                    id: 6,
                    name: 'Doces e Sobremesas',
                    image: 'cuisines/doces.png'
                }
            ],
            foods_count: 22
        }
    ]

    // Aplicar filtros
    let filteredRestaurants = mockRestaurants

    // Filtro por nome
    if (name && name.trim() !== '') {
        filteredRestaurants = filteredRestaurants.filter(restaurant => 
            restaurant.name.toLowerCase().includes(name.toLowerCase())
        )
    }

    // Filtro por tipo de comida
    if (veg == 1) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.veg === 1)
    }
    if (non_veg == 1) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.non_veg === 1)
    }

    // Filtro por desconto
    if (discount == 1) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.discount !== null)
    }

    // Filtro por top rated
    if (top_rated == 1) {
        filteredRestaurants = filteredRestaurants.filter(restaurant => restaurant.avg_rating >= 4.5)
    }

    // Paginação
    const startIndex = (parseInt(offset) - 1) * parseInt(limit)
    const endIndex = startIndex + parseInt(limit)
    const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex)

    const response = {
        restaurants: paginatedRestaurants,
        total_size: filteredRestaurants.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
    }

    res.status(200).json(response)
}