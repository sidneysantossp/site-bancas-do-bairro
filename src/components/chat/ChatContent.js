import React, { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import ContactLists from './ContactLists'
import ChatContactSearch from './ChatContactSearch'
import ChatWithAdmin from './ChatWithAdmin'
import { useTranslation } from 'react-i18next'
import ChatUserTab from './ChatUserTab'
import Skeleton from '@mui/material/Skeleton'

const ChatContent = (props) => {
    const {
        setUserType,
        handleToggleSidebar,
        selectedId,
        handleReset,
        searchSubmitHandler,
        channelLoading,
        isLoading,
        channelList,
        handleChannelOnClick,
        searchValue,
        setSearchValue,
        handleSearch,
        useType,
        setChannelId,
        channelData,
        isFetched,
    } = props
    const [channelListItems, setChannelListItems] = useState([])
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'))
    const { t } = useTranslation()
    const tt = (key, fallback) => {
        const translated = t(key)
        return translated === key ? (fallback ?? key) : translated
    }

    const handleChatWithAdmin = () => {
        if (isFetched) {
            if (channelList.length === 0 && useType === 'admin') {
                return (
                    <ChatWithAdmin
                        handleChannelOnClick={handleChannelOnClick}
                    />
                )
            }
        } else {
            return <Skeleton variant="rectangle" width="100%" height="50px" />
        }
    }
    return (
        <Stack spacing={1} padding=".5rem">
            <Typography
                sx={{ paddingInline: '1rem', paddingBlockStart: '.5rem' }}
                fontSize="18px"
                fontWeight="700"
            >
                {tt('Messages', 'Mensagens')}
            </Typography>
            <ChatContactSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                handleSearch={handleSearch}
                isLoading={isLoading}
                handleReset={handleReset}
                searchSubmitHandler={searchSubmitHandler}
            />
            <ChatUserTab
                setUserType={setUserType}
                useType={useType}
                setChannelId={setChannelId}
            />
            {handleChatWithAdmin()}
            <ContactLists
                useType={useType}
                channelList={channelList}
                handleChannelOnClick={handleChannelOnClick}
                channelLoading={channelLoading}
                selectedId={selectedId}
            />
        </Stack>
    )
}
export default ChatContent
