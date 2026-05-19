# QA movil de juegos

Fecha: 2026-05-19

## Juegos revisados

| Juego | Estado funcional | Observacion movil |
| --- | --- | --- |
| Versiculo Rapido | OK | Botones de respuesta grandes y tactiles. |
| Trivia Biblica | OK | Opciones claras y feedback visible. |
| Adivina la Historia | OK | Pistas legibles y referencias visibles. |
| Memory Match | OK | Cartas en grid tactil; requiere prueba fisica final. |
| Desafio de Fe | OK | Modo individual honesto, sin prometer multijugador. |

## Flujos cubiertos

- Resultado final.
- Guardado de puntaje.
- Historial propio.
- Repetir juego.
- Bloqueo de puntajes ajenos por RLS.
- Rechazo de puntaje invalido.
- Rechazo de `game_key` inexistente.

## QA ejecutado

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

## Pendiente

PENDING_HUMAN_DEVICE_TEST: confirmar que el grid de Memory Match y el bottom nav no compiten por espacio en pantallas Android pequenas con teclado/gestos del sistema.
