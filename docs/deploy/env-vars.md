# Variables de entorno para despliegue

## Resumen

Red de Jovenes usa variables publicas de Vite para conectar el frontend con Supabase. Las variables privadas se reservan para scripts locales de administracion y QA; nunca deben configurarse en el hosting frontend.

## Variables frontend necesarias

Estas variables si van en el hosting frontend:

| Variable | Uso | Entorno |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | URL publica del proyecto Supabase | Hosting frontend y local |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Llave publicable de Supabase para cliente web | Hosting frontend y local |

Valores esperados para este proyecto:

```text
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lzWu99dOnbt0eJVBgQ1fsw_jOy6bTC-
```

La publishable key es segura para cliente web y no equivale a `service_role`.

## Variables solo locales/admin

Estas variables no deben ir en el hosting frontend:

| Variable | Uso | Donde se configura |
| --- | --- | --- |
| `SUPABASE_SERVICE_ROLE_KEY` | Crear admin o usuarios QA desde scripts server-side/locales | `.env.admin.local` local ignorado |
| `ADMIN_EMAIL` | Email del admin bootstrap | `.env.admin.local` local ignorado |
| `ADMIN_PASSWORD` | Password local del admin bootstrap | `.env.admin.local` local ignorado |
| `QA_USER_A_EMAIL` | Usuario QA A | `.env.qa.local` local ignorado |
| `QA_USER_A_PASSWORD` | Password QA A | `.env.qa.local` local ignorado |
| `QA_USER_B_EMAIL` | Usuario QA B | `.env.qa.local` local ignorado |
| `QA_USER_B_PASSWORD` | Password QA B | `.env.qa.local` local ignorado |

## Variables de CLI/base de datos

Estas variables pueden existir localmente para Supabase CLI o tareas tecnicas, pero no deben ir al hosting frontend:

- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_HOST`
- `SUPABASE_DB_PORT`
- `SUPABASE_DB_NAME`
- `SUPABASE_DB_USER`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_POOLER_HOST`
- `SUPABASE_POOLER_PORT`
- `SUPABASE_POOLER_DB`
- `SUPABASE_POOLER_USER`
- `SUPABASE_POOLER_PASSWORD`

## Archivos revisados

| Archivo | Estado |
| --- | --- |
| `.env.example` | Frontend minimo para hosting |
| `.env.local.example` | Frontend + variables locales de Supabase CLI con placeholders |
| `.env.admin.local.example` | Admin bootstrap con placeholders |
| `.env.qa.local.example` | QA Auth/RLS con campos vacios |

## Reglas de seguridad

- No subir `.env.local`.
- No subir `.env.admin.local`.
- No subir `.env.qa.local`.
- No pegar `SUPABASE_SERVICE_ROLE_KEY` en Vercel, Netlify, Cloudflare Pages ni otro hosting frontend.
- No pegar password de base de datos en el hosting frontend.
- No escribir secretos reales en docs, scripts versionables o README.
