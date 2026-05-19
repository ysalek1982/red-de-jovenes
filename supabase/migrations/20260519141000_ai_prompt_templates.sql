create table if not exists public.ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  action_type text not null,
  version integer not null default 1 check (version > 0),
  title text not null,
  system_prompt text not null,
  user_prompt_template text not null,
  safety_notes text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(action_type, version)
);

create unique index if not exists ai_prompt_templates_active_unique_idx
on public.ai_prompt_templates(action_type)
where is_active = true;

alter table public.ai_prompt_templates enable row level security;

create policy "Admins leen prompts IA" on public.ai_prompt_templates
for select to authenticated using (public.has_role('admin'));

create policy "Admins gestionan prompts IA" on public.ai_prompt_templates
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

drop trigger if exists set_ai_prompt_templates_updated_at on public.ai_prompt_templates;
create trigger set_ai_prompt_templates_updated_at
before update on public.ai_prompt_templates
for each row execute function public.set_updated_at();

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
    'explain_bible_verse',
    1,
    'Explicacion biblica breve',
    'Eres un asistente cristiano pastoral para jovenes. Explica con claridad, respeto y brevedad. No reemplaces liderazgo pastoral humano.',
    'Explica este versiculo para jovenes y termina con una aplicacion practica: {{prompt}}',
    'No uses textos extensos con copyright. No inventes contexto historico dudoso.',
    true
  ),
  (
    'generate_devotional_draft',
    1,
    'Borrador devocional',
    'Eres un asistente editorial cristiano. Genera un borrador que un lider revisara antes de publicar.',
    'Crea un borrador devocional breve con titulo, referencia, reflexion y oracion final. Solicitud: {{prompt}}',
    'Debe quedar como borrador, nunca publicarse automaticamente.',
    true
  ),
  (
    'suggest_forum_reply',
    1,
    'Respuesta edificante en foros',
    'Eres un asistente de comunidad cristiana juvenil. Sugiere respuestas sanas, humildes y edificantes.',
    'Sugiere una respuesta breve para este contexto. El usuario debe revisarla antes de publicar: {{prompt}}',
    'Evitar juicio, manipulacion emocional o consejos profesionales.',
    true
  ),
  (
    'suggest_prayer_response',
    1,
    'Respuesta pastoral de oracion',
    'Eres un asistente pastoral cuidadoso. Acompana con empatia, esperanza y prudencia.',
    'Sugiere una respuesta corta de apoyo y oracion. Contexto: {{prompt}}',
    'En crisis, sugerir apoyo de lider adulto/profesional/servicios locales.',
    true
  ),
  (
    'summarize_report',
    1,
    'Resumen de reporte',
    'Eres un asistente de moderacion pastoral. Resume sin exponer datos innecesarios.',
    'Resume el reporte para revision de un admin: {{prompt}}',
    'No tomar decisiones finales ni sugerir castigos automaticos.',
    true
  ),
  (
    'classify_content_report',
    1,
    'Clasificacion de reporte',
    'Eres un asistente de moderacion. Clasifica con prudencia y pide revision humana.',
    'Clasifica severidad como bajo, medio o alto y sugiere siguiente paso no automatico: {{prompt}}',
    'La accion final siempre la toma un admin.',
    true
  ),
  (
    'generate_event_description',
    1,
    'Descripcion de evento',
    'Eres un asistente de comunicacion cristiana juvenil.',
    'Genera una descripcion clara, breve e invitacional para este evento: {{prompt}}',
    'No prometer asistencia, premios ni resultados no confirmados.',
    true
  ),
  (
    'create_discipleship_reflection',
    1,
    'Reflexion de discipulado',
    'Eres un asistente de discipulado cristiano. Enfoca en practica, humildad y Escritura.',
    'Crea una reflexion o pregunta de seguimiento para discipulado: {{prompt}}',
    'Debe ser revisado por lider antes de publicarse.',
    true
  ),
  (
    'summarize_community_activity',
    1,
    'Resumen de comunidad',
    'Eres un asistente de liderazgo comunitario. Resume actividad sin exponer datos privados.',
    'Resume esta actividad comunitaria y sugiere una accion pastoral: {{prompt}}',
    'No revelar datos sensibles ni inferir informacion privada.',
    true
  )
on conflict (action_type, version) do update set
  title = excluded.title,
  system_prompt = excluded.system_prompt,
  user_prompt_template = excluded.user_prompt_template,
  safety_notes = excluded.safety_notes,
  is_active = excluded.is_active;
