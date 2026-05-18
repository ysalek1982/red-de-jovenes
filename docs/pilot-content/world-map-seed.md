# Comunidades base para Mapa Mundial

Fecha: 2026-05-18

## Objetivo

Dar contenido inicial al Mapa Mundial para que el piloto pueda probar busqueda, filtros, KPIs y flujo de sugerencias sin empezar desde un directorio vacio.

## Migracion

- `20260518241000_seed_pilot_groups.sql`

## Comunidades base

| Pais | Ciudad | Nombre | Estado |
| --- | --- | --- | --- |
| Bolivia | Santa Cruz de la Sierra | Red Jovenes Santa Cruz - piloto | Activa, editable |
| Bolivia | La Paz | Red Jovenes La Paz - piloto | Activa, editable |
| Bolivia | Cochabamba | Red Jovenes Cochabamba - piloto | Activa, editable |
| Argentina | Buenos Aires | Jovenes Luz Buenos Aires - piloto | Activa, editable |
| Colombia | Bogota | Foro Juvenil Bogota - piloto | Activa, editable |
| Mexico | Ciudad de Mexico | Generacion Fe Ciudad de Mexico - piloto | Activa, editable |

## Criterios usados

- No se agregaron contactos personales.
- No se inventaron enlaces reales.
- Cada comunidad queda marcada como contenido inicial de piloto y requiere curaduria humana antes de produccion.
- El objetivo es probar la experiencia de directorio, no afirmar alianzas oficiales.

## Validacion esperada

- Las comunidades aparecen en `/app/mapa`.
- Los filtros por pais y ciudad responden con datos reales.
- La busqueda encuentra nombre, ciudad, pais o iglesia.
- Los KPIs se calculan desde Supabase.
- Las sugerencias de usuarios siguen en estado `pending`.
- Admin puede aprobar una sugerencia y crear comunidad activa.

## Pendientes

- Confirmar comunidades reales con responsables locales.
- Agregar contactos oficiales solo cuando exista permiso.
- Definir criterio editorial para publicar iglesias o grupos externos.
