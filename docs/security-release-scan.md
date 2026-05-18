# Auditoría de seguridad del Release Candidate

## Resumen

La Fase 15.7 revisó archivos versionables y configuración local ignorada antes del Release Candidate.

Resultado: no se detectaron secretos reales versionados.

## Alcance

Se revisaron estos patrones en archivos versionados:

- `service_role`
- `sb_secret_`
- `postgres://`
- `postgresql://`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `QA_USER_A_PASSWORD`
- `QA_USER_B_PASSWORD`
- `.env.admin.local`
- `.env.qa.local`

## Resultado del escaneo

El escaneo encontró referencias esperadas a nombres de variables, archivos locales ignorados y placeholders en:

- scripts locales de bootstrap y QA;
- documentación de setup;
- archivos `.env.*.example`.

No se encontraron valores reales de contraseñas, service role keys, connection strings privadas ni tokens privados en archivos versionados.

## Archivos locales ignorados

Se confirmó que estos archivos están ignorados por Git:

- `.env.admin.local`
- `.env.qa.local`
- `.env.local`

También se confirmó que no están versionados.

## Frontend

No se encontraron referencias a `SUPABASE_SERVICE_ROLE_KEY`, `service_role`, `sb_secret_`, `postgres://` ni `postgresql://` dentro de `src/`.

La aplicación frontend continúa usando únicamente:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## Scripts locales

Los scripts que usan `SUPABASE_SERVICE_ROLE_KEY` son scripts locales/server-side:

- `scripts/create-admin-user.mjs`
- `scripts/create-qa-users.mjs`

Estos scripts leen secretos solo desde archivos `.env.*.local` ignorados o variables de entorno, y no imprimen contraseñas ni service role keys.

## Validaciones

- `git check-ignore`: OK para `.env.admin.local`, `.env.qa.local` y `.env.local`.
- Escaneo en `src/`: sin coincidencias sensibles.
- `npm run lint`: OK.
- `npm run build`: OK.

## Observaciones

Las referencias a `ADMIN_PASSWORD`, `QA_USER_A_PASSWORD`, `QA_USER_B_PASSWORD` y `SUPABASE_SERVICE_ROLE_KEY` en documentación o scripts son nombres de variables, no valores reales.

Los valores reales permanecen únicamente en archivos locales ignorados por Git.
