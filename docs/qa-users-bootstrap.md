# Bootstrap seguro de usuarios QA

## Objetivo

Crear o actualizar dos usuarios QA confirmados para ejecutar pruebas reales de
Auth y RLS sin versionar credenciales.

## Script

```bash
npm run qa:create-users
```

El script `scripts/create-qa-users.mjs`:

- lee `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` desde `.env.admin.local` o
  variables de entorno;
- usa service role solo en contexto local/server-side;
- crea o actualiza:
  - `qa.user.a+redjovenes@gmail.com`
  - `qa.user.b+redjovenes@gmail.com`
- confirma email con `email_confirm: true`;
- asegura perfiles en `public.profiles`;
- elimina roles `admin` o `moderator` si existieran para esos usuarios;
- genera contraseñas seguras localmente;
- actualiza `.env.qa.local` con las credenciales QA;
- no imprime contraseñas ni service role.

## Archivos locales requeridos

- `.env.admin.local`: debe existir localmente y estar ignorado por Git.
- `.env.qa.local`: se crea o actualiza localmente y está ignorado por Git.

## Variables escritas en `.env.qa.local`

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `QA_USER_A_EMAIL`
- `QA_USER_A_PASSWORD`
- `QA_USER_B_EMAIL`
- `QA_USER_B_PASSWORD`

## Bloqueos posibles

- `BLOCKED_MISSING_ADMIN_ENV`: falta `.env.admin.local` o variables admin.
- `BLOCKED_MISSING_QA_PUBLIC_ENV`: falta URL o publishable key frontend.

## Seguridad

No se deben copiar valores reales de `.env.qa.local` ni `.env.admin.local` en
docs, commits, issues, logs o código fuente.

## Resultado Fase 15.1

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.
- `npm run qa:create-users`: `QA_USERS_READY`.
- `.env.qa.local`: actualizado localmente y confirmado como ignorado por Git.
- `.env.admin.local`: confirmado como ignorado por Git.
- Usuarios QA A/B: creados y sin rol admin.
