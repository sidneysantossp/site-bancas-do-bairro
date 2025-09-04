/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Rewrites para proxy de API
    async rewrites() {
        const RAW_BASE = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost/admin-bancas-do-bairro'
        const BACKEND_BASE = RAW_BASE.replace(/\/$/, '')
        return [
            // Aliases públicos
            { source: '/bancas', destination: '/cuisines' },
            { source: '/bancas/:id', destination: '/cuisines/:id' },

            // Proxy de API -> backend definido por env
            {
                source: '/api/:path*',
                destination: `${BACKEND_BASE}/api/:path*`,
            },

            // Proxy de arquivos de mídia do backend
            {
                source: '/storage/:path*',
                destination: `${BACKEND_BASE}/storage/:path*`,
            },
        ]
    },
}

module.exports = nextConfig
