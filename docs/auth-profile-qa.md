# QA Auth y perfil

Fecha: 2026-05-17

## Estado

- Supabase Auth esta conectado con publishable key desde frontend.
- El registro remoto ya fue validado previamente: Supabase crea el usuario.
- El login completo puede quedar bloqueado por confirmacion de email.

## Cambios de la macrofase

- El flujo de registro ahora distingue entre cuenta creada con sesion activa y cuenta creada pendiente de confirmacion.
- El login muestra un mensaje especifico cuando Supabase responde `Email not confirmed`.
- Se agrego servicio de perfil con lectura, creacion de respaldo si falta el trigger y actualizacion del propio perfil.
- Se agrego la ruta protegida `/app/perfil`.

## Validaciones funcionales

- Campos obligatorios: nombre completo.
- Usuario: opcional, se guarda en minusculas y no permite espacios.
- Campos editables: nombre completo, usuario, ciudad, pais, iglesia o comunidad y bio.
- RLS esperado: cada usuario solo puede insertar o actualizar su propio perfil.

## Prueba remota

- Se intento crear un usuario QA nuevo contra Supabase remoto usando solo la publishable key.
- Resultado actual: Supabase respondio `email rate limit exceeded`.
- Estado: `BLOCKED_AUTH_RATE_LIMIT`.
- La prueba previa documentada en `docs/supabase-qa.md` confirma que el registro remoto llego a crear usuario, pero el login quedo bloqueado por `Email not confirmed`.

## Bloqueos

- `BLOCKED_EMAIL_CONFIRMATION`: si el usuario QA no confirma su correo o no se desactiva temporalmente la confirmacion en Supabase, no se puede completar login real ni validar el trigger `profiles` desde una sesion autenticada.
- `BLOCKED_AUTH_RATE_LIMIT`: Supabase limito nuevos envios/altas por email durante la validacion nocturna.

## Seguridad

- No se usaron contrasenas de base de datos.
- No se uso service role en frontend.
- No se agregaron secretos a archivos versionados.
