# Acciones IA dentro del sistema

## Acciones implementadas en Edge Function

- `generate_devotional_draft`
- `suggest_forum_reply`
- `summarize_report`
- `classify_content_report`
- `suggest_prayer_response`
- `explain_bible_verse`
- `generate_event_description`
- `create_discipleship_reflection`
- `summarize_community_activity`

## Comportamiento

- Si Gemini esta configurado, la funcion devuelve texto para revision humana.
- Si Gemini no esta configurado, la solicitud queda en `ai_action_queue` en modo mock/no configurado.
- Se registra auditoria en `ai_action_logs` cuando hay generacion real.
- La IA no publica, modera ni borra contenido automaticamente.

## Aprobacion humana

Acciones destructivas o de moderacion deben pasar por `ai_action_queue` y `ai-action-executor`, operado solo por admin.
