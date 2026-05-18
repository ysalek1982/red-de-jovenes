# Experiencia PWA

## Completado

- Manifest con `start_url` en `/`.
- Service worker con app shell y fallback offline.
- No se cachean respuestas externas de Supabase.
- Botón “Instalar app”.
- Si el usuario descarta instalación, no se repite en la misma instalación local.

## QA

- `npm run smoke:build`: `SMOKE_BUILD_OK`.

## Pendiente

- Prueba real en Chrome Android y Edge/Chrome Desktop sobre URL HTTPS staging.
