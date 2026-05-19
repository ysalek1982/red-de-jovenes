# QA movil final contra staging

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

Variable usada:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

## Resultados

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | Sin errores ESLint. |
| `npm run build` | OK | Build Vite correcto. |
| `npm run smoke:build` | SMOKE_BUILD_OK | Dist contiene PWA base. |
| `npm run qa:auth` | QA_AUTH_OK | Usuarios QA inician sesion y leen datos base. |
| `npm run qa:rls` | QA_RLS_OK | RLS conserva aislamiento de datos. |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas staging responden correctamente. |
| `npm run qa:prayer` | QA_PRAYER_OK | Oracion sin regresiones. |
| `npm run qa:forums` | QA_FORUMS_OK | Foros, comentarios, reacciones y reportes OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin y bloqueo no admin OK. |
| `npm run qa:games` | QA_GAMES_OK | Cinco juegos validan puntaje e historial. |
| `npm run qa:map` | QA_MAP_OK | Mapa, sugerencias y aprobacion OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Escenarios de usuario completos OK. |

## Rutas relevantes

`qa:functional` valido:

- `/`
- `/landing`
- `/demo`
- `/entrar`
- `/crear-cuenta`
- `/recuperar`
- `/actualizar-contrasena`
- `/app`
- `/app/oracion`
- `/app/foros`
- `/app/devocional`
- `/app/juegos`
- `/app/mapa`
- `/app/seguridad`
- `/app/perfil`
- `/app/admin`

## Observaciones

- `/app/seguridad` sigue respondiendo como ruta secundaria oculta. No aparece en la navegacion visible.
- Los reportes internos siguen cubiertos por `qa:forums`, `qa:prayer`, `qa:admin` y `qa:journeys`.
- La prueba tactil final en dispositivo real sigue marcada como PENDING_HUMAN_DEVICE_TEST.
