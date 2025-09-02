import { Stack, Button } from '@mui/material'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import ErrorRoutesProtect from '../components/route-protectors/ErrorRoutesProtect'
import CustomAlert from '../components/alert/CustomAlert'
import FourHundred from '../../public/static/404.svg'
import CustomImageContainer from '@/components/CustomImageContainer'
import CustomContainer from '@/components/container'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

export default function Custom400() {
    const { t } = useTranslation()
    const router = useRouter()
    return (
        <ErrorRoutesProtect>
            <CustomContainer>
                <CustomStackFullWidth
                    justifyContent="center"
                    alignItems="center"
                    spacing={4}
                >
                    <Stack
                        maxWidth="500px"
                        width="100%"
                        spacing={2}
                        padding={{ xs: '3rem 1rem 3rem', md: '6rem 1rem 3rem' }}
                    >
                        <CustomImageContainer
                            loading="auto"
                            src={FourHundred?.src}
                        />
                        <CustomAlert
                            text={t('Page not found')}
                            type="info"
                        />
                        <Button
                            onClick={() => router.push('/')}
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {t('Back to home')}
                        </Button>
                    </Stack>
                </CustomStackFullWidth>
            </CustomContainer>
        </ErrorRoutesProtect>
    )
}
