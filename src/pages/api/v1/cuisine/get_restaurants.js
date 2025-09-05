// API mock para listar restaurantes (bancas) por cuisine_id
// Formato esperado pelo front (useGetCuisinesDetails):
// { restaurants: [...], total_size: number, limit: number, offset: number }

export default function handler(req, res) {
  const { cuisine_id, limit = 10, offset = 1 } = req.query

  // Dataset simplificado (alinhado com o shape usado em \"get-restaurants/all.js\")
  const all = [
    {
      id: 1,
      name: 'Banca do João - Açaí e Vitaminas',
      slug: 'banca-do-joao-acai-vitaminas',
      cover_photo_full_url: '/static/restaurants/banca-joao-cover.jpg',
      logo_full_url: '/static/restaurants/banca-joao-logo.jpg',
      avg_rating: 4.8,
      rating_count: 89,
      open: 1,
      active: 1,
      discount: { id: 1, discount: 20, discount_type: 'percent' },
      free_delivery: true,
      delivery_time: '30-45',
      cuisines: [{ id: 1, name: 'Açaí e Vitaminas' }],
      cuisine: [{ id: 1, name: 'Açaí e Vitaminas' }],
      current_opening_time: '08:00:00',
    },
    {
      id: 2,
      name: 'Banca da Maria - Sanduíches Artesanais',
      slug: 'banca-da-maria-sanduiches-artesanais',
      cover_photo_full_url: '/static/restaurants/banca-maria-cover.jpg',
      logo_full_url: '/static/restaurants/banca-maria-logo.jpg',
      avg_rating: 4.6,
      rating_count: 127,
      open: 1,
      active: 1,
      discount: null,
      free_delivery: false,
      delivery_time: '25-40',
      cuisines: [{ id: 2, name: 'Sanduíches' }],
      cuisine: [{ id: 2, name: 'Sanduíches' }],
      current_opening_time: '07:00:00',
    },
    {
      id: 3,
      name: 'Banca do Pedro - Bebidas Geladas',
      slug: 'banca-do-pedro-bebidas-geladas',
      cover_photo_full_url: '/static/restaurants/banca-pedro-cover.jpg',
      logo_full_url: '/static/restaurants/banca-pedro-logo.jpg',
      avg_rating: 4.3,
      rating_count: 64,
      open: 1,
      active: 1,
      discount: { id: 2, discount: 15, discount_type: 'percent' },
      free_delivery: true,
      delivery_time: '15-25',
      cuisines: [{ id: 3, name: 'Bebidas' }],
      cuisine: [{ id: 3, name: 'Bebidas' }],
      current_opening_time: '09:00:00',
    },
  ]

  const idNum = Number(cuisine_id)
  const filtered = Number.isFinite(idNum)
    ? all.filter((r) => Array.isArray(r.cuisines) && r.cuisines.some((c) => c.id === idNum))
    : all

  const startIndex = (parseInt(offset) - 1) * parseInt(limit)
  const endIndex = startIndex + parseInt(limit)
  const paginated = filtered.slice(startIndex, endIndex)

  const response = {
    restaurants: paginated,
    total_size: filtered.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
  }

  setTimeout(() => res.status(200).json(response), 80)
}
