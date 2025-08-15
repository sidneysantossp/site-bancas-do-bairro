import React, { useState } from 'react'
import CustomDialogConfirm from '../custom-dialog/confirm/CustomDialogConfirm'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { OrderApi } from '@/hooks/react-query/config/orderApi'
import { toast } from 'react-hot-toast'
import { onErrorResponse } from '../ErrorResponse'
import Typography from '@mui/material/Typography'
import { PrimaryButton } from '../products-page/FoodOrRestaurant'

const PaymentUpdate = ({ id, refetchOrderDetails, refetchTrackData }) => {
    const [openModal, setOpenModal] = useState(false)
    const { t } = useTranslation()
    const { mutate: paymentMethodUpdateMutation, isLoading: orderLoading } =
        useMutation(
            'order-payment-method-update',
            OrderApi.FailedPaymentMethodUpdate
        )

    const handleOnSuccess = () => {
        const handleSuccess = (response) => {
            toast.success(response.data.message)
            refetchOrderDetails()
            refetchTrackData()
        }
        const formData = {
            order_id: id,
            _method: 'put',
        }
        paymentMethodUpdateMutation(formData, {
            onSuccess: handleSuccess,
            onError: onErrorResponse,
        })
        setOpenModal(false)
    }
    return (
        <>
            <PrimaryButton
                variant="contained"
                onClick={() => setOpenModal(true)}
                sx={{ width: '100%' }}
            >
                <Typography variant="h5">
                    Mudar para Pagamento na Entrega
                </Typography>
            </PrimaryButton>
            <CustomDialogConfirm
                dialogTexts="Tem certeza que deseja mudar este pedido para Pagamento na Entrega?"
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={handleOnSuccess}
            />
        </>
    )
}

PaymentUpdate.propTypes = {}

export default PaymentUpdate
