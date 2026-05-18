# Administración y moderación funcional

## Completado

- KPIs reales ampliados: usuarios, oraciones, publicaciones, comentarios, devocionales, reportes y sugerencias.
- Reportes pendientes con cambio de estado: `reviewed`, `dismissed`, `action_taken`.
- Nota interna de moderación en reportes.
- Devocionales administrables con creación, edición, oración opcional y estado activo/inactivo.
- Sugerencias de grupos con aprobación/rechazo y nota interna.
- Al aprobar una sugerencia se crea un grupo activo desde el cliente normal protegido por RLS admin.
- Script `qa:admin` para validar rol admin, bloqueo no admin, moderación y escritura admin de devocionales.

## Migraciones

- `20260518190000_mature_functional_modules.sql`
- `20260518191000_add_game_scores_delete_policy.sql`

## QA

- `npm run qa:admin`: `QA_ADMIN_OK`.
- RLS usa `public.has_role('admin')`.

## Pendiente

- Separar panel admin en subrutas cuando el volumen de datos crezca.
