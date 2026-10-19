---
name: test-generation
description: Genera pruebas Jest de un microfront SVN en un loop de cobertura, sin modificar código fuente. Usar cuando pidan generar tests, subir cobertura o cubrir un archivo, función o módulo. Target por defecto 80%. Protocolo completo en .agents/skills/test-generation/SKILL.md.
---

# Generación de pruebas (Cursor)

Guía de dominio: `.agents/skills/test-generation/SKILL.md`. Convenciones de specs: skill `testing`.

## Alcance

Solo escribes `*.spec.ts`. No tocas `src/app/**/*.ts` de producción, `jest.config.ts`, `tsconfig.spec.json`, `package.json` ni lockfiles. No instales dependencias ni uses `--passWithNoTests`. Si un test exige cambiar producción, paras y pides aprobación.

## Loop

1. Clasifica: un archivo, una función o un módulo. Si es ambiguo, pregunta antes de generar.
2. Mide el baseline. Standalone: `npm run test` dentro del microfront y lee `coverage/lcov.info`. Legado: `npm run test:<mf>` desde la raíz.
3. Reporta el porcentaje y confirma el target. Default 80% en statements y branches. No arranques a escribir si el usuario aún no confirmó y el pedido no lo fijó.
4. Genera primero el archivo del scope con menor cobertura. `describe`/`test` en español. `test`, no `it`. `jest.fn()` / `jest.spyOn()`. Cada test tiene un `expect` específico. Sin schemas; BDS con `MockComponent` de `ng-mocks`.
5. Vuelve a medir. Repite hasta el target, hasta que el mismo archivo no suba en dos iteraciones, o hasta 5 iteraciones.
6. Cierra con antes → ahora, iteraciones, archivos tocados y la frase "Código fuente modificado: ninguno".

Si `npm run test` falla por entorno (registry, deps, compile del source), no cambies la config. Ofrece: lo arregla el desarrollador y retomas, generas specs sin el loop, o te pegan el output.

Prioriza domain y driven-adapters sobre componentes cuando el pedido es un módulo entero. Dentro del tier, el de menor cobertura va primero.
