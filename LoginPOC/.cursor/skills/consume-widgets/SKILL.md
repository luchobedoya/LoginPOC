---
name: consume-widgets
description: Integra un widget @svn/* o @bancolombia/* en un microfront Angular standalone mediante provide*Widget, infraestructuras gateway-implementation y func de pricing. Usar al registrar un widget, implementar sus driven-adapters o el segundo factor. Patrón completo en .agents/skills/consume-widgets/SKILL.md.
---

# Consumir widgets (Cursor)

Guía de dominio: `.agents/skills/consume-widgets/SKILL.md`. Referencia real: `provideManualTransfersWidget` en `mf-transfers_Front`.

## Procedimiento

1. Lee el README o los exports del paquete del widget y lista los gateways que exige, el bloque `func` y si lleva infraestructuras.
2. Por cada gateway, crea el driven-adapter en `infrastructure/driven-adapters/<feature>/`. Traduce el modelo del backend del microfront al modelo del widget.
3. Registra una sola vez, en `app.config.ts`:

```typescript
provideNombreWidget({
  infrastructures: [
    { gateway: ProductGateway, implementation: ProductsService },
  ],
  func: { manualTransfer: environment.funcIdManualPricing },
}),
```

4. Si dos widgets exportan el mismo nombre (`TaggingGateway`), usa alias en el import.
5. Widgets sin puertos (segundo factor, biometría, dynamic key) se registran con `provideTwoFactorAuthentication()` y las dependencias que indique su README (`provideSVNServiceRequest` con `SECOND_FACTOR` / `CONTROL_DUAL`).

## Reglas

- No declares además `{ provide: Gateway, useClass: Impl }` para un gateway que ya va en `infrastructures`, salvo que el widget lo pida.
- Los IDs de `func` salen de `environment`. Si no te los dieron, deja el placeholder y no inventes el número.
- Declara el paquete en `dependencies` del microfront. No edites `newSharedDependencies.config.js`; si falta como shared, documenta el impacto y escálalo.
- Prohibido `CUSTOM_ELEMENTS_SCHEMA` / `NO_ERRORS_SCHEMA`. Importa el componente del widget. En specs, `MockComponent` de `ng-mocks`.

## Verificar

El page usa el componente del widget; no reimplementa su flujo. `npm run test` del microfront cubre los adapters nuevos.
