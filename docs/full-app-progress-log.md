# Progreso integral de Red de Jóvenes

## 2026-05-18 · Fase 0

### Estado inicial

- Worktree limpio al iniciar.
- `npm run lint`: OK.
- `npm run build`: OK.
- `npx supabase migration list`: migraciones local/remoto alineadas.
- QA A/B: `BLOCKED_MISSING_QA_ENV`, documentado previamente.

### Arquitectura actual

- React + TypeScript + Vite + Tailwind.
- React Router con rutas públicas y privadas.
- Supabase Auth con sesión persistente.
- RLS activo en tablas base.
- PWA básica con manifest, service worker y fallback offline.
- App privada mobile-first con navegación inferior.

### Decisiones

- No se cambia todavía UI ni rutas en Fase 0.
- Se documenta el plan completo antes de modificar código.
- Las migraciones existentes no se modificarán; cualquier cambio de esquema será
  incremental.

### Próximo paso

Fase 1: hacer que `/` redirija a `/entrar` o `/app`, mover landing a `/landing`
y mantener `/demo`.

## 2026-05-18 · Fase 1

### Cambios

- `/` se convirtió en entrada inteligente según sesión.
- Landing pública movida a `/landing`.
- Header público actualizado para anclas `/landing#...`.
- Link secundario del login apunta a la landing pública.
- README y documentación de rutas actualizados.

### Validaciones

- `npm run lint`: OK.
- `npm run build`: OK.

### Migraciones

No aplica.

## 2026-05-18 · Fase 2

### Cambios

- Registro ampliado con username, rango de edad y aceptación de normas.
- Perfil editable ampliado con avatar URL y rango de edad.
- Nueva ruta `/recuperar` para recuperación de contraseña por Supabase.
- Servicio de perfil valida disponibilidad de username.
- Migración incremental aplicada para `profiles.age_range` y
  `profiles.community_guidelines_accepted_at`.
- Tipos Supabase regenerados desde remoto.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- `npm run lint`: OK.
- `npm run build`: OK.

### Bloqueos

- QA dinámico Auth sigue pendiente si no se configuran usuarios QA A/B en
  `.env.qa.local`.

## 2026-05-18 · Fase 3

### Cambios

- Se agregó `prayer_supports` para la acción “Estoy orando”.
- La sala muestra conteo de jóvenes orando por petición.
- Se agregaron filtros de estado: todas, en oración y respondidas.
- El usuario puede marcar o quitar su apoyo de oración.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK.

### Bloqueos

- QA dinámico con dos usuarios sigue pendiente por credenciales QA A/B.

## 2026-05-18 · Fase 4

### Cambios

- Se agregaron `post_comments` y `post_reactions`.
- Foros con la Palabra ahora permite comentar y reaccionar con “Amén”.
- El feed muestra conteos de comentarios/reacciones.
- RLS restringe escritura a contenido propio.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK.

### Bloqueos

- QA dinámico A/B sigue pendiente.
