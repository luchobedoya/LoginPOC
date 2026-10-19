---
name: tooling
description: Configura ESLint, Prettier, Husky y lint-staged de un microfront SVN (prefijo svn, límites de complejidad y script prepare). Usar al crear o ajustar linters, formatters o el pre-commit. Reglas exactas en .agents/skills/tooling/SKILL.md.
---

# Tooling (Cursor)

Guía de dominio: `.agents/skills/tooling/SKILL.md`. Copia `.eslintrc.json`, `.prettierrc` y `.prettierignore` del microfront de referencia de la misma versión (`mf-transfers_Front` o `mf-payment-history_Front`). Si el microfront ya usa `eslint.config.mjs`, respeta ese formato.

Hay un solo Husky, en la raíz. El `pre-commit` formatea la raíz, valida el manifest si cambió, corre `lint-staged` dentro de cada `mf-*` con `angular.json` tocado y después sus tests.

## Obligatorio en el microfront

- `"prepare": "cd .. && husky"` en `package.json`. Sin eso, el install del microfront no engancha los hooks.
- Selectores: `@angular-eslint/component-selector` con prefix `svn` y `kebab-case`. Directivas `svn` en `camelCase`.
- Límites en `*.ts`: `max-lines` 750, `max-lines-per-function` 35, `complexity` 10. En `*.spec.ts` esos dos primeros van off y el plugin `jest` exige `test`, no `it`.
- Prettier: `tabWidth` 2, `printWidth` 120, `singleQuote` true en TypeScript, `trailingComma` es5.
- Scripts `lint` (`ng lint --fix`), `format` y `test` (`jest --coverage`).

`@typescript-eslint/no-explicit-any` está off. No lo actives en un microfront existente.

## Durante una migración

No corras ESLint `--fix` ni Prettier sobre el código legado. El código nuevo sí se formatea. Ver `migrate-microfront`.

## Verificar

`npm run lint` dentro del microfront. Si vas a commitear, deja que el hook corra: no uses `--no-verify`.
