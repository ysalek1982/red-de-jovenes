# QA Bootstrap administrador

Fecha: 2026-05-17

## Migracion

- Migracion creada: `supabase/migrations/20260517224917_add_user_roles.sql`.
- Migracion de restriccion unica formal: `supabase/migrations/20260517225433_add_user_roles_unique_constraint.sql`.
- `npx supabase db push --dry-run`: OK, detecto las migraciones esperadas.
- `npx supabase db push`: OK, migraciones aplicadas.
- `npx supabase gen types`: OK, tipos regenerados.
- `npx supabase migration list`: local/remoto alineado con `20260517224917` y `20260517225433`.

## Variables locales

- `.env.admin.local.example` fue creado con placeholders.
- `.env.admin.local` existe localmente y esta ignorado por Git.
- No se versionaron valores privados.

## Script

- Script creado: `scripts/create-admin-user.mjs`.
- Comando agregado: `npm run admin:create`.
- Resultado inicial esperado sin `.env.admin.local`: `BLOCKED_MISSING_ADMIN_ENV`.
- Resultado despues de configurar variables locales: `ADMIN_USER_READY`.

Detalles seguros del resultado:

- `userCreated`: `false`, el usuario ya existia en Supabase Auth.
- `profileReady`: `true`.
- `role`: `admin`.

## Admin

- Email configurado: `ysalek@gmail.com`.
- Estado real: usuario existente asegurado como administrador.
- `ADMIN_USER_READY`: confirmado.

## UI

- Helper frontend creado para leer roles propios y consultar `has_role`.
- Ruta creada: `/app/admin`.
- Si el usuario tiene rol `admin`, `AppShell` muestra acceso de administracion.
- Si un usuario sin rol admin abre `/app/admin`, ve `No autorizado`.

## Validaciones

- `npm run lint`: OK.
- `npm run build`: OK.
- `npm run admin:create`: OK, finalizado con `ADMIN_USER_READY`.

## Bloqueos

- Login visual con `ysalek@gmail.com`: pendiente de prueba manual en navegador.
- No se deben escribir valores privados en archivos versionados.
