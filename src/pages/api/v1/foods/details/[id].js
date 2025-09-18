// API mock para detalhes de produtos/foods
export default function handler(req, res) {
    const { id } = req.query
    
    // Base de dados dos produtos (mock)
    const foodsData = {
        1: {
            id: 1,
            name: 'Pão de Açúcar',
            price: 8.50,
            description: 'Pão de açúcar tradicional da casa, feito com ingredientes frescos e receita especial.',
            image: '/static/foods/pao-acucar.jpg',
            image_full_url: '/static/foods/pao-acucar.jpg',
            category_id: 1,
            category_name: 'Pães e Doces',
            restaurant_id: 1,
            restaurant_name: 'Banca do Povo',
            available_time_starts: '08:00:00',
            available_time_ends: '22:00:00',
            veg: 1,
            non_veg: 0,
            status: 1,
            rating_count: 45,
            avg_rating: 4.6,
            slug: 'pao-de-acucar-1',
            meta_title: 'Pão de Açúcar - Banca do Povo',
            meta_description: 'Delicioso pão de açúcar tradicional feito com carinho'
        },
        2: {
            id: 2,
            name: 'Café com Leite',
            price: 4.50,
            description: 'Café fresquinho com leite cremoso, perfeito para acompanhar nossos pães.',
            image: '/static/foods/cafe-leite.jpg',
            image_full_url: '/static/foods/cafe-leite.jpg',
            category_id: 2,
            category_name: 'Bebidas',
            restaurant_id: 1,
            restaurant_name: 'Banca do Povo',
            available_time_starts: '06:00:00',
            available_time_ends: '23:00:00',
            veg: 1,
            non_veg: 0,
            status: 1,
            rating_count: 32,
            avg_rating: 4.3,
            slug: 'cafe-com-leite-2',
            meta_title: 'Café com Leite - Banca do Povo',
            meta_description: 'Café fresquinho com leite cremoso'
        },
        3: {
            id: 3,
            name: 'Sanduíche Natural',
            price: 12.00,
            description: 'Sanduíche natural com ingredientes frescos: alface, tomate, cenoura, peito de peru e cream cheese.',
            image: '/static/foods/sanduiche-natural.jpg',
            image_full_url: '/static/foods/sanduiche-natural.jpg',
            category_id: 3,
            category_name: 'Sanduíches',
            restaurant_id: 2,
            restaurant_name: 'Banca Princesa Ló',
            available_time_starts: '07:00:00',
            available_time_ends: '18:00:00',
            veg: 0,
            non_veg: 1,
            status: 1,
            rating_count: 67,
            avg_rating: 4.8,
            slug: 'sanduiche-natural-3',
            meta_title: 'Sanduíche Natural - Banca Princesa Ló',
            meta_description: 'Sanduíche natural com ingredientes frescos e saudáveis'
        },
        4: {
            id: 4,
            name: 'Açaí 500ml',
            price: 15.00,
            description: 'Açaí cremoso de 500ml com opções de acompanhamentos: granola, banana, morango e leite condensado.',
            image: '/static/foods/acai-500ml.jpg',
            image_full_url: '/static/foods/acai-500ml.jpg',
            category_id: 4,
            category_name: 'Açaí e Vitaminas',
            restaurant_id: 3,
            restaurant_name: 'Banca 24 de Maio',
            available_time_starts: '10:00:00',
            available_time_ends: '22:00:00',
            veg: 1,
            non_veg: 0,
            status: 1,
            rating_count: 89,
            avg_rating: 4.9,
            slug: 'acai-500ml-4',
            meta_title: 'Açaí 500ml - Banca 24 de Maio',
            meta_description: 'Açaí cremoso e delicioso com acompanhamentos'
        },
        5: {
            id: 5,
            name: 'Hambúrguer Artesanal',
            price: 22.00,
            description: 'Hambúrguer artesanal com carne bovina, queijo, alface, tomate, cebola e molho especial da casa.',
            image: '/static/foods/hamburguer-artesanal.jpg',
            image_full_url: '/static/foods/hamburguer-artesanal.jpg',
            category_id: 5,
            category_name: 'Hambúrgueres',
            restaurant_id: 4,
            restaurant_name: 'Frying Nemo',
            available_time_starts: '11:00:00',
            available_time_ends: '23:00:00',
            veg: 0,
            non_veg: 1,
            status: 1,
            rating_count: 124,
            avg_rating: 4.7,
            slug: 'hamburguer-artesanal-5',
            meta_title: 'Hambúrguer Artesanal - Frying Nemo',
            meta_description: 'Hambúrguer artesanal suculento com ingredientes frescos'
        }
    }
    
    const foodId = parseInt(id)
    const mockFood = foodsData[foodId]
    
    if (!mockFood) {
        return res.status(404).json({ 
            message: 'Produto não encontrado',
            error: 'Food not found'
        })
    }
    
    // Adicionar dados adicionais comuns
    mockFood.ingredients = [
        'Ingredientes frescos',
        'Sem conservantes',
        'Feito na hora'
    ]
    
    mockFood.nutritional_info = {
        calories: Math.floor(Math.random() * 500) + 200,
        protein: Math.floor(Math.random() * 30) + 5,
        carbs: Math.floor(Math.random() * 50) + 10,
        fat: Math.floor(Math.random() * 20) + 2
    }
    
    mockFood.reviews = [
        {
            id: 1,
            customer_name: 'João Silva',
            rating: 5,
            comment: 'Excelente produto, muito saboroso!',
            created_at: '2024-01-15T10:30:00Z'
        },
        {
            id: 2,
            customer_name: 'Maria Santos',
            rating: 4,
            comment: 'Muito bom, recomendo!',
            created_at: '2024-01-14T15:45:00Z'
        }
    ]
    
    res.status(200).json(mockFood)
}
