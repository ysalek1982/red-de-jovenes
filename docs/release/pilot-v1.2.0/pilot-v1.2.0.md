# Release pilot-v1.2.0

Fecha: 2026-05-21

URL staging: https://red-de-jovenes.vercel.app/

## Dictamen

PILOT-V1.2.0 LISTO.

Release piloto optimizado para usuarios reales, basado en `pilot-v1.1.1`.

## Base anterior

- Release anterior: `pilot-v1.1.1`
- Proposito del patch anterior: hotfix de scroll movil y foco de navegacion.
- Proposito de esta version: optimizacion integral de rendimiento, estabilidad, mobile, accesibilidad, PWA y seguridad frontend.

## Cambios principales

| Area | Cambio | Estado |
| --- | --- | --- |
| Rendimiento | Auditoria de build, bundles y rutas pesadas. | OK |
| Lazy loading | Fallback visual mejorado para modulos lazy. | OK |
| Estabilidad | Error boundaries globales y por modulo. | OK |
| Consultas | Servicios frecuentes con selects mas explicitos y limites. | OK |
| Mobile | Ajustes para tactil, iOS zoom y compatibilidad con bottom nav. | OK |
| Accesibilidad | Mejoras ARIA en busqueda, notificaciones, dialogos y errores. | OK |
| PWA | Cache reforzado para no almacenar Supabase ni endpoints dinamicos. | OK |
| Seguridad frontend | Revision de secretos, errores, `.vercelignore` y visibilidad admin. | OK |

## Modulos disponibles

- Auth y cuenta.
- Home comunitario.
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
- Buscador global.
- Notificaciones.
- Feedback piloto.
- Incidentes piloto.
- Admin.
- Admin Biblia.
- Admin IA.
- Monitoreo piloto.

## Biblia completa

- Fuente: eBible RVR1909 / spaRV1909.
- Licencia: public domain.
- Libros: 66.
- Capitulos: 1.189.
- Versiculos: 31.084.
- Estado: corpus completo importado y validado.

## IA Gemini

- Estado: preparada y gobernada.
- Key real: pendiente de configuracion manual por admin.
- No se activa automaticamente.
- No se expone ninguna key en frontend.
- Acciones sensibles mantienen aprobacion humana.

## QA local

Resultado: QA_LOCAL_OPTIMIZATION_OK.

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
- events;
- discipleship;
- messages;
- search;
- notifications;
- pilot feedback;
- pilot incidents;
- mobile scroll.

## QA staging

Resultado: QA_STAGING_OPTIMIZATION_OK.

Deployment validado:

- `red-de-jovenes-fthx5koco-ysaleks-projects.vercel.app`
- Alias: `https://red-de-jovenes.vercel.app`
- Estado: READY

Incluyo:

- functional;
- admin;
- bible corpus;
- journeys;
- pilot feedback;
- pilot incidents;
- mobile scroll.

## Pendientes humanos

- PENDING_HUMAN_DEVICE_TEST: prueba en telefono fisico.
- PENDING_HUMAN_PWA_INSTALL: instalacion PWA real.
- PENDING_HUMAN_RECOVERY_EMAIL: recovery desde inbox real.
- PENDING_HUMAN_GEMINI_REAL_KEY: configurar Gemini solo si el admin decide activarlo.
- Revision pastoral continua de planes, prompts y contenido generado/asistido.

## Recomendacion

Usar `pilot-v1.2.0` como version activa para el piloto cerrado monitoreado. Mantener monitoreo diario de feedback, incidentes, errores moviles, PWA y uso de IA si se activa.
