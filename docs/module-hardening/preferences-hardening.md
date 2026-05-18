# Endurecimiento de preferencias de notificacion

## Ruta revisada

- `/app/perfil`

## Auditoria

| Punto | Estado |
| --- | --- |
| Cargar preferencias | Funcional con `getNotificationPreferences` |
| Crear preferencias | Funcional con `upsertNotificationPreferences` |
| Devocional diario | Toggle funcional |
| Oracion | Toggle funcional |
| Comunidad | Toggle funcional |
| Guardar cambios | Funcional |
| No editar ajenas | Protegido por RLS |
| Push real | No implementado, indicado en UI |

## Alcance real

Las preferencias se guardan en Supabase y preparan una fase futura de notificaciones. No hay push real en esta version.

## QA

- `npm run qa:functional` valida upsert de preferencias.
- `npm run qa:rls` valida aislamiento general entre usuarios.

## Estado

**Funcional base para piloto.**

Pendiente futuro: implementar push real con VAPID/Edge Functions si se aprueba.
