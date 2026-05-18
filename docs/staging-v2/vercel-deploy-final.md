# Deploy final en Vercel

Fecha: 2026-05-18

## Configuracion del proyecto

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Node: usar version compatible con Vite/React del proyecto

## Variables frontend requeridas en Vercel

Configurar solo estas variables en el proyecto Vercel:

```env
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lzWu99dOnbt0eJVBgQ1fsw_jOy6bTC-
```

La publishable key es la clave publica para cliente web. No equivale a `service_role`.

## Variables que NO deben configurarse en Vercel

No configurar:

- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_PASSWORD`
- `ADMIN_EMAIL`
- `QA_USER_A_EMAIL`
- `QA_USER_A_PASSWORD`
- `QA_USER_B_EMAIL`
- `QA_USER_B_PASSWORD`
- connection strings privadas
- `.env.admin.local`
- `.env.qa.local`
- contrasenas de base de datos

## SPA fallback

Todas las rutas deben servir `index.html`:

- `/`
- `/landing`
- `/demo`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/actualizar-contrasena`
- `/app/**`

Vercel soporta SPA fallback para Vite si el proyecto esta configurado como single page app. Si aparece 404 al refrescar rutas privadas, agregar rewrites hacia `/index.html`.

Ejemplo `vercel.json` solo si hiciera falta:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

No se agrego `vercel.json` porque no se confirmo un fallo real de routing en Vercel.

## Intento de CLI

Comandos ejecutados:

- `npx --yes vercel@latest --version`
  - Resultado: `Vercel CLI 54.1.0`
- `npx --yes vercel@latest whoami`
  - Resultado: timeout sin sesion no interactiva disponible
- Revision de entorno:
  - `VERCEL_TOKEN_MISSING`

## Bloqueo

**BLOQUEADO_POR_AUTH_VERCEL**

No se realizo deploy desde Codex porque no hay token local de Vercel y `whoami` no completo en modo no interactivo. No se debe pegar token en archivos versionables.

## Instrucciones exactas por Dashboard

1. Entrar a Vercel.
2. Crear nuevo proyecto.
3. Importar el repositorio `ysalek1982/red-de-jovenes` o conectar la rama correspondiente.
4. Seleccionar framework `Vite`.
5. Configurar:
   - Install command: `npm install`
   - Build command: `npm run build`
   - Output directory: `dist`
6. Agregar solo las variables frontend listadas arriba.
7. No agregar variables admin, QA ni service role.
8. Ejecutar deploy.
9. Copiar la URL staging generada.
10. Configurar Supabase Auth con esa URL antes de certificar login, registro y recuperacion.

## Instrucciones exactas por CLI si se dispone de token local

Sin guardar el token en archivos:

```powershell
$env:VERCEL_TOKEN="PEGAR_SOLO_EN_SESION_LOCAL"
npx vercel link --token $env:VERCEL_TOKEN
npx vercel deploy --token $env:VERCEL_TOKEN
```

Luego usar la URL resultante como `QA_APP_BASE_URL` para certificacion.
