---
name: integrate-central-libs
description: Registra en app.config.ts las librerías SVN @svn/auth-lib, @svn/shared-utils-web, @svn/shared-async-connection, @svn/common-state y widgets @svn/*. Usar al conectar autenticación, HTTP, monitoreo, PDF, WebSocket o estado compartido en un microfront standalone. Orden de providers en .agents/skills/integrate-central-libs/SKILL.md.
---

# Librerías centrales SVN (Cursor)

Guía de dominio: `.agents/skills/integrate-central-libs/SKILL.md`. Copia versiones y firmas del microfront de referencia de la misma major de Angular (`mf-transfers_Front` o `mf-payment-history_Front`). No subas de major por tu cuenta.

## Orden en `app.config.ts`

1. `provideRouter(routes, withComponentInputBinding())`
2. `provideMicroFront()`
3. `provideAuthLib()`
4. `provideHttpClient(withInterceptors([...]))` con los cuatro interceptors SVN, en el orden de `pricing-and-interceptors`
5. `provideSVNServiceRequest(...)`
6. `providePdfServicesConfig()` y `provideMonitoringServicesConfig()` si el microfront los usa
7. Providers de iconografía BDS
8. Pricing: `AccessValidateService` y `{ provide: AccessValidateGateway, useClass: PricingService }`
9. NgRx solo si el microfront ya comparte estado entre flujos
10. `provide*Widget(...)` y después los casos de uso propios con `useExisting`

`provideSVNServiceRequest()` ya incluye HTTP y auth por dentro. Aun así, deja el `provideHttpClient(withInterceptors)` explícito como en el microfront de referencia.

## Alcance de cada paquete

| Paquete | Cuándo |
| --- | --- |
| `@svn/auth-lib` | Sesión y datos de usuario. Lo exigen los interceptors SF. |
| `@svn/shared-utils-web` | Interceptors, guard de pricing, monitoreo, pipes y requests SVN. |
| `@svn/shared-async-connection` | WebSocket. Solo si el flujo lo usa. |
| `@svn/common-state` | Estado compartido entre flujos, junto con NgRx. |
| `@svn/*-widget` | Ver `consume-widgets`. |

## Verificar

Compara el bloque `providers` con el de referencia. No edites `newSharedDependencies.config.js`. Si una versión no coincide con el rango de la guía, usa la del `package.json` de referencia y menciónalo.
