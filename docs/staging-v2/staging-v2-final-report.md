# Reporte final staging v2

Fecha: 2026-05-18

## Dictamen

**BLOQUEADO PARA STAGING REAL POR AUTENTICACION VERCEL**

El proyecto esta listo a nivel local para desplegar staging, pero no se pudo crear una URL staging real desde este entorno porque Vercel requiere autenticacion no interactiva o token local. No se declara certificacion sobre URL publica.

## URL staging

No disponible.

Estado: `PENDIENTE_URL_STAGING`.

## Resultado Vercel

| Elemento | Resultado |
| --- | --- |
| Vercel CLI | `54.1.0` |
| `VERCEL_TOKEN` | No disponible |
| `vercel whoami` | Timeout sin sesion no interactiva |
| Deploy real | No ejecutado |
| Bloqueo | `BLOQUEADO_POR_AUTH_VERCEL` |

## Resultado Supabase Auth config

Estado: documentado y listo para aplicar cuando exista URL staging.

Confirmaciones de codigo:

- Recuperacion usa `window.location.origin`.
- Redirect final: `/actualizar-contrasena`.
- No hay localhost hardcodeado en `src/`.
- No hay URL Vercel hardcodeada.

Pendiente:

- Configurar `Site URL` y `Redirect URLs` con la URL staging real en Supabase Dashboard.

## Resultado rutas

| Ruta | Estado local | Estado staging |
| --- | --- | --- |
| `/` | OK via `qa:functional` | No ejecutado |
| `/landing` | OK via `qa:functional` | No ejecutado |
| `/demo` | OK via `qa:functional` | No ejecutado |
| `/entrar` | OK via `qa:functional` | No ejecutado |
| `/crear-cuenta` | OK via `qa:functional` | No ejecutado |
| `/recuperar` | OK via `qa:functional` | No ejecutado |
| `/actualizar-contrasena` | OK via `qa:functional` | No ejecutado |
| `/app` | OK via `qa:functional` | No ejecutado |
| `/app/oracion` | OK via `qa:functional` | No ejecutado |
| `/app/foros` | OK via `qa:functional` | No ejecutado |
| `/app/devocional` | OK via `qa:functional` | No ejecutado |
| `/app/juegos` | OK via `qa:functional` | No ejecutado |
| `/app/mapa` | OK via `qa:functional` | No ejecutado |
| `/app/seguridad` | OK via `qa:functional` | No ejecutado |
| `/app/perfil` | OK via `qa:functional` | No ejecutado |
| `/app/admin` | OK via `qa:functional` | No ejecutado |

## Resultado Auth

- Local QA Auth: `QA_AUTH_OK`.
- Staging Auth: no ejecutado por falta de URL.

## Resultado recuperacion

- Codigo preparado con redirect dinamico.
- Prueba real de email y cambio de contrasena: pendiente de URL staging y configuracion Supabase.

## Resultado RLS

- Local QA RLS: `QA_RLS_OK`.
- Confirmado aislamiento de perfiles, posts, comentarios, oraciones, roles admin y escritura devocional.

## Resultado PWA

- Build PWA local: `SMOKE_BUILD_OK`.
- Manifest, service worker y fallback offline presentes.
- Prueba en dispositivo real: `PENDING_DEVICE_TEST` por falta de URL staging.

## Resultado admin

- Local QA Admin: `QA_ADMIN_OK`.
- Admin real sobre URL staging: no ejecutado por falta de URL.

## Resultado mobile

- No se ejecuto certificacion visual sobre URL staging.
- Las rutas locales ya fueron validadas funcionalmente.
- Prueba mobile real pendiente en dispositivo/URL staging.

## Validaciones finales locales

| Validacion | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:games` | `QA_GAMES_OK` |
| `npm run qa:map` | `QA_MAP_OK` |

## Riesgos

- Sin URL staging no se puede validar recuperacion de contrasena real.
- Sin URL staging no se puede certificar instalacion PWA real.
- Vercel debe configurarse sin variables admin, QA ni service role.
- Supabase Auth debe actualizarse con la URL staging antes de invitar usuarios piloto.

## Pendientes

1. Autenticar Vercel por Dashboard o token local.
2. Crear deploy staging.
3. Copiar URL staging.
4. Configurar Supabase Auth URL Configuration.
5. Ejecutar `QA_APP_BASE_URL=https://URL-STAGING npm run qa:functional`.
6. Probar login admin, usuario normal, registro y recuperacion.
7. Probar PWA en dispositivo real.

## Recomendacion

No iniciar piloto todavia. Primero crear la URL staging real y completar la certificacion publica siguiendo los documentos en `docs/staging-v2/`.
