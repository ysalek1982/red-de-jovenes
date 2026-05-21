# Reporte final hotfix scroll movil

## 1. Dictamen

`HOTFIX SCROLL MOVIL LISTO`

Observacion: queda pendiente la prueba en telefono fisico con usuario real para confirmar sensacion tactil y teclado movil.

## 2. Problema corregido

En telefono movil, la app podia conservar el scroll anterior al navegar entre modulos o al abrir contenido nuevo dentro de una ruta. Esto hacia que Foros, Biblia, Juegos, Mapa u otros modulos parecieran abrir al final o en una zona intermedia.

## 3. Causa

- React Router no reseteaba el scroll al cambiar `pathname/search`.
- El navegador podia restaurar scroll automaticamente.
- `AppShell` y bottom nav navegaban sin reset explicito.
- Algunos modulos renderizaban contenido nuevo dentro de la misma ruta sin `scrollIntoView`.
- Algunos contenedores internos con `overflow-y-auto` conservaban su propia posicion.

## 4. Rutas afectadas

- `/app`
- `/app/foros`
- `/app/oracion`
- `/app/biblia`
- `/app/juegos`
- `/app/mapa`
- `/app/eventos`
- `/app/mensajes`
- `/app/admin`

## 5. Componentes modificados

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

## 6. QA local

| Validacion | Resultado |
|---|---:|
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |
| `npm run qa:mobile-scroll` | `QA_MOBILE_SCROLL_OK` |

## 7. QA staging

URL: `https://red-de-jovenes.vercel.app/`

Deployment final: `https://red-de-jovenes-g0nnpz6kh-ysaleks-projects.vercel.app`

| Validacion | Resultado |
|---|---:|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |
| `npm run qa:mobile-scroll` | `QA_MOBILE_SCROLL_OK` |

## 8. Pendientes humanos

- `PENDING_HUMAN_MOBILE_SCROLL_TEST`: probar en telefono fisico con sesion real.
- Verificar teclado movil en formularios largos.
- Confirmar sensacion de scroll en Foros al abrir comentarios y en Biblia al cambiar capitulo.

## 9. Recomendacion

Mantener este hotfix en staging para el piloto y pedir a los usuarios que reporten cualquier caso residual de navegacion que abra contenido fuera de la parte visible. No se recomienda agregar cambios funcionales adicionales hasta validar el comportamiento en telefono fisico.
