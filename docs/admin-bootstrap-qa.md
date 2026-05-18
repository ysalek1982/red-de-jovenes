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
- `.env.admin.local` no existe en este entorno al momento de QA.
- `.env.admin.local` esta ignorado por Git.

## Script

- Script creado: `scripts/create-admin-user.mjs`.
- Comando agregado: `npm run admin:create`.
- Resultado actual esperado sin `.env.admin.local`:

```text
BLOCKED_MISSING_ADMIN_ENV
```

## Admin

- Email configurado en ejemplo: `ysalek@gmail.com`.
- Estado real de creacion: pendiente porque faltan variables locales privadas.
- `ADMIN_USER_READY`: pendiente hasta ejecutar con `.env.admin.local` completo.

## UI

- Helper frontend creado para leer roles propios y consultar `has_role`.
- Ruta creada: `/app/admin`.
- Si el usuario tiene rol `admin`, `AppShell` muestra acceso “Admin”.
- Si un usuario sin rol admin abre `/app/admin`, ve “No autorizado”.

## Validaciones

- `npm run lint`: OK.
- `npm run build`: OK.
- `npm run admin:create`: ejecutado sin secretos locales y bloqueado correctamente con `BLOCKED_MISSING_ADMIN_ENV`.

## Bloqueos

- Falta configurar `.env.admin.local` con `SUPABASE_SERVICE_ROLE_KEY` y `ADMIN_PASSWORD`.
- No se deben escribir esos valores en archivos versionados.
