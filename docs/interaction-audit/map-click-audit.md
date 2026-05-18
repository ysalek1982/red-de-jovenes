# Mapa Mundial - auditoria click por click

Fecha: 2026-05-18

## Validado

| Elemento | Resultado |
| --- | --- |
| Listado real desde `groups` | OK |
| Empty state sin comunidades | OK |
| Card muestra nombre, pais, ciudad, iglesia, reunion/contacto | OK |
| Buscar por nombre | OK |
| Buscar por iglesia | OK |
| Buscar por ciudad | OK |
| Buscar por pais | OK |
| Filtro pais | OK |
| Filtro ciudad | OK |
| Limpiar filtros | OK |
| Click en pais del mapa visual | OK |
| KPIs reales globales | OK |
| Nombre requerido en sugerencia | OK |
| Pais requerido en sugerencia | OK |
| Ciudad requerida en sugerencia | OK |
| Link opcional validado como URL http/https | OK |
| Enviar sugerencia | OK |
| Guardar en `group_suggestions` | OK |
| Confirmacion y limpieza de formulario | OK |
| Mis sugerencias | OK |
| Estado pending/approved/rejected | OK |
| Admin aprueba/rechaza | OK |
| Grupo activo creado al aprobar | OK |
| Usuario normal no crea grupo activo | OK |
| Usuario B no modifica sugerencia de A | OK |

## Correcciones

- Validacion de ciudad requerida.
- Validacion de formato para link de contacto.
- QA ampliado para cubrir filtros, sugerencias propias, aprobacion admin y bloqueo de usuario normal.

## QA

- `npm run qa:map`: `QA_MAP_OK`
- `npm run qa:rls`: `QA_RLS_OK`

## Estado final

OK.
