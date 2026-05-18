# Endurecimiento de juegos de fe

## Ruta revisada

- `/app/juegos`

## Auditoria

| Punto | Estado |
| --- | --- |
| Versiculo Rapido | Funciona de inicio a fin |
| Trivia Biblica | Funciona de inicio a fin |
| Preguntas y opciones | Datos locales en `src/data/faithGamesData.ts` |
| Feedback correcto/incorrecto | Funcional |
| Puntaje | Calculado en frontend |
| Resultado final | Funcional |
| Repetir juego | Funcional |
| Persistencia de puntaje | No implementada en esta version |
| RLS de puntajes | No aplica porque no hay escritura remota |

## Alcance real

Juegos de fe esta listo como **modulo funcional frontend para piloto**, no como sistema competitivo persistente.

No hay placeholders engañosos: los juegos disponibles se pueden jugar y los proximos juegos aparecen como proximamente.

## QA manual minimo

1. Entrar a `/app/juegos`.
2. Completar Versiculo Rapido.
3. Ver feedback por respuesta.
4. Ver resultado final.
5. Repetir juego.
6. Cambiar a Trivia Biblica.
7. Completar y verificar puntaje.

## Estado

**Funcional base para piloto.**

Pendiente futuro: persistir puntajes por usuario si se decide convertirlo en dinamica competitiva.
