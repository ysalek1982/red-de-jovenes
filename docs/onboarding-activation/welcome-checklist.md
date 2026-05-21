# Checklist de bienvenida

Fecha: 2026-05-21

## Implementacion

Se agrego una tarjeta en `/app` para usuarios con baja activacion:

> Empieza tu camino en Red de Jovenes

La tarjeta usa datos reales desde Supabase mediante `getOnboardingStatus(userId)` y no marca pasos como completados si no existe evidencia en la base de datos.

## Pasos calculados

| Paso | Fuente real | CTA |
| --- | --- | --- |
| Completa tu perfil | `profiles` | `/app/perfil` |
| Lee tu primer versiculo | `bible_reading_progress` o `bible_plan_progress` | `/app/biblia` |
| Guarda un versiculo | `bible_saved_verses` | `/app/biblia` |
| Ora con alguien | `prayer_requests` o `prayer_supports` | `/app/oracion` |
| Participa en Foros | `posts` o `post_comments` | `/app/foros` |
| Juega tu primer juego | `game_scores` | `/app/juegos` |
| Unete a una comunidad | `group_members` | `/app/mapa` |

## Comportamiento

- El checklist se muestra solo si el usuario no alcanzo activacion inicial.
- La activacion inicial se considera completa con 5 de 7 pasos.
- El usuario puede colapsar la tarjeta.
- La preferencia de colapso se guarda en `localStorage` por usuario.
- No se agregaron tablas, migraciones ni politicas RLS.

## Validacion

- `npm run build`: OK.
- La tarjeta no altera Auth, RLS, Biblia corpus ni Gemini.
