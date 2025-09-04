import Link from 'next/link'

// Minimal 500 page without app-specific dependencies.
// Keep this page self-contained to ensure it renders even when the app is broken.
export default function Custom500() {
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
                    500 - Erro interno do servidor
                </h1>
                <p style={{ marginBottom: '1.5rem', color: '#555' }}>
                    Ocorreu um erro inesperado. Tente novamente mais tarde.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => location.reload()}
                        style={{
                            background: '#1976d2',
                            color: '#fff',
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            border: 0,
                            cursor: 'pointer',
                        }}
                    >
                        Recarregar
                    </button>
                    <Link href="/" style={{
                        display: 'inline-block',
                        background: '#e0e0e0',
                        color: '#111',
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        textDecoration: 'none',
                    }}>
                        Página Inicial
                    </Link>
                </div>
            </div>
        </div>
    )
}
