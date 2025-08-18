/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Otimização de imagens
    images: {
        domains: [
            'stackfood.6am.one',
            'stackfood-admin.6amtech.com',
            'localhost',
            // Adicione outros domínios de API conforme necessário
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    
    // Otimizações de performance
    compress: true,
    poweredByHeader: false,
    generateEtags: false,
    
    // Headers de segurança
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ]
    },

    // Redirect raiz -> /home
    async redirects() {
        return [
            {
                source: '/',
                destination: '/home',
                permanent: true,
            },
        ]
    },
    
    // Experimental features (removidas para evitar erros)
    // experimental: {
    //     optimizeCss: true,
    //     scrollRestoration: true,
    // },
}

module.exports = nextConfig
