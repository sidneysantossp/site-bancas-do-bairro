// Proxy genérico para todas as APIs do backend de produção
export default async function handler(req, res) {
    const { path } = req.query
    const backendUrl = 'https://admin.guiadasbancas.com.br'
    
    // Construir a URL completa
    const apiPath = Array.isArray(path) ? path.join('/') : path
    const fullUrl = `${backendUrl}/api/${apiPath}`
    
    try {
        console.log(`Proxy: ${req.method} ${fullUrl}`)
        
        // Headers padrão para o backend
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'NextJS-Proxy/1.0',
            'X-software-id': '33571750',
        }
        
        // Adicionar zona padrão
        const defaultZone = JSON.stringify([1])
        headers['zoneId'] = defaultZone
        headers['zone-id'] = defaultZone
        headers['zone_id'] = defaultZone
        
        // Copiar headers relevantes da requisição original
        if (req.headers.authorization) {
            headers.authorization = req.headers.authorization
        }
        if (req.headers['x-localization']) {
            headers['X-localization'] = req.headers['x-localization']
        }
        
        const fetchOptions = {
            method: req.method,
            headers,
        }
        
        // Adicionar body para métodos POST/PUT/PATCH
        if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
            fetchOptions.body = JSON.stringify(req.body)
        }
        
        const response = await fetch(fullUrl, fetchOptions)
        
        if (!response.ok) {
            console.error(`Proxy: Erro ${response.status} para ${fullUrl}`)
            return res.status(response.status).json({ 
                error: `Backend error: ${response.status} ${response.statusText}`,
                url: fullUrl
            })
        }
        
        const data = await response.json()
        console.log(`Proxy: Sucesso ${response.status} para ${fullUrl}`)
        
        // Headers CORS
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-localization')
        
        res.status(response.status).json(data)
        
    } catch (error) {
        console.error(`Proxy: Erro na requisição para ${fullUrl}:`, error.message)
        res.status(500).json({ 
            error: 'Proxy error', 
            message: error.message,
            url: fullUrl
        })
    }
}

// Permitir todos os métodos HTTP
export const config = {
    api: {
        externalResolver: true,
    },
}
