// Utilitários para geração e manipulação de slugs SEO-friendly

/**
 * Gera um slug SEO-friendly a partir de um texto
 * @param {string} text - Texto para converter em slug
 * @returns {string} - Slug gerado
 */
export const generateSlug = (text) => {
  if (!text) return ''
  
  return text
    .toString()
    .normalize('NFD') // Normalizar caracteres Unicode
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Substituir caracteres especiais por hífen
    .replace(/(^-|-$)/g, '') // Remover hífens do início e fim
}

/**
 * Gera um slug de produto com ID
 * @param {Object} product - Objeto do produto
 * @returns {string} - Slug do produto no formato "nome-produto-id"
 */
export const buildProductSlug = (product) => {
  if (!product) return ''
  
  const id = product?.id
  const name = product?.name || 'produto'
  const slug = generateSlug(name)
  
  return id ? `${slug}-${id}` : slug
}

/**
 * Gera um slug de banca/restaurante com ID
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {string} - Slug da banca no formato "nome-banca-id"
 */
export const buildBancaSlug = (restaurant) => {
  if (!restaurant) return ''
  
  const id = restaurant?.id
  const name = restaurant?.name || 'banca'
  const slug = generateSlug(name)
  
  return id ? `${slug}-${id}` : slug
}

/**
 * Extrai o ID de um slug
 * @param {string} slug - Slug no formato "nome-item-id". Também aceita variantes como "nome-item123" (sem hífen antes do ID)
 * @returns {string|null} - ID extraído ou null se não encontrado
 */
export const extractIdFromSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return null
  
  // Remover querystring e hash se existirem
  const pure = slug.split(/[?#]/)[0]

  // 1) Caso canônico: último segmento separado por hífen é um número
  const parts = pure.split('-')
  const lastPart = parts[parts.length - 1]
  if (/^\d+$/.test(lastPart)) return lastPart

  // 2) Variante tolerante: extrair dígitos finais mesmo sem hífen (ex.: "mini-kebab13" => "13")
  const match = pure.match(/(\d+)$/)
  return match ? match[1] : null
}

/**
 * Gera URL SEO-friendly para produto (nova estrutura limpa)
 * @param {Object} product - Objeto do produto
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {string} - URL SEO-friendly no formato /banca-nome/categoria/produto-nome
 */
export const buildProductSEOUrl = (product, restaurant) => {
  if (!product || !restaurant) return ''
  
  const bancaSlug = buildBancaSlug(restaurant)
  const productSlug = buildProductSlug(product)
  const categoria = product.category_name ? 
    product.category_name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'produtos'
  
  return `/${bancaSlug}/${categoria}/${productSlug}`
}

/**
 * Gera URL SEO-friendly para produto (estrutura antiga com /banca/)
 * @param {Object} product - Objeto do produto
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {string} - URL SEO-friendly antiga
 */
export const buildProductSEOUrlOld = (product, restaurant) => {
  if (!product || !restaurant) return ''
  
  const bancaSlug = buildBancaSlug(restaurant)
  const productSlug = buildProductSlug(product)
  
  return `/banca/${bancaSlug}/produto/${productSlug}`
}

/**
 * Gera URL SEO-friendly para banca (nova estrutura limpa)
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {string} - URL SEO-friendly no formato /banca-nome
 */
export const buildBancaSEOUrl = (restaurant) => {
  if (!restaurant) return ''
  
  const bancaSlug = buildBancaSlug(restaurant)
  return `/${bancaSlug}`
}

/**
 * Gera URL SEO-friendly para banca (estrutura antiga com /banca/)
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {string} - URL SEO-friendly antiga
 */
export const buildBancaSEOUrlOld = (restaurant) => {
  if (!restaurant) return ''
  
  const bancaSlug = buildBancaSlug(restaurant)
  return `/banca/${bancaSlug}`
}

/**
 * Converte URL antiga para nova URL SEO-friendly
 * @param {string} oldUrl - URL antiga no formato /produto/id
 * @param {Object} product - Objeto do produto
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {string} - Nova URL SEO-friendly
 */
export const convertToSEOUrl = (oldUrl, product, restaurant) => {
  if (!oldUrl || !product || !restaurant) return oldUrl
  
  // Se já é uma URL SEO-friendly, retornar como está
  if (oldUrl.includes('/banca/') && oldUrl.includes('/produto/')) {
    return oldUrl
  }
  
  return buildProductSEOUrl(product, restaurant)
}

/**
 * Valida se um slug está no formato correto
 * @param {string} slug - Slug para validar
 * @returns {boolean} - True se válido, false caso contrário
 */
export const isValidSlug = (slug) => {
  if (!slug || typeof slug !== 'string') return false
  
  // Verificar se termina com um número (ID)
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  return /^\d+$/.test(lastPart) && parts.length >= 2
}

/**
 * Gera meta tags para SEO
 * @param {Object} product - Objeto do produto
 * @param {Object} restaurant - Objeto da banca/restaurante
 * @returns {Object} - Objeto com meta tags
 */
export const generateSEOMetaTags = (product, restaurant) => {
  if (!product || !restaurant) return {}
  
  const canonicalUrl = buildProductSEOUrl(product, restaurant)
  
  return {
    title: `${product.name} - ${restaurant.name} | Bancas do Bairro`,
    description: product.description || `${product.name} - Produto disponível na ${restaurant.name}`,
    keywords: `${product.name}, ${restaurant.name}, delivery, bancas do bairro`,
    canonicalUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3007'}${canonicalUrl}`,
    ogImage: product.image_full_url,
    ogTitle: `${product.name} - ${restaurant.name}`,
    ogDescription: product.description || `${product.name} - Produto disponível na ${restaurant.name}`,
  }
}