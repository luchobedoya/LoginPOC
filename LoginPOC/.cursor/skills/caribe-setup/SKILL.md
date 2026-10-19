---
name: caribe-setup
description: Instala y usa Caribe Design System (cb-*) en un microfront SVN standalone, con tema scopeado y coexistencia con BDS. Usar al construir UI nueva o al migrar una pantalla de BDS a Caribe. Detalle de grid, tokens y equivalencias en .agents/skills/caribe-setup/SKILL.md.
---

# Caribe (Cursor)

Guía de dominio: `.agents/skills/caribe-setup/SKILL.md`. BDS sigue cargándose en `bootstrap.ts`. Caribe es el sistema de la UI nueva.

## Decisión

Antes de una pantalla nueva, busca el componente en el portal de Caribe. Si existe, úsalo. Añade un `bc-*` nuevo solo cuando no haya alternativa Caribe. En un microfront ya migrado, conserva los `bc-*` existentes y sustituye por pantalla.

## Integrar

1. Desde la carpeta del microfront: `npm install @bancolombia/caribe-design-system @bancolombia/caribe-brand-bancolombia`. Usa la versión vigente aprobada; no inventes el rango. Si `npm install` falla, no reintentes con `--legacy-peer-deps` ni `--force`.
2. Crea `src/caribe.scss` scopeado al selector raíz (`svn-mf-<nombre>`), con los `@use` de design system y brand que muestra la guía.
3. En el componente raíz: `styleUrls` incluye `caribe.scss` y `encapsulation: ViewEncapsulation.None`.
4. Sube el budget de estilos en `angular.json` como indica la guía.
5. Importa cada componente `cb-*` en el array `imports` del standalone que lo usa. Prohibido `CUSTOM_ELEMENTS_SCHEMA` y `NO_ERRORS_SCHEMA`.

## Al escribir la vista

- Clases `cb-*` y tokens `--cb-sys-*` según la guía. Lee la sección de grid, tipografía o color que necesites; no reproduzcas el catálogo de memoria.
- No quites `BDS_VERSION` ni `setupMicroFrontend.styles`.

## Verificar

`npm run build` en el microfront. Si el servidor local está arriba, abre la pantalla nueva y comprueba que el tema no se sale del selector raíz (el host y otros microfronts no deben heredar el scope).
