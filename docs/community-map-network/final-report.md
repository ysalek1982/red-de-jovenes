# Reporte final: red comunitaria y mapa vivo

Fecha: 2026-05-19

## Dictamen

LISTO PARA PILOTO COMO RED COMUNITARIA.

URL staging: https://red-de-jovenes.vercel.app/

Deployment Vercel:

- Estado: Ready
- Target: production
- Alias: https://red-de-jovenes.vercel.app
- Deployment inspeccionado: `red-de-jovenes-7khck7v8c-ysaleks-projects.vercel.app`

## Mejoras del mapa

- Se agrego membresia real con `group_members`.
- El usuario puede unirse a comunidades activas.
- El usuario puede salir de comunidades.
- Se muestra "Mis comunidades".
- Se muestran conteos reales de miembros mediante `get_group_member_counts()`.
- Se agrego modalidad de comunidad: presencial, online o hibrida.
- Sugerencias incluyen modalidad y nota para moderador.
- Admin aprueba sugerencias y crea/actualiza grupos activos preservando modalidad y origen.
- El mapa sigue sin API externa ni claves pagas.

## Mejoras del inicio

- `/app` ahora muestra pulso de comunidad con datos reales:
  - posts recientes;
  - peticiones recientes;
  - devocional del dia;
  - ultimo juego propio;
  - comunidades propias.
- Se agrego comunidad destacada con conteo real de miembros.
- Se muestra CTA para completar perfil si faltan datos comunitarios.

## Mejoras de foros

- Posts pueden asociarse a comunidad propia.
- Foros muestran autor con avatar/inicial, ciudad, pais, iglesia o comunidad.
- Se agrego filtro "Mi comunidad".
- RLS bloquea publicaciones en comunidades donde el usuario no participa.
- Reportes, comentarios y Amen siguen activos.

## Mejoras de perfil

- Perfil muestra comunidades propias.
- Perfil muestra actividad personal real:
  - devocionales leidos;
  - oraciones apoyadas;
  - juegos completados;
  - puntos de juegos.
- Se mantiene privacidad: no se agrego perfil publico abierto.

## Mejoras de oracion

- Peticiones pueden asociarse a comunidad propia.
- Se agrego filtro "Mi comunidad".
- Tarjetas muestran comunidad cuando aplica.
- RLS bloquea peticiones en comunidades donde el usuario no participa.

## Migraciones aplicadas

- `20260519110000_add_group_members_network.sql`
- `20260519111000_add_group_suggestion_moderator_note.sql`
- `20260519112000_add_posts_group_context.sql`
- `20260519113000_add_prayer_group_context.sql`
- `20260519113100_tighten_prayer_group_policy.sql`

## QA local

| Validacion | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | SMOKE_BUILD_OK |
| `npm run qa:auth` | QA_AUTH_OK |
| `npm run qa:rls` | QA_RLS_OK |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK |
| `npm run qa:prayer` | QA_PRAYER_OK |
| `npm run qa:forums` | QA_FORUMS_OK |
| `npm run qa:admin` | QA_ADMIN_OK |
| `npm run qa:games` | QA_GAMES_OK |
| `npm run qa:map` | QA_MAP_OK |
| `npm run qa:journeys` | QA_JOURNEYS_OK |
| `npm run qa:community` | QA_COMMUNITY_OK |

## QA staging

Con `$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"`:

| Validacion | Resultado |
| --- | --- |
| `npm run qa:functional` | QA_FUNCTIONAL_ROUTES_OK |
| `npm run qa:map` | QA_MAP_OK |
| `npm run qa:forums` | QA_FORUMS_OK |
| `npm run qa:prayer` | QA_PRAYER_OK |
| `npm run qa:community` | QA_COMMUNITY_OK |

## Pendientes reales

- Prueba humana de PWA instalada en dispositivo fisico.
- Prueba humana del flujo de recuperacion desde inbox real.
- Mapa geografico con coordenadas queda como mejora futura.
- Feed no es tiempo real; se actualiza por carga/recarga de pantalla.

## Recomendacion

Iniciar piloto cerrado. La app ya no se siente solo como modulos aislados: tiene pertenencia por comunidad, actividad reciente, filtros comunitarios y RLS especifico para proteger las nuevas interacciones.
