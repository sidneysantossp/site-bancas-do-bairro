import React, { useState } from 'react'
import { Grid, Typography, Stack } from '@mui/material'
import {
    SaveButton,
    CustomDivWithBorder,
    CustomProfileTextfield,
} from './Profile.style'
import { useFormik } from 'formik'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useTranslation } from 'react-i18next'
import * as Yup from 'yup'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { useTheme } from '@mui/material/styles'

const AccountInformation = ({ data, formSubmit }) => {
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? (fallback ?? key) : translated
    }
    const theme = useTheme()
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setConfirmShowPassword] = useState(false)
    const { f_name, l_name, phone, email } = data
    const profileFormik = useFormik({
        initialValues: {
            name: f_name ? `${f_name} ${l_name}` : '',
            email: email ? email : '',
            phone: phone ? phone : '',
            password: '',
            confirm_password: '',
            button_type: 'change_password',
        },
        validationSchema: Yup.object({
            password: Yup.string()
                .required(tt('No password provided.', 'Senha obrigatória.'))
                .min(
                    6,
                    tt('Password is too short - should be 6 chars minimum.', 'Senha muito curta - mínimo de 6 caracteres.')
                ),
            confirm_password: Yup.string()
                .required(tt('Confirm Password', 'Confirmar Senha'))
                .oneOf([Yup.ref('password'), null], tt('Passwords must match', 'As senhas devem coincidir')),
        }),
        onSubmit: async (values, helpers) => {
            try {
                formSubmitOnSuccess(values)
            } catch (err) {}
        },
    })
    const formSubmitOnSuccess = (values) => {
        setShowPassword(false)
        setConfirmShowPassword(false)
        formSubmit(values)
    }

    return (
        <>
            <Typography
                fontSize="16px"
                fontWeight="500"
                color={theme.palette.neutral[1000]}
            >
                {tt('Change Password', 'Alterar Senha')}
            </Typography>
            <CustomDivWithBorder>
                <form noValidate onSubmit={profileFormik.handleSubmit}>
                    <Grid container md={12} xs={12} spacing={2}>
                        <Grid item md={5} xs={12}>
                            <CustomProfileTextfield
                                required
                                id="password"
                                variant="outlined"
                                placeholder={tt('8+ Character', '8+ Caracteres')}
                                value={profileFormik.values.password}
                                onChange={profileFormik.handleChange}
                                name="password"
                                label={tt('Password', 'Senha')}
                                type={showPassword ? 'text' : 'password'}
                                InputLabelProps={{ shrink: true }}
                                error={
                                    profileFormik.touched.password &&
                                    Boolean(profileFormik.errors.password)
                                }
                                helperText={
                                    profileFormik.touched.password &&
                                    profileFormik.errors.password
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prevState) =>
                                                            !prevState
                                                    )
                                                }
                                                //   onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item md={5} xs={12}>
                            <CustomProfileTextfield
                                required
                                id="confirm_password"
                                label={tt('Confirm Password', 'Confirmar Senha')}
                                placeholder={tt('8+ Character', '8+ Caracteres')}
                                variant="outlined"
                                name="confirm_password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={profileFormik.values.confirm_password}
                                onChange={profileFormik.handleChange}
                                InputLabelProps={{ shrink: true }}
                                error={
                                    profileFormik.touched.confirm_password &&
                                    Boolean(
                                        profileFormik.errors.confirm_password
                                    )
                                }
                                helperText={
                                    profileFormik.touched.confirm_password &&
                                    profileFormik.errors.confirm_password
                                }
                                touched={profileFormik.touched.confirm_password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() =>
                                                    setConfirmShowPassword(
                                                        (prevState) =>
                                                            !prevState
                                                    )
                                                }
                                                //   onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <Visibility />
                                                ) : (
                                                    <VisibilityOff />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack>
                                <SaveButton
                                    sx={{ padding: '10px 20px' }}
                                    fullWidth
                                    variant="contained"
                                    type="submit"
                                >
                                    {tt('Change', 'Alterar')}
                                </SaveButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </CustomDivWithBorder>
        </>
    )
}

export default AccountInformation
