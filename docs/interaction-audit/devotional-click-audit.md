# Devocional - auditoria click por click

Fecha: 2026-05-18

## Validado

- Ver devocional activo del dia.
- Fallback al ultimo activo.
- Marcar como leido.
- Guardar favorito.
- Quitar favorito.
- Ver favoritos.
- Ver historial.
- Progreso real.
- Seleccion de estado del corazon como reflexion local visible.
- Admin crea devocional.
- Admin edita devocional.
- Activar/inactivar desde admin.
- Usuario normal no crea devocional.

## Observaciones

- La seleccion de estado del corazon no se persiste y se muestra como reflexion local de la pantalla.
- Quitar "leido" no aplica en el modelo actual: la lectura funciona como historial.

## QA

- `npm run qa:functional`: OK para lectura/favorito/leido.
- `npm run qa:admin`: OK para escritura admin.
- `npm run qa:rls`: OK para bloqueo usuario normal.

## Estado final

OK.
