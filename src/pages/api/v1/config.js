// API que busca configuração do backend de produção
export default async function handler(req, res) {
    const backendUrl = 'https://admin.guiadasbancas.com.br'
    
    try {
        console.log('Buscando configuração do backend de produção...')
        
        const response = await fetch(`${backendUrl}/api/v1/config`, {
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
            console.error('Erro ao buscar configuração:', response.status, response.statusText)
            // Fallback para dados mock em caso de erro
            return res.status(200).json(getMockConfig())
        }

        const data = await response.json()
        console.log('Configuração obtida com sucesso')
        
        res.status(200).json(data)
    } catch (error) {
        console.error('Erro na requisição de configuração:', error.message)
        // Fallback para dados mock em caso de erro
        res.status(200).json(getMockConfig())
    }
}

// Dados mock como fallback
function getMockConfig() {
    return {
        business_name: 'Bancas do Bairro',
        logo: '/logo.png',
        address: 'São Paulo, SP',
        phone: '(11) 99999-9999',
        email: 'contato@bancasdobairro.com',
        base_urls: {
            restaurant_image_url: '/storage/restaurant/',
            customer_image_url: '/storage/profile/',
            banner_image_url: '/storage/banner/',
            category_image_url: '/storage/category/',
            product_image_url: '/storage/product/',
            delivery_man_image_url: '/storage/delivery-man/',
            notification_image_url: '/storage/notification/',
            gateway_image_url: '/storage/payment_modules/gateway_image/',
            react_landing_page_images: '/storage/react_landing/',
            react_landing_page_fav_icon: '/storage/react_landing/'
        },
        currency_symbol: 'R$',
        currency_symbol_direction: 'left',
        currency_symbol_position: 'left',
        digit_after_decimal_point: 2,
        schedule_order_slot_duration: 30,
        time_format: '24',
        language: [
            {
                key: 'pt-br',
                value: 'Português (Brasil)',
                direction: 'ltr',
                default: true
            },
            {
                key: 'en',
                value: 'English',
                direction: 'ltr',
                default: false
            }
        ],
        social_media: [
            {
                id: 1,
                name: 'facebook',
                link: 'https://facebook.com/bancasdobairro',
                status: 1
            },
            {
                id: 2,
                name: 'instagram',
                link: 'https://instagram.com/bancasdobairro',
                status: 1
            }
        ],
        delivery_management: {
            status: 1,
            min_shipping_charge: 2,
            shipping_per_km: 1
        },
        play_store_config: {
            status: 1,
            link: 'https://play.google.com/store/apps/details?id=com.bancasdobairro',
            min_version: '1.0.0'
        },
        app_store_config: {
            status: 1,
            link: 'https://apps.apple.com/app/bancas-do-bairro/id123456789',
            min_version: '1.0.0'
        },
        footer_text: 'Bancas do Bairro - Conectando você aos melhores sabores do seu bairro',
        min_order_value: 10,
        country: 'BR',
        default_location: {
            lat: '-23.5505',
            lng: '-46.6333'
        },
        map_api_key: (process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''),
        customer_verification: 0,
        order_confirmation_model: 'manual',
        show_dm_earning: 1,
        canceled_by_deliveryman: 0,
        canceled_by_restaurant: 0,
        timeformat: '24',
        toggle_veg_non_veg: 1,
        toggle_dm_registration: 1,
        toggle_restaurant_registration: 1,
        schedule_order: 1,
        cash_on_delivery: 1,
        digital_payment: 1,
        partial_payment: 0,
        partial_payment_method: 'both',
        add_fund_status: 1,
        maintenance_mode: 0,
        country_code: 'BR',
        tax_included: 0,
        system_language: [
            {
                key: 'pt-br',
                value: 'Português (Brasil)'
            }
        ],
        social_login: [
            {
                login_medium: 'google',
                status: 1
            },
            {
                login_medium: 'facebook',
                status: 1
            }
        ],
        apple_login: [
            {
                login_medium: 'apple',
                status: 0
            }
        ],
        email_verification: 0,
        phone_verification: 0,
        country_picker_status: 1,
        landing_page_links: {
            app_url_android: 'https://play.google.com/store/apps/details?id=com.bancasdobairro',
            app_url_ios: 'https://apps.apple.com/app/bancas-do-bairro/id123456789',
            web_app_url: 'https://bancasdobairro.com'
        },
        social_media_for_landing_page: [
            {
                id: 1,
                name: 'facebook',
                link: 'https://facebook.com/bancasdobairro',
                status: 1
            }
        ],
        react_setup: {
            react_domain: process.env.NEXT_CLIENT_HOST_URL || 'http://localhost:3000',
            react_platform_title: 'Bancas do Bairro',
            react_site_url: process.env.NEXT_CLIENT_HOST_URL || 'http://localhost:3000'
        }
    }
}