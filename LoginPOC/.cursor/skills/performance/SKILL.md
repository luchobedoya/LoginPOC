---
name: performance
description: Corrige fugas de memoria en microfronts SVN (subscribe, listeners, observers, timers, shareReplay, destroy del bootstrap) y ejecuta la auditoría ESLint. Usar ante warnings de memoria, al configurar el audit o al revisar cleanup de un componente. Reglas y comandos en .agents/skills/performance/SKILL.md.
---

# Performance y memoria (Cursor)

Guía de dominio: `.agents/skills/performance/SKILL.md`. Las reglas están en `warn`: no bloquean el build, sí se corrigen cuando tocas el archivo.

## Patrones al editar

- En componentes, `subscribe` dentro de `pipe(takeUntilDestroyed())`. `takeUntil` va último en el `pipe`.
- No hagas `.unsubscribe()` de un `Subject`; usa `.complete()`.
- No expongas un `Subject` público en un servicio.
- `addEventListener` tiene su `removeEventListener` al destruir. `IntersectionObserver`, `ResizeObserver` y `MutationObserver` llaman `.disconnect()`.
- `setInterval` tiene `clearInterval` en el destroy. Evita `setTimeout` que sobreviva al componente.
- `shareReplay({ bufferSize: 1, refCount: true })`.
- No guardes `ElementRef.nativeElement` en un servicio singleton.
- Un microfront independiente no llama `bootstrapApplication` suelto. El arranque es `setupMicroFrontend`, que conserva la referencia de destroy.

`takeUntilDestroyed` necesita contexto de inyección (constructor o `inject(DestroyRef)`). En specs estas reglas no aplican.

## Auditar

Todo el monorepo: `npm run audit:memory-leaks` (genera `.sarif` en `reports/memory-leaks/`).

Un microfront: `node performance/tools/memory-audit/sarif-reporter.js --mfe=mf-<nombre>`.

Warnings en consola: `npm run lint` dentro del microfront.

Prioriza: `bootstrapApplication` sin destroy, `subscribe` sin corte, `shareReplay` mal configurado, listeners y observers sin cleanup.

Los plugins `eslint-plugin-rxjs` y `eslint-plugin-rxjs-angular` están en la raíz. No los instales de nuevo en el microfront. Para el `.eslintrc.json`, copia el patrón de `mf-constructor_Front` descrito en la guía.
