const http = require('http');
const https = require('https');

const base = process.argv[2] || 'http://localhost:3013';
const paths = ['/', '/home', '/categories', '/banca', '/privacy-policy', '/refund-policy', '/shipping-policy', '/404', '/does-not-exist-xyz'];

function getClient(url) {
  return url.startsWith('https') ? https : http;
}

let fails = 0;
let done = 0;

console.log(`Iniciando smoke tests em ${base} ...`);

paths.forEach((p) => {
  const url = base + p;
  const client = getClient(url);
  const req = client.get(url, (res) => {
    const code = res.statusCode || 0;
    const expected = (p === '/404' || p === '/does-not-exist-xyz') ? (code === 404 || code === 200) : (code >= 200 && code < 400);
    if (expected) {
      console.log(`OK  ${code} -> ${url}`);
    } else {
      console.log(`ERR ${code} -> ${url}`);
      fails++;
    }
    res.resume();
    if (++done === paths.length) finish();
  });
  req.on('error', (err) => {
    console.log(`ERR 000 -> ${url} - ${err.message}`);
    fails++;
    if (++done === paths.length) finish();
  });
  req.setTimeout(8000, () => {
    req.abort();
  });
});

function finish() {
  console.log(`Resumo: FAIL=${fails} de ${paths.length}`);
  process.exit(fails > 0 ? 1 : 0);
}