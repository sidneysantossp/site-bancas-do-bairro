import Link from 'next/link'

// Minimal 404 page without app-specific dependencies.
// Keep this page self-contained to ensure it renders even when the app is broken.
export default function Custom404() {
    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                textAlign: 'center',
            }}
        >
            <div>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                    404 - Página não encontrada
                </h1>
                <p style={{ marginBottom: '1.5rem', color: '#555' }}>
                    A página que você procura não existe ou foi movida.
                </p>
                <Link href="/" style={{
                    display: 'inline-block',
                    background: '#1976d2',
                    color: '#fff',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                }}>
                    Voltar para a Página Inicial
                </Link>
            </div>
        </div>
    )
}
