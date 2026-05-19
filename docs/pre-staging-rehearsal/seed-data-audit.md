# Auditoria de datos semilla pre-staging

Fecha: 2026-05-18

## Objetivo

Confirmar que el contenido base cargado para piloto existe, es repetible y no depende de datos ficticios presentados como reales.

## Comandos ejecutados

```bash
npm run qa:seed
npm run qa:games
npm run qa:map
npm run qa:admin
npm run lint
npm run build
```

## Resultado

| Area | Verificacion | Resultado |
| --- | --- | --- |
| Devocionales | 7 devocionales piloto activos | OK |
| Devocionales | Sin duplicados por fecha | OK |
| Devocionales | Titulo, referencia, reflexion, oracion y fecha validos | OK |
| Devocionales | Devocional del dia o fallback disponible | OK |
| Mapa | Comunidades activas disponibles | OK |
| Mapa | Bolivia / Santa Cruz de la Sierra | OK |
| Mapa | Bolivia / La Paz | OK |
| Mapa | Bolivia / Cochabamba | OK |
| Mapa | Nodos internacionales piloto | OK |
| Mapa | Sin duplicados nombre + pais + ciudad | OK |
| Mapa | Sin contactos personales ficticios | OK |
| Mapa | Filtro pais/ciudad/busqueda | OK |
| Juegos | 15 preguntas Versiculo Rapido | OK |
| Juegos | 15 preguntas Trivia Biblica | OK |
| Juegos | Sin opciones vacias | OK |
| Juegos | Respuestas correctas validas | OK |
| Seguridad | Admin/reportes siguen funcionando | OK |

## Evidencia automatizada

`npm run qa:seed` devolvio:

- `QA_SEED_DATA_OK`
- Devocionales activos: 8.
- Devocionales piloto: 7.
- Comunidades activas: 11.
- Nodos internacionales piloto: 3.
- Juegos: 15 preguntas por juego.

## Hallazgos

No se encontraron duplicados ni datos semilla invalidos.

## Estado final

**SEED_DATA_OK**
