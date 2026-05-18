# Banco minimo de preguntas para juegos

Fecha: 2026-05-18

## Objetivo

Evitar que Juegos de fe se sienta como una demo corta durante el piloto. El banco ahora permite una sesion completa de practica con puntaje e historial.

## Cambios

Archivo actualizado:

- `src/data/faithGamesData.ts`

Contenido:

| Juego | Preguntas | Categorias |
| --- | ---: | --- |
| Versiculo Rapido | 15 | Promesas, confianza, identidad, paz, amor, oracion, Palabra, servicio, fe, gracia, unidad, santidad, sabiduria, descanso, esperanza |
| Trivia Biblica | 15 | Evangelios, Antiguo Testamento, Fe y vida |

## Criterios

- Opciones claras y sin vacios.
- Respuestas correctas verificables por referencia.
- Explicaciones breves y formativas.
- Dificultad basica/media para jovenes nuevos en la Red.
- Tono juvenil y sano, sin competitividad agresiva.

## Validacion esperada

- Iniciar juego.
- Responder todas las preguntas.
- Ver feedback correcto/incorrecto.
- Ver resultado final.
- Guardar puntaje si hay sesion.
- Ver historial personal.
- Repetir juego.

## Pendiente editorial

Revisar banco con lideres de contenido antes de ampliar a categorias avanzadas o duelos entre usuarios.
