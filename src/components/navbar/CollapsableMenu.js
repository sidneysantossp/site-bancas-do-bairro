import React, { useState, useEffect } from 'react'
import { alpha, Collapse, Typography } from '@mui/material'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useRouter } from 'next/router'
import { getDataLimit } from '@/utils/customFunctions'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@emotion/react'
import i18n from '@/language/i18n'

const CollapsableMenu = ({ value, setOpenDrawer, pathName }) => {
    const router = useRouter()
    const theme = useTheme()
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    useEffect(() => {
        if (typeof window === 'undefined') return
        const userLanguage = localStorage.getItem('language')
        if (userLanguage) {
            let normalized = userLanguage.toLowerCase().replace('_', '-')
            const lang =
                normalized === 'pt' || normalized.startsWith('pt-')
                    ? 'pt-br'
                    : normalized
            if (i18n.language !== lang) {
                i18n.changeLanguage(lang)
            }
        }
        // Re-render quando o idioma mudar
        const handler = () => setOpen((prev) => prev)
        i18n.on('languageChanged', handler)
        return () => {
            i18n.off('languageChanged', handler)
        }
    }, [])
    const handleClick = () => setOpen(!open)
    const handleRoute = (id, name) => {
        router.push(`${value.path}/${id}?name=${name}`)
        setOpen(false)
        setOpenDrawer(false)
    }
    const handleView = () => {
        router.push(pathName)
        setOpen(false)
        setOpenDrawer(false)
    }
    const textColor = theme.palette.whiteContainer.main

    return (
        <>
            <ListItemButton
                onClick={handleClick}
                sx={{
                    borderBottom: '1px solid',
                    borderBottomColor: (theme) =>
                        alpha(theme.palette.neutral[300], 0.3),
                    '&:hover': {
                        backgroundColor: 'primary.main',
                        color: `${textColor}`,
                    },
                }}
            >
                <ListItemText
                    primary={
                        <Typography sx={{ fontSize: '12px' }}>
                            {value?.displayText || t(value?.text)}
                        </Typography>
                    }
                />
                {open ? (
                    <ExpandLess sx={{ fontSize: '16px' }} />
                ) : (
                    <ExpandMore sx={{ fontSize: '16px' }} />
                )}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {getDataLimit(value.items)?.map((item, index) => (
                        <ListItemButton
                            sx={{
                                borderBottom: '1px solid',
                                borderBottomColor: (theme) =>
                                    alpha(theme.palette.neutral[300], 0.3),
                                pl: 4,
                                '&:hover': {
                                    backgroundColor: (theme) =>
                                        alpha(theme.palette.primary.main, 0.2),
                                },
                            }}
                            key={index}
                            onClick={() => handleRoute(item.id, item?.name)}
                        >
                            <ListItemText
                                primary={
                                    <Typography sx={{ fontSize: '12px' }}>
                                        {item.name}
                                    </Typography>
                                }
                            ></ListItemText>
                        </ListItemButton>
                    ))}
                    <ListItemButton
                        sx={{
                            padding: '3px',
                            color: (theme) => theme.palette.primary.main,
                            textAlign: 'center',

                            borderRadius: '10px',
                            marginRight: '20px',
                            marginLeft: '22px',
                        }}
                        onClick={handleView}
                    >
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        textDecoration: 'underLine',
                                    }}
                                >
                                    {t('View all') === 'View all' ? 'Ver mais' : t('View all')}
                                </Typography>
                            }
                        ></ListItemText>
                    </ListItemButton>
                </List>
            </Collapse>
        </>
    )
}

export default CollapsableMenu
