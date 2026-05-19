# Flujos IA con aprobacion humana

## Regla base

La IA asiste, pero no reemplaza el criterio pastoral. Nada sensible se publica automaticamente.

## Flujos

| Area | Flujo | Publicacion automatica |
|---|---|---:|
| Biblia | explicar versiculo y crear reflexion breve | No |
| Devocional | generar borrador para admin | No |
| Reportes | resumir y clasificar severidad | No |
| Oracion | sugerir respuesta pastoral | No |
| Foros | sugerir respuesta edificante | No |
| Eventos | generar descripcion editable | No |
| Discipulado | generar pregunta/reflexion editable | No |

## Etiqueta obligatoria

Toda salida visible debe incluir el sentido de:

> Sugerido por IA · revisalo antes de publicar.

## Cola

Cuando Gemini no esta configurado o una accion requiere revision, queda trazabilidad en:

- `ai_action_queue`
- `ai_action_logs`

## QA

- `npm run qa:ai-approval`
- Resultado esperado: `QA_AI_HUMAN_APPROVAL_OK`
