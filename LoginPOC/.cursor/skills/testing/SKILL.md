---
name: testing
description: Escribe y repara pruebas Jest y Playwright de un microfront SVN, con la matriz de jest-preset-angular por versión de Angular. Usar al crear specs, arreglar TestBed, configurar Jest o mantener acceptancetest. Patrones por capa en .agents/skills/testing/SKILL.md.
---

# Pruebas Jest y Playwright (Cursor)

Guía de dominio: `.agents/skills/testing/SKILL.md`. Si el pedido es subir cobertura de forma automática y sin tocar producción, usa `test-generation`.

## Dónde correr

- Standalone: `npm run test` dentro del microfront (`jest --coverage`). Config `jest.config.ts`.
- Legado Angular 16: `npm run test:<mf>` desde la raíz. Config `jest.config.js`.

| Modelo | jest-preset-angular | Import |
| --- | --- | --- |
| Standalone 17 | ^14 | `jest-preset-angular/presets` |
| Standalone 20 | ^16 | `jest-preset-angular/presets/index.js` |

Confirma la versión en el `package.json` antes de cambiar el import. Referencias: `mf-transfers_Front/jest.config.ts` y `mf-payment-history_Front/jest.config.ts`.

Si Jest falla con `Unexpected token 'export'`, agrega ese paquete al `transformIgnorePatterns` existente. No reescribas el preset.

## Specs

- Un `.spec.ts` por cada `.ts` funcional.
- `jest.fn()` y `jest.spyOn()`. No uses `jasmine.createSpyObj()`.
- `describe` y `test` en español. Cada test tiene un `expect` concreto. Camino feliz y error.
- Objetivo > 80% en statements y branches.
- Sin `CUSTOM_ELEMENTS_SCHEMA` ni `NO_ERRORS_SCHEMA`. Componentes BDS, widgets y propios externos: `MockComponent` de `ng-mocks`.
- El caso de uso se prueba con el gateway mockeado. El adapter se prueba mapeando DTO y error HTTP. El page se prueba contra el caso de uso, no contra `HttpClient`.

Playwright vive en `acceptancetest/`. No lo incluyas en el run de Jest (`testPathIgnorePatterns` ya lo excluye en los de referencia).

## Verificar

`npm run test` (o `npm run test:<mf>`) en verde. Si cambiaste `jest.config.ts`, compáralo con el microfront de referencia de la misma versión antes de dar por cerrada la config.
