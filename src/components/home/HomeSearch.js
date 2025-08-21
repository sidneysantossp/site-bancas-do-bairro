import React, { useEffect, useRef, useState } from 'react'
import { Box } from '@mui/material'
import CustomSearch from '../custom-search/CustomSearch'
import { useRouter } from 'next/router'
import SearchSuggestionsBottom from '../search/SearchSuggestionsBottom'
const HomeSearch = () => {
    const [openSearchSuggestions, setOpenSearchSuggestions] = useState(false)
    const [selectedValue, setSelectedValue] = useState('')
    const [zoneid, setZoneid] = useState(null)
    const router = useRouter()
    const searchRef = useRef(null)

    useEffect(() => {
        // Carrega zoneid apenas no cliente
        if (typeof window !== 'undefined') {
            try {
                const z = window.localStorage.getItem('zoneid')
                setZoneid(z)
            } catch (e) {
                setZoneid(null)
            }
        }
    }, [])

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setOpenSearchSuggestions(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [searchRef])
    const handleOnFocus = () => {
        setOpenSearchSuggestions(true)
        if (typeof window !== 'undefined') {
            try {
                window.localStorage.setItem('bg', true)
            } catch (e) {}
        }
    }
    const handleKeyPress = (value) => {
        setOpenSearchSuggestions(false)

        if (typeof window !== 'undefined') {
            try {
                let getItem = JSON.parse(window.localStorage.getItem('searchedValues'))
                if (getItem && getItem.length > 0) {
                    if (value !== '') {
                        getItem.push(value)
                    }
                    window.localStorage.setItem('searchedValues', JSON.stringify(getItem))
                } else {
                    if (value !== '') {
                        let newData = []
                        newData.push(value)
                        window.localStorage.setItem('searchedValues', JSON.stringify(newData))
                    }
                }
            } catch (e) {}
        }
        if (value !== '') {
            router.push(
                {
                    pathname: router.pathname,
                    query: {
                        query: value,
                    },
                },
                undefined,
                { shallow: true }
            )
        }
    }
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                position: 'relative',
                mb: '1rem',
            }}
            onFocus={() => handleOnFocus()}
            ref={searchRef}
        >
            {zoneid && router.pathname !== '/' && (
                <>
                    <CustomSearch
                        label="Search..."
                        handleSearchResult={handleKeyPress}
                        selectedValue={selectedValue}
                    />
                    {openSearchSuggestions && (
                        <SearchSuggestionsBottom
                            setOpenSearchSuggestions={setOpenSearchSuggestions}
                            setSelectedValue={setSelectedValue}
                        />
                    )}
                </>
            )}
        </Box>
    )
}
export default HomeSearch
