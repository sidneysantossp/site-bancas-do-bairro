// Proxy para categorias do backend de produção
export default async function handler(req, res) {
    const backendUrl = 'https://admin.guiadasbancas.com.br'
    
    try {
        console.log('Proxy: Fazendo requisição para', `${backendUrl}/api/v1/categories`)
        
        const response = await fetch(`${backendUrl}/api/v1/categories`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'NextJS-Proxy/1.0',
                // Adicionar headers necessários do backend
                'zoneId': JSON.stringify([1]),
                'zone-id': JSON.stringify([1]),
                'zone_id': JSON.stringify([1]),
                'X-software-id': '33571750',
            },
        })

        if (!response.ok) {
            console.error('Proxy: Erro na resposta do backend:', response.status, response.statusText)
            return res.status(response.status).json({ 
                error: `Backend error: ${response.status} ${response.statusText}` 
            })
        }

        const data = await response.json()
        console.log('Proxy: Sucesso! Categorias recebidas:', data?.length || 'N/A')
        
        // Retornar os dados com headers CORS apropriados
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        res.status(200).json(data)
    } catch (error) {
        console.error('Proxy: Erro na requisição:', error.message)
        res.status(500).json({ 
            error: 'Proxy error', 
            message: error.message 
        })
    }
}
