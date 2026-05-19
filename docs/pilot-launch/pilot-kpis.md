# Metricas de piloto

## Adopcion

- Usuarios registrados.
- Perfiles completos.
- Usuarios activos diarios.
- Usuarios activos semanales.

## Comunidad

- Publicaciones.
- Comentarios.
- Reacciones Amen.
- Oraciones creadas.
- Apoyos de oracion.
- Comunidades sugeridas.
- Comunidades aprobadas.
- Miembros por comunidad.

## Biblia

- Versiculos guardados.
- Lecturas completadas.
- Uso de versiculo aleatorio.

## Juegos

- Partidas jugadas.
- Puntajes guardados.
- Juegos mas usados.

## Eventos

- Eventos creados.
- Confirmaciones de asistencia.

## Mensajes

- Conversaciones creadas.
- Mensajes enviados.
- Reportes de mensajes.

## IA

- Solicitudes IA.
- Acciones por tipo.
- Limites alcanzados.
- Errores.
- Costo estimado.

## Seguridad y moderacion

- Reportes creados.
- Reportes resueltos.
- Reportes pendientes.
- Tiempo de respuesta.

## Implementacion

Se agrego `src/features/admin/pilotMetricsService.ts` y un bloque “Estado del piloto” en `/app/admin`. Las metricas son conteos reales desde Supabase; si no hay actividad, muestran cero.
