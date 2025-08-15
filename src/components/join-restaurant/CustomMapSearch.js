import React from 'react'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { Autocomplete, Paper, styled, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'
import SearchIcon from '@mui/icons-material/Search'
import { useDispatch } from 'react-redux'
import { setLocation, setFormattedAddress } from '@/redux/slices/addressData'

const CssTextField = styled(TextField)(({ theme, border }) => ({
    '& label.Mui-focused': {
        color: '#EF7822',
        background: '#fff',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#EF7822',
        background: '#fff',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiFormLabel-root': {
        lineHeight: '1em !important',
        fontSize: '14px',
    },
    '& .MuiOutlinedInput-input': {
        fontWeight: '400',
    },
    '& .MuiOutlinedInput-root': {
        height: '45px',
        padding: '4px 4px 4px 16px',
        fontSize: '14px',
        fontWeight: '400 !important',
        border: border ? border : '',
        '& fieldset': {
            borderColor: '#EF7822',
        },
        '&:hover fieldset': {
            borderColor: '#EF7822',
            border: `1px solid ${border}`,
        },
        '&.Mui-focused fieldset': {
            borderColor: '#EF7822',
        },
    },
}))
const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
    '& .MuiAutocomplete-root': {
        zIndex: 1500,
    },
}))
const CustomMapSearch = ({
    border,
    setSearchKey,
    setEnabled,
    predictions,
    setPlaceId,
    setPlaceDescription,
    setPlaceDetailsEnabled,
    isLoadingPlacesApi,
    currentLocationValue,
}) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    
    // Lista local de endereços brasileiros para autocomplete com coordenadas
    const localAddresses = [
        { place_id: 'local_1', description: 'São Paulo, SP - Brasil', lat: -23.5505, lng: -46.6333 },
        { place_id: 'local_2', description: 'Rio de Janeiro, RJ - Brasil', lat: -22.9068, lng: -43.1729 },
        { place_id: 'local_3', description: 'Belo Horizonte, MG - Brasil', lat: -19.9167, lng: -43.9345 },
        { place_id: 'local_4', description: 'Brasília, DF - Brasil', lat: -15.7939, lng: -47.8828 },
        { place_id: 'local_5', description: 'Salvador, BA - Brasil', lat: -12.9714, lng: -38.5014 },
        { place_id: 'local_6', description: 'Fortaleza, CE - Brasil', lat: -3.7319, lng: -38.5267 },
        { place_id: 'local_7', description: 'Recife, PE - Brasil', lat: -8.0476, lng: -34.8770 },
        { place_id: 'local_8', description: 'Porto Alegre, RS - Brasil', lat: -30.0346, lng: -51.2177 },
        { place_id: 'local_9', description: 'Curitiba, PR - Brasil', lat: -25.4284, lng: -49.2733 },
        { place_id: 'local_10', description: 'Goiânia, GO - Brasil', lat: -16.6869, lng: -49.2648 },
        { place_id: 'local_11', description: 'Manaus, AM - Brasil', lat: -3.1190, lng: -60.0217 },
        { place_id: 'local_12', description: 'Belém, PA - Brasil', lat: -1.4558, lng: -48.5044 },
        { place_id: 'local_13', description: 'Vitória, ES - Brasil', lat: -20.3155, lng: -40.3128 },
        { place_id: 'local_14', description: 'Natal, RN - Brasil', lat: -5.7945, lng: -35.2110 },
        { place_id: 'local_15', description: 'João Pessoa, PB - Brasil', lat: -7.1195, lng: -34.8450 },
        { place_id: 'local_16', description: 'Aracaju, SE - Brasil', lat: -10.9472, lng: -37.0731 },
        { place_id: 'local_17', description: 'Maceió, AL - Brasil', lat: -9.6658, lng: -35.7353 },
        { place_id: 'local_18', description: 'Teresina, PI - Brasil', lat: -5.0892, lng: -42.8019 },
        { place_id: 'local_19', description: 'São Luís, MA - Brasil', lat: -2.5387, lng: -44.2825 },
        { place_id: 'local_20', description: 'Campo Grande, MS - Brasil', lat: -20.4697, lng: -54.6201 },
        { place_id: 'local_21', description: 'Cuiabá, MT - Brasil', lat: -15.6014, lng: -56.0979 },
        { place_id: 'local_22', description: 'Rio Branco, AC - Brasil', lat: -9.9753, lng: -67.8243 },
        { place_id: 'local_23', description: 'Porto Velho, RO - Brasil', lat: -8.7612, lng: -63.9039 },
        { place_id: 'local_24', description: 'Boa Vista, RR - Brasil', lat: 2.8235, lng: -60.6758 },
        { place_id: 'local_25', description: 'Macapá, AP - Brasil', lat: 0.0389, lng: -51.0664 },
        { place_id: 'local_26', description: 'Palmas, TO - Brasil', lat: -10.1840, lng: -48.3336 }
    ];

    return (
        <CustomStackFullWidth mb="1rem">
            <Paper
                variant="outlined"
                sx={{
                    width: '100%',
                }}
            >
                <CustomAutocomplete
                    fullWidth
                    freeSolo
                    disableClearable
                    id="address-autocomplete"
                    getOptionLabel={(option) => {
                        if (typeof option === 'string') return option;
                        return option?.description || '';
                    }}
                    options={localAddresses}
                    defaultValue=""
                    loading={false}
                    loadingText="Carregando..."
                    noOptionsText="Digite para buscar cidades"
                    openOnFocus
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    onChange={(event, value) => {
                        if (value) {
                            console.log('Selected address:', value);
                            
                            // Se é um endereço local com coordenadas
                            if (value.lat && value.lng) {
                                // Atualizar diretamente as coordenadas no mapa
                                setSearchKey({
                                    description: value.description,
                                    lat: value.lat,
                                    lng: value.lng
                                });
                                
                                // Simular seleção de lugar para atualizar o mapa
                                setPlaceId(value.place_id);
                                setPlaceDescription(value.description);
                                setPlaceDetailsEnabled(true);
                                
                                // Atualizar Redux store para sincronizar com o mapa
                                dispatch(setLocation({
                                    lat: value.lat,
                                    lng: value.lng
                                }));
                                dispatch(setFormattedAddress(value.description));
                                
                                // Notificar componentes pais sobre a nova localização
                                if (typeof window !== 'undefined') {
                                    localStorage.setItem('currentLatLng', JSON.stringify({
                                        lat: value.lat,
                                        lng: value.lng
                                    }));
                                    localStorage.setItem('location', value.description);
                                }
                            } else {
                                // Lógica original para endereços da API
                                if (value.place_id) {
                                    setPlaceId(value?.place_id)
                                    setPlaceDescription(value?.description)
                                }
                                setPlaceDetailsEnabled(true)
                            }
                        }
                        setPlaceDescription(value?.description)
                    }}
                    clearOnBlur={true}
                    renderInput={(params) => (
                        <CssTextField
                            border={border}
                            {...params}
                            placeholder={'Pesquisar localização aqui...'}
                            onChange={(event) => {
                                setSearchKey({
                                    description: event.target.value,
                                })
                                if (event.target.value) {
                                    setEnabled(true)
                                } else {
                                    setEnabled(false)
                                }
                            }}
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <>
                                        <SearchIcon
                                            color="disabled"
                                            sx={{ fontSize: '1.7rem' }}
                                        />
                                        {params.InputProps.startAdornment}
                                    </>
                                ),
                            }}
                        />
                    )}
                />
            </Paper>
        </CustomStackFullWidth>
    )
}
export default CustomMapSearch
