---
name: migrate-microfront
description: Migra un microfront SVN de Angular 16 legado al modelo standalone Angular 20 (ruta 16, luego 17, luego 20) sin refactorizar. Usar al actualizar un microfront host-dependiente al toolkit. Fases, bitácora y gotchas en .agents/skills/migrate-microfront/SKILL.md.
---

# Migrar microfront (Cursor)

Guía de dominio: `.agents/skills/migrate-microfront/SKILL.md`. Léela al empezar y otra vez antes de cada fase. `CREATE_MICROFRONT_SVN.md` manda en estructura y configs. Comandos desde la carpeta del microfront.

Referencias mecánicas (webpack, bootstrap, jest, providers, eslint): `mf-transfers_Front` y `mf-payment-history_Front`. No copies su lógica de negocio ni su organización interna.

## Reglas que paran la migración

- Migra, no refactorices. No renombres negocio, no extraigas helpers, no modernices estilo, no corras `--fix` masivo. El código nuevo sí sigue el Prettier del microfront.
- Conserva la semántica del `forRoot`: mismos tokens, mismos pares gateway→servicio, mismo orden, en `app.config.ts`.
- Conserva el nombre real de carpetas (`infrastructure/` o el typo que ya exista).
- Quita `overrides` del `package.json` al inicio. No los devuelvas hasta que la instalación limpia de la fase final funcione, y solo con un análisis aparte.
- No ejecutes `npm install` en las fases intermedias. Pide al desarrollador `--legacy-peer-deps` o `--force`. En la fase final la instalación es limpia, sin flags. Si falla, la migración no está completa.
- Prohibido `CUSTOM_ELEMENTS_SCHEMA` y `NO_ERRORS_SCHEMA`. En specs, `MockComponent` de `ng-mocks`.
- Al cerrar: cero `*.module.ts`, el microfront fuera del `angular.json` raíz, rutas con `loadComponent`, pipeline en la plantilla v3.

## Bitácora

Busca una bitácora existente de ese microfront antes de empezar. Si no hay, créala con la plantilla de la guía (estado, versión, fase, hallazgos, checklist de fases). Actualízala al cerrar cada fase y antes de reportar un bloqueo.

## Fases

No avances si la fase no compila o los tests fallan.

0. Análisis, sin editar: versiones, módulos, `forRoot`, componentes, BDS 13, libs ESM, overrides, entrada en el `angular.json` raíz, rutas.
1. 16→17: quitar overrides, dependencias, Jest y ESLint. Breaking.
2. `bootstrap.ts` + `app.config.ts`.
3. Componentes standalone, iconografía BDS 15, borrar todos los `*.module.ts`.
4. Federation (`./main`, `setupMicroFrontend`) y manifest.
5. Specs sin schemas.
6. 17→20: deps, `jest-preset-angular` 16, schematics. Salto menor.
7. `npm install` limpio, quitar del `angular.json` raíz, pipeline v3, lint y tests.

Gotchas (jspdf, fflate, renombres BDS) están en el catálogo de la guía. Ábrelo cuando una lib ESM rompa el build, no antes.
