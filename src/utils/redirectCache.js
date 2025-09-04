// Cache otimizado para redirecionamentos SEO
// Evita consultas desnecessárias à API para URLs já processadas

const redirectCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos
const MAX_CACHE_SIZE = 1000 // Máximo de 1000 entradas

/**
 * Gera chave de cache para um slug
 * @param {string} slug - Slug para gerar chave
 * @returns {string} - Chave de cache
 */
const getCacheKey = (slug) => {
  return `redirect_${slug}`
}

/**
 * Verifica se uma entrada do cache ainda é válida
 * @param {Object} entry - Entrada do cache
 * @returns {boolean} - True se válida, false se expirada
 */
const isValidCacheEntry = (entry) => {
  return entry && (Date.now() - entry.timestamp) < CACHE_TTL
}

/**
 * Limpa entradas expiradas do cache
 */
const cleanExpiredEntries = () => {
  const now = Date.now()
  for (const [key, entry] of redirectCache.entries()) {
    if ((now - entry.timestamp) >= CACHE_TTL) {
      redirectCache.delete(key)
    }
  }
}

/**
 * Limita o tamanho do cache removendo entradas mais antigas
 */
const limitCacheSize = () => {
  if (redirectCache.size > MAX_CACHE_SIZE) {
    // Remover 20% das entradas mais antigas
    const entriesToRemove = Math.floor(MAX_CACHE_SIZE * 0.2)
    const sortedEntries = Array.from(redirectCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    for (let i = 0; i < entriesToRemove; i++) {
      redirectCache.delete(sortedEntries[i][0])
    }
  }
}

/**
 * Obtém URL de redirecionamento do cache
 * @param {string} slug - Slug para buscar
 * @returns {string|null} - URL de redirecionamento ou null se não encontrada
 */
export const getCachedRedirect = (slug) => {
  const key = getCacheKey(slug)
  const entry = redirectCache.get(key)
  
  if (isValidCacheEntry(entry)) {
    return entry.redirectUrl
  }
  
  return null
}

/**
 * Armazena URL de redirecionamento no cache
 * @param {string} slug - Slug original
 * @param {string} redirectUrl - URL de redirecionamento
 */
export const setCachedRedirect = (slug, redirectUrl) => {
  cleanExpiredEntries()
  limitCacheSize()
  
  const key = getCacheKey(slug)
  redirectCache.set(key, {
    redirectUrl,
    timestamp: Date.now()
  })
}

/**
 * Marca um slug como não necessitando redirecionamento
 * @param {string} slug - Slug que não precisa de redirecionamento
 */
export const setCachedNoRedirect = (slug) => {
  cleanExpiredEntries()
  limitCacheSize()
  
  const key = getCacheKey(slug)
  redirectCache.set(key, {
    redirectUrl: null, // null indica que não precisa redirecionar
    timestamp: Date.now()
  })
}

/**
 * Limpa todo o cache de redirecionamentos
 */
export const clearRedirectCache = () => {
  redirectCache.clear()
}

/**
 * Obtém estatísticas do cache
 * @returns {Object} - Estatísticas do cache
 */
export const getCacheStats = () => {
  cleanExpiredEntries()
  
  return {
    size: redirectCache.size,
    maxSize: MAX_CACHE_SIZE,
    ttl: CACHE_TTL,
    entries: Array.from(redirectCache.entries()).map(([key, entry]) => ({
      key,
      redirectUrl: entry.redirectUrl,
      age: Date.now() - entry.timestamp
    }))
  }
}