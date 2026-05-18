# Guia de hosting

Esta guia es neutral y aplica a Vercel, Netlify, Cloudflare Pages o cualquier hosting estatico compatible con SPA.

## Configuracion comun

| Campo | Valor |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `dist` |
| Framework | Vite / React |
| Node | Usar version LTS moderna compatible con el proyecto |

## Variables frontend

Configurar solamente:

```text
VITE_SUPABASE_URL=https://ntlzlfbztryasbmjnynq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_lzWu99dOnbt0eJVBgQ1fsw_jOy6bTC-
```

## SPA fallback

Todas las rutas deben servir `index.html`.

### Vercel

Vercel suele detectar Vite automaticamente. Si hace falta, agregar regla de rewrite hacia `index.html`.

Configuracion:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: solo `VITE_*`.

### Netlify

Crear fallback SPA con `_redirects` o configuracion equivalente:

```text
/* /index.html 200
```

Configuracion:

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: solo `VITE_*`.

### Cloudflare Pages

Configuracion:

- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: solo `VITE_*`.

Para SPA fallback, usar `_redirects` si aplica o la configuracion de Pages para servir `index.html`.

### Hosting estatico compatible

Requisitos:

- servir archivos de `dist`;
- servir `index.html` para rutas desconocidas;
- servir `manifest.webmanifest` con tipo correcto si el proveedor lo permite;
- permitir `sw.js` en raiz del sitio.

## Reglas de seguridad

No agregar al hosting frontend:

- `SUPABASE_SERVICE_ROLE_KEY`;
- password de base de datos;
- connection strings privadas;
- `.env.admin.local`;
- `.env.qa.local`;
- `.env.local`;
- variables `ADMIN_*`;
- variables `QA_USER_*`.

El frontend solo debe usar publishable key de Supabase.

## Recomendacion

Para piloto cerrado, la opcion mas directa es **Vercel** por soporte automatico para Vite, previews por branch y configuracion simple de variables `VITE_*`.

Netlify o Cloudflare Pages tambien son validos si se configura correctamente el fallback SPA.
