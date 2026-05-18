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
