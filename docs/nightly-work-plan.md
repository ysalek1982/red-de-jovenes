# Plan nocturno de desarrollo

Fecha de inicio: 2026-05-17

## Estado inicial verificado

- Rama: `codex/red-de-jovenes-inicial`
- Ultimo commit: `50a1fdb Verifica migracion Supabase remota`
- `npm run lint`: OK
- `npm run build`: OK, con advertencia no bloqueante de chunk mayor a 500 kB.
- Supabase CLI: `2.98.2`
- Migracion local/remota: `20260517214049` alineada.
- Bloqueo conocido: `Email not confirmed` al intentar iniciar sesion con usuario QA sin confirmar.

## Arquitectura actual

- Landing publica cristiana/PWA en `/`, con navegacion por anclas: Mision, Funciones, Testimonios y Comunidad.
- Rutas publicas: `/entrar`, `/crear-cuenta`, `/demo`.
- Ruta privada inicial: `/app`, protegida por sesion Supabase.
- Cliente Supabase en `src/lib/supabase.ts` usando solo publishable key.
- Tipos remotos generados en `src/types/supabase.generated.ts` y reexportados desde `src/types/database.ts`.
- Migracion inicial con tablas `profiles`, `prayer_requests`, `posts`, `devotionals`, `testimonies` y `groups`, todas con RLS.

## Plan de macrofases

| Macrofase | Objetivo | Commit esperado |
| --- | --- | --- |
| 0 | Control inicial, documentacion y revision de secretos | `Prepara plan nocturno de desarrollo` |
| 1 | Auth real y perfil editable | `Completa Auth y perfil de usuario` |
| 2 | Sala de oracion | `Implementa sala de oracion` |
| 3 | Feed de comunidad cristiana | `Implementa feed de comunidad` |
| 4 | Devocional diario | `Implementa devocional diario` |
| 5 | Navegacion privada y AppShell | `Mejora experiencia privada de la app` |
| 6 | PWA instalable real | `Configura PWA instalable` |
| 7 | Seguridad y RLS QA | `Valida seguridad RLS inicial` |
| 8 | Pulido visual integral | `Pule experiencia visual integral` |
| 9 | Reporte final y cierre | `Documenta resultado nocturno` |

## Reglas de ejecucion

- No cambiar el concepto visual de landing cristiana/PWA.
- No reintroducir portal institucional, dashboard administrativo ni modulos municipales.
- Mantener la UI en espanol.
- No versionar secretos, contrasenas, service role keys ni connection strings privadas.
- Ejecutar `npm run lint` y `npm run build` en cada macrofase que toque codigo.
- Crear migraciones incrementales solo cuando el esquema actual no alcance.
- Despues de cada migracion: `db push --dry-run`, `db push` y regeneracion de tipos.
