import React from 'react'

// Simple storefront pin icon to represent a "banca"
// Dimensions match the previous icon to preserve layout
const BancaNearbyIcon = () => (
    <svg
        width="109"
        height="112"
        viewBox="0 0 109 112"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        {/* Map pin backdrop */}
        <path
            d="M54.5 6.5C37.1 6.5 23 20.6 23 38c0 12.7 7.2 23.6 17.6 28.8L54.5 91l13.9-24.2C78.8 61.6 86 50.7 86 38 86 20.6 71.9 6.5 54.5 6.5Z"
            fill="#F20305"
        />
        {/* Inner circle */}
        <circle cx="54.5" cy="38" r="21.5" fill="#FFFFFF" />

        {/* Storefront icon (awning + door) */}
        {/* Awning stripes */}
        <path d="M39.5 33h30v6c0 1.1-.9 2-2 2h-26c-1.1 0-2-.9-2-2v-6z" fill="#FF8200" />
        <path d="M41 33h5v8h-5V33z" fill="#FFC37A" />
        <path d="M48 33h5v8h-5V33z" fill="#FFD39C" />
        <path d="M55 33h5v8h-5V33z" fill="#FFC37A" />
        <path d="M62 33h5v8h-5V33z" fill="#FFD39C" />

        {/* Shop body */}
        <rect x="39.5" y="41" width="30" height="16" rx="2" fill="#E9EEF7" />
        {/* Door */}
        <rect x="52.5" y="44" width="6" height="13" rx="1" fill="#B5DBFF" />
        {/* Window */}
        <rect x="42.5" y="44" width="7" height="7" rx="1" fill="#B5DBFF" />
        <rect x="59.5" y="44" width="7" height="7" rx="1" fill="#B5DBFF" />

        {/* Soft shadow base */}
        <ellipse cx="54.5" cy="90" rx="27.5" ry="7" fill="#FF8200" fillOpacity="0.2" />
    </svg>
)

export default BancaNearbyIcon
