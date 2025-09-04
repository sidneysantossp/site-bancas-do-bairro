import React from 'react'
import Head from 'next/head'
import NextLink from 'next/link'

function Error({ statusCode }) {
  const title = statusCode === 404
    ? 'Página não encontrada'
    : 'Ocorreu um erro'

  const description = statusCode === 404
    ? 'A página que você procura pode ter sido removida, teve o nome alterado ou está temporariamente indisponível.'
    : 'Desculpe, algo inesperado aconteceu. Tente novamente em instantes.'

  return (
    <>
      <Head>
        <title>{title} | Bancas do Bairro</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
            Erro {statusCode ?? 'desconhecido'}
          </p>
          <h1 style={{ fontSize: '2rem', margin: '0.5rem 0 0.75rem' }}>{title}</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>{description}</p>
          <div style={{ display: 'inline-flex', gap: '0.75rem' }}>
            <NextLink href="/" legacyBehavior>
              <a style={{
                backgroundColor: '#1976d2',
                color: 'white',
                padding: '0.6rem 1rem',
                borderRadius: 8,
                textDecoration: 'none'
              }}>
                Voltar para a página inicial
              </a>
            </NextLink>
            <button
              onClick={() => (typeof window !== 'undefined' ? window.location.reload() : null)}
              style={{
                backgroundColor: 'transparent',
                color: '#1976d2',
                padding: '0.6rem 1rem',
                borderRadius: 8,
                border: '1px solid #1976d2',
                cursor: 'pointer'
              }}
            >
              Recarregar
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 500
  return { statusCode }
}

export default Error
