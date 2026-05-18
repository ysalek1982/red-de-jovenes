# Plan maestro de maduración funcional

## Objetivo

Completar funcionalidades reales en módulos existentes de Red de Jóvenes antes del despliegue staging, manteniendo la experiencia cristiana/PWA, Supabase Auth, RLS y la estética actual.

## Matriz maestra

| Módulo | Estado actual | Objetivo funcional | Brechas detectadas | Cambios necesarios | Migraciones requeridas | QA requerido | Estado final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Admin/moderación | Parcial | Operar piloto con KPIs, reportes, devocionales y grupos | Reportes sin nota interna ni `action_taken`; aprobación de grupos no crea grupo; edición devocional incompleta | Mejorar adminService y AdminHome | Sí | `qa:admin` | En progreso |
| Devocionales | Parcial | Contenido diario administrable y progreso personal | Sin `is_active`, oración final ni favoritos visibles | Campos nuevos, favoritos, progreso, admin | Sí | `qa:admin`, `qa:functional` | En progreso |
| Foros con la Palabra | Parcial | Feed social con edición, comentarios, reacciones y reportes | No edita post/comentario propio; filtros limitados | Servicios de update/delete, UI de filtros/edición | Sí para update comments | `qa:forums` | En progreso |
| Sala de oración | Parcial | Oración comunitaria con categoría, anónimo y testimonio | Sin categoría, anónimo visual ni testimonio de respuesta | Campos nuevos, filtros y UI | Sí | `qa:prayer` | En progreso |
| Seguridad/reportes | Parcial | Reportes operables por usuarios y admin | Motivos libres, estados limitados, sin nota interna | Motivos predefinidos y admin notes | Sí | `qa:admin`, `qa:rls` | En progreso |
| Juegos de fe | Parcial | Juegos con progreso real | Puntajes no persistidos | Tabla `game_scores`, servicio y UI de historial | Sí | `qa:games` | En progreso |
| Mapa mundial | Parcial | Descubrir comunidades reales y sugerir grupos | Aprobación no crea grupo activo | Servicio admin para aprobar/rechazar | Sí para campos de revisión | `qa:map`, `qa:admin` | En progreso |
| Perfil/preferencias | Casi completo | Perfil personal y preferencias claras | Avatar preview básico, rol no visible | Mostrar rol, preview y mensajes | No | `qa:functional` | En progreso |
| Inicio privado | Casi completo | Centro real con resúmenes sin métricas falsas | Resúmenes básicos | Añadir KPIs reales y enlaces | No | `qa:functional` | En progreso |
| PWA | Casi completo | App instalable clara y honesta | Prompt puede repetirse por sesión | Persistir descarte local y doc límites | No | `smoke:build` | En progreso |

## Política de seguridad

- No usar `service_role` en `src/`.
- No versionar `.env.local`, `.env.admin.local`, `.env.qa.local` ni passwords.
- Mantener RLS como control real, no solo validación visual.
- Toda escritura administrativa desde cliente debe estar protegida por `public.has_role('admin')`.

## Validación esperada

Al cierre:

- `npm run lint`
- `npm run build`
- `npm run smoke:build`
- `npm run qa:auth`
- `npm run qa:rls`
- `npm run qa:functional`
- `npm run qa:prayer`
- `npm run qa:forums`
- `npm run qa:admin`
- `npm run qa:games`
- `npm run qa:map`
