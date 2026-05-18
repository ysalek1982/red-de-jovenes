# Admin - funcionalidad real

Fecha: 2026-05-18

## Resultado

El panel admin esta conectado a operaciones reales para piloto cerrado.

## Validado

- KPIs reales: usuarios, oraciones, publicaciones, comentarios, devocionales, reportes pendientes y sugerencias pendientes.
- Reportes pendientes visibles y actualizables a `reviewed`, `dismissed` o `action_taken`.
- Nota interna de reporte disponible.
- Sugerencias de comunidades visibles.
- Admin puede aprobar/rechazar sugerencias.
- Al aprobar sugerencia, se crea o actualiza grupo activo evitando duplicado basico por nombre, pais y ciudad.
- Admin crea y edita devocionales.
- Publicaciones recientes y peticiones recientes se muestran como lectura operativa.
- Usuario no admin no accede a acciones admin.

## QA

- `npm run qa:admin`: `QA_ADMIN_OK`
- `npm run qa:rls`: `QA_RLS_OK`
- `npm run qa:map`: `QA_MAP_OK`

## Pendientes

- Dividir el panel en subpantallas si el volumen de reportes, sugerencias o devocionales crece.
