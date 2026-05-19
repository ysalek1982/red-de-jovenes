# Plantillas pastorales versionadas

## Implementacion

Tabla:

- `ai_prompt_templates`

Cada plantilla tiene:

- `action_type`;
- `version`;
- `title`;
- `system_prompt`;
- `user_prompt_template`;
- `safety_notes`;
- `is_active`.

## Reglas

- Solo una version activa por accion.
- No se borran versiones antiguas.
- Un admin puede crear una nueva version y activarla.
- La salida de IA debe ser revisada por una persona antes de publicarse si afecta devocionales, discipulado, reportes o moderacion.

## Acciones iniciales

- `explain_bible_verse`
- `generate_devotional_draft`
- `suggest_forum_reply`
- `suggest_prayer_response`
- `summarize_report`
- `classify_content_report`
- `generate_event_description`
- `create_discipleship_reflection`
- `summarize_community_activity`

## QA

- `npm run qa:ai-prompts`
- Resultado esperado: `QA_AI_PROMPTS_OK`
