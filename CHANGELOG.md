# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [3.2.1](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.2.0...v3.2.1) (2025-08-27)


### Bug Fixes

* **routing:** remove / page so Next.js redirect '/' -> '/home' takes effect ([f48e832](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/f48e8323441ea8abfeeffaa3b1791b3b7acdefc8))

## [3.2.0](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.8...v3.2.0) (2025-08-27)


### Features

* **routing:** redirect '/' -> '/home' (permanent) as requested ([1a6fdab](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/1a6fdabd07b4996663c3cf728e1bf00a24769b0d))


### Maintenance

* **routing:** set Home as root; remove '/' redirects ([aaf64be](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/aaf64befd12df72a5543eb35529f677b4ef22055))

### [3.1.8](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.7...v3.1.8) (2025-08-27)


### Bug Fixes

* **vercel:** use redirects block for '/' -> '/home' (307) at the platform level ([3a75334](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/3a753347bedfe6535419c175acd181549de9a240))

### [3.1.7](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.6...v3.1.7) (2025-08-27)


### Bug Fixes

* **routing:** disable Edge middleware; temporary 307 '/'->'/home'; simplify vercel routes ([7635fef](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/7635fef2ee1be81765764f15e5e803f27673aa23))

### [3.1.6](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.5...v3.1.6) (2025-08-27)


### Bug Fixes

* **about-us:** decouple from root getServerSideProps to avoid redirect; fetch config locally ([1425346](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/142534662341893eeeacb0ae617303c3ed10b256))

### [3.1.5](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.4...v3.1.5) (2025-08-27)


### Bug Fixes

* **routing:** add client-side fallback redirect from '/' to '/home' via useEffect ([b359111](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/b3591112b1e95f50b4a497c59f71d111f39b4144))

### [3.1.4](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.3...v3.1.4) (2025-08-27)


### Bug Fixes

* **middleware:** broaden matcher to '/:path*' to ensure root redirect runs (307) ([0211e6b](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/0211e6b1c6f098109daac40268de8b2b12485e2e))

### [3.1.3](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.2...v3.1.3) (2025-08-27)


### Bug Fixes

* **vercel:** add platform redirect '/' -> '/home' (307) in vercel.json ([863b66c](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/863b66c20cf1760f42d114470f32811112eba77b))

### [3.1.2](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.1...v3.1.2) (2025-08-27)


### Bug Fixes

* **routing:** add Edge middleware to redirect '/' -> '/home' (307) and SSR fallback ([82da14a](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/82da14a65116088981f219136e06c1013e556e95))

### [3.1.1](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.1.0...v3.1.1) (2025-08-27)


### Bug Fixes

* **routing:** redirect '/' -> '/home' via SSR (temporary 307) ([f84d925](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/f84d9250d140152a75b5403946449ffd4fbd6a13))


### Maintenance

* **ci:** auto-publish GitHub Release via workflow_run; redirect / -> /home in Next.js ([65e0bc6](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/65e0bc6302e990c04054729c6e8d7e94bcc43061))
* **vercel:** trigger Vercel redeploy ([44d2deb](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/44d2deb392c721282c3edd6ccd54e6fdbd489e4c))
* **vercel:** trigger Vercel redeploy ([b7bc339](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/b7bc339736651b52979276d3d7ac368f5dce1b67))

## [3.1.0](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.0.7...v3.1.0) (2025-08-27)


### Features

* **release:** validate automated release pipeline (no-op) ([5963347](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/59633473e2ff972a3c37d1462b0bf0a0e2aa5ff2))


### Continuous Integration

* **release:** add diagnostics, force bash shell, remove npm cache ([9f730b3](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/9f730b335957fe15cd527e3ce0f2c796d1eb52be))
* **release:** always push after standard-version to ensure tag and changelog reach remote ([9df6b0c](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/9df6b0ca0153c91e27064f8f86e7b0f2e1ed873b))
* **release:** avoid npm install, disable husky, run standard-version via npx ([936ac7b](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/936ac7b1f5a674a0861f9afad8a2997a5f36d638))
* **release:** fetch tags and set default bash shell; print tags list for debug ([77c211e](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/77c211ec278294c577e5038642af0ef1f52c539c))
* **release:** fix YAML syntax by quoting step name with colon ([eb508be](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/eb508be7f053732dff6b06d597c059ca443b334f))
* **release:** remove unsupported fetch-tags input; rely on git fetch --tags ([775abc1](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/775abc1c5e8f4ac09346d645a6276c56c66bfd31))

### [3.0.7](https://github.com/sidneysantossp/site-bancas-do-bairro/compare/v3.0.6...v3.0.7) (2025-08-26)


### Maintenance

