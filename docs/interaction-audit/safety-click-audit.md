# Seguridad - auditoria click por click

Fecha: 2026-05-18

## Validado

- Crear reporte general.
- Reportar post.
- Reportar comentario.
- Reportar peticion.
- Motivo obligatorio.
- Detalle opcional.
- Confirmacion visible.
- Admin ve reportes pendientes.
- Admin cambia estado.
- Admin agrega nota interna.
- Usuario normal no ve reportes ajenos.

## QA

- `npm run qa:functional`: OK para reporte general.
- `npm run qa:forums`: OK para reportar comentario.
- `npm run qa:admin`: OK para moderacion.
- `npm run qa:rls`: OK para aislamiento.

## Estado final

OK.
