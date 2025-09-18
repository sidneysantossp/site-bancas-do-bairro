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

        // Quando um backend externo estiver configurado, proxiar /api e /storage
        // Usamos beforeFiles para ter precedência sobre rotas locais (ex.: pages/api)
        if (BACKEND_BASE) {
            return {
                beforeFiles: [
                    {
                        source: '/api/:path*',
                        destination: `${BACKEND_BASE}/api/:path*`,
                    },
                    {
                        source: '/storage/:path*',
                        destination: `${BACKEND_BASE}/storage/:path*`,
                    },
                ],
                afterFiles: rules,
                fallback: [],
            }
        }

        return rules
    },
}

module.exports = nextConfig
