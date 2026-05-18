# PWA local/offline - funcionalidad real

Fecha: 2026-05-18

## Resultado

La base PWA local esta funcional y lista para validacion HTTPS/staging.

## Validado

- Manifest presente.
- Service worker presente.
- Offline fallback presente.
- `start_url` apunta a `/`.
- `display` es `standalone`.
- El prompt de instalacion se puede descartar y no molesta repetidamente.
- El service worker no cachea respuestas sensibles de Supabase.
- Navegacion SPA no se rompe en build.

## QA

- `npm run smoke:build`: `SMOKE_BUILD_OK`
- `npm run build`: OK

## Pendientes

- Prueba final en dispositivo real requiere URL HTTPS/staging.
