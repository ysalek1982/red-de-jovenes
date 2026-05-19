# QA local de Biblia completa

Fecha: 2026-05-19

## Dictamen

`QA_LOCAL_BIBLE_COMPLETE_OK`

## Validaciones ejecutadas

| Validacion | Resultado | Observacion |
| --- | --- | --- |
| `npm run lint` | OK | ESLint sin errores |
| `npm run build` | OK | Build Vite/TypeScript correcto |
| `npm run smoke:build` | `SMOKE_BUILD_OK` | 74 archivos, 69 assets, PWA requerida presente |
| `npm run qa:bible` | `QA_BIBLE_OK` | Modulo Biblia base operativo |
| `npm run qa:bible-db` | `QA_BIBLE_DB_OK` | 2 traducciones, 66 libros |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` | RPC random devuelve versiculos reales |
| `npm run qa:bible-search` | `QA_BIBLE_SEARCH_OK` | Busqueda por referencia y palabra OK |
| `npm run qa:bible-reader` | `QA_BIBLE_READER_OK` | Lectura por capitulo y progreso OK |
| `npm run qa:bible-plans` | `QA_BIBLE_PLANS_OK` | 5 planes activos y progreso propio |
| `npm run qa:bible-daily` | `QA_BIBLE_DAILY_OK` | Versiculo diario y fallback random OK |
| `npm run qa:bible-ai` | `QA_BIBLE_AI_OK` | IA responde estado no configurado sin romper flujo |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` | Admin Biblia visible, no admin denegado |
| `npm run qa:admin-bible-complete` | `QA_ADMIN_BIBLE_COMPLETE_OK` | Conteos admin completos |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` | Rutas publicas/privadas OK |
| `npm run qa:rls` | `QA_RLS_OK` | RLS sigue activo |
| `npm run qa:admin` | `QA_ADMIN_OK` | Admin/moderacion OK |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` | Flujos usuario/admin OK |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` | Corpus RVR1909 completo validado |

## Evidencia del corpus

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

## Pendientes locales

- La IA biblica sigue sin proveedor Gemini real configurado; el flujo controlado responde `AI_PROVIDER_NOT_CONFIGURED`.
- El panel Admin Biblia muestra 31086 versiculos totales porque incluye traducciones/semillas adicionales; la traduccion RVR1909 completa tiene 31084 versiculos con texto.
