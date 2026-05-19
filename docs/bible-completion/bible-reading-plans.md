# Planes de lectura biblica

Migracion: `20260519160000_bible_reading_plans.sql`

## Tablas

- `bible_reading_plans`
- `bible_reading_plan_days`
- `bible_plan_progress`

## Planes iniciales

| Plan | Duracion | Estado |
| --- | ---: | --- |
| 7 dias con Jesus | 7 | Activo |
| 7 dias de oracion | 7 | Activo |
| 14 dias de identidad en Cristo | 14 | Activo |
| 21 dias en los Salmos | 21 | Activo |
| Proverbios para decidir mejor | 10 | Activo |

Los planes usan referencias y reflexiones propias breves. No copian capitulos largos.

## UI

La Biblia permite seleccionar plan, seleccionar dia, marcar como leido y guardar una reflexion personal.

## RLS

- Usuarios leen planes activos.
- Usuarios marcan solo su propio progreso.
- Admin puede gestionar planes y dias.
