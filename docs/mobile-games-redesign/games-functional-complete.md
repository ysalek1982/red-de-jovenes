# Juegos de fe completos

Fecha: 2026-05-19

## Cambios realizados

Todos los juegos visibles en `/app/juegos` quedaron jugables. Se elimino el estado visible de "proximamente" y se reemplazo cualquier promesa multijugador por modos individuales reales.

## Juegos disponibles

| Juego | Tipo | Estado | Persistencia |
| --- | --- | --- | --- |
| Versiculo Rapido | Quiz de completar versiculos | Jugable | Guarda puntaje en `game_scores`. |
| Trivia Biblica | Quiz de conocimiento biblico | Jugable | Guarda puntaje en `game_scores`. |
| Adivina la Historia | Quiz por pistas narrativas | Jugable | Guarda puntaje en `game_scores`. |
| Memory Match | Juego de pares | Jugable | Guarda puntaje al completar pares. |
| Desafio de Fe | Decisiones formativas individuales | Jugable | Guarda puntaje en `game_scores`. |

## Base de datos

Se creo la migracion incremental:

- `20260519010000_expand_game_score_keys.sql`

La migracion amplia `game_scores_game_key_check` para permitir:

- `versiculo-rapido`
- `trivia-biblica`
- `adivina-historia`
- `memory-match`
- `desafio-fe`

No se modificaron migraciones antiguas.

## QA

`npm run qa:games` valida:

- guardado de puntaje por cada juego;
- lectura de historial propio;
- bloqueo de puntaje para otro usuario;
- rechazo de puntaje invalido;
- rechazo de `game_key` inexistente;
- ejecucion repetible sin romper datos reales.

Resultado:

```json
{
  "status": "QA_GAMES_OK",
  "gameScores": {
    "versiculo-rapido": "OK",
    "trivia-biblica": "OK",
    "adivina-historia": "OK",
    "memory-match": "OK",
    "desafio-fe": "OK"
  },
  "ownHistory": "OK",
  "crossUserScore": "DENIED",
  "invalidScore": "DENIED",
  "invalidGameKey": "DENIED"
}
```
