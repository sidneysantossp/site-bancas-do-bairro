// API mock para lista de "cuisines" (categorias de bancas)
// Formato esperado pelo front: { Cuisines: [...] }

export default function handler(req, res) {
  const cuisines = [
    { id: 1, name: 'Açaí e Vitaminas', image_full_url: '/static/icons/acai.svg' },
    { id: 2, name: 'Sanduíches', image_full_url: '/static/icons/sandwich.svg' },
    { id: 3, name: 'Bebidas', image_full_url: '/static/icons/drinks.svg' },
    { id: 4, name: 'Comida Caseira', image_full_url: '/static/icons/snacks.svg' },
    { id: 5, name: 'Lanches', image_full_url: '/static/icons/snacks.svg' },
    { id: 6, name: 'Doces e Sobremesas', image_full_url: '/static/icons/snacks.svg' },
  ]

  // Simular pequeno delay de rede
  setTimeout(() => {
    res.status(200).json({ Cuisines: cuisines })
  }, 80)
}
