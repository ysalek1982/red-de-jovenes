# Tabs de usuarios y roles en Admin

## Cambio

El Admin ahora tiene una sección de **Roles y permisos** con tabs reales para administrar usuarios por categoría:

- Todos
- Admins
- Moderadores
- Miembros
- Sin rol

Cada tab muestra conteo real y filtra la lista de usuarios sin recargar la página.

## Funcionalidad

- Buscar usuarios por nombre, usuario, ciudad, país o ID.
- Asignar rol `admin`, `moderator` o `member`.
- Quitar roles existentes.
- Evitar quitar el rol admin del propio usuario desde la interfaz.
- Evitar remover el último admin desde la función SQL.

## Seguridad

- No se usa `service_role` en frontend.
- Las acciones pasan por RPC administrativas con verificación `has_role('admin')`.
- Los usuarios normales no pueden ejecutar cambios de roles.

## Validación

El QA de administración valida:

- Admin autenticado.
- Usuario normal bloqueado.
- Asignación/remoción de rol.
- Moderación de reportes.
- Escritura admin de devocionales.
