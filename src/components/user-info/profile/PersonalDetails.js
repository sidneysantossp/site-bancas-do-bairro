import React from 'react'
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
import { Grid, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { CustomDivWithBorder } from './Profile.style'

const PersonalDetails = ({ data }) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? (fallback ?? key) : translated
    }
    const fallbacks = {
        'User Name': 'Nome do Usuário',
        Email: 'Email',
        Phone: 'Telefone',
    }
    return (
        <CustomStackFullWidth>
            <CustomDivWithBorder>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        // paddingLeft={!isSmall && '20px'}
                    >
                        <CustomStackFullWidth gap="10px">
                            <Stack direction="row" spacing={2}>
                                <Typography fontSize="14px" fontWeight="500">
                                    {tt('User Name', fallbacks['User Name'])}
                                </Typography>
                                <Typography
                                    fontSize="14px"
                                    fontWeight="400"
                                    color={theme.palette.neutral[500]}
                                >
                                    {`${data?.data?.f_name} ${data?.data?.l_name}`}
                                </Typography>
                            </Stack>
                        </CustomStackFullWidth>
                        <Stack direction="row" spacing={2}>
                            <Typography fontSize="14px" fontWeight="500">
                                {tt('Email', fallbacks.Email)}&nbsp;&nbsp;
                            </Typography>
                            <Typography
                                fontSize="14px"
                                fontWeight="400"
                                color={theme.palette.neutral[500]}
                            >
                                {data?.data?.email}
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4} md={4}>
                        <CustomStackFullWidth gap="10px">
                            <Stack direction="row" spacing={2}>
                                <Typography fontSize="14px" fontWeight="500">
                                    {tt('Phone', fallbacks.Phone)}
                                </Typography>
                                <Typography
                                    fontSize="14px"
                                    fontWeight="400"
                                    color={theme.palette.neutral[500]}
                                >
                                    {data?.data?.phone}
                                </Typography>
                            </Stack>
                        </CustomStackFullWidth>
                    </Grid>
                </Grid>
            </CustomDivWithBorder>
        </CustomStackFullWidth>
    )
}

export default PersonalDetails
