# Certificacion final de staging real

Fecha: 2026-05-19

URL staging real: https://red-de-jovenes.vercel.app/

## Dictamen

LISTO PARA PILOTO CERRADO CON OBSERVACION MENOR.

La aplicacion desplegada en Vercel responde correctamente como SPA, ejecuta el build de produccion, mantiene Auth/RLS operativo contra Supabase y pasa el paquete completo de QA automatizado contra la URL publica.

## Resultado QA completo

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | Sin errores de ESLint. |
| `npm run build` | OK | Build Vite generado correctamente en `dist`. |
| `npm run smoke:build` | SMOKE_BUILD_OK | Archivos PWA y assets requeridos presentes. |
| `npm run qa:auth` | QA_AUTH_OK | Login, sesiones, perfiles y lecturas base OK para usuarios QA. |
| `npm run qa:rls` | QA_RLS_OK | Escrituras propias permitidas y escrituras ajenas denegadas. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas publicas y privadas responden 200 en staging. |
| `npm run qa:prayer` | QA_PRAYER_OK | Peticiones, soporte, anonimato y respuesta propia OK. |
| `npm run qa:forums` | QA_FORUMS_OK | Posts, comentarios, reacciones y reportes OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Rol admin, bloqueo no admin, moderacion y devocional admin OK. |
| `npm run qa:games` | QA_GAMES_OK | Puntajes propios y bloqueo de puntaje ajeno OK. |
| `npm run qa:map` | QA_MAP_OK | Grupos, sugerencias, aprobacion admin y filtros OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Escenarios joven nuevo, participante, admin y seguridad OK. |

Variable usada para QA de rutas:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

## Rutas verificadas

| Ruta | Resultado |
| --- | --- |
| `/` | 200, redirige a `/entrar` sin sesion en navegador. |
| `/entrar` | 200 |
| `/crear-cuenta` | 200 |
| `/recuperar` | 200 |
| `/actualizar-contrasena` | 200 |
| `/app` | 200 |
| `/app/oracion` | 200 |
| `/app/foros` | 200 |
| `/app/devocional` | 200 |
| `/app/juegos` | 200 |
| `/app/mapa` | 200 |
| `/app/seguridad` | 200 |
| `/app/perfil` | 200 |
| `/app/admin` | 200 |

Las rutas privadas refrescadas directamente no devuelven 404 gracias al fallback SPA de Vercel.

## Auth

Estado: OK con observacion externa en registro nuevo.

- Login de usuarios QA confirmado por `qa:auth`.
- Login admin confirmado por `qa:admin`.
- Usuario no admin bloqueado para acciones administrativas por `qa:admin`, `qa:rls` y `qa:functional`.
- La ruta `/crear-cuenta` responde 200.
- Se intento un registro nuevo real usando Supabase Auth con un correo tecnico de QA y metadata completa.
- Resultado del registro nuevo: bloqueado por Supabase con `email rate limit exceeded`.
- El bloqueo de registro nuevo es externo/configuracion/rate-limit de Supabase, no una falla de build, routing, frontend o RLS.

## Recovery

Estado: OK con observacion.

- La solicitud real de recuperacion fue aceptada por Supabase usando `resetPasswordForEmail`.
- El redirect configurado fue `https://red-de-jovenes.vercel.app/actualizar-contrasena`.
- La ruta `/actualizar-contrasena` responde 200.
- Pendiente humano: confirmar recepcion del correo y completar cambio desde el inbox real del usuario QA o piloto. El entorno de Codex no tiene acceso al buzon.

## RLS

Estado: OK.

- Usuarios autenticados leen datos permitidos.
- Usuario A no modifica datos de usuario B.
- Usuario normal no manipula roles admin.
- Usuario normal no crea devocionales ni grupos activos directamente.
- Admin opera moderacion, devocionales y aprobacion de comunidades.

## PWA

Estado: OK base instalable.

- `/manifest.webmanifest`: 200.
- `/sw.js`: 200.
- `/offline.html`: 200.
- `start_url` configurado en `/`.
- `display` configurado como `standalone`.
- El service worker cachea recursos propios de la app y no cachea Supabase porque ignora origenes externos.
- Pendiente de piloto: prueba visual del prompt de instalacion en Chrome Android y Desktop, porque el disparo de `beforeinstallprompt` depende del navegador/dispositivo.

## Mapa Mundial

Estado: OK.

- Lectura de grupos activos OK.
- Creacion de sugerencias OK.
- Usuario ve sus propias sugerencias.
- Usuario normal no aprueba ni crea grupos activos.
- Admin aprueba sugerencias.
- Al aprobar, se crea comunidad activa.
- Filtros por pais, ciudad y busqueda OK.

## Admin

Estado: OK.

- Admin reconocido por rol.
- Usuario no admin bloqueado.
- Moderacion de reportes OK.
- Escritura admin de devocionales OK.
- Aprobacion de comunidades validada por `qa:map`.

## Bugs encontrados

No se encontraron bugs funcionales bloqueantes en staging durante esta certificacion.

Observacion del entorno: la automatizacion de navegador embebido no permitio escribir texto por falta de clipboard virtual. No es un bug de la app; los flujos de login, roles y escritura fueron validados con scripts QA reales contra Supabase.

Observacion Supabase: el intento de registro nuevo quedo bloqueado por `email rate limit exceeded`. Reintentar cuando se libere el limite o ajustar temporalmente la configuracion de email para el piloto controlado.

## Bugs corregidos

No se requirieron correcciones de codigo en esta fase.

## Pendientes reales

- Reintentar registro nuevo cuando Supabase libere el rate limit de email.
- Confirmar recuperacion de contrasena abriendo el enlace desde un inbox real.
- Probar instalacion PWA en dispositivo real con HTTPS:
  - Chrome Android.
  - Chrome o Edge Desktop.
- Mantener en Vercel solo variables frontend (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`).

## Recomendacion

Iniciar piloto cerrado en staging con usuarios controlados, monitoreando:

- registro y confirmacion de email;
- recuperacion de contrasena desde inbox real;
- instalacion PWA en dispositivos reales;
- moderacion de reportes y sugerencias;
- actividad inicial en oracion, foros, devocionales, juegos y mapa.
