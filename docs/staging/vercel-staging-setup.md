# Configuración de staging en Vercel

## Estado verificado desde Codex

- Vercel CLI: `54.1.0`.
- Proyecto local enlazado a Vercel: no (`NO_VERCEL_PROJECT_LINK`).
- Autenticación CLI: bloqueada por flujo interactivo (`vercel whoami` no finalizó dentro del timeout).
- URL staging generada desde este entorno: no disponible.

Resultado: `BLOCKED_VERCEL_AUTH_OR_PROJECT_LINK`.

## Configuración recomendada

Crear un proyecto nuevo en Vercel para staging con estos valores:

| Campo | Valor |
| --- | --- |
| Framework preset | Vite |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | Versión estable soportada por Vercel |

## Variables de entorno frontend

Configurar solo estas variables en Vercel:

```env
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=PEGAR_PUBLISHABLE_KEY
```

La publishable key es segura para frontend. No usar service role ni passwords.

## Variables que NO deben configurarse en Vercel

No agregar al hosting frontend:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `QA_USER_A_EMAIL`
- `QA_USER_A_PASSWORD`
- `QA_USER_B_EMAIL`
- `QA_USER_B_PASSWORD`
- `SUPABASE_DB_PASSWORD`
- connection strings privadas
- `.env.admin.local`
- `.env.qa.local`

## Pasos para crear staging

1. Entrar a Vercel con una cuenta autorizada.
2. Crear un proyecto desde el repositorio de Red de Jóvenes.
3. Seleccionar la rama de release o `codex/red-de-jovenes-inicial`.
4. Confirmar preset `Vite`.
5. Configurar build command `npm run build`.
6. Configurar output directory `dist`.
7. Agregar solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`.
8. Desplegar.
9. Copiar la URL staging generada.
10. Configurar esa URL en Supabase Auth antes de probar login, registro y recuperación.

## SPA fallback

Vercel sirve aplicaciones Vite como SPA usando el fallback a `index.html`. Verificar manualmente que estas rutas no devuelvan 404 al refrescar:

- `/`
- `/landing`
- `/demo`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/actualizar-contrasena`
- `/app`
- `/app/oracion`
- `/app/foros`
- `/app/devocional`
- `/app/juegos`
- `/app/mapa`
- `/app/seguridad`
- `/app/perfil`
- `/app/admin`

## Comandos locales previos al deploy

```bash
npm run lint
npm run build
npm run smoke:build
npm run qa:auth
npm run qa:rls
npm run qa:functional
npm run qa:prayer
npm run qa:forums
```

## Comandos CLI si Vercel está autenticado

Estos comandos solo deben ejecutarse cuando el entorno ya esté autenticado y el proyecto esté enlazado:

```bash
npx vercel link
npx vercel deploy
```

Después del deploy, registrar la URL en `docs/staging/staging-certification-final-report.md` y repetir la certificación por módulo sobre la URL pública.
