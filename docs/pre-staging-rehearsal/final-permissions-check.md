# Revision final de permisos pre-staging

Fecha: 2026-05-18

## Objetivo

Confirmar que usuarios normales y administrador solo pueden ejecutar acciones permitidas antes de staging.

## Comandos ejecutados

```bash
npm run qa:rls
npm run qa:admin
npm run qa:map
npm run qa:forums
npm run qa:prayer
npm run lint
npm run build
```

## Resultado por permiso

| Validacion | Resultado |
| --- | --- |
| Usuario normal no entra como admin | OK |
| Usuario normal no aprueba comunidades | OK |
| Usuario normal no crea grupos activos directamente | OK |
| Usuario normal no cambia reportes | OK |
| Usuario normal no crea devocionales | OK |
| Usuario A no edita post de usuario B | OK |
| Usuario A no edita peticion de usuario B | OK |
| Usuario B no modifica sugerencia de usuario A | OK |
| Admin puede operar moderacion | OK |
| Admin puede aprobar comunidades | OK |
| Admin puede crear/editar devocionales | OK |
| RLS bloquea acciones indebidas | OK |
| Frontend no usa `service_role` | OK por revision estatica previa y smoke build |

## Evidencia

- `npm run qa:rls`: `QA_RLS_OK`
- `npm run qa:admin`: `QA_ADMIN_OK`
- `npm run qa:map`: `QA_MAP_OK`
- `npm run qa:forums`: `QA_FORUMS_OK`
- `npm run qa:prayer`: `QA_PRAYER_OK`

## Estado final

**PERMISSIONS_OK**
