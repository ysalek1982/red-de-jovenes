# Checklist Supabase para piloto

No ejecutar cambios destructivos durante esta revision. Este checklist es para confirmar configuracion antes de invitar usuarios reales.

## Proyecto

- Project ref: `ntlzlfbztryasbmjnynq`
- Project URL: `https://ntlzlfbztryasbmjnynq.supabase.co`

## Auth

- Confirmar que Auth esta habilitado.
- Revisar si email confirmation esta habilitado o deshabilitado para el piloto.
- Confirmar que el flujo elegido esta documentado para usuarios piloto.
- Revisar plantillas de email si se usaran confirmaciones o recuperacion.

## URLs

Actualizar en Supabase Dashboard antes del deploy real:

- Site URL: URL publica/staging del deploy.
- Redirect URLs:
  - URL publica/staging raiz.
  - URL publica/staging `/entrar`.
  - URL publica/staging `/recuperar`.
  - URL publica/staging `/app`.

Mantener URLs locales solo si el equipo las necesita para desarrollo.

## Tablas

Confirmar existencia de:

- `profiles`
- `prayer_requests`
- `prayer_supports`
- `posts`
- `post_comments`
- `post_reactions`
- `devotionals`
- `devotional_reads`
- `devotional_favorites`
- `testimonies`
- `groups`
- `group_suggestions`
- `content_reports`
- `notification_preferences`
- `user_roles`

## RLS

Confirmar que RLS esta habilitado en tablas publicas sensibles.

Validaciones esperadas:

- usuarios autenticados leen datos permitidos;
- usuarios solo actualizan su perfil;
- usuarios solo modifican posts, comentarios y oraciones propios;
- usuarios no pueden asignarse roles;
- usuarios no pueden escribir devocionales como cliente normal;
- admin usa politicas basadas en `has_role('admin')`.

## Admin

- Confirmar que `ysalek@gmail.com` existe en Supabase Auth.
- Confirmar que tiene rol `admin` en `public.user_roles`.
- Confirmar login admin en el deploy staging.
- Confirmar acceso a `/app/admin`.

## Usuarios QA

- Confirmar usuarios QA A/B creados y confirmados.
- Confirmar que no tienen rol admin.
- Ejecutar `npm run qa:auth`.
- Ejecutar `npm run qa:rls`.

## Seguridad

- Confirmar que el frontend solo usa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Confirmar que `SUPABASE_SERVICE_ROLE_KEY` no esta en hosting frontend.
- Confirmar que passwords de base de datos no estan en hosting frontend.
- Confirmar que no hay service role en `src/`.

## Migraciones

Confirmar que migraciones local/remoto estan alineadas:

- `npx supabase migration list`

No modificar migraciones ya aplicadas. Cualquier cambio futuro debe ser migracion incremental.
