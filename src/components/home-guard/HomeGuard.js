import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector } from "react-redux";

const HomeGuard = (props) => {
    const {children,from,page} = props
    const router = useRouter()
    const { cartList } = useSelector((state) => state.cart)
    const { userLocationUpdate } = useSelector((state) => state.globalSettings)
    const [checked, setChecked] = useState(false)

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

            // Quando a localização for válida, liberamos o conteúdo
            if (location && location !== 'null' && location !== 'undefined' && location.trim() !== '') {
                setChecked(true)
            } else {
                // Não redirecionar imediatamente. Aguarde ForceGeolocation preencher os dados
                setChecked(false)
            }
        },
        // Reavaliar quando o roteador estiver pronto e quando a geolocalização atualizar
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [router.isReady, userLocationUpdate]
    )

    if (!checked) {
        return null
    }

    // If got here, it means that the redirect did not occur, and that tells us that the user is
    // authenticated / authorized.

    return <>
        <CssBaseline/>
        {children}</>
}

HomeGuard.propTypes = {}

export default HomeGuard