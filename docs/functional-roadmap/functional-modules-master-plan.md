# Plan maestro de maduracion funcional

## Objetivo

Completar funcionalidades reales en modulos existentes de Red de Jovenes antes del despliegue staging, manteniendo la experiencia cristiana/PWA, Supabase Auth, RLS y la estetica actual.

## Matriz maestra

| Modulo | Estado actual | Objetivo funcional | Brechas detectadas | Cambios necesarios | Migraciones requeridas | QA requerido | Estado final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Admin/moderacion | Parcial | Operar piloto con KPIs, reportes, devocionales y grupos | Reportes sin nota interna ni `action_taken`; aprobacion de grupos no creaba grupo activo; edicion devocional incompleta | Mejorar `adminService`, `AdminHome`, politicas admin y QA | Si: `20260518190000` | `qa:admin` | Completado |
| Devocionales | Parcial | Contenido diario administrable y progreso personal | Sin `is_active`, oracion final ni favoritos visibles | Campos nuevos, favoritos, progreso y gestion admin | Si: `20260518190000` | `qa:admin`, `qa:functional` | Completado |
| Foros con la Palabra | Parcial | Feed social con edicion, comentarios, reacciones y reportes | No editaba post/comentario propio; filtros limitados | Servicios de update/delete, UI de filtros/edicion y QA ampliado | Si: `20260518190000` | `qa:forums` | Completado |
| Sala de oracion | Parcial | Oracion comunitaria con categoria, anonimato visual y testimonio | Sin categoria, anonimato visual ni testimonio de respuesta | Campos nuevos, filtros, UI y QA ampliado | Si: `20260518190000` | `qa:prayer` | Completado |
| Seguridad/reportes | Parcial | Reportes operables por usuarios y admin | Motivos libres, estados limitados, sin nota interna | Motivos predefinidos, notas internas y estados de moderacion | Si: `20260518190000` | `qa:admin`, `qa:rls` | Completado |
| Juegos de fe | Parcial | Juegos con progreso real | Puntajes no persistidos | Tabla `game_scores`, servicio y UI de historial | Si: `20260518190000`, `20260518191000` | `qa:games` | Completado |
| Mapa mundial | Parcial | Descubrir comunidades reales y sugerir grupos | Aprobacion no creaba grupo activo; faltaba informacion de reunion | Campos de revision, aprobacion admin y sugerencias mejoradas | Si: `20260518190000` | `qa:map`, `qa:admin` | Completado |
| Perfil/preferencias | Casi completo | Perfil personal y preferencias claras | Rol no visible en perfil | Mostrar rol, vista previa y mensajes claros | No | `qa:functional` | Completado |
| Inicio privado | Casi completo | Centro real con resumenes sin metricas falsas | Algunos textos asumian alcance fijo | Ajustar accesos y texto a datos reales | No | `qa:functional` | Completado |
| PWA | Casi completo | App instalable clara y honesta | Prompt podia repetirse por sesion | Persistir descarte local y documentar limites | No | `smoke:build` | Completado |

## Politica de seguridad

- No usar `service_role` en `src/`.
- No versionar `.env.local`, `.env.admin.local`, `.env.qa.local` ni passwords.
- Mantener RLS como control real, no solo validacion visual.
- Toda escritura administrativa desde cliente debe estar protegida por `public.has_role('admin')`.

## Validacion final esperada

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
