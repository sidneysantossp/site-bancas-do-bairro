# 🏪 Site Bancas do Bairro

Plataforma web para conectar bancas de jornal do bairro com seus clientes, permitindo pedidos online de produtos como jornais, revistas, doces, bebidas e muito mais.

## 🚀 Tecnologias

- **Next.js 15.1.6** - Framework React com SSR/SSG
- **React 18.2.0** - Biblioteca principal para UI
- **Material-UI (MUI) 5.x** - Sistema de design e componentes
- **Redux Toolkit** - Gerenciamento de estado global
- **React Query** - Cache e sincronização de dados da API
- **Styled Components** - CSS-in-JS
- **i18next** - Sistema de internacionalização

## 📋 Scripts Disponíveis

### `npm run dev`
Inicia o servidor de desenvolvimento.\
Abra [http://localhost:3000](http://localhost:3000) para ver no navegador.

### `npm run build`
Cria a versão de produção otimizada do projeto.

### `npm start`
Inicia o servidor de produção (após o build).

## 🌍 Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```bash
NEXT_PUBLIC_GOOGLE_MAP_KEY=sua_chave_do_google_maps
NEXT_PUBLIC_BASE_URL=http://localhost/admin-bancas-do-bairro
NEXT_CLIENT_HOST_URL=http://localhost:3000
NEXT_PUBLIC_SITE_VERSION=3.1
```

## 🚀 Deploy

Este projeto está configurado para deploy na Vercel:

1. Conecte este repositório à sua conta Vercel
2. Configure as variáveis de ambiente na Vercel
3. Deploy automático a cada push na branch main

## 📱 Funcionalidades

- ✅ Catálogo de produtos das bancas
- ✅ Sistema de carrinho de compras
- ✅ Autenticação de usuários
- ✅ Geolocalização
- ✅ Sistema de pagamentos
- ✅ Interface responsiva
- ✅ Múltiplos idiomas (pt-br principal)

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
