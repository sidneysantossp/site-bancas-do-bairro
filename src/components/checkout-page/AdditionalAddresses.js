import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
    CustomAccordion,
    CustomStackFullWidth,
    CustomTextField,
} from '@/styled-components/CustomStyles.style'
import {
    AccordionDetails,
    AccordionSummary,
    Grid,
    Typography,
    Stack,
} from '@mui/material'
import { ACTIONS } from './states/additionalInformationStates'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import { useTheme } from '@mui/styles'
const AdditionalAddresses = (props) => {
    const {
        t,
        additionalInformationStates,
        additionalInformationDispatch,
        orderType,
    } = props
    const theme = useTheme()
    const { i18n } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        // Force fallback when provided for checkout labels
        return fallback ?? translated ?? key
    }
    const note_text =
        orderType === 'take_away' ? 'Additional Note' : 'Additional Information'
    const [expanded, setExpanded] = useState(false)
    const handleChange = () => {
        setExpanded(!expanded)
    }
    return (
        <CustomStackFullWidth>
            <CustomAccordion
                onChange={handleChange}
                background={theme.palette.background.paper}
            >
                <AccordionSummary
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        pb="-10px"
                    >
                        <Typography
                            fontSize="16px"
                            fontWeight="700"
                            no_margin_top="true"
                        >
                            {orderType === 'take_away'
                                ? tt(note_text, 'Observação adicional')
                                : tt(note_text, 'Informações adicionais')}
                        </Typography>
                        {expanded ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                    </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ marginTop: '-16px' }}>
                    <CustomStackFullWidth mt=".5rem">
                        <Grid container spacing={3}>
                            {orderType !== 'take_away' &&
                                orderType !== 'dine_in' && (
                                    <>
                                        <Grid item xs={12}>
                                            <CustomTextField
                                                label={tt('Street number', 'Número da rua')}
                                                value={
                                                    additionalInformationStates.streetNumber
                                                }
                                                fullWidth
                                                onChange={(e) =>
                                                    additionalInformationDispatch(
                                                        {
                                                            type: ACTIONS.setStreetNumber,
                                                            payload:
                                                                e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <CustomTextField
                                                label={tt('House number', 'Número da casa')}
                                                value={
                                                    additionalInformationStates.houseNumber
                                                }
                                                fullWidth
                                                onChange={(e) =>
                                                    additionalInformationDispatch(
                                                        {
                                                            type: ACTIONS.setHouseNumber,
                                                            payload:
                                                                e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <CustomTextField
                                                label={tt('Floor', 'Andar')}
                                                value={
                                                    additionalInformationStates.floor
                                                }
                                                fullWidth
                                                onChange={(e) =>
                                                    additionalInformationDispatch(
                                                        {
                                                            type: ACTIONS.setFloor,
                                                            payload:
                                                                e.target.value,
                                                        }
                                                    )
                                                }
                                            />
                                        </Grid>
                                    </>
                                )}
                            <Grid item xs={12}>
                                <CustomTextField
                                    multiline
                                    rows={4}
                                    placeholder={tt(
                                        'ex-lease provide an extra napkin',
                                        'ex.: por favor, forneça um guardanapo extra'
                                    )}
                                    label={tt('Note', 'Observação')}
                                    value={additionalInformationStates.note}
                                    fullWidth
                                    onChange={(e) =>
                                        additionalInformationDispatch({
                                            type: ACTIONS.setNote,
                                            payload: e.target.value,
                                        })
                                    }
                                />
                            </Grid>
                        </Grid>
                    </CustomStackFullWidth>
                </AccordionDetails>
            </CustomAccordion>
        </CustomStackFullWidth>
    )
}

AdditionalAddresses.propTypes = {}

export default AdditionalAddresses
