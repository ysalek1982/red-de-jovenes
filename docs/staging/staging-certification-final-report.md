# Reporte final de certificación staging

## Dictamen

`BLOQUEADO`

La aplicación Red de Jóvenes está validada localmente y lista para ser desplegada a staging, pero la certificación funcional sobre URL pública no pudo completarse porque no existe un deploy staging generado desde este entorno.

Bloqueo principal: `BLOCKED_VERCEL_AUTH_OR_PROJECT_LINK`.

## URL staging

No disponible.

Debe generarse en Vercel u otro hosting compatible siguiendo `docs/staging/vercel-staging-setup.md`.

## Estado general

| Área | Resultado |
| --- | --- |
| Build local | OK |
| Smoke de build | `SMOKE_BUILD_OK` |
| Auth QA local | `QA_AUTH_OK` |
| RLS QA local | `QA_RLS_OK` |
| QA funcional local | `QA_FUNCTIONAL_ROUTES_OK` |
| QA oración local | `QA_PRAYER_OK` |
| QA foros local | `QA_FORUMS_OK` |
| Vercel CLI | Disponible, versión `54.1.0` |
| Vercel project link | No disponible |
| Vercel auth CLI | Bloqueada por flujo interactivo |
| Certificación sobre URL pública | Bloqueada |

## Tabla por módulo

| Módulo | Estado local | Prueba staging | Resultado staging | Pendiente |
| --- | --- | --- | --- | --- |
| Auth/Login | OK | Abrir `/`, login admin, logout, login usuario normal | Bloqueado | URL staging y Supabase Site URL |
| Registro | OK | Crear usuario nuevo y confirmar profile | Bloqueado | URL staging y email Auth |
| Recuperación de contraseña | OK en código/ruta | Email recovery hasta `/actualizar-contrasena` | Bloqueado | URL staging y Redirect URLs |
| Perfil | OK | Editar datos y avatar | Bloqueado | URL staging |
| Oración | `QA_PRAYER_OK` | Crear petición, orar, marcar respondida | Bloqueado | URL staging |
| Foros | `QA_FORUMS_OK` | Post, comentario, reacción, reporte | Bloqueado | URL staging |
| Devocional | OK | Leer, favorito, marcar leído, historial | Bloqueado | URL staging |
| Juegos | OK | Completar juegos y puntaje | Bloqueado | URL staging |
| Mapa | OK | Filtros y sugerencia de comunidad | Bloqueado | URL staging |
| Seguridad/reportes | OK | Crear reporte y validar privacidad | Bloqueado | URL staging |
| Preferencias | OK | Guardar switches y refrescar | Bloqueado | URL staging |
| Admin | OK | Admin entra; no admin bloqueado | Bloqueado | URL staging |
| PWA | Build/smoke OK | Instalar Android/desktop, offline fallback | Bloqueado | URL staging y dispositivo real |
| Routing | OK local | Refrescar rutas profundas sin 404 | Bloqueado | URL staging |

## Estado Auth

- Login local QA: OK.
- Registro local: preparado y probado por QA funcional.
- Recuperación de contraseña:
  - Ruta `/recuperar`: OK local.
  - Ruta `/actualizar-contrasena`: OK local y añadida a QA funcional.
  - `redirectTo`: usa `window.location.origin`, compatible con staging.
  - Pendiente: configurar Site URL y Redirect URLs en Supabase cuando exista URL staging.

## Estado RLS

`QA_RLS_OK` local.

Se confirmó con usuarios QA A/B:

- escrituras propias permitidas;
- lectura pública permitida;
- modificaciones cruzadas denegadas;
- usuario no admin sin acceso admin;
- escritura admin sensible denegada a cliente normal.

Pendiente: repetir sobre URL staging usando la misma base Supabase.

## Estado PWA

- Manifest: OK.
- Service worker: OK.
- Offline fallback: OK.
- Smoke de build: OK.
- `start_url`: `/`.

Pendiente: prueba real de instalación en Chrome Android y Edge/Chrome Desktop contra URL staging.

## Estado admin

- Admin `ysalek@gmail.com`: creado previamente y con rol admin.
- Panel admin local: OK.
- Protección no admin: OK en QA funcional/RLS local.

Pendiente: login admin sobre URL staging.

## Bugs encontrados

| ID | Estado |
| --- | --- |
| STG-001: no hay URL staging ni proyecto Vercel enlazado | Pendiente externo |
| STG-002: QA funcional no cubría `/actualizar-contrasena` | Corregido |

## Bugs corregidos

- Se agregó `/actualizar-contrasena` a `scripts/qa-functional-routes.mjs`.
- Se documentó la configuración de Supabase Auth para staging.
- Se documentó el procedimiento de Vercel staging con variables seguras.

## Validaciones finales

| Comando | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:auth` | `QA_AUTH_OK` |
| `npm run qa:rls` | `QA_RLS_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:prayer` | `QA_PRAYER_OK` |
| `npm run qa:forums` | `QA_FORUMS_OK` |

## Riesgos

| Riesgo | Severidad | Mitigación |
| --- | --- | --- |
| URL staging no creada | Alta | Crear deploy en Vercel y repetir certificación. |
| Supabase Auth sin URL staging | Alta | Configurar Site URL y Redirect URLs antes de pilotos. |
| PWA sin prueba real en dominio HTTPS | Media | Probar instalación en dispositivo real después del deploy. |
| Recovery email no probado sobre staging | Media | Ejecutar flujo completo al tener URL pública. |

## Pendientes

1. Crear proyecto staging en Vercel.
2. Configurar variables frontend seguras.
3. Configurar Supabase Auth con URL staging.
4. Ejecutar certificación módulo por módulo sobre la URL pública.
5. Probar PWA en dispositivo real.
6. Actualizar este reporte con la URL y evidencia real.

## Recomendación

No iniciar piloto público hasta tener URL staging real y completar la certificación sobre ese dominio.

El código puede desplegarse a staging; la aplicación queda lista para el siguiente paso operativo, pero el dictamen de certificación staging permanece bloqueado por falta de URL pública.