* **deploy:** trigger Vercel redeploy ([a1ea773](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/a1ea7735de94a48a91b6505422014d89cf7ba193))
* **deploy:** trigger Vercel redeploy at 2025-08-23 09:17:27 -03:00 ([f6fcc81](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/f6fcc8162a587a73274b75ec5125d0b303811c48))
* **release:** alinhar package.json para 3.0.6 e habilitar release automático por tag ([726f5d2](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/726f5d2d1fc944414e3bb55f30001a3d95bf4b83))
* sync local changes before Vercel redeploy ([6911630](https://github.com/sidneysantossp/site-bancas-do-bairro/commit/6911630130e13c5f0c60f10351541ee272c36f6b))

### [3.0.5](https://github.com/sidneysantossp/guiadasbancas/compare/v3.0.2...v3.0.5) (2025-08-21)


### Continuous Integration

* **release:** auto bump version, changelog and tag on push to main ([2915f47](https://github.com/sidneysantossp/guiadasbancas/commit/2915f47965c9f257a1c115d6757d099f5dbe4216))
* **release:** inferir versão automaticamente (feat/fix/BREAKING) no standard-version ([52df6d6](https://github.com/sidneysantossp/guiadasbancas/commit/52df6d66df1ee1ec25be9ccc1a4f50f2b68915b1))
* **web:** redirecionar raiz para /home via Next.js e .htaccess (Apache) ([58bcecb](https://github.com/sidneysantossp/guiadasbancas/commit/58bcecb6d652de1bb105df5a616086786bacbcc5))
* **web:** usar redirect temporário (302) de / para /home no Next.js e Apache para evitar cache durante testes ([ff9694d](https://github.com/sidneysantossp/guiadasbancas/commit/ff9694d1746224c51c699a2a8bcf28221aa29627))

### [3.0.4](https://github.com/sidneysantossp/guiadasbancas/compare/v3.0.2...v3.0.4) (2025-08-21)


### Continuous Integration

* **release:** auto bump version, changelog and tag on push to main ([2915f47](https://github.com/sidneysantossp/guiadasbancas/commit/2915f47965c9f257a1c115d6757d099f5dbe4216))
* **release:** inferir versão automaticamente (feat/fix/BREAKING) no standard-version ([52df6d6](https://github.com/sidneysantossp/guiadasbancas/commit/52df6d66df1ee1ec25be9ccc1a4f50f2b68915b1))
* **web:** redirecionar raiz para /home via Next.js e .htaccess (Apache) ([58bcecb](https://github.com/sidneysantossp/guiadasbancas/commit/58bcecb6d652de1bb105df5a616086786bacbcc5))
* **web:** usar redirect temporário (302) de / para /home no Next.js e Apache para evitar cache durante testes ([ff9694d](https://github.com/sidneysantossp/guiadasbancas/commit/ff9694d1746224c51c699a2a8bcf28221aa29627))

### [3.0.3](https://github.com/sidneysantossp/guiadasbancas/compare/v3.0.2...v3.0.3) (2025-08-21)


### Continuous Integration

* **release:** auto bump version, changelog and tag on push to main ([2915f47](https://github.com/sidneysantossp/guiadasbancas/commit/2915f47965c9f257a1c115d6757d099f5dbe4216))
* **release:** inferir versão automaticamente (feat/fix/BREAKING) no standard-version ([52df6d6](https://github.com/sidneysantossp/guiadasbancas/commit/52df6d66df1ee1ec25be9ccc1a4f50f2b68915b1))
* **web:** redirecionar raiz para /home via Next.js e .htaccess (Apache) ([58bcecb](https://github.com/sidneysantossp/guiadasbancas/commit/58bcecb6d652de1bb105df5a616086786bacbcc5))
* **web:** usar redirect temporário (302) de / para /home no Next.js e Apache para evitar cache durante testes ([ff9694d](https://github.com/sidneysantossp/guiadasbancas/commit/ff9694d1746224c51c699a2a8bcf28221aa29627))

### [3.0.2](https://github.com/sidneysantossp/guiadasbancas/compare/v0.1.0...v3.0.2) (2025-08-20)


### Maintenance

* **next:** allow images from guiadasbancas.com.br domains ([a3c339e](https://github.com/sidneysantossp/guiadasbancas/commit/a3c339e8e04c2a350d32e6eada18ab32ba94fa03))
* **release:** add standard-version workflow and npm scripts for semantic versioning ([4393382](https://github.com/sidneysantossp/guiadasbancas/commit/43933826283ac437167d0e9cabf6d88fa31c943b))
* **release:** configure standard-version (.versionrc.json) ([3c45eb8](https://github.com/sidneysantossp/guiadasbancas/commit/3c45eb8f8d1585114ddeb945841c42551ce2f0b5))
* trigger vercel redeploy (production) ([04271d7](https://github.com/sidneysantossp/guiadasbancas/commit/04271d7e491ac94596dec9c213f113d5b4fe4b04))
* vercel redeploy after envs update ([9233a62](https://github.com/sidneysantossp/guiadasbancas/commit/9233a623d9a327d209142abc7ac15d7f18e247de))
* vercel redeploy after envs update ([48f3980](https://github.com/sidneysantossp/guiadasbancas/commit/48f3980a1dafe7630b74d2eb3d2b6469ed46b7b0))

### [3.0.1](https://github.com/sidneysantossp/guiadasbancas/compare/v0.1.0...v3.0.1) (2025-08-20)


### Maintenance

* **next:** allow images from guiadasbancas.com.br domains ([a3c339e](https://github.com/sidneysantossp/guiadasbancas/commit/a3c339e8e04c2a350d32e6eada18ab32ba94fa03))
* **release:** add standard-version workflow and npm scripts for semantic versioning ([4393382](https://github.com/sidneysantossp/guiadasbancas/commit/43933826283ac437167d0e9cabf6d88fa31c943b))
* **release:** configure standard-version (.versionrc.json) ([3c45eb8](https://github.com/sidneysantossp/guiadasbancas/commit/3c45eb8f8d1585114ddeb945841c42551ce2f0b5))
* trigger vercel redeploy (production) ([04271d7](https://github.com/sidneysantossp/guiadasbancas/commit/04271d7e491ac94596dec9c213f113d5b4fe4b04))
* vercel redeploy after envs update ([9233a62](https://github.com/sidneysantossp/guiadasbancas/commit/9233a623d9a327d209142abc7ac15d7f18e247de))
* vercel redeploy after envs update ([48f3980](https://github.com/sidneysantossp/guiadasbancas/commit/48f3980a1dafe7630b74d2eb3d2b6469ed46b7b0))

chore(deploy): trigger Vercel redeploy at 2025-08-23 09:17:27 -03:00
