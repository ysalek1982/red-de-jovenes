# Release pilot-v1.1.1

## Dictamen

`HOTFIX SCROLL MÓVIL LISTO`

## URL staging

https://red-de-jovenes.vercel.app/

## Commit base

`d38675b Documenta hotfix scroll movil`

## Problema corregido

En teléfono móvil, al navegar entre módulos, enlaces, detalles o secciones, la app podía conservar el scroll anterior y abrir el nuevo contenido en una posición baja de la pantalla. El usuario quedaba desorientado porque no veía de inmediato el encabezado o el contenido principal del módulo abierto.

## Rutas afectadas

- `/app`
- `/app/foros`
- `/app/oracion`
- `/app/biblia`
- `/app/juegos`
- `/app/mapa`
- `/app/eventos`
- `/app/mensajes`
- `/app/admin`

## Componentes principales modificados

- `src/components/navigation/ScrollToTop.tsx`
- `src/lib/scroll.ts`
- `src/App.tsx`
- `src/components/layout/AppShell.tsx`
- `src/pages/CommunityFeedPage.tsx`
- `src/pages/PrayerRoomPage.tsx`
- `src/pages/BiblePage.tsx`
- `src/pages/FaithGamesPage.tsx`
- `src/pages/WorldMapPage.tsx`
- `src/pages/EventsPage.tsx`
- `src/pages/MessagesPage.tsx`
- `src/pages/AdminHome.tsx`
- `src/index.css`
- `scripts/qa-mobile-scroll-routes.mjs`

## QA local pilot-v1.1.1

| Validación | Resultado |
|---|---:|
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |
| `npm run qa:mobile-scroll` | `QA_MOBILE_SCROLL_OK` |

## QA staging del hotfix

Staging quedó validado contra:

https://red-de-jovenes.vercel.app/

Deployment Vercel validado:

`https://red-de-jovenes-g0nnpz6kh-ysaleks-projects.vercel.app`

| Validación | Resultado |
|---|---:|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |
| `npm run qa:mobile-scroll` | `QA_MOBILE_SCROLL_OK` |

## Pendiente humano

`PENDING_HUMAN_MOBILE_SCROLL_TEST`

Pruebas pendientes en teléfono físico con sesión real:

- navegar desde `/app` hacia Foros, Biblia, Juegos y Mapa después de hacer scroll abajo;
- abrir comentarios en Foros;
- cambiar capítulo en Biblia;
- iniciar y terminar un juego;
- abrir `Más > Comunidad`;
- verificar comportamiento con teclado móvil en formularios.

## Recomendación

Usar `pilot-v1.1.1` como release patch del piloto cerrado. No agregar cambios funcionales adicionales hasta confirmar el comportamiento en teléfono físico con usuarios reales.
