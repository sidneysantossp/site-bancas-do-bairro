import React from 'react'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import nofood from '../../assets/gif/no-food.gif'
import { Stack, Typography, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import CustomImageContainer from '../CustomImageContainer'

const CustomEmptyResult = ({ label, image, height, width, subTitle }) => {
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        if (!key) return ''
        const translated = t(key)
        return translated === key ? fallback ?? key : translated
    }
    const fallbacks = {
        'No Order found': 'Nenhum Pedido Realizado',
        'Not found': 'Não encontrado',
        'No Address Found!': 'Nenhum endereço encontrado!',
        'Please add your address for better experience!': 'Adicione seu endereço para uma melhor experiência!',
        'No Coupon Found': 'Nenhum cupom encontrado',
        'No Favourite Food Found': 'Nenhum produto adicionado ao seus favoritos',
        'No Favourite Restaurant Found': 'Nenhuma Banca favorita',
    }
    const theme = useTheme()

    return (
        <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            gap="10px"
        >
            <CustomImageContainer
                src={image ? image.src : nofood.src}
                alt="my gif"
                height={height || 300}
                width={width || 300}
                objectFit="contain"
            />
            <Stack alignItems="center" justifyContent="center" gap="5px">
                <Typography
                    fontSize="14px"
                    fontWeight={600}
                    color={
                        subTitle
                            ? theme.palette.neutral[1000]
                            : theme.palette.neutral[400]
                    }
                >
                    {label ? tt(label, fallbacks[label]) : tt('Not found', fallbacks['Not found'])}
                </Typography>
                {subTitle && (
                    <Typography
                        color={theme.palette.neutral[400]}
                        fontSize="12px"
                        fontWeight={400}
                        textAlign="center"
                    >
                        {tt(subTitle, fallbacks[subTitle])}
                    </Typography>
                )}
            </Stack>
        </CustomStackFullWidth>
    )
}

CustomEmptyResult.propTypes = {}

export default CustomEmptyResult
