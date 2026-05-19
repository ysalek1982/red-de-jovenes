# Fase 26 - Plan de juegos completos y menu movil

Fecha: 2026-05-19

URL staging: https://red-de-jovenes.vercel.app/

## Estado inicial

La aplicacion llega a esta fase con staging certificado para piloto cerrado, Auth/RLS funcionales y QA completo en verde. La mejora solicitada no cambia backend sensible ni concepto visual: se concentra en juegos, navegacion privada movil y visibilidad del modulo Seguridad.

## Juegos visibles actuales

| Juego | Estado actual | Problema | Accion |
| --- | --- | --- | --- |
| Versiculo Rapido | Jugable | Funciona como quiz y guarda puntaje. | Mantener y mejorar historial/progreso. |
| Trivia Biblica | Jugable | Funciona como quiz y guarda puntaje. | Mantener y ampliar QA. |
| Batallas de Fe | Proximamente | Visible pero no jugable. | Convertir a Desafio de Fe individual jugable. |
| Adivina la Historia | Proximamente | Visible pero no jugable. | Implementar como quiz de pistas biblicas. |
| Memory Match | No visible | Requerido por fase 26. | Implementar juego de pares funcional. |

## Restriccion de base de datos

`game_scores.game_key` acepta inicialmente solo:

- `versiculo-rapido`
- `trivia-biblica`

Para guardar puntajes de los nuevos juegos se requiere una migracion incremental que amplie el constraint a:

- `adivina-historia`
- `memory-match`
- `desafio-fe`

## Navegacion actual

La navegacion privada vive en `src/components/layout/AppShell.tsx` como barra inferior con scroll horizontal y todos los modulos visibles:

- Inicio
- Oracion
- Foros
- Devocional
- Juegos
- Mapa
- Seguridad
- Perfil
- Administracion si aplica
- Salir

Problemas:

- En movil se siente como web comprimida por exceso de items.
- Seguridad aparece como modulo principal, aunque debe quedar como capacidad interna de reportes/moderacion.
- No existe menu "Mas" para acciones secundarias.

## Plan de correccion

1. Completar todos los juegos visibles y eliminar estados "Proximamente".
2. Ampliar QA de juegos para cubrir cada `game_key`.
3. Quitar Seguridad de la navegacion visible y del home, manteniendo reportes y moderacion admin.
4. Redisenar mobile nav como app: accesos principales fijos y menu "Mas".
5. Mejorar progreso real de juegos y home con datos reales.
6. Ejecutar QA completo local y contra staging cuando aplique.
