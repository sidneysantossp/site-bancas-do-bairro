import axios from 'axios'

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    const { lat, lng } = req.query

    if (!lat || !lng) {
        return res.status(400).json({ 
            message: 'Latitude and longitude are required',
            zone_ids: [1] // Fallback para zona padrão
        })
    }

    try {
        // URL do backend administrativo
        const backendUrl = process.env.BACKEND_URL || 'http://localhost/admin-bancas-do-bairro'
        
        // Fazer requisição para o backend para obter a zona baseada nas coordenadas
        const response = await axios.get(`${backendUrl}/api/v1/config/get-zone-id`, {
            params: { lat, lng },
            timeout: 10000,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        if (response.data && response.data.zone_ids) {
            return res.status(200).json(response.data)
        } else {
            // Se o backend não retornar zona válida, usar zona padrão
            return res.status(200).json({
                zone_ids: [1],
                message: 'Using default zone'
            })
        }

    } catch (error) {
        console.error('Erro ao obter zone ID do backend:', error.message)
        
        // Implementar lógica de fallback baseada em coordenadas conhecidas
        const zoneId = getZoneByCoordinates(parseFloat(lat), parseFloat(lng))
        
        return res.status(200).json({
            zone_ids: [zoneId],
            message: 'Using fallback zone calculation'
        })
    }
}

// Função de fallback para determinar zona baseada em coordenadas
function getZoneByCoordinates(lat, lng) {
    // Coordenadas aproximadas para diferentes regiões
    // Você pode expandir isso baseado nas zonas configuradas no seu admin
    
    // Campo Grande/MS (zona 1)
    if (lat >= -20.7 && lat <= -20.3 && lng >= -54.8 && lng <= -54.4) {
        return 1
    }
    
    // São Paulo/SP (zona 2) - exemplo
    if (lat >= -23.8 && lat <= -23.3 && lng >= -46.8 && lng <= -46.3) {
        return 2
    }
    
    // Zona padrão para outras localidades
    return 1
}
