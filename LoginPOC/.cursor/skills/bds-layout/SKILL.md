---
name: bds-layout
description: Configura la carga dinámica de estilos BDS, iconografía y el consumo de componentes bc-* en un microfront SVN standalone. Usar al tocar bootstrap.ts, environments de BDS, app.config de iconos o templates con componentes del design system. La UI nueva se construye con Caribe. Detalle en .agents/skills/bds-layout/SKILL.md.
---

# Layout BDS (Cursor)

Guía de dominio: `.agents/skills/bds-layout/SKILL.md`. La UI nueva va con Caribe (`caribe-setup`). BDS sigue siendo configuración técnica obligatoria.

## Identificar la versión

| Modelo | `design-system-web` | Estilos |
| --- | --- | --- |
| Legado Angular 16 | 13.x | Los sirve el host. No agregues carga dinámica. |
| Standalone Angular 17 | ^15.x | Dinámicos en `bootstrap.ts` |
| Standalone Angular 20 | ^16.x | Dinámicos en `bootstrap.ts` |

BDS 15 y 16 son standalone. No existen `BcXxxModule`. Importa cada componente o directiva en el `imports` del componente que lo usa.

## Standalone

1. En `src/environments/`, deja `BDS_VERSION`, `DESIGN_SYSTEM_CSS_URL` y `BDS_ICONS_URL` alineados con la versión del `package.json`.
2. `setupMicroFrontend` en `bootstrap.ts` recibe `styles.version`, `styles.light`, `styles.dark` y `parentNode` apuntando a `#svn-mf-container`. Copia la forma de `mf-payment-history_Front` o `mf-transfers_Front`.
3. No importes el CSS del BDS en `styles.scss` ni en `index.html`.
4. Registra en `app.config.ts` solo los providers de iconografía que el microfront usa (`BcConfigIconModule`, illustration, pictogram), con `path: environment.BDS_ICONS_URL`.

## Templates

- Directiva: `<button bc-button>`. También `bc-card`, `bc-input`, `bc-link`.
- Componente: `bc-icon`, `bc-icon-button`, `bc-alert`, `bc-modal`.
- No envuelvas esos bindings en APIs de signals del BDS.

Al subir de BDS 13 a 15/16, revisa en la guía de dominio los renombres visuales antes de asumir que el selector sigue igual.

## Verificar

Confirma en el microfront de referencia de la misma versión de Angular que `bootstrap.ts` y los providers de iconos coinciden en forma. No declares la tarea lista solo con el template: el estilo depende de la carga dinámica.
