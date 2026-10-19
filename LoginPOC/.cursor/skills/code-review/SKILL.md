---
name: code-review
description: Revisa cambios de un microfront SVN con el checklist del equipo (capas, pruebas, commits, seguridad, federación, performance) y comentarios en español. Usar al revisar un PR, un diff local o al preparar un PR propio. Plantilla y reglas ISW en .agents/skills/code-review/SKILL.md.
---

# Code review (Cursor)

Guía de dominio: `.agents/skills/code-review/SKILL.md`. Lee el diff completo (`git diff` y `git log` de la rama), no solo el último commit.

## Cómo comentar

Español técnico (ES-CO). Explica el porqué y propone el cambio.

| Prefijo | Cuándo |
| --- | --- |
| `🚨 bloqueante:` | Viola una regla dura. Impide el merge. |
| `⚠️ sugerencia:` | Mejora que no bloquea. |
| `💡 nitpick:` | Estilo. |
| `❓ pregunta:` | Falta contexto. |

No marques como hallazgo lo que ESLint ya exige: 750 líneas por archivo, 35 por función, complejidad 10, números mágicos, `console.log`, imports sin uso.

## Checklist sobre el diff

- `ui` no importa `infrastructure`. `domain` no importa `ui` ni `infrastructure`.
- Cada `.ts` funcional nuevo tiene `.spec.ts`, con `expect` específico, sin `CUSTOM_ELEMENTS_SCHEMA` ni `NO_ERRORS_SCHEMA`. BDS y widgets se mockean con `MockComponent` de `ng-mocks`. Cobertura de lo nuevo por encima del 80% en statements y branches.
- Commits `type(scope): descripción` en español. Scope = microfront sin `_Front`.
- Sin `.env`, tokens, secretos en `environment.ts`, `console.log` ni `debugger`.
- Si toca `webpack.config.js` o `general_Conf/manifest/manifest.json`: `remoteName`, `ngModuleName` y `rootSelector` coinciden. Standalone lleva `isIndependent: true`, `type: "module"`, `exposedModule: "./main"`.
- Sin `subscribe()` sin `takeUntilDestroyed`, sin `addEventListener` sin cleanup, sin `setInterval` sin `clearInterval`.
- Rutas de funcionalidad con `validateAccessPricingGuard`. `featureId` y flags no inventados.
- UI nueva en Caribe. BDS nuevo solo si no hay equivalente.

Reglas de criterio (JSDoc en gateways, HTML semántico, IDs únicos, sin URLs absolutas, duplicación entre microfronts) están en la guía, sección ISW. Ábrelas si el diff toca dominio, templates o código copiado de otro microfront.

## Cierre

Lista primero los bloqueantes. Si no hay, dilo y deja sugerencias aparte. No reescribas el código revisado salvo que te lo pidan.
