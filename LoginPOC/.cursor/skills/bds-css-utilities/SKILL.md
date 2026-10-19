---
name: bds-css-utilities
description: Elige clases utilitarias bc-* del BDS (layout, tipografía, color, bordes, sombras, breakpoints) en templates de microfronts SVN. Usar al maquetar o corregir estilos con utilidades BDS, no con CSS inline. Catálogo completo por categoría en .agents/skills/bds-css-utilities/SKILL.md. La UI nueva prefiere clases de Caribe.
---

# Utilidades CSS del BDS (Cursor)

Guía de dominio: `.agents/skills/bds-css-utilities/SKILL.md` (~980 líneas). No la cargues entera. Lee solo la sección de la categoría que vas a usar.

Estas clases aplican a BDS 15 y 16. En BDS 13 puede haber variaciones. Para pantallas nuevas, busca primero el equivalente Caribe (`caribe-setup`) y usa `bc-*` cuando la pantalla siga en BDS.

## Patrón

```
bc-{propiedad}-{valor}
bc-{propiedad}-{breakpoint}-{valor}
```

Mobile first: la clase sin breakpoint aplica desde 0. `sm` 576, `md` 768, `lg` 992, `xl` 1440. No uses un infijo `-xs-`.

| Necesidad | Clase |
| --- | --- |
| Display / flex | `bc-d-flex`, `bc-flex-column`, `bc-justify-content-center`, `bc-align-items-center` |
| Grid | `bc-col-6`, `bc-col-md-4` |
| Texto | `bc-text-center`, `bc-fs-3`, `bc-fw-bold` |
| Color | `bc-text-primary`, `bc-bg-success` |
| Borde y radio | `bc-border-1`, `bc-border-radius-2-full` |
| Sombra y capa | `bc-shadow-03`, `bc-z-index-8` |
| Estado | `bc-disable`, `bc-overflow-hidden` |

## Reglas

- Colores semánticos o de token (`bc-text-primary`, `bc-bg-success`). No hardcodees hex en el template.
- Sin estilos inline si existe utilidad.
- Z-index solo con la escala `bc-z-index-*` documentada en la guía. No inventes valores.
- Las utilidades llegan por la hoja que inyecta `setupMicroFrontend`. No las importes en `styles.scss`.

## Verificar

Después de elegir la clase, contrástala con la sección de esa categoría en la guía de dominio. Si la pantalla es nueva y Caribe tiene el componente, no maquetes con `bc-*`.
