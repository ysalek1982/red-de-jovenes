# Optimizacion de consultas Supabase

## Objetivo

Reducir carga innecesaria en listas y evitar traer columnas completas cuando el modulo no las necesita.

## Cambios aplicados

### Mensajes

Archivo: `src/features/messages/messageService.ts`

- Se reemplazo `select('*, conversation_members(*), messages(*)')` por columnas explicitas.
- Se agrego limite de conversaciones recientes: `25`.
- Se agrego limite de mensajes anidados por conversacion: `40`.
- Se mantiene RLS como fuente de verdad para privacidad.

### Notificaciones

Archivo: `src/features/notifications/notificationService.ts`

- Se reemplazo `select('*')` por columnas visibles necesarias.
- Se mantiene limite de `30` notificaciones recientes.

### Juegos

Archivo: `src/features/games/gameService.ts`

- Se reemplazo `select('*')` por columnas necesarias del historial.
- Se mantiene limite de `60` puntajes propios.

### Eventos

Archivo: `src/features/events/eventService.ts`

- Se reemplazo `select('*, event_rsvps(*)')` por columnas explicitas.
- Se mantiene limite de `30` eventos.
- Se agrega limite de RSVP anidados.

## Consultas revisadas y no modificadas

- Foros y oracion ya tienen `limit(20)` y selects con relaciones concretas.
- Biblia mantiene RPCs/limites propios para no traer corpus completo al cliente.
- Admin conserva consultas amplias porque muestra panel operativo; optimizacion avanzada queda para paginacion post-piloto.
- `pilot_feedback` y `pilot_incidents` ya limitan a `100` y separan evidencia QA.

## Pendientes recomendados

- Paginacion real en Admin si el piloto supera el volumen esperado.
- Paginacion de conversaciones y mensajes si hay uso intensivo.
- RPCs agregadas para KPIs de admin si el panel diario crece.
