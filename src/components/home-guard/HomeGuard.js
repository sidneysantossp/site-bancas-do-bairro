import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import CssBaseline from "@mui/material/CssBaseline";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useSelector } from "react-redux";

const HomeGuard = (props) => {
    const {children,from,page} = props
    const router = useRouter()
    const { cartList } = useSelector((state) => state.cart)
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)
    const [checked, setChecked] = useState(false)
    
    // Inicialização imediata para evitar carregamento infinito
    useEffect(() => {
        console.log('HomeGuard: Inicializando valores padrão imediatamente')
        
        // Definir valores padrão sempre que o componente montar
        localStorage.setItem('location', 'Minha localização atual')
        localStorage.setItem('zoneid', JSON.stringify([1]))
        
        // Liberar conteúdo imediatamente
        setChecked(true)
    }, [])

    useEffect(
        () => {
            if (!router.isReady) {
                return
            }
            if(from==="checkout" && cartList?.length===0 && page !== 'campaign'){
                router.push('/home')
                return
            }

            const location = localStorage.getItem('location')
            const zoneid = localStorage.getItem('zoneid')

            // Se não há localização válida, definir valores padrão imediatamente
            if (!location || location === 'null' || location === 'undefined' || location.trim() === '') {
                console.log('HomeGuard: Definindo localização padrão')
                localStorage.setItem('location', 'Minha localização atual')
                localStorage.setItem('zoneid', JSON.stringify([1]))
                setChecked(true)
                return
            }

            // Se não há zoneid válido, definir padrão
            if (!zoneid || zoneid === 'null' || zoneid === 'undefined' || zoneid === '[]' || zoneid.trim() === '') {
                console.log('HomeGuard: Definindo zona padrão')
                localStorage.setItem('zoneid', JSON.stringify([1]))
            }

            // Liberar o conteúdo
            setChecked(true)
        },
        // Reavaliar quando o roteador estiver pronto e quando a geolocalização atualizar
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.isReady, userLocationUpdate]
    )

    if (!checked) {
        return (
            <>
                <CssBaseline/>
                <Box
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 2,
                        px: 2,
                        textAlign: 'center',
                    }}
                >
                    <CircularProgress color="primary" />
                    <Typography variant="body1" color="text.secondary">
                        Carregando localização...
                    </Typography>
                </Box>
            </>
        )
    }

    // If got here, it means that the redirect did not occur, and that tells us that the user is
    // authenticated / authorized.

    return (
        <>
            <CssBaseline/>
            {children}
        </>
    )
}

HomeGuard.propTypes = {}

export default HomeGuard