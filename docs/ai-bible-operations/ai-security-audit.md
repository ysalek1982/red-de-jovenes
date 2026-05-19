# Auditoria de seguridad operativa de IA

## Alcance revisado

- `supabase/functions/admin-ai-settings/index.ts`
- `supabase/functions/ai-generate/index.ts`
- `supabase/functions/ai-action-executor/index.ts`
- `supabase/functions/_shared/ai-helpers.ts`
- `src/features/ai/aiService.ts`
- `src/features/ai/aiGuardrails.ts`
- `src/pages/AdminHome.tsx`
- `supabase/migrations/20260519131000_ai_gemini_settings.sql`
- `supabase/migrations/20260519132000_lock_ai_provider_settings_client_access.sql`

## Hallazgos

| Control | Estado | Evidencia |
|---|---:|---|
| `encrypted_api_key` no se lee desde cliente | OK | La politica directa de `ai_provider_settings` fue removida y `qa:ai-settings` valida que no haya filas visibles desde cliente. |
| Estado enmascarado para admin | OK | `admin_ai_provider_status` expone solo provider, last4, modelo, estado y fecha. |
| Edge Functions validan JWT | OK | `requireUser` valida token con `supabase.auth.getUser`. |
| Edge Functions validan admin | OK | `requireAdmin` consulta `user_roles` con `user.id`. |
| React no llama Gemini directo | OK | `aiService` invoca `supabase.functions.invoke`. |
| Gemini key no usa `VITE_*` | OK | No hay variable frontend para Gemini. |
| Acciones sensibles no se ejecutan automaticamente | OK | `ai-generate` devuelve texto o cola; `ai-action-executor` requiere admin. |
| Logs no registran prompt completo | Parcial/OK | `ai_action_logs` guarda `prompt_summary` y `output_summary`, no prompt completo. |
| Cola IA conserva solicitud completa | Observacion | `ai_action_queue.prompt` guarda la solicitud para revision humana; debe evitarse incluir datos sensibles en solicitudes. |
| Guardrails pastorales | OK | `aiGuardrails.ts` define acciones permitidas y restricciones pastorales. |

## Riesgos operativos

- Sin limites diarios, una llave Gemini real podria generar consumo inesperado.
- Sin plantillas versionadas, los prompts base pueden cambiar sin trazabilidad pastoral.
- La cola de IA puede contener datos sensibles si el usuario los escribe en el prompt.
- La prueba real de Gemini depende de que un admin cargue una key real desde el panel.

## Acciones requeridas en Fase 31

1. Agregar limites de uso por usuario, rol y global.
2. Registrar eventos de costo/uso.
3. Versionar plantillas pastorales por `action_type`.
4. Agregar panel de monitoreo de IA.
5. Fortalecer importador biblico con metadata/licencia obligatoria.
6. Agregar QA especifico para limites, plantillas, prueba real opcional y aprobacion humana.
