# Auditoria de referencias del modulo Construir

Fecha: 2026-05-21

Release base: `pilot-v1.3.0`

## Resultado

| Archivo | Referencia encontrada | Accion |
| --- | --- | --- |
| `src/components/layout/AppShell.tsx` | Item visible `Construir` hacia `/app/construir`. | Remover de menu "Mas" y navegacion desktop. |
| `src/routes/AppRoutes.tsx` | Lazy import de `BuildNetworkPage` y ruta `/app/construir`. | Quitar pagina activa y dejar redireccion controlada a `/app`. |
| `src/pages/AppHome.tsx` | Card `Construir la Red` en accesos rapidos. | Remover del Home. |
| `src/pages/QuickGuidePage.tsx` | Seccion `Construir la Red` y enlace `/app/construir`. | Remover de guia rapida. |
| `src/pages/BuildNetworkPage.tsx` | Pagina activa del modulo. | Eliminar archivo si queda sin imports. |
| `src/features/buildNetwork/buildNetworkService.ts` | Servicio exclusivo del modulo. | Eliminar archivo si queda sin imports. |
| `scripts/qa-functional-routes.mjs` | Ruta `/app/construir` en QA funcional. | Remover expectativa de ruta activa. |
| `scripts/qa-build-network-module.mjs` | QA exclusivo del modulo. | Eliminar script y quitar package script. |
| `package.json` | Script `qa:build-network`. | Remover script. |
| `src/features/admin/adminService.ts` | Conteo `feedback_suggestions`. | Mantener como dato historico/general, no como Construir visible. |
| `src/types/database.ts` y tipos generados | Tipo `feedback_suggestions`. | Mantener por compatibilidad de datos historicos. |
| `docs/onboarding-activation/*` | Algunas referencias de release/guia a Construir. | Remover en documentos activos de onboarding/hotfix. |
| `docs/prototype-completion/*` | Referencias historicas del cierre contra prototipo. | Mantener clasificadas como historicas. |
| `docs/pilot-launch/*` y `docs/pilot-monitoring/*` | QA historico `qa:build-network`. | Mantener como historico; no se ejecutara en QA activo. |
| `docs/release/pilot-v1.3.0/*` | Release historico menciona Construir. | Mantener como historico y superseder con `pilot-v1.3.1`. |

## Decisiones

- No borrar tablas remotas ni migraciones historicas.
- No borrar `feedback_suggestions` de tipos porque puede existir historial.
- Remover toda referencia activa visible de navegacion, rutas, Home, guia actual y QA activo.
- `/app/construir` no abrira el modulo antiguo; redirigira a `/app`.
