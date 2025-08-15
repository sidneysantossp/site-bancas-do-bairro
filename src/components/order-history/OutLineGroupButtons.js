import React from 'react'
import { Button, Typography, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

const OutlinedGroupButtons = (props) => {
    const { selected, buttonsData, handleSelection } = props
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? fallback ?? key : translated
    }
    const fallbacks = {
        Ongoing: 'Em andamento',
        Previous: 'Anteriores',
        Subscription: 'Assinaturas',
    }

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            {buttonsData?.length > 0 &&
                buttonsData?.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            sx={{
                                borderRadius: '3px',
                                borderBottom: '5px solid',
                                borderBottomColor:
                                    selected === item?.value
                                        ? (theme) => theme.palette.primary.main
                                        : 'transparent',
                            }}
                            onClick={() => handleSelection(item.value)}
                        >
                            <Typography
                                sx={{
                                    textAlign: 'left',
                                    color:
                                        selected === item?.value
                                            ? (theme) =>
                                                  theme.palette.neutral[1000]
                                            : (theme) =>
                                                  theme.palette.neutral[400],
                                    fontWeight:
                                        selected === item?.value
                                            ? '700'
                                            : '400',
                                }}
                                fontSize={{
                                    xs: '14px',
                                    sm: '16px',
                                    md: '18px',
                                }}
                            >
                                {tt(item?.title, fallbacks[item?.title])}
                            </Typography>
                        </Button>
                    )
                })}
        </Stack>
    )
}

OutlinedGroupButtons.propTypes = {}

export default OutlinedGroupButtons
