# QA staging final de onboarding

Fecha: 2026-05-21

URL staging: https://red-de-jovenes.vercel.app/

Deployment validado:

- Vercel deployment: `red-de-jovenes-ffrslvle8-ysaleks-projects.vercel.app`
- Estado: READY
- Alias: `https://red-de-jovenes.vercel.app`

## Resultado

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Incluye `/app/guia` y rutas principales. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin, bloqueo no-admin y moderacion correctos. |
| `npm run qa:bible-corpus` | QA_BIBLE_CORPUS_COMPLETE_OK | Biblia RVR1909 completa validada. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Flujos principales de usuario y admin correctos. |
| `npm run qa:mobile-scroll` | QA_MOBILE_SCROLL_OK | Rutas moviles principales responden en staging. |

## Validacion manual pendiente

- PENDING_HUMAN_ONBOARDING_DEVICE_TEST: confirmar en telefono fisico que el checklist no tapa navegacion.
- PENDING_HUMAN_NEW_USER_REVIEW: validar con usuario nuevo real que entiende los primeros pasos.
- PENDING_HUMAN_PWA_INSTALL: instalar app desde navegador real si el prompt aparece.

## Dictamen

QA_STAGING_ONBOARDING_OK. La version desplegada queda lista para documentar el cierre de Fase 41 y release `pilot-v1.3.0`.
