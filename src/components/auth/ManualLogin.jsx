import React, { useEffect, useState } from 'react'
import {
    CustomColouredTypography,
    CustomStackFullWidth,
    CustomLink,
} from '@/styled-components/CustomStyles.style'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Visibility from '@mui/icons-material/Visibility'
import { alpha, Stack } from '@mui/material'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockIcon from '@mui/icons-material/Lock'
import { CustomTypography } from '@/components/custom-tables/Tables.style'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import { CustomSigninOutLine } from '@/components/auth/sign-in'
import RememberMe from '@/components/auth/RememberMe'
import { t } from 'i18next'
import { useTheme } from '@mui/styles'
import PhoneOrEmailIcon from '@/components/auth/PhoneOrEmailIcon'
import { checkInput } from '@/utils/customFunctions'
import CustomLoginPhoneInput from '@/components/auth/sign-in/CustomLoginPhoneInput'

const ManualLogin = (props) => {
    const {
        setShowPassword,
        loginFormik,
        global,
        showPassword,
        handleOnChange,
        isLoading,
        rememberMeHandleChange,
        handleClick,
        setModalFor,
        setForWidth,
    } = props
    const theme = useTheme()
    const [isPhone, setIsPhone] = useState('')

    const handlePasswordClick = () => {
        setModalFor('forgot_password')
        setForWidth(false)
    }

    useEffect(() => {
        const value = loginFormik.values.email_or_phone

        const filterInput = checkInput(value)
        if (filterInput === 'phone') {
            setIsPhone('phone')
        } else {
            setIsPhone('email')
        }
    }, [loginFormik.values.email_or_phone])
    return (
        <form onSubmit={loginFormik.handleSubmit} noValidate>
            <CustomStackFullWidth
                alignItems="center"
                spacing={{ xs: 2, md: 4 }}
            >
                <Stack width="100%" minHeight="45px">
                    {isPhone === 'phone' ? (
                        <CustomLoginPhoneInput
                            value={loginFormik.values.email_or_phone}
                            onHandleChange={handleOnChange}
                            initCountry={global?.country}
                            touched={loginFormik.touched.email_or_phone}
                            errors={loginFormik.errors.email_or_phone}
                            rtlChange="true"
                            borderradius="10px"
                            autoFocus
                        />
                    ) : (
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel
                                required
                                sx={{
                                    color: (theme) =>
                                        theme.palette.neutral[600],
                                    backgroundColor: (theme) =>
                                        theme.palette.background.paper,

                                    '&.Mui-focused': {
                                        color: (theme) =>
                                            theme.palette.neutral[1000], // Set label color to black when focused
                                    },
                                }}
                                htmlFor="outlined-adornment-password"
                            >
                                E-mail/Telefone
                            </InputLabel>
                            <CustomSigninOutLine
                                borderradius="10px"
                                width="100%"
                                required
                                type="text"
                                id="email_or_phone"
                                name="email_or_phone"
                                placeholder="E-mail/Telefone"
                                value={loginFormik.values.email_or_phone}
                                onChange={loginFormik.handleChange}
                                error={
                                    loginFormik.touched.email_or_phone &&
                                    Boolean(loginFormik.errors.email_or_phone)
                                }
                                autoFocus={isPhone === 'email' && true}
                                helperText={
                                    loginFormik.touched.email_or_phone &&
                                    loginFormik.errors.email_or_phone
                                }
                                touched={loginFormik.touched.email_or_phone}
                                startAdornment={
                                    <InputAdornment
                                        position="start"
                                        sx={{
                                            marginInlineEnd: '0px !important',
                                        }}
                                    >
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            edge="start"
                                        >
                                            <PhoneOrEmailIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label="Password"
                            />
                            {loginFormik.errors.email_or_phone && (
                                <CustomTypography
                                    variant="subtitle2"
                                    sx={{
                                        color: (theme) =>
                                            theme.palette.error.main,
                                    }}
                                >
                                    {loginFormik.errors.email_or_phone}
                                </CustomTypography>
                            )}
                        </FormControl>
                    )}
                </Stack>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel
                        required
                        sx={{
                            color: (theme) => theme.palette.neutral[600],

                            '&.Mui-focused': {
                                color: (theme) => theme.palette.neutral[1000], // Set label color to black when focused
                            },
                        }}
                        htmlFor="outlined-adornment-password"
                    >
                        Senha
                    </InputLabel>
                    <CustomSigninOutLine
                        borderradius="10px"
                        width="100%"
                        required
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        placeholder="8+ caracteres"
                        value={loginFormik.values.password}
                        onChange={loginFormik.handleChange}
                        error={
                            loginFormik.touched.password &&
                            Boolean(loginFormik.errors.password)
                        }
                        helperText={
                            loginFormik.touched.password &&
                            loginFormik.errors.password
                        }
                        touched={loginFormik.touched.password}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() =>
                                        setShowPassword(
                                            (prevState) => !prevState
                                        )
                                    }
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <Visibility
                                            sx={{
                                                width: '20px',
                                                height: '20px',
                                                color: (theme) =>
                                                    alpha(
                                                        theme.palette
                                                            .neutral[400],
                                                        0.5
                                                    ),
                                            }}
                                        />
                                    ) : (
                                        <VisibilityOff
                                            sx={{
                                                width: '20px',
                                                height: '20px',
                                                color: (theme) =>
                                                    alpha(
                                                        theme.palette
                                                            .neutral[400],
                                                        0.5
                                                    ),
                                            }}
                                        />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        startAdornment={
                            <InputAdornment
                                position="start"
                                sx={{
                                    marginInlineEnd: '0px !important',
                                }}
                            >
                                <IconButton
                                    aria-label="toggle password visibility"
                                    edge="start"
                                >
                                    <LockIcon
                                        sx={{
                                            fontSize: '1.2rem',
                                            color: (theme) =>
                                                alpha(
                                                    theme.palette.neutral[400],
                                                    0.5
                                                ),
                                        }}
                                    />
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Password"
                    />
                    {loginFormik.errors.password && (
                        <CustomTypography
                            variant="subtitle2"
                            sx={{
                                color: (theme) => theme.palette.error.main,
                            }}
                        >
                            {loginFormik.errors.password}
                        </CustomTypography>
                    )}
                </FormControl>
                <CustomStackFullWidth
                    alignItems="center"
                    sx={{ marginTop: '15px !important' }}
                    justifyContent="space-between"
                    direction="row"
                >
                    <RememberMe
                        rememberMeHandleChange={rememberMeHandleChange}
                    />
                    <Typography
                        onClick={handlePasswordClick}
                        sx={{
                            fontSize: '12px',
                            textTransform: 'none',
                            cursor: 'pointer',
                            color: (theme) => theme.palette.primary.main,
                        }}
                    >
                        Esqueceu a senha?
                    </Typography>
                </CustomStackFullWidth>
            </CustomStackFullWidth>
            <CustomStackFullWidth sx={{ paddingY: '10px' }}>
                <CustomColouredTypography
                    color={theme.palette.neutral[500]}
                    onClick={handleClick}
                    sx={{
                        cursor: 'pointer',
                        fontWeight: '400',
                        fontSize: '12px',
                        [theme.breakpoints.down('sm')]: {
                            fontSize: '12px',
                            marginLeft: '0px',
                        },
                    }}
                >
                    Ao entrar, eu concordo com os{' '}
                    <Typography
                        component="span"
                        color={theme.palette.primary.main}
                        sx={{
                            textAlign: 'center',
                            fontWeight: '400',
                            fontSize: '12px',
                            ml: '4px',
                        }}
                    >
                        Termos e Condições
                    </Typography>
                </CustomColouredTypography>
            </CustomStackFullWidth>
            <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                    mt: 2,
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '.6rem',
                    height: '45px',
                }}
                loading={isLoading}
            >
                Entrar
            </LoadingButton>
            <CustomStackFullWidth
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 1 }}
            >
                <CustomTypography fontSize="14px">
                    Não tem uma conta?
                </CustomTypography>
                <CustomLink
                    onClick={() => {
                        setModalFor('sign-up')
                    }}
                    href="#"
                    variant="body2"
                    sx={{ ml: '5px' }}
                >
                    Cadastre-se
                </CustomLink>
            </CustomStackFullWidth>
        </form>
    )
}

export default ManualLogin
