# Mapa mundial comunitario

Fecha: 2026-05-19

## Cambios aplicados

- Se agrego `group_members` para que un joven pueda unirse a comunidades activas.
- Se agrego `modality` a `groups` y `group_suggestions`.
- Se agrego `moderator_note` a `group_suggestions`.
- Se agrego `get_group_member_counts()` para devolver conteos por grupo sin exponer perfiles.
- El mapa ahora muestra miembros reales, modalidad y estado "Mi comunidad".
- El usuario puede unirse, salir y ver "Mis comunidades".
- La sugerencia de comunidad incluye modalidad y nota para moderador.
- Admin mantiene aprobacion/rechazo de sugerencias, y al aprobar se conserva modalidad y origen de sugerencia.

## RLS

| Accion | Estado |
| --- | --- |
| Usuario lee grupos activos | OK |
| Usuario crea sugerencia propia | OK |
| Usuario lee sugerencias propias | OK |
| Usuario se une a comunidad activa | OK |
| Usuario sale de comunidad propia | OK |
| Usuario no crea membresia para otro | OK |
| Usuario no elimina membresia ajena | OK |
| Admin lee/gestiona sugerencias | OK |
| Admin crea/actualiza grupos aprobados | OK |

## QA

`npm run qa:map`:

- `QA_MAP_OK`
- `membershipCreate`: OK
- `ownMembershipRead`: OK
- `crossUserMembershipInsert`: DENIED
- `crossUserMembershipDelete`: DENIED
- `memberCounts`: OK
- `leaveMembership`: OK

## Observaciones

- No se agrego API externa ni clave de mapa.
- La vista sigue siendo un mapa visual interactivo por pais/ciudad.
- El mapa geografico real con coordenadas queda como mejora futura.
