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

## 2026-05-18 · Fase 5

### Cambios

- Se agregaron `devotional_reads` y `devotional_favorites`.
- El devocional diario permite marcar como leído y guardar favorito.
- La pantalla muestra progreso espiritual con conteo de devocionales leídos.
- Se mantiene fallback al último devocional disponible si no existe uno para hoy.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

### Bloqueos

- QA dinámico A/B sigue pendiente por `.env.qa.local` incompleto.

## 2026-05-18 · Fase 6

### Cambios

- Se reemplazó el mock visual de juegos por dos juegos frontend funcionales.
- “Versículo Rápido” permite completar versículos con opciones múltiples.
- “Trivia Bíblica” permite responder preguntas por categorías simples.
- Se agregaron feedback inmediato, puntaje, progreso y reinicio.
- “Batallas de Fe” queda visible como próximo módulo, sin prometer backend.

### Validaciones

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

### Migraciones

No aplica. Los puntajes no se persisten todavía.

## 2026-05-18 · Fase 7

### Cambios

- El mapa mundial se conectó a `groups` en Supabase.
- Se agregaron filtros por país y búsqueda por comunidad.
- Se creó `group_suggestions` para sugerir nuevas comunidades.
- La vista mantiene mapa visual premium y cards de grupos activos.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

### Bloqueos

- QA dinámico de sugerencias queda pendiente hasta tener usuarios QA A/B.

## 2026-05-18 · Fase 8

### Cambios

- Se creó `content_reports` para reportar posts, comentarios, peticiones y perfiles.
- Se agregó la ruta `/app/seguridad` con normas de comunidad y formulario.
- La navegación privada ahora incluye “Seguridad”.
- Foros y Sala de oración incluyen acción “Reportar”.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warnings no bloqueantes de plugin timing y chunk grande.

### Bloqueos

- QA dinámico de reportes queda pendiente hasta tener usuarios QA A/B.

## 2026-05-18 · Fase 9

### Cambios

- El panel admin pasó de placeholder a vista funcional inicial.
- Se agregaron KPIs y listas recientes de usuarios, reportes, sugerencias,
  posts, oraciones y devocionales.
- Se agregó creación/edición inicial de devocionales.
- Se agregaron acciones admin para revisar reportes y aprobar sugerencias.
- Se aplicaron políticas RLS admin para moderación y devocionales.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## 2026-05-18 · Fase 10

### Cambios

- Se corrigió metadata PWA con español legible.
- Se actualizó el service worker para cachear solo recursos estáticos propios.
- Se mantiene `start_url: /` para abrir login o app según sesión.
- Se agregó `InstallPrompt` con botón “Instalar app”.
- Se corrigió `offline.html` con copy y estética coherentes.

### Validaciones

- `npm run lint`: OK.
- `npm run build`: OK, con warnings no bloqueantes de plugin timing y chunk grande.

## 2026-05-18 · Fase 11

### Cambios

- Se creó `notification_preferences`.
- `/app/perfil` ahora permite guardar preferencias de recordatorios.
- Preferencias: devocional diario, oración y comunidad.
- Push real queda explícitamente preparado para fase futura.

### Validaciones

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos Supabase regenerados.
- `npm run lint`: OK.
- `npm run build`: OK, con warnings no bloqueantes de plugin timing y chunk grande.
