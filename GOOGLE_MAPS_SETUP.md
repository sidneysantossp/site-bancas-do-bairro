# Configuração do Google Maps API

## Pré-requisitos

1. Conta no Google Cloud Platform
2. Projeto criado no Google Cloud Console
3. Faturamento ativado (obrigatório, mesmo para uso gratuito)

## APIs Necessárias

Ative as seguintes APIs no Google Cloud Console:

- **Maps JavaScript API** - Para exibir mapas
- **Geocoding API** - Para converter endereços em coordenadas
- **Places API** - Para busca de lugares e autocomplete

## Configuração da API Key

### 1. Criar API Key

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto
3. Vá em "APIs e Serviços" → "Credenciais"
4. Clique em "Criar Credenciais" → "Chave de API"
5. Copie a chave gerada

### 2. Configurar Restrições (Recomendado)

**Restrições de Aplicativo:**
- Tipo: Referrers HTTP (sites)
- Referrers permitidos:
  ```
  http://localhost:3001/*
  http://localhost:3000/*
  https://seu-dominio.com/*
  ```

**Restrições de API:**
- Maps JavaScript API
- Geocoding API
- Places API

### 3. Configurar no Projeto

Adicione no arquivo `.env.development`:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAP_KEY=sua_api_key_aqui
```

Adicione no arquivo `.env.production`:

```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAP_KEY=sua_api_key_aqui
```

## Verificação

Após configurar, reinicie o servidor Next.js:

```bash
npm run dev
```

O Google Maps deve carregar sem erros na seleção de localização.

## Troubleshooting

### Erro: "Esta Página Não Carregou O Google Maps Corretamente"

**Possíveis causas:**
1. API Key não configurada
2. APIs não ativadas no Google Cloud
3. Faturamento não ativado
4. Restrições muito restritivas
5. Cota excedida

**Soluções:**
1. Verificar se `NEXT_PUBLIC_GOOGLE_MAP_KEY` está definida
2. Ativar todas as APIs necessárias
3. Ativar faturamento no projeto
4. Verificar restrições da API Key
5. Verificar uso na dashboard do Google Cloud

### Erro: "RefererNotAllowedMapError"

- Verificar restrições de referrer
- Adicionar domínio atual nas restrições

### Erro: "ApiNotActivatedMapError"

- Ativar APIs necessárias no Google Cloud Console

## Custos

O Google Maps oferece:
- **$200 de crédito gratuito por mês**
- **28.500 carregamentos de mapa gratuitos por mês**
- **40.000 geocodificações gratuitas por mês**

Para a maioria dos projetos, isso é suficiente para uso gratuito.

## Backup - Alternativas

Se o Google Maps não funcionar, o sistema tem fallbacks:
1. OpenStreetMap para reverse geocoding
2. Geolocalização por IP
3. Zona padrão (ID: 1)

## Manutenção

- Monitorar uso na dashboard do Google Cloud
- Verificar logs de erro no console do navegador
- Manter API Key segura (não commitar no git)
- Renovar restrições se necessário
