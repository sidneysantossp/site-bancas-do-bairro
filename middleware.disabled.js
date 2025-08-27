import { NextResponse } from 'next/server'

export function middleware(req) {
  const url = req.nextUrl.clone()

  // Redireciona explicitamente a raiz para /home no Edge (antes de renderizar)
  if (url.pathname === '/') {
    url.pathname = '/home'
    return NextResponse.redirect(url, 307) // temporário para driblar cache
  }

  return NextResponse.next()
}

// Garante que o middleware seja executado em todas as rotas, mas só redirecionamos na raiz
export const config = {
  matcher: ['/:path*'],
}