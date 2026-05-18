# QA PWA final

## Objetivo

Validar que Red de Jóvenes queda lista como PWA instalable para piloto.

## Archivos revisados

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `src/components/pwa/InstallPrompt.tsx`
- `index.html`

## Resultado

- `start_url`: `/`.
- `scope`: `/`.
- `display`: `standalone`.
- `theme_color`: `#020617`.
- `background_color`: `#020617`.
- Ícono: `favicon.svg` con `purpose: any maskable`.
- Offline fallback: `public/offline.html`.
- Botón “Instalar app”: implementado y visible como botón compacto también en
  móvil cuando el navegador emite `beforeinstallprompt`.
- Service worker: cachea app shell y recursos estáticos propios.
- Supabase: no se cachea tráfico externo ni respuestas sensibles.
- Sesión: no se modifica ni se cachea explícitamente desde el service worker.

## Prueba real recomendada

### Chrome Android

1. Abrir `https://...` o el host de staging.
2. Confirmar que aparece opción de instalar.
3. Instalar la app.
4. Abrir desde pantalla de inicio.
5. Validar que `/` muestra login sin sesión.
6. Iniciar sesión y navegar a `/app`.
7. Desactivar conexión y validar fallback offline en navegación no cacheada.

### Edge/Chrome Desktop

1. Abrir la app.
2. Usar el botón de instalación del navegador o el botón “Instalar app”.
3. Abrir ventana instalada.
4. Validar login, navegación privada y cierre de sesión.

## Validaciones

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## Pendiente no bloqueante

Agregar íconos PNG dedicados de 192x192 y 512x512 antes de producción pública.
