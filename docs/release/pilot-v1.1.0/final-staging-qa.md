# QA Staging Final - pilot-v1.1.0

Fecha: 2026-05-21

URL: https://red-de-jovenes.vercel.app/

Deployment Vercel:

- Estado: READY
- Deployment: `https://red-de-jovenes-6ht8e7vdh-ysaleks-projects.vercel.app`
- Alias principal: `https://red-de-jovenes.vercel.app`

## QA ejecutado

Variable:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas publicas/privadas y SPA fallback OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin, bloqueo no admin y moderacion OK. |
| `npm run qa:bible-corpus` | QA_BIBLE_CORPUS_COMPLETE_OK | RVR1909 completa OK. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Flujos principales OK. |
| `npm run qa:pilot-feedback` | QA_PILOT_FEEDBACK_OK | Feedback piloto OK. |
| `npm run qa:pilot-incidents` | QA_PILOT_INCIDENTS_OK | Incidentes piloto OK. |

## Verificacion visual staging

Se verificaron las rutas que habian presentado overflow en mobile:

| Ruta | 360px | 375px | 414px | Resultado |
| --- | --- | --- | --- | --- |
| `/app/foros` | overflow 0 | overflow 0 | overflow 0 | OK |
| `/app/oracion` | overflow 0 | overflow 0 | overflow 0 | OK |
| `/app/admin` | overflow 0 | overflow 0 | overflow 0 | OK |

No se detecto mojibake visible en esas rutas.

## Validacion manual

Desde Codex se valido:

- login mediante QA automatizado;
- rutas SPA;
- bottom nav sin overflow en rutas criticas;
- Biblia corpus;
- Admin;
- feedback/incidentes.

Pendiente humano:

- prueba tactil fisica con PWA instalada;
- recovery desde inbox real.

## Dictamen

QA_STAGING_PILOT_V1_1_0_OK.
