# Plan integral de desarrollo de Red de Jóvenes

Fecha de inicio: 2026-05-18

## Objetivo

Convertir Red de Jóvenes en una app cristiana/PWA funcional, con entrada directa
a login, sesión persistente, módulos internos útiles, Supabase Auth/RLS y una
experiencia mobile-first coherente con el prototipo Lovable.

## Estado inicial verificado

- Rama: `codex/red-de-jovenes-inicial`.
- Worktree inicial: limpio.
- `npm run lint`: OK.
- `npm run build`: OK.
- Supabase CLI: operativo.
- Migraciones local/remoto:
  - `20260517214049_initial_red_de_jovenes`
  - `20260517224917_add_user_roles`
  - `20260517225433_add_user_roles_unique_constraint`
- QA A/B: bloqueado por falta de variables QA en `.env.qa.local`.
- Admin principal: `ysalek@gmail.com` validado previamente como admin.

## Rutas actuales antes de esta fase

Públicas:

- `/`: landing pública.
- `/demo`: demo público.
- `/entrar`: login.
- `/crear-cuenta`: registro.

Privadas:

- `/app`
- `/app/oracion`
- `/app/orar`
- `/app/comunidad`
- `/app/foros`
- `/app/devocional`
- `/app/juegos`
- `/app/mapa`
- `/app/perfil`
- `/app/admin`

## Tablas actuales

- `profiles`
- `prayer_requests`
- `posts`
- `devotionals`
- `testimonies`
- `groups`
- `user_roles`

## RLS actual resumido

- `profiles`: lectura autenticada, inserción/actualización solo perfil propio.
- `prayer_requests`: lectura de públicas/propias, escritura solo propias.
- `posts`: lectura autenticada, escritura solo propios.
- `devotionals`: lectura autenticada, sin escritura desde cliente.
- `testimonies`: lectura de aprobados, creación autenticada.
- `groups`: lectura autenticada.
- `user_roles`: cada usuario lee solo sus propios roles.
- `has_role(required_role)`: función `security definer` para roles.

## Brechas funcionales detectadas

1. Entrada: `/` aún muestra landing; debe redirigir a login o app según sesión.
2. Onboarding: falta username/edad/normas de comunidad en registro.
3. Recuperación de contraseña: no existe.
4. Sala de oración: falta interacción “Estoy orando” persistida.
5. Foros: faltan comentarios y reacciones.
6. Devocional: faltan leídos/favoritos.
7. Juegos: existen como demo visual, falta lógica de juego real.
8. Mapa: existe vista visual, falta conexión a `groups`, filtros y sugerencias.
9. Espacio seguro: falta página dedicada y reportes.
10. Admin: existe guard, pero el panel sigue siendo placeholder.
11. PWA: falta prompt de instalación dentro de la UI.
12. QA dinámico RLS: bloqueado por falta de usuarios QA A/B.

## Riesgos

- Las migraciones remotas pueden bloquearse si Supabase requiere credenciales
  interactivas o si el proyecto remoto no está disponible.
- QA dinámico con dos usuarios depende de credenciales locales confirmadas.
- Las políticas RLS deben mantenerse restrictivas para no exponer escritura
  administrativa desde cliente normal.
- La app debe conservar la identidad visual Lovable y no virar a portal
  institucional.

## Orden de trabajo

1. Entrada directa a login y landing en `/landing`.
2. Auth/onboarding/perfil.
3. Sala de oración funcional con soportes.
4. Foros con comentarios/reacciones.
5. Devocional con leídos/favoritos.
6. Juegos funcionales frontend y puntajes.
7. Mapa mundial conectado a grupos/sugerencias.
8. Espacio seguro/reportes.
9. Admin inicial funcional.
10. PWA instalable robusta.
11. Preferencias de notificaciones.
12. QA integral.
13. Pulido mobile-first.
14. Reporte final.

Cada fase debe cerrar con `npm run lint`, `npm run build`, revisión de secretos y
commit propio.
