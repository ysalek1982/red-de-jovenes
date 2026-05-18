# Inicio privado - funcionalidad real

Fecha: 2026-05-18

## Resultado

`/app` funciona como centro real de usuario y no depende de metricas falsas.

## Validado

- Saludo personalizado.
- Devocional real desde Supabase.
- Resumen de oracion conectado.
- Resumen de foros conectado.
- Accesos reales a oracion, foros, devocional, juegos, mapa, seguridad y perfil.
- Admin ve acceso a administracion.
- No admin no ve administracion.
- Logout disponible en la navegacion privada.
- Estados de carga/error/empty presentes en los bloques principales.

## QA

- `npm run qa:functional`: `QA_FUNCTIONAL_ROUTES_OK`
- `npm run qa:admin`: valida acceso admin/no admin.

## Pendientes

- Personalizacion por actividad reciente puede agregarse despues del piloto.
