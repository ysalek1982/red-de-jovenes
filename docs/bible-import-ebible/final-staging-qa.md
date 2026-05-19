# QA staging con Biblia completa

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

## Deploy

| Campo | Resultado |
| --- | --- |
| Target | Production/Staging Vercel |
| Deployment | `https://red-de-jovenes-oyn0wz2um-ysaleks-projects.vercel.app` |
| Alias | `https://red-de-jovenes.vercel.app` |
| Estado | READY / Aliased |

## QA staging ejecutado

Variable:

```powershell
$env:QA_APP_BASE_URL="https://red-de-jovenes.vercel.app"
```

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | `/app/biblia` y rutas principales responden 200 |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` | Random devolvio Genesis 20:16 y Romanos 8:1 |
| `npm run qa:bible-search` | `QA_BIBLE_SEARCH_OK` | Busqueda por `Juan 3:16` y palabra OK |
| `npm run qa:bible-reader` | `QA_BIBLE_READER_OK` | Lectura por capitulo y progreso OK |
| `npm run qa:bible-plans` | `QA_BIBLE_PLANS_OK` | Planes activos y progreso propio OK |
| `npm run qa:bible-daily` | `QA_BIBLE_DAILY_OK` | Versiculo diario y fallback random OK |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` | Admin Biblia y bloqueo no admin OK |
| `npm run qa:admin-bible-complete` | `QA_ADMIN_BIBLE_COMPLETE_OK` | Conteos admin completos |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` | Corpus RVR1909 completo validado |

## Evidencia del corpus en staging

| Control | Resultado |
| --- | --- |
| Traduccion | `RVR1909` |
| Libros | 66 |
| Versiculos con texto | 31084 |
| Duplicados | 0 |
| Textos vacios | 0 |
| Genesis 1 | 31 versiculos |
| Salmos 23 | 6 versiculos |
| Juan 3 | 36 versiculos |
| Apocalipsis 22 | 21 versiculos |
| Busqueda `amor` | 10 resultados |
| Escritura usuario normal en `bible_verses` | Denegada |

## Validacion visual

No se ejecuto una prueba visual manual con navegador real desde Codex. La validacion staging fue automatizada sobre URL publica, rutas SPA, RPCs, busqueda, lector, planes, admin y RLS. Queda recomendado un spot-check humano visual de `/app/biblia` en navegador antes de la sesion piloto, aunque no bloquea el corpus.

## Dictamen

`STAGING_BIBLE_COMPLETE_QA_OK`
