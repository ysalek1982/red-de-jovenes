# Foros con la Palabra funcionales

Fecha: 2026-05-18

## Cambios

- Se agregaron comentarios en publicaciones.
- Se agregaron reacciones tipo `amen`.
- El feed carga conteo de comentarios y reacciones.
- Cada post permite:
  - crear publicación
  - destacar versículo
  - reaccionar con “Amén”
  - comentar
  - eliminar publicación propia

## Migración aplicada

```text
20260518030000_add_post_comments_reactions.sql
```

Tablas:

- `post_comments`
- `post_reactions`

## RLS

- Usuarios autenticados pueden leer comentarios y reacciones.
- Usuarios autenticados pueden crear sus propios comentarios.
- Usuarios autenticados pueden borrar sus propios comentarios.
- Usuarios autenticados pueden crear/quitar sus propias reacciones.
- La unicidad `(post_id, user_id, reaction)` evita duplicar “Amén”.

## Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK.

## Pendiente QA dinámico

Validar con usuarios QA A/B cuando existan credenciales:

- Usuario A crea post.
- Usuario B comenta.
- Usuario B reacciona con “Amén”.
- Usuario B no puede modificar/eliminar el post de A.
