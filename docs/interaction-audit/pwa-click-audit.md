# PWA local - auditoria de interacciones

Fecha: 2026-05-18

## Validado localmente

- Manifest presente.
- Service worker presente.
- Offline fallback presente.
- Boton instalar solo aparece si el navegador emite `beforeinstallprompt`.
- Descartar instalacion persiste en `localStorage`.
- No se muestra repetidamente tras descarte.
- Service worker no cachea respuestas de Supabase.
- Build SPA no rompe navegacion local.

## Pendiente externo

- Prueba real requiere HTTPS/staging y dispositivo/navegador compatible.

## QA

- `npm run smoke:build`: `SMOKE_BUILD_OK`
- `npm run build`: OK

## Estado final

OK local.
