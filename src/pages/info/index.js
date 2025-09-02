import React, { useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import CustomContainer from '../../components/container'
import UserInfo from '../../components/user-info'
import AuthGuard from '../../components/authentication/AuthGuard'
import jwt from 'base-64'
import { useRouter } from 'next/router'
const Index = () => {

    const router = useRouter()
    const pathname = router.pathname
    const { page, orderId, token } = router.query
    const [attributeId, setAttributeId] = useState('')

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwt.decode(token)

                if (typeof decodedToken === 'string') {
                    const keyValuePairs = decodedToken.split('&&')

                    for (const pair of keyValuePairs) {
                        const [key, value] = pair.split('=')
                        if (key === 'attribute_id') {
                            setAttributeId(value)
                            break
                        }
                    }
                } else {
                    console.error('Decoded token is not a string:', decodedToken)
                }
            } catch (error) {
                console.error('Error decoding token:', error)
            }
        }
    }, [token])

    return (
        <div>
            <CssBaseline />
            <CustomContainer>
                    <AuthGuard from={pathname ? pathname.replace('/', '') : ''}>
                    {page && (
                        <UserInfo
                            page={page}
                            orderId={orderId ?? attributeId}
                            setAttributeId={setAttributeId}
                        />
                    )}
                </AuthGuard>
            </CustomContainer>
        </div>
    )
}

export default Index