---
name: monitoring-and-tagging
description: Instrumenta monitoreo y tagging de un microfront SVN detrás de gateway y caso de uso, más el behavioral monitoring que piden los widgets. Usar al enviar contexto, eventos de analítica o implementar BehavioralMonitoringGateway y TaggingGateway. Detalle en .agents/skills/monitoring-and-tagging/SKILL.md.
---

# Monitoreo y tagging (Cursor)

Guía de dominio: `.agents/skills/monitoring-and-tagging/SKILL.md`. La UI no llama a `MonitoringService` ni al cliente de analítica.

## Monitoreo del microfront

1. Gateway abstracto y caso de uso en `domain/`. El caso de uso de monitoreo puede ir `providedIn: 'root'`. Los de una feature van sin `providedIn` y se registran en `app.config.ts`.
2. Driven-adapter en `infrastructure/driven-adapters/` que envuelve `MonitoringService` de `@svn/shared-utils-web`.
3. `provideMonitoringServicesConfig()` en `app.config.ts`, en el orden de `integrate-central-libs`.
4. La page o el effect llama al caso de uso. El adapter mapea el evento; no deja pasar DTOs del vendor hacia `domain`.

## Tagging

Mismo patrón: gateway, caso de uso, adapter. No mezcles el cliente de tagging dentro del componente.

## Widgets

`BehavioralMonitoringGateway` y `TaggingGateway` que pide un widget se implementan en driven-adapters y se entregan solo dentro de `provide*Widget({ infrastructures })`. No los registres otra vez con `useClass`.

Si el nombre `TaggingGateway` choca con el del microfront, alias en el import.

## Verificar

Busca en `ui/` imports de `MonitoringService` o del SDK de tagging. No debe haber. El spec del caso de uso mockea el gateway.
