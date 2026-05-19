# Release piloto v1.0.0

Fecha de congelamiento: 2026-05-19

## Dictamen final

`LISTO PARA INICIAR PILOTO CERRADO MONITOREADO`

Red de Jovenes queda congelada como release `pilot-v1.0.0` para iniciar piloto cerrado con usuarios reales, monitoreo operativo y Biblia completa RVR1909 importada.

## Identificacion

| Campo | Valor |
| --- | --- |
| URL staging | https://red-de-jovenes.vercel.app/ |
| Rama | `main` |
| Commit base antes del release | `448b113 Actualiza evidencia staging de Biblia completa` |
| Tag de release | `pilot-v1.0.0` |
| Estado Vercel | READY |
| Modo | Piloto cerrado monitoreado |

## Modulos disponibles

| Modulo | Estado |
| --- | --- |
| Auth, registro y recuperacion | Operativo |
| Home tipo red social cristiana | Operativo |
| Biblia | Completa con RVR1909 |
| Devocional | Operativo |
| Oracion | Operativo |
| Foros con la Palabra | Operativo |
| Juegos de fe | Operativo |
| Comunidad / Mapa | Operativo |
| Eventos | Operativo |
| Discipulado | Operativo |
| Mensajes seguros | Operativo |
| Construir la Red | Operativo |
| Buscador global | Operativo |
| Notificaciones internas | Operativo |
| Perfil y preferencias | Operativo |
| Admin | Operativo |
| Admin Biblia | Operativo |
| Admin IA | Preparado |
| Monitoreo de piloto | Operativo |
| Reportes y moderacion | Operativo internamente |
| PWA | Base operativa, pendiente prueba fisica final |

## Biblia completa

| Campo | Valor |
| --- | --- |
| Fuente | eBible RVR1909 / spaRV1909 |
| Licencia | public domain / Dominio Publico |
| Formato usado | VPL ZIP convertido a JSON interno |
| Checksum SHA-256 | `B331BC607A569F8EE0FFC0A93DB7D4FF6342FC93E5C5AFE0C8D0AF3221BED5AD` |
| Libros | 66 |
| Capitulos | 1189 |
| Versiculos RVR1909 con texto | 31084 |
| Duplicados | 0 |
| Textos vacios importados | 0 |
| Estado | Completa para piloto |

## IA Gemini

Gemini queda preparada y gobernada, pero no activada automaticamente.

| Componente | Estado |
| --- | --- |
| Edge Functions IA | Preparadas |
| Panel Admin IA | Preparado |
| Guardrails pastorales | Activos |
| Logs IA | Activos |
| Limites de uso | Preparados |
| Plantillas pastorales | Versionadas |
| Aprobacion humana | Requerida para acciones sensibles |
| Key Gemini real | Pendiente de carga manual por admin |

## QA local final Fase 36

| Validacion | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` | OK |
| `npm run smoke:build` | `SMOKE_BUILD_OK` |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` |
| `npm run qa:admin` | `QA_ADMIN_OK` |
| `npm run qa:journeys` | `QA_JOURNEYS_OK` |

## QA staging vigente

| Validacion | Resultado |
| --- | --- |
| `npm run qa:functional` | `QA_FUNCTIONAL_ROUTES_OK` |
| `npm run qa:bible-random` | `QA_BIBLE_RANDOM_OK` |
| `npm run qa:bible-search` | `QA_BIBLE_SEARCH_OK` |
| `npm run qa:bible-reader` | `QA_BIBLE_READER_OK` |
| `npm run qa:bible-plans` | `QA_BIBLE_PLANS_OK` |
| `npm run qa:bible-daily` | `QA_BIBLE_DAILY_OK` |
| `npm run qa:admin-bible` | `QA_ADMIN_BIBLE_OK` |
| `npm run qa:admin-bible-complete` | `QA_ADMIN_BIBLE_COMPLETE_OK` |
| `npm run qa:bible-corpus` | `QA_BIBLE_CORPUS_COMPLETE_OK` |

## Bitacora de soporte

`docs/pilot-monitoring/support-log.md` se versiona en este release porque contiene solo bitacora operativa, registros QA y conteos agregados. No contiene secretos, contrasenas, llaves privadas ni datos personales reales de usuarios piloto.

## Pendientes humanos

| Pendiente | Responsable sugerido | Bloquea piloto |
| --- | --- | --- |
| Prueba PWA fisica Android/Desktop | Lider tecnico | No |
| Recovery real desde inbox | Admin/lider tecnico | No |
| Configuracion Gemini real | Admin, solo si decide activar IA | No |
| Revision pastoral de prompts y planes | Lider pastoral | No |
| Monitoreo diario de feedback/incidentes | Admin/lider moderador | Si, durante piloto |
| Reunion de cierre dia 7 | Equipo piloto | No |

## Riesgos

| Riesgo | Mitigacion |
| --- | --- |
| Usuarios menores comparten datos sensibles | Normas, reportes, moderacion y guia piloto |
| Uso indebido de IA | IA desactivada hasta configuracion manual, guardrails y aprobacion humana |
| Costo Gemini | Limites diarios y panel de uso |
| Feedback real revela bugs no vistos por QA | Modo soporte piloto y bitacora de incidentes |
| Recovery/PWA requieren prueba humana real | Checklist post-release |
| Licencias biblicas futuras | Solo importar fuentes autorizadas documentadas |

## Recomendacion

Iniciar piloto cerrado con grupo pequeno de 10 a 20 jovenes, 1 admin y 2 lideres/moderadores. Duracion sugerida: 7 a 14 dias, con revision diaria de feedback, incidentes, reportes, actividad comunitaria y uso de Biblia.
