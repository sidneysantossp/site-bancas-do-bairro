import { createGlobalStyle } from 'styled-components'

const MapCustomStyle = createGlobalStyle`
  /* Traduzir o botão "Select" para "Selecionar" */
  .pac-container .pac-item {
    font-family: 'Roboto', sans-serif;
  }
  
  /* Traduzir botão Select para Selecionar */
  button[jstcache="403"] {
    font-size: 0 !important;
  }
  
  button[jstcache="403"]::after {
    content: "Selecionar";
    font-size: 16px;
  }

  /* Estilo para esconder "undefined" no campo de busca */
  .MuiAutocomplete-input[value="undefined"] {
    color: transparent !important;
  }
  
  .MuiAutocomplete-input[placeholder="undefined"] {
    color: transparent !important;
  }
`

export default MapCustomStyle
