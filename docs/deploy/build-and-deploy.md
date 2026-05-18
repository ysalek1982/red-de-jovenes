# Build y despliegue

## Instalacion

```bash
npm install
```

## Build

```bash
npm run build
```

La carpeta de salida es:

```text
dist
```

## Smoke test del build

Despues de generar `dist`:

```bash
npm run smoke:build
```

El smoke test valida:

- `dist/index.html`;
- `dist/manifest.webmanifest`;
- `dist/sw.js`;
- `dist/offline.html`;
- archivos en `dist/assets`;
- ausencia de patrones sensibles como `service_role`, `sb_secret_`, connection strings privadas, passwords locales y archivos `.env`.

## Variables necesarias

Configurar en el hosting frontend:

```text
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lzWu99dOnbt0eJVBgQ1fsw_jOy6bTC-
```

No configurar en hosting frontend:

- `SUPABASE_SERVICE_ROLE_KEY`
- passwords de base de datos;
- variables QA;
- variables admin locales.

## SPA fallback

La app usa React Router como SPA. El hosting debe servir `index.html` para cualquier ruta interna:

- `/`
- `/landing`
- `/demo`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/app`
- `/app/oracion`
- `/app/foros`
- `/app/devocional`
- `/app/juegos`
- `/app/mapa`
- `/app/seguridad`
- `/app/perfil`
- `/app/admin`

Sin fallback SPA, las rutas internas pueden fallar al refrescar el navegador.

## PWA

Revisar que el build incluya:

- `manifest.webmanifest`;
- `sw.js`;
- `offline.html`;
- `favicon.svg`;
- assets propios.

Configuracion esperada:

- `start_url`: `/`
- `scope`: `/`
- `display`: `standalone`
- `theme_color`: `#020617`
- `background_color`: `#020617`

La ruta `/` debe seguir funcionando como entrada de app:

- sin sesion: redirige a `/entrar`;
- con sesion: redirige a `/app`.

## Validacion minima antes de publicar

```bash
npm run lint
npm run build
npm run smoke:build
npm run qa:auth
npm run qa:rls
```

Si QA Auth/RLS no puede ejecutarse por falta de `.env.qa.local`, documentar el bloqueo. Para este release candidate ya existen usuarios QA locales y los scripts pasan.
