# PWA autoinstalable

## Objetivo

Fortalecer la instalación de Red de Jóvenes como PWA sin cachear respuestas
sensibles de Supabase.

## Configuración verificada

- `manifest.webmanifest`:
  - `name`: Red de Jóvenes
  - `short_name`: Red Jóvenes
  - `start_url`: `/`
  - `scope`: `/`
  - `display`: `standalone`
  - `theme_color`: `#020617`
  - `background_color`: `#020617`
- `index.html` contiene metadata PWA/SEO y manifest.
- `offline.html` mantiene estética oscura/glassmorphism.
- `sw.js` cachea app shell y recursos propios estáticos.
- El service worker no cachea tráfico externo de Supabase.
- Las navegaciones usan fallback offline sin guardar HTML de rutas privadas.

## UI

- Se agregó `InstallPrompt`.
- El botón “Instalar app” aparece solo cuando el navegador emite
  `beforeinstallprompt`.
- El botón se oculta si la app ya está en modo standalone.

## Validación

- `npm run lint`: OK.
- `npm run build`: OK, con warnings no bloqueantes de plugin timing y chunk grande.

## Pendientes

- Validar instalación real en Chrome/Android y Edge desktop.
- Agregar íconos PNG dedicados si se decide no depender solo de `favicon.svg`.
