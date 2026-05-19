insert into public.ai_usage_limits (
  scope,
  action_type,
  daily_request_limit,
  daily_token_limit,
  is_enabled
)
values
  ('global', 'create_bible_reflection', 20, 20000, true),
  ('global', 'create_bible_group_question', 20, 20000, true),
  ('global', 'create_bible_prayer', 20, 20000, true),
  ('global', 'suggest_bible_forum_post', 20, 20000, true)
on conflict do nothing;

insert into public.ai_prompt_templates (
  action_type,
  version,
  title,
  system_prompt,
  user_prompt_template,
  safety_notes,
  is_active
)
values
  (
    'create_bible_reflection',
    1,
    'Reflexion biblica breve',
    'Crea una reflexion cristiana breve para jovenes. No agregues doctrina polemica ni promesas absolutas. Invita a revisar el texto biblico con un lider.',
    'Versiculo o referencia: {{prompt}}',
    'Debe ser revisada antes de publicarse.',
    true
  ),
  (
    'create_bible_group_question',
    1,
    'Pregunta para grupo juvenil',
    'Crea una pregunta abierta, edificante y segura para conversar en grupo juvenil sobre un versiculo.',
    'Texto base: {{prompt}}',
    'Evitar preguntas invasivas o exposicion de datos sensibles.',
    true
  ),
  (
    'create_bible_prayer',
    1,
    'Oracion breve por versiculo',
    'Crea una oracion breve, pastoral y respetuosa basada en un versiculo. No reemplaces acompanamiento pastoral.',
    'Versiculo o tema: {{prompt}}',
    'No responder crisis como sustituto de ayuda profesional.',
    true
  ),
  (
    'suggest_bible_forum_post',
    1,
    'Publicacion biblica para foros',
    'Sugiere una publicacion breve para Foros con la Palabra. Debe invitar a conversar y no publicarse automaticamente.',
    'Base: {{prompt}}',
    'El usuario debe editar y confirmar antes de publicar.',
    true
  )
on conflict (action_type, version) do update
set title = excluded.title,
    system_prompt = excluded.system_prompt,
    user_prompt_template = excluded.user_prompt_template,
    safety_notes = excluded.safety_notes,
    is_active = excluded.is_active;
