# QA Staging Final - Mejoras de Interfaz

Fecha: 2026-05-21

URL staging: https://red-de-jovenes.vercel.app/

Deployment Vercel:
- Estado: READY.
- Deployment: `https://red-de-jovenes-6s4orgjj3-ysaleks-projects.vercel.app`
- Alias principal: `https://red-de-jovenes.vercel.app`

## QA ejecutado contra staging

Variable usada:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK | Rutas publicas y privadas responden 200; SPA fallback OK. |
| `npm run qa:admin` | QA_ADMIN_OK | Admin, bloqueo no admin, reportes y devocionales OK. |
| `npm run qa:bible-corpus` | QA_BIBLE_CORPUS_COMPLETE_OK | RVR1909 completa con 66 libros y 31084 versiculos. |
| `npm run qa:journeys` | QA_JOURNEYS_OK | Flujos joven nuevo, participante y admin OK. |
| `npm run qa:pilot-feedback` | QA_PILOT_FEEDBACK_OK | Feedback piloto OK. |
| `npm run qa:pilot-incidents` | QA_PILOT_INCIDENTS_OK | Incidentes piloto OK. |

## Verificacion de rutas publicas

| Ruta | Resultado |
| --- | --- |
| `/` | 200 |
| `/app/biblia` | 200 |
| `/app/admin` | 200 |

## Validacion manual visual

Desde Codex se verifico disponibilidad HTTP y QA funcional autenticado. La prueba tactil en dispositivo fisico queda como comprobacion humana recomendada para:
- bottom nav;
- formularios con teclado movil;
- scroll en juegos;
- panel "Mas";
- lectura larga de Biblia.

## Dictamen staging

QA STAGING OK. El deployment nuevo esta activo y las validaciones funcionales requeridas pasan contra la URL publica.
