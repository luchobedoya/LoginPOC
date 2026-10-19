---
name: commit-all
description: Agrupa los cambios del monorepo SVN en commits Conventional Commits en español, con scope por microfront. Usar cuando pidan commitear, hacer commit, commit all o separar cambios pendientes. No hace push ni abre PR. Detalle en .agents/skills/commit-all/SKILL.md.
---

# Commits semánticos (Cursor)

Guía de dominio: `.agents/skills/commit-all/SKILL.md`. Solo commits locales. No hagas `push` ni abras un PR.

## Antes de commitear

Muestra el plan (grupos, archivos y mensajes) y espera un sí explícito. No ejecutes `git commit` en el mismo turno en el que propones el plan.

Inspecciona en paralelo: `git status --short`, `git diff --stat`, `git diff` y `git log --oneline -10`.

Si aparece `.env`, `auth.json`, tokens, llaves o credenciales, detente y pregunta.

## Cómo agrupar

- Un commit por cambio lógico. Dos microfronts son dos commits. Un microfront y el `host` o `general_Conf` también.
- `git add` con rutas explícitas. No uses `git add .` ni `git add -i`.
- No reviertas trabajo existente. No uses `--amend` ni `--no-verify`.
- Si el hook de Husky modifica archivos, vuelve a agregarlos y crea un commit nuevo.

## Mensaje

`type(scope): descripción` en español, imperativo, sin punto final.

Types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `style`, `perf`, `ci`, `build`.

Scope: nombre del microfront sin `_Front` (`mf-transfers`), `host`, `general_Conf`, `manifest`, o transversal (`skills`, `docs`, `ci`, `deps`, `tooling`, `pipelines`). Si no hay scope claro, omítelo.

Pasa el mensaje con heredoc. Al terminar, resume con `git log --oneline` y `git status`.
