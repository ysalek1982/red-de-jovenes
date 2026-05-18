# QA Supabase

Fecha: 2026-05-17

## Proyecto

- Project ref: `ntlzlfbztryasbmjnynq`
- Project URL: `https://ntlzlfbztryasbmjnynq.supabase.co`

## CLI

- Comando: `npm install supabase --save-dev`
- Resultado: exitoso.
- Comando: `npx supabase --version`
- Resultado: `2.98.2`

## Login

- Comando: `npx supabase login`
- Resultado: bloqueado.
- Motivo: el CLI no puede usar el flujo automático de login en un entorno no-TTY y solicita `--token` o la variable `SUPABASE_ACCESS_TOKEN`.
- Estado: `BLOCKED_SUPABASE_LOGIN_INTERACTIVE`

## Migraciones remotas

- `npx supabase link --project-ref ntlzlfbztryasbmjnynq`: no ejecutado porque no hay sesión CLI.
- `npx supabase db push --dry-run`: no ejecutado porque no hay sesión CLI.
- `npx supabase db push`: no ejecutado porque no hay sesión CLI.
- `npx supabase migration list`: no ejecutado porque no hay sesión CLI.

La migración local pendiente es:

- `supabase/migrations/20260517214049_initial_red_de_jovenes.sql`

## Tipos remotos

- Comando previsto: `npx supabase gen types typescript --project-id ntlzlfbztryasbmjnynq --schema public > src/types/supabase.generated.ts`
- Resultado: no ejecutado porque no hay sesión CLI.
- Estado: los tipos manuales actuales siguen en `src/types/database.ts`.

## Auth

No se ejecutó prueba real de registro/login contra Supabase remoto porque la migración aún no pudo aplicarse.

Flujo pendiente cuando exista sesión CLI:

1. Aplicar migración remota.
2. Crear usuario QA desde `/crear-cuenta`.
3. Confirmar usuario en Supabase Auth.
4. Confirmar creación automática en `profiles`.
5. Entrar desde `/entrar`.
6. Abrir `/app`.
7. Crear una petición de oración.
8. Crear un post.
9. Cerrar sesión.
10. Confirmar que `/app` redirige a `/entrar`.

## Trigger `profiles`

- No validado remotamente.
- Motivo: `supabase db push` no aplicado por bloqueo de login CLI.

## RLS

- No validado remotamente.
- Motivo: `supabase db push` no aplicado por bloqueo de login CLI.

Validaciones pendientes:

- Usuario autenticado puede leer devocionales.
- Usuario autenticado puede leer posts.
- Usuario autenticado puede crear post propio.
- Usuario autenticado puede crear petición propia.
- Usuario no puede modificar datos de otro usuario.

## Seguridad

- No se escribieron contraseñas reales.
- No se escribieron connection strings privadas.
- No se usó service role key.
- `.env.local` permanece ignorado por Git.
- Las contraseñas de ejemplo permanecen como placeholders.

## Errores encontrados

- `npx supabase login` falló por entorno no-TTY.
- Corrección pendiente: ejecutar en una terminal interactiva o definir `SUPABASE_ACCESS_TOKEN` fuera de archivos versionables.
