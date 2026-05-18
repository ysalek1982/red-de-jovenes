# Foros con la Palabra - funcionalidad real

Fecha: 2026-05-18

## Resultado

Los foros funcionan como experiencia social cristiana con publicaciones, comentarios, reacciones y reportes.

## Validado

- Crear publicacion.
- Agregar versiculo y referencia opcional.
- Editar publicacion propia.
- Eliminar publicacion propia.
- Comentar.
- Editar comentario propio.
- Eliminar comentario propio.
- Reaccionar con "Amen".
- Evitar reaccion duplicada.
- Reportar publicacion.
- Reportar comentario.
- Filtros por recientes, con versiculo y mas comentadas.
- Conteos reales de comentarios y reacciones.
- Bloqueo de modificacion de contenido ajeno.
- Estados de carga, error y vacio presentes.

## QA

- `npm run qa:forums`: `QA_FORUMS_OK`
- `npm run qa:rls`: `QA_RLS_OK`

## Pendientes

- Busqueda textual y paginacion server-side si el feed crece.
