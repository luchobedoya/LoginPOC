---
name: clean-architecture-microfront
description: Organiza un microfront SVN en capas domain, ui, infrastructure y state, con gateways abstractos y registro en app.config.ts. Usar al crear features, mover lógica de negocio fuera de componentes o corregir dependencias entre capas. Detalle en .agents/skills/clean-architecture-microfront/SKILL.md.
---

# Arquitectura limpia (Cursor)

Guía de dominio: `.agents/skills/clean-architecture-microfront/SKILL.md`. Durante una migración no reorganices carpetas ni renombres (`migrate-microfront`).

## Dependencias

```
ui → domain ← infrastructure
state → domain
```

`domain` no importa `ui` ni `infrastructure`. Un page no inyecta un servicio HTTP ni un driven-adapter.

## Dónde va cada archivo

| Pieza | Ruta | Forma |
| --- | --- | --- |
| Modelo y puerto | `domain/models/<entidad>/` | `*.model.ts` y gateway abstracto que retorna `Observable` |
| Caso de uso | `domain/usecases/` | `@Injectable()` sin `providedIn`, `inject(Gateway)` |
| Adapter | `infrastructure/driven-adapters/` | Implementa el gateway, mapea DTO y traduce `HttpErrorResponse` a error de dominio |
| Page | `ui/pages/` | Orquesta caso de uso, navegación y mensajes |
| Componente dumb | `ui/components/` | `input()` / `output()`, sin casos de uso |
| Estado NgRx | `state/` | Effects llaman casos de uso, solo si el microfront ya usa NgRx |

## Registro

En `app.config.ts`:

- El caso de uso como provider.
- El adapter y `{ provide: Gateway, useExisting: Adapter }` si el adapter ya está provisto. `useClass` si Angular debe instanciarlo para ese token.
- El cableado de un widget va dentro de `provide*Widget`, no duplicado aquí.

Side effects (router, alertas) viven en la page o en effects, no en el caso de uso.

## Verificar

Busca imports ilegales: `rg` de `infrastructure` dentro de `ui/` y de `domain/`, y de `ui/` dentro de `domain/`. El spec del caso de uso mockea el gateway, no `HttpClient`.
