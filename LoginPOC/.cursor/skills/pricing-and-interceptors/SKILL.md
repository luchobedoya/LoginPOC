---
name: pricing-and-interceptors
description: Protege las rutas de un microfront SVN con validateAccessPricingGuard y registra los cuatro interceptors SVN en provideHttpClient. Usar al añadir una ruta de funcionalidad, configurar HttpClient o diagnosticar 401/736, 403 del WAF o /sin-permisos. Detalle en .agents/skills/pricing-and-interceptors/SKILL.md.
---

# Pricing e interceptors (Cursor)

Guía de dominio: `.agents/skills/pricing-and-interceptors/SKILL.md`. Copia la forma de `mf-transfers_Front` (`app.config.ts` y `ui/ui.routes.ts`).

## Interceptors

En `provideHttpClient(withInterceptors([...]))`, este orden:

1. `commonSFHeadersInterceptor`
2. `hostCredentialsInterceptor` solo si `!isDevMode()`
3. `activeSessionInterceptor` (401 + código 736)
4. `checkWafErrorInterceptor` (403)

Hacen falta `provideAuthLib()` y `DatePipe` en el mismo `app.config.ts`.

## Guard

Cada ruta de funcionalidad lleva `canActivate: [validateAccessPricingGuard]` y `data` con:

- `featureId` (obligatorio)
- `urlEndpoint` hacia validate-menu-access (obligatorio)
- `mfRouteFlag` (obligatorio)
- `denyBtnRoute`, `denyBtnText`, `isFilexMode` solo si aplican

Providers: `AccessValidateService` y `{ provide: AccessValidateGateway, useClass: PricingService }`.

Si no te dieron `featureId`, endpoint o flag, deja placeholders en `environment` y conserva el guard. No infieras IDs. El acceso nuevo no lee `@bancolombia/ngx-fflags` en el componente: entra por el orquestador.

Sin permisos, el guard redirige a `/sin-permisos`. Un fallo de red reintenta hasta tres veces.

## Verificar

Toda ruta nueva de funcionalidad tiene el guard. El interceptor de credenciales no corre en dev. No hay un `if` de feature flag paralelo decidiendo el acceso de esa ruta.
