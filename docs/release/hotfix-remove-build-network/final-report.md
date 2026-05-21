# Reporte final - Hotfix remover Construir la Red

## Dictamen

MODULO CONSTRUIR REMOVIDO CORRECTAMENTE.

## Qué se quitó

- Navegación visible de Construir la Red en el menú Más y desktop.
- Card/acceso rápido en Home.
- Sección y enlace en Guía rápida.
- Ruta activa del módulo.
- Página `BuildNetworkPage`.
- Servicio `buildNetworkService`.
- Script `qa:build-network`.
- Expectativa de `/app/construir` en `qa:functional`.

## Qué se mantuvo

- Auth y RLS sin cambios.
- Biblia completa RVR1909 sin cambios.
- Gemini/secrets sin cambios.
- Feedback piloto, incidentes, reportes, comunidades, eventos, Biblia, IA y Admin.
- Sugerencias históricas preservadas como datos generales.

## Base de datos

No se borraron tablas remotas ni migraciones históricas. En particular, `feedback_suggestions` queda preservada para evitar pérdida de historial y porque no hay autorización para cambios destructivos sobre datos productivos.

## Rutas afectadas

| Ruta | Estado |
| --- | --- |
| `/app/construir` | Redirige de forma controlada a `/app` |
| `/app` | Operativa sin card Construir |
| `/app/guia` | Operativa sin mención a Construir |
| Menú Más | Operativo sin Construir |

## QA local

OK:

- `npm run lint`
- `npm run build`
- `npm run smoke:build`
- `npm run qa:functional`
- `npm run qa:auth`
- `npm run qa:rls`
- `npm run qa:admin`
- `npm run qa:bible-corpus`
- `npm run qa:journeys`
- `npm run qa:community`
- `npm run qa:forums`
- `npm run qa:prayer`
- `npm run qa:games`
- `npm run qa:map`
- `npm run qa:events`
- `npm run qa:discipleship`
- `npm run qa:messages`
- `npm run qa:search`
- `npm run qa:notifications`
- `npm run qa:pilot-feedback`
- `npm run qa:pilot-incidents`
- `npm run qa:mobile-scroll`

No se ejecutó `qa:build-network` porque fue removido.

## QA staging

OK contra `https://red-de-jovenes.vercel.app`:

- `npm run qa:functional`
- `npm run qa:admin`
- `npm run qa:bible-corpus`
- `npm run qa:journeys`
- `npm run qa:mobile-scroll`

Vercel READY:

- `https://red-de-jovenes-bm6u6qs2s-ysaleks-projects.vercel.app`
- Alias: `https://red-de-jovenes.vercel.app`

## Pendientes

- PENDING_HUMAN_VISUAL_CONFIRMATION: confirmar en teléfono real que el menú Más no muestra Construir la Red.
- Mantener documentación histórica sin editar para trazabilidad de releases anteriores.

## Recomendación

Usar `pilot-v1.3.1` como release de piloto vigente y continuar el piloto con una experiencia más simple: Inicio, Biblia, Devocional, Oración, Foros, Juegos, Comunidad/Mapa, Eventos, Discipulado, Mensajes, Perfil y Admin.
