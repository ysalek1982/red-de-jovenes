# Revision integral por subagentes

Fecha: 2026-06-02

Objetivo: revisar que las secciones principales de Red de Jovenes funcionen, esten conectadas y no dejen enlaces visibles rotos antes de continuar el piloto.

## Subagentes usados

| Subagente | Area revisada | Resultado |
| --- | --- | --- |
| Core / Mobile | rutas, AppShell, bottom nav, PWA, enlaces publicos | Navegacion privada coherente. Se reforzo seguridad de rutas desde notificaciones. |
| Comunidad / Social | foros, oracion, mapa, eventos, mensajes, comunidad | Se detecto que eventos seguia permitiendo insercion de usuarios normales por RLS. Se corrigio con migracion incremental para dejar eventos como CMS admin. |
| Biblia / IA / Admin | Biblia, corpus, Admin Biblia, IA, cola de aprobacion | Se detecto escritura directa de corpus por admins cliente y versiculo diario sin validacion de existencia. Se corrigio con migracion incremental y validacion en Edge Function. |
| QA / Scripts | QA funcional, scroll movil, rutas, secretos | Se ajusto puerto local por defecto de QA funcional y se amplio cobertura de scroll movil. |

## Correcciones aplicadas

| Area | Hallazgo | Correccion |
| --- | --- | --- |
| Notificaciones | `link_path` podia apuntar a rutas privadas removidas o no registradas. | Se agrego validacion de rutas permitidas y `/app/construir` redirige a `/app`. |
| Admin IA | La cola de aprobacion mostraba elementos, pero no permitia aprobar/rechazar desde UI. | Se agregaron botones Aprobar/Rechazar conectados a `ai-action-executor`. |
| Acciones IA | El selector admin no incluia todas las acciones biblicas permitidas por guardrails. | Se agregaron acciones de reflexion, pregunta grupal, oracion y post biblico. |
| Versiculo diario | Admin podia guardar una referencia inexistente. | Edge Function valida fecha, numeros positivos y existencia real en `bible_verses`. |
| Corpus biblico | Politicas antiguas permitian escritura directa del corpus a admins desde cliente. | Migracion incremental elimina escrituras directas; importacion queda por proceso administrativo/Edge Function. |
| Eventos | RLS permitia a cualquier autenticado crear eventos propios aunque UI fuera admin. | Migracion incremental deja crear/editar eventos solo a admin. |
| QA eventos | QA esperaba creacion de eventos por usuario normal. | QA ahora valida que usuario normal no crea eventos y prueba RSVP sobre evento activo existente. |
| QA rutas | Default local apuntaba a `127.0.0.1:8080`. | Default actualizado a `127.0.0.1:5173`. |
| QA scroll | Faltaban `devocional` y `seguridad` en verificacion de rutas privadas. | Se agregaron a `qa:mobile-scroll`. |

## Observaciones no bloqueantes

- Componentes publicos heredados no activos conservan algunos enlaces antiguos, pero no forman parte de las rutas actuales principales.
- Los reportes de mensajes existen y son contados por admin; una bandeja admin mas detallada puede agregarse como mejora futura si el piloto lo requiere.
- Algunos filtros de listas se aplican despues de limites razonables; si el piloto genera mucho volumen, conviene agregar paginacion por filtro en servidor.

## Dictamen

LISTO CON CORRECCIONES DE INTEGRIDAD APLICADAS.

Las secciones activas se mantienen conectadas, no se reintrodujo Construir la Red, Seguridad sigue fuera del menu visible y no se tocaron secretos, Gemini ni el corpus importado.
