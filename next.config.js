/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Rewrites para proxy de API
    async rewrites() {
        const RAW_BASE = process.env.NEXT_PUBLIC_BASE_URL || ''
        const BACKEND_BASE = RAW_BASE ? RAW_BASE.replace(/\/$/, '') : ''
        const rules = [
            // Aliases públicos
            { source: '/bancas', destination: '/banca' },
            { source: '/bancas/:id', destination: '/banca/:id' },
        ]

        // Em desenvolvimento, use as rotas locais do Next.js em /api
        // Somente proxie /api e /storage quando um backend externo estiver configurado
        // e não estivermos em desenvolvimento
        if (BACKEND_BASE && process.env.NODE_ENV !== 'development') {
            rules.push(
                {
                    source: '/api/:path*',
                    destination: `${BACKEND_BASE}/api/:path*`,
                },
                {
                    source: '/storage/:path*',
                    destination: `${BACKEND_BASE}/storage/:path*`,
                }
            )
        }

        return rules
    },
}

module.exports = nextConfig
