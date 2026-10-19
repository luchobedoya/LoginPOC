---
name: module-federation
description: Expone un microfront SVN al host con Module Federation y ngx-microfront-toolkit (webpack, bootstrap setupMicroFrontend, provideMicroFront y manifest). Usar al registrar un remote, cambiar shared deps o distinguir legado de standalone. Detalle en .agents/skills/module-federation/SKILL.md.
---

# Module Federation (Cursor)

Guía de dominio: `.agents/skills/module-federation/SKILL.md`. Archivos reales: `mf-transfers_Front/webpack.config.js`, `mf-transfers_Front/src/bootstrap.ts`, `general_Conf/manifest/manifest.json`.

## Qué modelo es

| | Legado Angular 16 | Standalone 17/20 |
| --- | --- | --- |
| Host | `loadRemoteModule` de un NgModule | Remote `./main` |
| Arranque | `bootstrapModule` | `setupMicroFrontend` en `bootstrap.ts` |
| Providers | `forRoot` | `provideMicroFront()` |
| Shared | `sharedDependencies.config.js` | `newSharedDependencies.config.js` |
| Manifest | sin `isIndependent` | `isIndependent: true`, `type: "module"`, `remoteName` |

No conviertas un legado a standalone dentro de este skill. Eso es `migrate-microfront`.

## Standalone

1. `webpack.config.js`: `name` camelCase (`mfTransfers`), `exposes['./main'] = './src/bootstrap.ts'`, `shared: share(sharedModules)` importado de `../newSharedDependencies.config`. Output `statics/[name].[contenthash].js`.
2. `src/main.ts` solo importa `./bootstrap`.
3. `setupMicroFrontend` con `rootSelector` igual al `ngModuleName` del manifest (`svn-mf-<nombre>`), estilos BDS y `parentNode` `#svn-mf-container`.
4. `provideMicroFront()` en `app.config.ts`.
5. Manifest: `remoteEntry` con placeholder de ambiente, `exposedModule: "./main"`, `routePath`, `ngModuleName`, `isIndependent: true`, `type: "module"`, `remoteName` igual al `name` del webpack.

`newSharedDependencies.config.js` no se edita. Si falta una dependencia compartida, documenta el impacto y escálalo.

El pre-commit valida el manifest cuando cambia. Revisa también el manifest local del entorno de desarrollo.

## Verificar

`name`, `remoteName`, `ngModuleName` y `rootSelector` son el mismo microfront escrito en sus tres formas. `exposedModule` del standalone es `./main`, no un `XxxModule`.
