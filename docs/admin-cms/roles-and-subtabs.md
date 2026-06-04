# Mejora de Admin CMS y gestión de roles

## Objetivo

El administrador ahora queda organizado como un centro CMS por categorías, con acceso rápido a contenido, Biblia, piloto, feedback, incidentes, reportes y una nueva sección de **Roles y permisos**.

## Roles administrables

| Rol | Uso | Alcance |
| --- | --- | --- |
| Admin | Operación completa del CMS | Puede gestionar roles, Biblia, IA, reportes y piloto |
| Moderador | Cuidado comunitario | Acompaña reportes y comunidad sin operar configuración sensible |
| Miembro | Usuario del piloto | Participa como joven normal |

## Implementación

- El frontend no usa `service_role`.
- La asignación y remoción de roles pasa por RPC administrativas:
  - `admin_assign_user_role`
  - `admin_revoke_user_role`
- Las funciones validan que el usuario actual sea admin.
- No se permite remover el último administrador.
- La tabla `user_roles` mantiene lectura propia para usuarios y lectura total solo para admins.

## UX Admin

- Se agregó subcategoría `Roles` en el nav sticky del Admin.
- Se agregaron tarjetas de conteo por rol.
- Se agregó búsqueda por nombre, usuario, ciudad, país o ID.
- Cada usuario muestra sus roles actuales y acciones directas para asignar o quitar rol.
- La UI deshabilita quitar el rol admin del propio usuario para evitar bloqueo operativo accidental.

## Pendiente operativo

Aplicar la migración en Supabase antes de usar esta sección en staging/producción:

```bash
npx supabase db push --dry-run
npx supabase db push
```
