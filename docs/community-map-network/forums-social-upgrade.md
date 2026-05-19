# Foros como red cristiana

Fecha: 2026-05-19

## Cambios aplicados

- Los posts pueden asociarse opcionalmente a una comunidad activa.
- El compositor permite publicar en el foro general o en una comunidad propia.
- Las tarjetas muestran autor con avatar/inicial, ciudad, pais, iglesia o comunidad.
- Se agrego filtro "Mi comunidad".
- Se mantiene filtro de recientes, con versiculo y mas comentadas.
- Los botones de comentar, Amen y reportar se conservan.

## Seguridad

- La migracion `20260519112000_add_posts_group_context.sql` agrega `posts.group_id`.
- RLS permite publicar en una comunidad solo si el usuario es miembro activo.
- Usuario no miembro no puede crear posts en una comunidad ajena.
- Usuario sigue sin poder editar/eliminar contenido ajeno.

## QA

`npm run qa:forums` valida:

- creacion de post con comunidad;
- comentario;
- reaccion Amen;
- reporte de comentario;
- edicion propia;
- bloqueo de edicion ajena;
- bloqueo de comentario ajeno;
- bloqueo de post en comunidad donde el usuario no participa.

## Observaciones

- No se implemento chat en tiempo real.
- El filtro de comunidad es local sobre posts cargados.
- La actividad sigue siendo por recarga de datos, no streaming.
