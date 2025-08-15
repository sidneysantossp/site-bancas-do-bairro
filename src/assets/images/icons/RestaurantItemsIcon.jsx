import { useTheme } from '@mui/material'
import React from 'react'

const RestaurantItemsIcon = () => {
    const theme = useTheme()
    return (
        <svg
            width="13"
            height="12"
            viewBox="0 0 13 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Simple product/box icon */}
            <path
                d="M1.5 3L6.5 1L11.5 3V9L6.5 11L1.5 9V3Z"
                stroke={theme.palette.primary.main}
                strokeWidth="1"
                fill="none"
                strokeLinejoin="round"
            />
            <path
                d="M1.5 3L6.5 5L11.5 3"
                stroke={theme.palette.primary.main}
                strokeWidth="1"
                fill="none"
                strokeLinejoin="round"
            />
            <path
                d="M6.5 5V11"
                stroke={theme.palette.primary.main}
                strokeWidth="1"
                fill="none"
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default RestaurantItemsIcon
