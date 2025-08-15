import { Avatar, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import 'moment/locale/pt-br'
import { useSelector } from 'react-redux'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'

const CustomerInfo = () => {
    const theme = useTheme()
    const { userData } = useSelector((state) => state.user)
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? (fallback ?? key) : translated
    }
    // Ensure moment uses Portuguese locale
    moment.locale('pt-br')

    return (
        <CustomStackFullWidth
            direction="row"
            gap="9px"
            justifyContent="center"
            alignItems="center"
        >
            <Avatar
                sx={{
                    height: 68,
                    width: 70,
                    backgroundColor: userData?.image
                        ? (theme) => theme.palette.neutral[100]
                        : (theme) => theme.palette.neutral[400],
                }}
                src={userData?.image_full_url}
            />
            <CustomStackFullWidth>
                <Typography fontSize="1rem" fontWeight="600">
                    {' '}
                    {userData?.f_name?.concat(' ', userData?.l_name)}
                </Typography>
                <Typography
                    fontSize="0.75rem"
                    fontWeight="400"
                    color={theme.palette.neutral[500]}
                    sx={{ direction: theme.direction === 'rtl' ? 'rtl' : '' }}
                    textAlign={theme.direction === 'rtl' ? 'end' : 'start'}
                >
                    {userData?.phone}
                </Typography>
                <Typography
                    fontSize="0.65rem"
                    fontWeight="400"
                    color={theme.palette.neutral[500]}
                >
                    {tt('Joined', 'Entrou em')}{' '}
                    {moment(userData?.created_at).format('LL')}
                </Typography>
            </CustomStackFullWidth>
        </CustomStackFullWidth>
    )
}

export default CustomerInfo
