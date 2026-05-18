# Log nocturno de avance

## Macrofase 0 - Control inicial

Estado: completada.

- Rama verificada: `codex/red-de-jovenes-inicial`.
- Ultimo commit verificado: `50a1fdb Verifica migracion Supabase remota`.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia no bloqueante de chunk mayor a 500 kB.
- `npx supabase --version`: `2.98.2`.
- `npx supabase migration list`: local/remoto alineado en `20260517214049`.
- `.gitignore` confirma `.env`, `.env.local`, `.env.*.local`, `.auth/`, `supabase/.temp/` y `*.local.json`.
- Revision de patrones sensibles versionables: sin coincidencias reales para llaves privadas de Supabase, URLs privadas de Postgres ni claves de backend.
- Bloqueo conocido registrado: `Email not confirmed` para usuario QA sin confirmar.

Commit esperado: `Prepara plan nocturno de desarrollo`.

## Macrofase 1 - Auth y perfil

Estado: completada.

- Se mejoro el manejo de email no confirmado en login.
- El registro ahora distingue cuenta con sesion activa de cuenta pendiente de confirmacion.
- Se agrego `profileService` con lectura, creacion de respaldo y actualizacion del perfil propio.
- Se agrego perfil editable protegido en `/app/perfil`.
- Se documento QA en `docs/auth-profile-qa.md`.
- `npm run lint`: OK.
- `npm run build`: OK, con advertencia no bloqueante de chunk mayor a 500 kB.
- Bloqueos remotos: `BLOCKED_EMAIL_CONFIRMATION` y `BLOCKED_AUTH_RATE_LIMIT`.

Commit esperado: `Completa Auth y perfil de usuario`.
