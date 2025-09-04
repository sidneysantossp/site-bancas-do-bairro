// API endpoint para monitorar estatísticas do cache de redirecionamentos
import { getCacheStats, clearRedirectCache } from '../../../utils/redirectCache'

export default function handler(req, res) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const stats = getCacheStats()
        res.status(200).json({
          success: true,
          data: stats,
          message: 'Estatísticas do cache obtidas com sucesso'
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Erro ao obter estatísticas do cache',
          details: error.message
        })
      }
      break

    case 'DELETE':
      try {
        clearRedirectCache()
        res.status(200).json({
          success: true,
          message: 'Cache limpo com sucesso'
        })
      } catch (error) {
        res.status(500).json({
          success: false,
          error: 'Erro ao limpar cache',
          details: error.message
        })
      }
      break

    default:
      res.setHeader('Allow', ['GET', 'DELETE'])
      res.status(405).json({
        success: false,
        error: `Método ${method} não permitido`
      })
      break
  }
}