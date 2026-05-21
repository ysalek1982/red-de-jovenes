# QA staging final de optimizacion

Fecha: 2026-05-21

URL staging: https://red-de-jovenes.vercel.app/

Deployment validado:

- Vercel deployment: `red-de-jovenes-fthx5koco-ysaleks-projects.vercel.app`
- Estado: READY
- Alias: `https://red-de-jovenes.vercel.app`

## Resultado

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas publicas y privadas responden 200 en staging. |
| `npm run qa:admin` | QA_ADMIN_OK | Rol admin, bloqueo no-admin, reportes y escritura devocional correctos. |
| `npm run qa:bible-corpus` | QA_BIBLE_CORPUS_COMPLETE_OK | RVR1909 completa: 66 libros, 31.084 versiculos, sin duplicados ni textos vacios. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Flujos de joven nuevo, participante, admin y seguridad correctos. |
| `npm run qa:pilot-feedback` | QA_PILOT_FEEDBACK_OK | Feedback propio/admin y bloqueo cruzado correctos. |
| `npm run qa:pilot-incidents` | QA_PILOT_INCIDENTS_OK | Incidentes admin y bloqueo no-admin correctos. |
| `npm run qa:mobile-scroll` | QA_MOBILE_SCROLL_OK | Rutas moviles principales responden en staging y validacion de scroll disponible. |

## Validacion manual pendiente

- PENDING_HUMAN_DEVICE_TEST: probar telefono fisico con login, bottom nav, Biblia, Foros, Oracion, Juegos, Mapa, Mensajes, Admin y prompt PWA.
- PENDING_HUMAN_PWA_INSTALL: instalacion real en Android/iOS/desktop depende del navegador y dispositivo.

## Dictamen

QA_STAGING_OPTIMIZATION_OK. La version desplegada en staging queda lista para documentar la optimizacion final y congelar `pilot-v1.2.0`.
