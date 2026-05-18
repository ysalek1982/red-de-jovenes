# Devocional diario funcional

## Objetivo

Convertir el módulo de devocional en una experiencia diaria útil dentro de la
app privada, conectada a Supabase y alineada con el concepto cristiano/PWA del
prototipo.

## Cambios implementados

- `devotional_reads`: registra qué devocionales marcó como leídos cada usuario.
- `devotional_favorites`: registra devocionales guardados por usuario.
- `/app/devocional` muestra el devocional del día o, si no existe para la fecha
  actual, el último devocional disponible.
- El usuario puede marcar el devocional como leído.
- El usuario puede guardar o quitar el devocional de sus favoritos.
- La pantalla muestra progreso espiritual con cantidad de devocionales leídos.
- El historial breve mantiene los devocionales recientes.

## RLS

- Usuarios autenticados pueden leer sus propias lecturas y favoritos.
- Usuarios autenticados pueden insertar su propia lectura.
- Usuarios autenticados pueden insertar o eliminar sus propios favoritos.
- No se permite escritura de devocionales desde cliente normal.

## Migración

- `supabase/migrations/20260518040000_add_devotional_progress.sql`

## Validación

- `npx supabase db push --dry-run`: OK.
- `npx supabase db push`: OK.
- Tipos remotos regenerados en `src/types/supabase.generated.ts`.
- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.

## Bloqueos

- QA dinámico con usuarios A/B sigue bloqueado hasta completar credenciales en
  `.env.qa.local`.
