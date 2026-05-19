# Panel diario de monitoreo

## Objetivo

El panel Admin muestra datos reales para revisar cada dia del piloto cerrado sin usar metricas ficticias.

## Datos incluidos

| Indicador | Fuente |
|---|---|
| Usuarios activos hoy | Actividad en posts, comentarios, oracion, juegos, mensajes, eventos, comunidades y feedback. |
| Nuevos registros | `profiles.created_at` desde el inicio del dia. |
| Perfiles incompletos | Campos clave vacios en `profiles`. |
| Publicaciones nuevas | `posts.created_at` hoy. |
| Comentarios nuevos | `post_comments.created_at` hoy. |
| Oraciones nuevas | `prayer_requests.created_at` hoy. |
| Apoyos de oracion | `prayer_supports.created_at` hoy. |
| Juegos jugados | `game_scores.created_at` hoy. |
| Mensajes enviados | `messages.created_at` hoy. |
| Eventos con asistencia | `event_rsvps.created_at` hoy. |
| Comunidades con nuevos miembros | `group_members.created_at` hoy. |
| Feedback nuevo | `pilot_feedback.status = new`. |
| Incidentes abiertos | `pilot_incidents.status = open`. |
| Reportes pendientes | `content_reports.status = pending`. |
| Uso IA hoy | `ai_action_logs.created_at` hoy. |
| Errores IA | `ai_action_logs.status = error` hoy. |
| Limite IA alcanzado | `ai_action_logs.status = limit_reached` hoy. |

## Rutina diaria

1. Revisar incidentes abiertos y criticos.
2. Revisar feedback nuevo.
3. Revisar reportes pendientes.
4. Verificar si hay errores IA o limites alcanzados.
5. Registrar correcciones y decisiones.
