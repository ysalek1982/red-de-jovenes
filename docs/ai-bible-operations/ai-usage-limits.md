# Limites de uso IA

## Implementacion

Tablas:

- `ai_usage_daily`: consumo diario por usuario y accion.
- `ai_usage_limits`: limites por scope global, rol o usuario.
- `ai_cost_events`: eventos de costo estimado.

## Comportamiento

`ai-generate` calcula tokens estimados antes de llamar Gemini. Si el usuario supera el limite diario devuelve:

> Alcanzaste el limite diario de IA. Intenta manana o pide apoyo a un lider.

Si Gemini no esta configurado, la solicitud tambien cuenta como uso operativo para evitar abuso de cola.

## Admin

El panel admin muestra:

- uso IA de hoy;
- limites configurados;
- tokens estimados;
- acciones mas recientes.

## QA

- `npm run qa:ai-limits`
- Resultado esperado: `QA_AI_USAGE_LIMITS_OK`
