# QA Seguridad y RLS

Fecha: 2026-05-17

## Estado de migraciones

- Supabase CLI: operativo.
- `npx supabase migration list`: local/remoto alineado en `20260517214049`.
- No se crearon migraciones nuevas en esta macrofase.

## Revision estatica de politicas

- Todas las tablas principales tienen RLS activo: `profiles`, `prayer_requests`, `posts`, `devotionals`, `testimonies` y `groups`.
- `profiles`: usuarios autenticados pueden leer perfiles; cada usuario inserta y actualiza solo su propio perfil.
- `prayer_requests`: usuarios autenticados leen peticiones publicas o propias; crean, actualizan y eliminan solo propias.
- `posts`: usuarios autenticados leen posts; crean, actualizan y eliminan solo propios.
- `devotionals`: usuarios autenticados solo leen; no hay politica de escritura desde cliente.
- `testimonies`: usuarios autenticados leen solo testimonios aprobados y pueden crear testimonios; no hay politica para aprobar desde cliente.
- `groups`: usuarios autenticados solo leen; no hay politica de escritura desde cliente.

## Validacion dinamica

- Estado: preparada con script local.
- Script: `npm run qa:rls`.
- Resultado actual: pendiente por falta de credenciales QA locales confirmadas.
- `BLOCKED_EMAIL_CONFIRMATION`: si no hay sesion QA confirmada disponible, no se pueden ejecutar pruebas autenticadas completas.
- `BLOCKED_AUTH_RATE_LIMIT`: Supabase limito nuevos registros por email durante la sesion nocturna.
- `BLOCKED_MISSING_QA_ENV`: no hay dos usuarios QA configurados en variables locales.

## Escenarios pendientes con sesion QA

- Leer devocionales como usuario autenticado.
- Leer posts como usuario autenticado.
- Crear post propio.
- Crear peticion de oracion propia.
- Actualizar perfil propio.
- Intentar modificar perfil de otro usuario y confirmar rechazo.
- Intentar modificar post de otro usuario y confirmar rechazo.
- Intentar modificar peticion de otro usuario y confirmar rechazo.
- Intentar aprobar testimonios desde cliente y confirmar rechazo.

## Script RLS disponible

```bash
npm run qa:rls
```

El script usa dos usuarios QA confirmados y no imprime correos ni contrasenas. Valida:

- Login de usuario A y B.
- Escrituras propias de usuario A.
- Lecturas permitidas de usuario B.
- Rechazo de modificaciones de usuario B sobre perfil, post y peticion de usuario A.
- Limpieza de datos temporales creados por QA cuando sea posible.

## Revision de secretos

- Sin coincidencias reales para llaves privadas de Supabase, URLs privadas de Postgres ni claves de backend en archivos versionables.
- `.env.local` y `supabase/.temp/` permanecen ignorados.
- No se uso service role en frontend.

## Riesgo actual

El riesgo principal no es de RLS sino de QA incompleto: hasta confirmar un usuario o ajustar temporalmente la confirmacion de email, las pruebas dinamicas de RLS quedan pendientes.
