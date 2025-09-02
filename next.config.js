/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Otimização de imagens
    images: {
        domains: [
            'stackfood.6am.one',
            'stackfood-admin.6amtech.com',
            'localhost',
            'cdn-icons-png.flaticon.com',
            // Adicione outros domínios de API conforme necessário
            'admin.guiadasbancas.com.br',
            'guiadasbancas.com.br',
            'www.guiadasbancas.com.br',
            '127.0.0.1',
        ],
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    
    // Otimizações de performance
    compress: true,
    poweredByHeader: false,
    generateEtags: false,

    // Evitar escrita em disco quando sem espaço
    webpack: (config, { dev }) => {
        if (dev) {
            // Desativa cache persistente do Webpack que grava em .next/cache
            config.cache = false
        }
        return config
    },
    
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

    // Redirects: raiz agora serve a Home (sem redirect '/')
    async redirects() {
        return [
            // Redirecionar antigas rotas de restaurant para banca
            {
                source: '/restaurant',
                destination: '/banca',
                permanent: true,
            },
            {
                source: '/restaurant/:path*',
                destination: '/banca/:path*',
                permanent: true,
            },
            // Redirecionar antigas rotas de cadastro para nova rota banca-registration
            {
                source: '/restaurant-registration',
                destination: '/banca-registration',
                permanent: true,
            },
            {
                source: '/restaurant-registration/:path*',
                destination: '/banca-registration/:path*',
                permanent: true,
            },
        ]
    },

    // Rewrites para expor /bancas como alias público de /cuisines e proxy de API/arquivos
    async rewrites() {
        const RAW_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost/admin-bancas-do-bairro'
        const BACKEND_BASE = RAW_BASE.replace(/\/$/, '')
        return [
            // Aliases públicos
            { source: '/bancas', destination: '/cuisines' },
            { source: '/bancas/:id', destination: '/cuisines/:id' },

            // Proxy de API -> backend definido por env (funciona em local e Vercel)
            // Ex.: /api/v1/config -> ${BACKEND_BASE}/api/v1/config
            {
                source: '/api/:path*',
                destination: `${BACKEND_BASE}/api/:path*`,
            },

            // Proxy de arquivos de mídia do backend (imagens, storage, etc.)
            // Ex.: /storage/... -> ${BACKEND_BASE}/storage/...
            {
                source: '/storage/:path*',
                destination: `${BACKEND_BASE}/storage/:path*`,
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
