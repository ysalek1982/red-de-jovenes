# Release pilot-v1.3.0

Fecha: 2026-05-21

URL staging: https://red-de-jovenes.vercel.app/

## Dictamen

PILOT-V1.3.0 LISTO.

Release piloto con onboarding, activacion y primera experiencia mejorada.

## Base anterior

- Release anterior: `pilot-v1.2.0`
- Base funcional: app optimizada para piloto, Biblia completa RVR1909, comunidad, juegos, mapa, Admin y monitoreo.

## Cambios

| Area | Cambio | Estado |
| --- | --- | --- |
| Onboarding | Checklist real en `/app` para jovenes con baja activacion. | OK |
| Activacion | Pasos reales: perfil, Biblia, oracion, foros, juegos y comunidad. | OK |
| Perfil | Porcentaje de completitud y campos faltantes. | OK |
| Guia rapida | Nueva ruta privada `/app/guia` accesible desde "Mas". | OK |
| Microcopy | Textos mas claros, pastorales y orientados a accion. | OK |
| Admin | Metricas reales de activacion inicial. | OK |
| QA | Local y staging validados. | OK |

## Modulos disponibles

- Auth y cuenta.
- Home comunitario con checklist de bienvenida.
- Biblia completa RVR1909.
- Devocional.
- Oracion.
- Foros.
- Juegos.
- Mapa/comunidad.
- Eventos.
- Discipulado.
- Mensajes.
- Construir la Red.
- Guia rapida.
- Feedback piloto.
- Incidentes piloto.
- Admin y monitoreo.

## QA local

Resultado: QA_LOCAL_ONBOARDING_OK.

Incluyo:

- lint;
- build;
- smoke build;
- functional;
- auth;
- RLS;
- admin;
- bible corpus;
- journeys;
- community;
- forums;
- prayer;
- games;
- map;
- pilot feedback;
- pilot incidents;
- mobile scroll.

## QA staging

Resultado: QA_STAGING_ONBOARDING_OK.

Deployment:

- `red-de-jovenes-ffrslvle8-ysaleks-projects.vercel.app`
- Alias: `https://red-de-jovenes.vercel.app`
- Estado: READY

Incluyo:

- functional;
- admin;
- bible corpus;
- journeys;
- mobile scroll.

## Pendientes humanos

- PENDING_HUMAN_ONBOARDING_DEVICE_TEST.
- PENDING_HUMAN_NEW_USER_REVIEW.
- PENDING_HUMAN_PWA_INSTALL.
- PENDING_HUMAN_RECOVERY_EMAIL.
- Gemini real sigue pendiente de activacion manual por admin.

## Recomendacion

Usar `pilot-v1.3.0` como version activa para incorporar jovenes nuevos al piloto cerrado monitoreado y observar si completan los primeros pasos sin asistencia externa.
