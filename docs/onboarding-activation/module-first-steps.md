# Primeros pasos por modulo

Fecha: 2026-05-21

## Cambios

Se agregaron ayudas contextuales pequenas y estados vacios mas accionables en modulos principales:

| Modulo | Cambio | Estado |
| --- | --- | --- |
| Biblia | Card de primer paso cuando no hay guardados ni lecturas. | OK |
| Foros | Empty state orienta a compartir reflexion, pregunta o palabra de animo. | OK |
| Oracion | Card de primer paso antes del formulario cuando aun no hay peticiones. | OK |
| Juegos | Card de primer paso cuando no hay historial de partidas. | OK |
| Mapa | Card para buscar ciudad, unirse o sugerir comunidad si no pertenece a ninguna. | OK |
| Eventos | Empty state explica que se podra confirmar asistencia. | OK |
| Mensajes | Empty state orienta a conversar con jovenes de comunidades o perfiles sugeridos. | OK |

## Criterios

- No se agregaron modulos nuevos.
- No se usaron datos ficticios.
- No se tocaron Auth, RLS, Biblia corpus ni Gemini.
- Los mensajes aparecen dentro de estados existentes o cards pequenas, sin popups.
