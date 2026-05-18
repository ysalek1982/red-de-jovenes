# Juegos de fe funcionales

## Objetivo

Pasar de un mock visual a una primera versión funcional de juegos cristianos
sin agregar complejidad innecesaria de backend.

## Juegos implementados

### Versículo Rápido

- Preguntas de completar versículos.
- Opciones múltiples.
- Feedback inmediato.
- Referencia bíblica visible.
- Puntaje y resultado final.

### Trivia Bíblica

- Preguntas de Evangelios, Antiguo Testamento y vida de fe.
- Opciones múltiples.
- Feedback inmediato con explicación.
- Puntaje y reinicio.

## Datos

- Los datos viven en `src/data/faithGamesData.ts`.
- No se creó persistencia de puntajes todavía para evitar agregar esquema antes
  de validar la mecánica con usuarios reales.

## Pendiente futuro

- Persistir puntajes por usuario.
- Ranking real por grupo.
- Modo multijugador para “Batallas de Fe”.
- Más categorías y preguntas administrables.

## Validación

- `npm run lint`: OK.
- `npm run build`: OK, con warning no bloqueante de chunk grande.
