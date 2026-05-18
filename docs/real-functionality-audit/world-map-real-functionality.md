# Mapa Mundial - funcionalidad real

Fecha: 2026-05-18

## Estado anterior

El modulo leia grupos activos desde Supabase y permitia crear sugerencias, pero todavia tenia limitaciones funcionales:

- El mapa era visual/decorativo y sus puntos eran estaticos.
- No existia filtro por ciudad.
- No habia vista de "mis sugerencias".
- Las sugerencias no guardaban descripcion.
- El QA no validaba que un admin aprobara una sugerencia y que apareciera como grupo activo.
- La limpieza de grupos temporales revelo que admin necesitaba lectura sobre grupos inactivos.

## Correcciones realizadas

- El mapa ahora es un mapa visual interactivo: cada nodo representa un pais real con comunidades activas y filtra al hacer click.
- El directorio usa `groups` desde Supabase con `is_active = true`.
- Se agregaron busqueda por nombre, iglesia, ciudad, pais, informacion de reunion, descripcion y contacto.
- Se agrego filtro por pais, filtro por ciudad y boton para limpiar filtros.
- Los KPIs son reales:
  - comunidades activas
  - paises
  - ciudades
  - sugerencias pendientes si el usuario es admin
  - mis sugerencias si el usuario no es admin
- El formulario de sugerencia ahora guarda:
  - nombre
  - pais
  - ciudad
  - iglesia/comunidad
  - informacion de reunion
  - contacto
  - descripcion
- El usuario puede ver sus propias sugerencias con estado:
  - pending
  - approved
  - rejected
- Admin puede aprobar/rechazar sugerencias desde `/app/admin`.
- Al aprobar, se crea o actualiza un grupo activo evitando duplicado basico por nombre, pais y ciudad.

## Migraciones

- `20260518220000_enhance_group_suggestions_real_directory.sql`
  - agrega `description` a `group_suggestions`
  - agrega indices para consultas por usuario/fecha y grupos activos por pais/ciudad
- `20260518221000_add_admin_groups_select_policy.sql`
  - permite que admin lea todos los grupos, incluyendo inactivos, para operar moderacion y limpieza segura

## RLS validado

| Regla | Resultado |
| --- | --- |
| Usuario autenticado lee grupos activos | OK |
| Usuario A crea sugerencia propia | OK |
| Usuario A lee sugerencia propia | OK |
| Usuario B no modifica sugerencia de A | DENEGADO |
| Usuario normal no crea grupo activo directo | DENEGADO |
| Admin aprueba sugerencia | OK |
| Al aprobar aparece grupo activo | OK |
| Admin puede inactivar grupo temporal de QA | OK |

## QA

Comandos ejecutados:

- `npm run lint`: OK
- `npm run build`: OK
- `npm run qa:map`: `QA_MAP_OK`
- `npm run qa:rls`: `QA_RLS_OK`

`qa:map` ahora prueba:

- lectura de grupos activos
- creacion de sugerencia por usuario A
- lectura de sugerencia propia
- bloqueo de modificacion por usuario B
- bloqueo de creacion directa de grupo por usuario normal
- aprobacion admin
- grupo activo visible tras aprobar
- filtros por pais, ciudad y busqueda
- limpieza segura del grupo temporal

## Pendientes

- Mapa geografico real con coordenadas sigue fuera de alcance.
- Si el piloto crece, conviene agregar paginacion y busqueda server-side.
