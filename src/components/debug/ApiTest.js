import React, { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, Alert } from '@mui/material'
import MainApi from '../../api/MainApi'

const ApiTest = () => {
    const [categories, setCategories] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const testApi = async () => {
            try {
                console.log('Testando conexão com API via proxy...')
                const response = await MainApi.get('/api/v1/categories')
                console.log('Resposta da API:', response.data)
                
                // Normalizar resposta (pode vir como array direto ou dentro de data)
                const categories = Array.isArray(response.data) ? response.data : response.data?.data || []
                setCategories(categories)
                setError(null)
            } catch (err) {
                console.error('Erro na API:', err)
                setError(`${err.message} - ${err.response?.data?.error || ''}`)
            } finally {
                setLoading(false)
            }
        }

        testApi()
    }, [])

    if (loading) {
        return (
            <Box display="flex" alignItems="center" gap={2} p={2}>
                <CircularProgress size={20} />
                <Typography>Testando conexão com backend...</Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                Erro na conexão: {error}
            </Alert>
        )
    }

    return (
        <Box p={2}>
            <Alert severity="success" sx={{ mb: 2 }}>
                ✅ Conexão com backend estabelecida!
            </Alert>
            <Typography variant="h6" gutterBottom>
                Categorias carregadas: {Array.isArray(categories) ? categories.length : 'N/A'}
            </Typography>
            {Array.isArray(categories) && categories.slice(0, 3).map(cat => (
                <Typography key={cat.id} variant="body2">
                    • {cat.name}
                </Typography>
            ))}
        </Box>
    )
}

export default ApiTest
