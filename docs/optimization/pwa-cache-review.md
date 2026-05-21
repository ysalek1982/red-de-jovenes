# Revision PWA y cache

## Archivos revisados

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `src/components/pwa/InstallPrompt.tsx`

## Validaciones

- Manifest presente.
- `start_url` configurado en `/`.
- `scope` configurado en `/`.
- Modo `standalone`.
- Offline fallback disponible en `/offline.html`.
- Service worker solo maneja requests `GET`.
- Service worker ignora origenes externos, por lo que no cachea Supabase.
- Boton de instalacion usa `beforeinstallprompt`.
- Descarte del prompt persiste en `localStorage`.

## Mejoras aplicadas

- Cache versionado de `red-de-jovenes-v2` a `red-de-jovenes-v3` para refrescar assets del release optimizado.
- El service worker ignora rutas tipo `/api/` y `/functions/` si en el futuro existen endpoints same-origin.
- El prompt de instalacion tolera navegadores que bloquean `localStorage`.

## Pendientes humanos

- Probar instalacion PWA en Chrome Android.
- Probar instalacion en Edge/Chrome Desktop.
- Confirmar apertura desde icono instalado.
- Confirmar offline fallback con red desactivada.
