// Firebase Service Worker desabilitado
// Este arquivo existe apenas para evitar erros de carregamento

console.log('Firebase Service Worker desabilitado')

// Service Worker vazio - sem funcionalidade
self.addEventListener('install', function(event) {
    console.log('Service Worker instalado (vazio)')
})

self.addEventListener('activate', function(event) {
    console.log('Service Worker ativado (vazio)')
})

// Função vazia para compatibilidade
function onBackgroundMessage(payload) {
    // Service Worker desabilitado - função vazia
    console.log('onBackgroundMessage chamado (desabilitado)', payload)
}
