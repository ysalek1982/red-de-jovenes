# QA staging del hotfix scroll movil

URL staging: `https://red-de-jovenes.vercel.app/`  
Deployment Vercel: `https://red-de-jovenes-g0nnpz6kh-ysaleks-projects.vercel.app`  
Estado Vercel: `READY`  
Fecha: 2026-05-21

## Deployment

Despues del push a `main`, el alias productivo seguia apuntando al deployment anterior. Se ejecuto deployment productivo con Vercel CLI desde el proyecto vinculado:

`npx vercel --prod --yes`

Resultado:

- Build Vercel: OK.
- Alias actualizado: `https://red-de-jovenes.vercel.app`.
- Deployment final: `red-de-jovenes-g0nnpz6kh`.

## QA ejecutado contra staging

Variable usada:

`QA_APP_BASE_URL=https://red-de-jovenes.vercel.app`

| Validacion | Resultado | Observacion |
|---|---:|---|
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas/privadas y modulos principales responden 200. |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin, bloqueo no admin y moderacion OK. |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` | Corpus RVR1909 completo en staging. |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` | Flujos principales de usuario/admin OK. |
| `npm run qa:mobile-scroll` | `QA_MOBILE_SCROLL_OK` | Rutas clave 200 y guardrails de scroll presentes. |

## Validacion responsive/manual

La automatizacion de navegador no esta disponible en este entorno (`playwright` no instalado). Se deja pendiente la prueba fisica/manual:

- telefono real;
- responsive browser con sesion real;
- abrir `/app`, hacer scroll abajo y navegar a Foros, Biblia, Juegos y Mapa;
- abrir comentarios en Foros;
- cambiar capitulo en Biblia;
- iniciar juego.

Estado: `PENDING_HUMAN_MOBILE_SCROLL_TEST`.
