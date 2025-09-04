// API mock para landing page
export default function handler(req, res) {
    const mockLandingPageData = {
        banner_section_full: {
            banner_section_img_full: 'banner-home.jpg'
        },
        react_header_title: 'Bem-vindo às Bancas do Bairro',
        react_header_sub_title: 'Encontre as melhores bancas da sua região',
        react_header_image_full_url: '/static/heroHome.svg',
        react_services: [
            {
                id: 1,
                title: 'Entrega Rápida',
                sub_title: 'Receba seus produtos em casa',
                image: 'delivery.png'
            },
            {
                id: 2,
                title: 'Qualidade Garantida',
                sub_title: 'Produtos frescos e selecionados',
                image: 'quality.png'
            },
            {
                id: 3,
                title: 'Preços Justos',
                sub_title: 'Os melhores preços da região',
                image: 'price.png'
            }
        ],
        react_promotional_banner: {
            title: 'Promoções Especiais',
            sub_title: 'Descontos imperdíveis todos os dias',
            image: 'promo-banner.jpg'
        },
        discount_banner: {
            title: 'Desconto de 20%',
            sub_title: 'Na primeira compra',
            image: 'discount-banner.jpg'
        },
        base_urls: {
            react_header_image_url: '/storage/react_landing/',
            react_services_image_url: '/storage/react_landing/',
            promotional_banner_image_url: '/storage/react_landing/',
            discount_banner_image_url: '/storage/react_landing/'
        }
    }

    // Simular delay de rede (opcional)
    if (req.query.delay) {
        const delay = parseInt(req.query.delay) || 1000
        setTimeout(() => {
            res.status(200).json(mockLandingPageData)
        }, delay)
    } else {
        res.status(200).json(mockLandingPageData)
    }
}