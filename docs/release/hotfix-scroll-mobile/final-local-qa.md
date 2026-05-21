# QA local final del hotfix scroll movil

Release base: `pilot-v1.1.0`  
Fecha: 2026-05-21

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run lint` | OK | ESLint sin errores. |
| `npm run build` | OK | TypeScript y Vite build correctos. |
| `npm run smoke:build` | `SMOKE_BUILD_OK` | `index.html`, manifest, service worker y offline presentes. |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas/privadas y modulos principales OK. |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin, bloqueo no admin y moderacion OK. |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` | RVR1909 completa: 66 libros, 31.084 versiculos, sin duplicados. |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` | Flujos de usuario, participante, admin y seguridad OK. |
| `npm run qa:mobile-scroll` | `QA_MOBILE_SCROLL_OK` | Validacion estatica local de guardrails de scroll. |

## Dictamen local

Hotfix listo localmente. Pendiente validar contra staging despues del push/deploy y probar en telefono fisico.
