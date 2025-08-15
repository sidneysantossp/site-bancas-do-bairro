import toast from 'react-hot-toast'
import { Paper, Stack } from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import React from 'react'

export const handleProductVariationRequirementsToaster = (
    text,
    checkingQuantity,
    t
) => {
    if (checkingQuantity) {
        toast.custom(
            () => (
                <Paper sx={{ padding: '10px' }}>
                    <span>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WarningAmberIcon color="warning" />
                            <p
                                style={{
                                    paddingLeft: '0px',
                                    paddingRight: '5px',
                                }}
                            >
                                Variação selecionada denominada{' '}
                                <span style={{ fontWeight: 'bold' }}>{text?.name}</span>{' '}
                                deve estar entre o mínimo{' '}
                                <span style={{ fontWeight: 'bold' }}>{text?.min}</span>{' '}
                                e o máximo{' '}
                                <span style={{ fontWeight: 'bold' }}>{text?.max}</span>
                            </p>
                        </Stack>
                    </span>
                </Paper>
            ),
            {
                id: text,
            }
        )
    } else {
        toast.custom(
            () => (
                <Paper sx={{ padding: '10px' }}>
                    <span>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <WarningAmberIcon color="warning" />
                            <p
                                style={{
                                    paddingLeft: '0px',
                                    paddingRight: '5px',
                                }}
                            >
                                Variação{' '}
                                <span style={{ fontWeight: 'bold' }}> {text}</span>{' '}
                                não pode ficar sem seleção.
                            </p>
                        </Stack>
                    </span>
                </Paper>
            ),
            {
                id: text,
            }
        )
    }
}
