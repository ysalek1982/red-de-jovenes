# Certificacion de URL staging

Fecha: 2026-05-18

## Estado

**PENDIENTE_URL_STAGING**

No existe una URL staging real generada desde Vercel en este entorno. Por lo tanto, no se ejecutaron pruebas sobre dominio publico y no se declara certificacion staging completa.

## Bloqueo

- Vercel CLI disponible: `54.1.0`
- `VERCEL_TOKEN`: no disponible
- `npx --yes vercel@latest whoami`: no completo en modo no interactivo
- Resultado: `BLOQUEADO_POR_AUTH_VERCEL`

## Validacion local disponible

La validacion local equivalente ya paso con:

- `npm run qa:functional`: `QA_FUNCTIONAL_ROUTES_OK`
- `npm run qa:auth`: `QA_AUTH_OK`
- `npm run qa:rls`: `QA_RLS_OK`
- `npm run smoke:build`: `SMOKE_BUILD_OK`

Esto no reemplaza la certificacion sobre URL staging real.

## Tabla de rutas staging

| Ruta | Resultado | Observacion |
| --- | --- | --- |
| `/` | No ejecutado en staging | Pendiente de URL publica |
| `/landing` | No ejecutado en staging | Pendiente de URL publica |
| `/demo` | No ejecutado en staging | Pendiente de URL publica |
| `/entrar` | No ejecutado en staging | Pendiente de URL publica |
| `/crear-cuenta` | No ejecutado en staging | Pendiente de URL publica |
| `/recuperar` | No ejecutado en staging | Pendiente de URL publica |
| `/actualizar-contrasena` | No ejecutado en staging | Pendiente de URL publica |
| `/app` | No ejecutado en staging | Pendiente de URL publica |
| `/app/oracion` | No ejecutado en staging | Pendiente de URL publica |
| `/app/foros` | No ejecutado en staging | Pendiente de URL publica |
| `/app/devocional` | No ejecutado en staging | Pendiente de URL publica |
| `/app/juegos` | No ejecutado en staging | Pendiente de URL publica |
| `/app/mapa` | No ejecutado en staging | Pendiente de URL publica |
| `/app/seguridad` | No ejecutado en staging | Pendiente de URL publica |
| `/app/perfil` | No ejecutado en staging | Pendiente de URL publica |
| `/app/admin` | No ejecutado en staging | Pendiente de URL publica |

## Pruebas criticas pendientes

Cuando exista URL staging:

```powershell
$env:QA_APP_BASE_URL="https://URL-STAGING"
npm run qa:functional
```

Luego validar manualmente:

1. Login admin.
2. Login usuario normal.
3. Bloqueo admin para usuario no admin.
4. Registro nuevo.
5. Recuperacion de contrasena real.
6. Refresco de rutas privadas sin 404.
7. PWA install prompt.
8. Offline fallback.
9. Ausencia de secretos en build.

## Dictamen de esta fase

**CERTIFICACION_STAGING_BLOQUEADA_POR_URL**. La app esta validada localmente, pero falta desplegar para certificar URL publica.
