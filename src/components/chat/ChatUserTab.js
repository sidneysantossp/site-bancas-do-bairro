import React from 'react'
import { Tab, Tabs, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

export const data = [
    {
        id: 1,
        userType: 'Jornaleiro',
        value: 'vendor',
    },
    {
        id: 2,
        userType: 'Delivery Man',
        value: 'delivery_man',
    },
    {
        id: 3,
        userType: 'admin',
        value: 'admin',
    },
]

const ChatUserTab = ({ setUserType, useType, setChannelId }) => {
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? (fallback ?? key) : translated
    }
    const handleChange = (event, newValue) => {
        setUserType(newValue)
        setChannelId(null)
    }

    return (
        <Stack width="100%" sx={{ paddingInlineEnd: '6px' }}>
            <Tabs
                indicatorColor="primary"
                value={useType}
                onChange={handleChange}
                scrollButtons={false}
                aria-label="scrollable prevent tabs example"
                sx={{
                    '& .MuiButtonBase-root': {
                        paddingInlineEnd: '10px',
                        paddingInlineStart: '10px',
                    },
                    '& .MuiTabs-flexContainer': {
                        gap: '5px',
                    },
                }}
            >
                {data?.map((item) => {
                    const fallbackMap = {
                        Seller: 'Banca',
                        'Delivery Man': 'Entregador',
                        admin: 'Admin',
                    }
                    return (
                        <Tab
                            value={item?.value}
                            label={tt(item.userType, fallbackMap[item.userType])}
                            key={item?.id}
                        />
                    )
                })}
            </Tabs>
        </Stack>
    )
}

export default ChatUserTab
