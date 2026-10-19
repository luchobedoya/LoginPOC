---
name: microfront-pipelines
description: Configura el pipeline Azure DevOps de un microfront SVN con microfront-pipeline-template-v3.yml, Sonar y la estrategia trunk-based. Usar al crear CI/CD, migrar un pipeline legado a v3 o ajustar triggers y parámetros. YAML de referencia en .agents/skills/microfront-pipelines/SKILL.md.
---

# Pipelines de microfront (Cursor)

Guía de dominio: `.agents/skills/microfront-pipelines/SKILL.md`. Complementa con las secciones de pipeline de `CREATE_MICROFRONT_SVN.md`.

## Build de un microfront independiente

`pipelines/.azure-pipelines.yml` extiende `microfront-pipeline-template-v3.yml@svnWebRepo`.

- `parameters.microfront`: `mf-<nombre>` sin `_Front`.
- `trigger.paths.include`: `mf-<nombre>_Front/*`.
- El repositorio de plantilla apunta a `NU0214001_SucursalVirtualNegociosWEB_MR`, ref `refs/heads/trunk`.
- La v3 hace `npm ci` dentro de la carpeta del microfront. Un standalone no puede seguir en la plantilla del host.

Al migrar un legado, reemplazar el YAML por el bloque de la guía es parte de la fase final, no un extra.

## Ramas

- Trabajo en `feature/<codigo_HU>-<titulo>` (`bug/…`, `refactor/…`).
- Nada entra a `trunk` por push directo.
- Antes de pedir revisión, el build del PR tiene que pasar. La descripción usa `.azuredevops/pull_request_template.md`.

## Qué no hace este playbook

No crea el pipeline en Azure DevOps ni el proyecto Sonar: eso lo pide el desarrollador con permisos. Deja el YAML listo y lista los pasos manuales (pipeline, build policy, Sonar, permisos de ejecución).

## Verificar

El parámetro `microfront` y el `paths.include` no se contradicen (`mf-transfers` vs `mf-transfers_Front/*`). El archivo vive en el microfront, no en la raíz del monorepo.
