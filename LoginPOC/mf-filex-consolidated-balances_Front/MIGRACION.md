# Migración: mf-filex-consolidated-balances

**Estado**: in-progress
**Versión actual**: 20 (código; instalación pendiente)
**Fase actual**: 7 — Validación final (npm install limpio a cargo del desarrollador)
**Última actualización**: 2026-10-29

## Hallazgos del análisis (Fase 0)

- Versiones de origen: Angular 17.3, BDS 15, behaviors 9, core-utils 10, jest-preset-angular 14, TypeScript 5.4, zone.js 0.14. El microfront ya estaba en modelo standalone.
- Sin `*.module.ts`. `app.config.ts` ya replicaba providers, interceptors SVN, pricing, PDF, monitoreo, tagging y el widget de saldos consolidados.
- Componentes standalone: `AppComponent`, `FilexSummaryBalancesComponent`, `FilexBalancesComponent`.
- BDS en templates: `bc-icon` (`arrow-left`), `bc-icon-button`. Sin ilustraciones `il-*`.
- Libs ESM en Jest: jspdf, jspdf-autotable, file-saver, fflate.
- `overrides` eliminados del `package.json`.
- Entrada `mf-filex-consolidated-balances` eliminada del `angular.json` raíz.
- Rutas ya usaban `loadComponent` y `validateAccessPricingGuard`. Manifest y host local ya tenían `isIndependent`, `type: module`, `remoteName` y `exposedModule: ./main`.
- Pipeline ya apuntaba a `microfront-pipeline-template-v3.yml`.

## Progreso por fase

- [x] Fase 0: Análisis
- [x] Fase 1: 16→17 (ya estaba en 17; se eliminaron overrides)
- [x] Fase 2: Bootstrap standalone + `app.config.ts` (ya existían; `styles.version` pasa a `environment.BDS_VERSION`)
- [x] Fase 3: Componentes standalone, sin módulos Angular
- [x] Fase 4: Federation `./main` y manifest independiente
- [x] Fase 5: Specs sin `CUSTOM_ELEMENTS_SCHEMA` ni `NO_ERRORS_SCHEMA`
- [x] Fase 6: 17→20 — deps a Angular `^20.3.34`, BDS `^16.3.0`, Jest 30, preset `jest-preset-angular/presets/index.js`
- [ ] Fase 7: `npm install` limpio, lint, test y build (los ejecuta el desarrollador)

## Último paso / Próximo paso / Bloqueos

Código de la migración aplicado. No se ejecutó `npm install`. Próximo paso: desde `mf-filex-consolidated-balances_Front`, `npm install` sin flags y luego `npm run lint`, `npm run test` y `npm run build`. El `package-lock.json` queda desactualizado hasta esa instalación. Los `overrides` no se reintroducen hasta un análisis aparte de vulnerabilidades.
