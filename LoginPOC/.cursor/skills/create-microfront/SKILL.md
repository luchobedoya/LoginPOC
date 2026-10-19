---
name: create-microfront
description: Crea un microfront SVN nuevo en Angular 20 standalone con toolkit, arquitectura limpia, Module Federation, manifest, BDS, Caribe, interceptors, pricing, pruebas y pipeline. Usar al iniciar un dominio que no existe en el monorepo. Paso a paso en .agents/skills/create-microfront/SKILL.md y CREATE_MICROFRONT_SVN.md.
---

# Crear microfront (Cursor)

Guía de dominio: `.agents/skills/create-microfront/SKILL.md`. Ante un conflicto, manda `CREATE_MICROFRONT_SVN.md`. Referencia: `mf-payment-history_Front`.

## Antes de crear

Si la funcionalidad pertenece a un dominio que ya tiene microfront, agrégala como ruta ahí. No abras un microfront nuevo.

## Orden

Trabaja en la carpeta `mf-<nombre>_Front`. El proyecto Angular se llama `mf-<nombre>` (sin `_Front`). Webpack `name`: `mf<Nombre>` en camelCase. `rootSelector` y `ngModuleName`: `svn-mf-<nombre>`.

1. Proyecto Angular 20 independiente, prefix `svn`, scss, sin SSR. Sigue el comando de la guía.
2. `.npmrc` del registry del banco, copiado de un microfront existente.
3. Tooling y Jest (skills `tooling` y `testing`). Script `"prepare": "cd .. && husky"`.
4. Module Federation: `exposes['./main'] = './src/bootstrap.ts'`, `setupMicroFrontend`, `provideMicroFront()`.
5. Entrada en `general_Conf/manifest/manifest.json` con `isIndependent: true`, `type: "module"`, `remoteName`, `ngModuleName`, `routePath`.
6. Environments con `BDS_VERSION`, URLs de BDS y placeholders de `featureId`, `urlEndpoint`, `mfRouteFlag` si no te los dieron.
7. Estilos BDS dinámicos y Caribe para la UI.
8. Providers `@svn/*`, cuatro interceptors y `validateAccessPricingGuard` en cada ruta de funcionalidad.
9. Capas `domain/`, `ui/`, `infrastructure/`.
10. Playwright en `acceptancetest/` y pipeline `microfront-pipeline-template-v3.yml`.

`npm install` solo limpio, sin flags. Si falla, informa y no reintentes con `--force` ni `--legacy-peer-deps`.

## Verificar

Dentro del microfront: `npm run build`, `npm run test`, `npm run lint`. Compara `app.config.ts`, `bootstrap.ts`, `webpack.config.js`, `jest.config.ts` y `.eslintrc.json` con `mf-payment-history_Front`. Sin `CUSTOM_ELEMENTS_SCHEMA` ni `NO_ERRORS_SCHEMA`.
