import { useEffect, useState } from 'react'

const ClearStoragePage = () => {
    const [status, setStatus] = useState('Preparando limpeza...')
    const [details, setDetails] = useState([])

    useEffect(() => {
        const log = (msg) => setDetails((prev) => [...prev, msg])

        const clearAll = async () => {
            try {
                // Local/session storage
                try {
                    localStorage.clear()
                    sessionStorage.clear()
                    log('localStorage e sessionStorage limpos')
                } catch (e) {
                    log(`Falha ao limpar local/session storage: ${e?.message || e}`)
                }

                // Cookies essenciais utilizados no SSR
                try {
                    const past = 'Thu, 01 Jan 1970 00:00:00 GMT'
                    ;['languageSetting'].forEach((name) => {
                        document.cookie = `${name}=; expires=${past}; path=/;`
                    })
                    log('Cookies básicos limpos')
                } catch (e) {
                    log(`Falha ao limpar cookies: ${e?.message || e}`)
                }

                // Cache Storage (Service Worker caches)
                try {
                    if ('caches' in window) {
                        const keys = await caches.keys()
                        await Promise.all(keys.map((k) => caches.delete(k)))
                        log(`Caches removidos: ${keys.length}`)
                    }
                } catch (e) {
                    log(`Falha ao limpar caches: ${e?.message || e}`)
                }

                // IndexedDB (apaga todos os bancos deste origin)
                try {
                    if (window.indexedDB) {
                        if (indexedDB.databases) {
                            const dbs = await indexedDB.databases()
                            await Promise.all(
                                dbs.map((db) => db?.name && indexedDB.deleteDatabase(db.name))
                            )
                            log(`IndexedDB removidos: ${dbs.length}`)
                        } else {
                            // Fallback: tenta remover DBs mais comuns deste app
                            const guessDbs = ['keyval-store', 'workbox-expiration', 'firebase-messaging-database']
                            await Promise.all(
                                guessDbs.map((name) => {
                                    try {
                                        return indexedDB.deleteDatabase(name)
                                    } catch (_) {
                                        return Promise.resolve()
                                    }
                                })
                            )
                            log('IndexedDB limpos (fallback)')
                        }
                    }
                } catch (e) {
                    log(`Falha ao limpar IndexedDB: ${e?.message || e}`)
                }

                setStatus('Limpeza concluída. Redirecionando...')
            } catch (e) {
                setStatus(`Erro durante a limpeza: ${e?.message || e}`)
            } finally {
                setTimeout(() => {
                    window.location.href = '/'
                }, 1200)
            }
        }

        clearAll()
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'
        }}>
            <h1>Limpeza de dados do site</h1>
            <p>{status}</p>
            <div style={{
                maxWidth: 720,
                width: '100%',
                background: '#111',
                color: '#eee',
                borderRadius: 8,
                padding: 12,
                fontSize: 13
            }}>
                {details.map((d, i) => (
                    <div key={i}>• {d}</div>
                ))}
            </div>
            <p style={{ color: '#666' }}>Você será redirecionado para a Home automaticamente.</p>
        </div>
    )
}

export default ClearStoragePage


