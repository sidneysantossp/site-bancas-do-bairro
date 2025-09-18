import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // Redirecionar raiz para /home
  if (pathname === '/') {
    url.pathname = '/home'
    return NextResponse.redirect(url, 307)
  }

  // Detectar URLs antigas e redirecionar para nova estrutura (sem consultas à API)
  // Padrão: /produto/nome-produto-123 -> /banca-nome/categoria/produto-nome-123
  if (pathname.startsWith('/produto/')) {
    // Para produtos individuais, redirecionar para página de produto genérica
    // O redirecionamento específico será feito no getServerSideProps
    const productSlug = pathname.replace('/produto/', '')
    if (productSlug && /\d+$/.test(productSlug)) {
      url.pathname = `/produto/${productSlug}`
      return NextResponse.rewrite(url)
    }
  }

  // Detectar URLs antigas de bancas: /banca/nome-banca-123 -> /nome-banca-123
  if (pathname.startsWith('/banca/') && !pathname.startsWith('/banca/produto/')) {
    const bancaSlug = pathname.replace('/banca/', '')
    if (bancaSlug && /\d+$/.test(bancaSlug)) {
      url.pathname = `/${bancaSlug}`
      // Remover parâmetros redundantes que podem vir de navegações antigas
      url.searchParams.delete('bancaSlug')
      url.searchParams.delete('id')
      return NextResponse.redirect(url, 301)
    }
  }

  // Detectar URLs antigas de produtos com banca: /banca/nome-banca-123/produto/nome-produto-456
  if (pathname.match(/^\/banca\/[^/]+-\d+\/produto\/[^/]+-\d+$/)) {
    const parts = pathname.split('/')
    const bancaSlug = parts[2] // nome-banca-123
    const productSlug = parts[4] // nome-produto-456
    
    if (bancaSlug && productSlug) {
      // Redirecionar para estrutura nova: /nome-banca-123/produtos/nome-produto-456
      url.pathname = `/${bancaSlug}/produtos/${productSlug}`
      // Limpar possíveis parâmetros redundantes herdados
      url.searchParams.delete('bancaSlug')
      url.searchParams.delete('id')
      return NextResponse.redirect(url, 301)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/',
    '/produto/:path*',
    '/banca/:path*',
  ],
}