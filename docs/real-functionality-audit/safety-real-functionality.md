# Seguridad y reportes - funcionalidad real

Fecha: 2026-05-18

## Resultado

El sistema de espacio seguro y reportes esta operativo para piloto.

## Validado

- La pagina muestra normas de comunidad.
- Se pueden crear reportes con motivo obligatorio.
- Detalle opcional disponible.
- Se pueden reportar posts, comentarios y peticiones desde los flujos conectados.
- Usuario no ve reportes ajenos.
- Admin ve reportes pendientes.
- Admin cambia estado de reporte.
- Admin deja nota interna.
- RLS protege lectura/escritura.

## QA

- `npm run qa:functional`: valida creacion de reporte.
- `npm run qa:forums`: valida reporte de comentario.
- `npm run qa:admin`: valida moderacion de reporte.
- `npm run qa:rls`: valida aislamiento.

## Pendientes

- Flujo avanzado de auditoria por moderador queda para fase futura.
