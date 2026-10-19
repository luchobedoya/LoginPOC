---
name: angular20-conventions
description: Aplica convenciones de Angular standalone (signals, control flow, inject, input/output, OnPush) al código propio de un microfront SVN. Usar al crear o modernizar componentes y servicios en Angular 17 o 20, o al elegir entre Signals, RxJS y NgRx. Ejemplos y matriz completa en .agents/skills/angular20-conventions/SKILL.md.
---

# Convenciones Angular standalone (Cursor)

Guía de dominio: `.agents/skills/angular20-conventions/SKILL.md`. Léela si el caso no cabe en estos pasos. Referencias: `mf-payment-history_Front` (Angular 20) y `mf-transfers_Front` (Angular 17).

## Antes de editar

1. Abre el `package.json` del microfront. Si es Angular 16 con NgModules, no modernices el código: eso es una migración (`migrate-microfront`).
2. Limita signals, `inject()`, `@if`/`@for` e `input()`/`output()` al código propio del microfront.

## Código propio

- Estado local de UI: `signal()` y `computed()`. No uses `BehaviorSubject` para estado de pantalla.
- Dependencias: `inject()`, no constructor.
- Templates: `@if`, `@for` y `@let`. En `@for`, `track` es obligatorio.
- Componentes dumb nuevos: `input()` / `input.required()` y `output()`. `@Input()` / `@Output()` siguen siendo válidos si hay que interoperar con APIs que esperan decoradores.
- Rutas: `loadComponent` en `ui/ui.routes.ts`.
- `ChangeDetectionStrategy.OnPush` es opt-in. Actívalo solo si el estado es inmutable o basado en signals, y comprueba que los componentes BDS hijos sigan refrescándose.

## Dónde vive cada herramienta

| Caso | Herramienta |
| --- | --- |
| Estado local y valores derivados de la UI | Signals |
| HTTP, gateways y casos de uso | RxJS (`Observable`) |
| Flujos `merge` / `switchMap` | RxJS |
| Estado de dominio compartido entre rutas, si el microfront ya usa NgRx | NgRx |

No conviertas gateways ni casos de uso a signals. Si el microfront no tiene NgRx, no lo introduzcas para un estado local.

## BDS y librerías de terceros

No reescribas el consumo de BDS ni de widgets a signals. Su API pública usa `@Input()`, `@Output()`, constructor y change detection por defecto. `bc-button`, `bc-card`, `bc-input` y `bc-link` son directivas; `bc-icon`, `bc-icon-button`, `bc-alert` y `bc-modal` son componentes.

## Verificar

- El template compila con `track` en cada `@for`.
- Un componente de UI no inyecta un driven-adapter: inyecta el caso de uso.
- Si hay servidor del microfront en marcha, recorre la pantalla modificada. Si no, ejecuta `npm run test` dentro de la carpeta del microfront.
