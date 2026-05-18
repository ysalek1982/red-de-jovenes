# Devocionales administrables

## Completado

- Devocionales activos/inactivos.
- Oración final opcional.
- Devocional del día filtra contenido activo.
- Fallback al último devocional activo.
- Progreso personal: leído, guardado, total leído y total guardado.
- Lista de devocionales guardados.
- Administración de devocionales desde `/app/admin`.

## Seguridad

- Usuario normal puede leer devocionales activos y gestionar lecturas/favoritos propios.
- Admin puede leer todos, crear, editar y eliminar devocionales.
- Escritura de devocionales por usuario normal permanece bloqueada por RLS.

## QA

- Cubierto por `qa:functional`, `qa:rls` y `qa:admin`.

## Pendiente

- Editor dedicado de devocionales con vista previa rica.
