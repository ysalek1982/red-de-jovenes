create table if not exists public.bible_saved_verses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null,
  verse_text text not null,
  note text,
  created_at timestamptz not null default now(),
  unique(user_id, reference)
);

create table if not exists public.bible_reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan_key text not null,
  day_number integer not null check (day_number > 0),
  completed_at timestamptz not null default now(),
  unique(user_id, plan_key, day_number)
);

create table if not exists public.bible_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference text not null,
  highlight_text text not null,
  color text not null default 'gold',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  title text not null,
  description text,
  event_type text not null default 'encuentro',
  modality text not null default 'presencial',
  country text,
  city text,
  location_text text,
  meeting_link text,
  starts_at timestamptz not null,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (modality in ('presencial', 'online', 'hibrida')),
  check (event_type in ('encuentro', 'oracion', 'estudio', 'servicio', 'juego', 'otro'))
);

create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'going',
  created_at timestamptz not null default now(),
  unique(event_id, user_id),
  check (status in ('going', 'interested'))
);

create table if not exists public.discipleship_tracks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  level text not null default 'inicial',
  duration_days integer not null default 7,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.discipleship_steps (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.discipleship_tracks(id) on delete cascade,
  day_number integer not null,
  title text not null,
  content text not null,
  action_step text,
  verse_reference text,
  sort_order integer not null default 0,
  unique(track_id, day_number)
);

create table if not exists public.discipleship_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  track_id uuid not null references public.discipleship_tracks(id) on delete cascade,
  step_id uuid not null references public.discipleship_steps(id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique(user_id, step_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text,
  conversation_type text not null default 'direct',
  group_id uuid references public.groups(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (conversation_type in ('direct', 'group'))
);

create table if not exists public.conversation_members (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  joined_at timestamptz not null default now(),
  unique(conversation_id, user_id),
  check (role in ('member', 'owner'))
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.message_reports (
  id uuid primary key default gen_random_uuid(),
  message_id uuid not null references public.messages(id) on delete cascade,
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reason text not null,
  detail text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  check (status in ('pending', 'reviewed', 'dismissed', 'action_taken'))
);

create table if not exists public.user_follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  following_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.feedback_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null,
  title text not null,
  detail text,
  status text not null default 'pending',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status in ('pending', 'reviewed', 'dismissed', 'action_taken'))
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.bible_saved_verses enable row level security;
alter table public.bible_reading_progress enable row level security;
alter table public.bible_highlights enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.discipleship_tracks enable row level security;
alter table public.discipleship_steps enable row level security;
alter table public.discipleship_progress enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.message_reports enable row level security;
alter table public.user_follows enable row level security;
alter table public.feedback_suggestions enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_conversation_member(target_conversation_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversation_members
    where conversation_id = target_conversation_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.is_conversation_creator(target_conversation_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversations
    where id = target_conversation_id
      and created_by = auth.uid()
  );
$$;

grant execute on function public.is_conversation_member(uuid) to authenticated;
grant execute on function public.is_conversation_creator(uuid) to authenticated;

create policy "Usuarios gestionan sus versiculos guardados" on public.bible_saved_verses
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuarios gestionan su progreso biblico" on public.bible_reading_progress
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Usuarios gestionan sus subrayados" on public.bible_highlights
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Usuarios leen eventos activos" on public.events
for select to authenticated using (is_active = true or public.has_role('admin') or created_by = auth.uid());
create policy "Usuarios crean eventos propios" on public.events
for insert to authenticated with check (created_by = auth.uid());
create policy "Creador o admin actualiza eventos" on public.events
for update to authenticated using (created_by = auth.uid() or public.has_role('admin'))
with check (created_by = auth.uid() or public.has_role('admin'));
create policy "Usuarios gestionan sus rsvps" on public.event_rsvps
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Usuarios leen tracks activos" on public.discipleship_tracks
for select to authenticated using (is_active = true or public.has_role('admin'));
create policy "Admins gestionan tracks" on public.discipleship_tracks
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "Usuarios leen pasos activos" on public.discipleship_steps
for select to authenticated using (
  exists (
    select 1 from public.discipleship_tracks
    where discipleship_tracks.id = discipleship_steps.track_id
      and (discipleship_tracks.is_active = true or public.has_role('admin'))
  )
);
create policy "Admins gestionan pasos" on public.discipleship_steps
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy "Usuarios gestionan su progreso discipulado" on public.discipleship_progress
for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Usuarios crean conversaciones" on public.conversations
for insert to authenticated with check (created_by = auth.uid());
create policy "Miembros leen conversaciones" on public.conversations
for select to authenticated using (public.is_conversation_member(id));
create policy "Creadores actualizan conversaciones" on public.conversations
for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "Miembros leen membresias de conversaciones" on public.conversation_members
for select to authenticated using (user_id = auth.uid() or public.is_conversation_member(conversation_id));
create policy "Creadores agregan miembros" on public.conversation_members
for insert to authenticated with check (user_id = auth.uid() or public.is_conversation_creator(conversation_id));
create policy "Usuarios salen de conversaciones" on public.conversation_members
for delete to authenticated using (user_id = auth.uid());
create policy "Miembros leen mensajes" on public.messages
for select to authenticated using (public.is_conversation_member(conversation_id));
create policy "Miembros envian mensajes" on public.messages
for insert to authenticated with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));
create policy "Usuarios editan sus mensajes" on public.messages
for update to authenticated using (sender_id = auth.uid()) with check (sender_id = auth.uid());
create policy "Usuarios reportan mensajes" on public.message_reports
for insert to authenticated with check (reporter_id = auth.uid());
create policy "Admins leen reportes mensajes" on public.message_reports
for select to authenticated using (public.has_role('admin'));
create policy "Admins actualizan reportes mensajes" on public.message_reports
for update to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Usuarios leen relaciones propias" on public.user_follows
for select to authenticated using (follower_id = auth.uid() or following_id = auth.uid());
create policy "Usuarios siguen jovenes" on public.user_follows
for insert to authenticated with check (follower_id = auth.uid());
create policy "Usuarios dejan de seguir" on public.user_follows
for delete to authenticated using (follower_id = auth.uid());

create policy "Usuarios gestionan feedback propio" on public.feedback_suggestions
for insert to authenticated with check (user_id = auth.uid());
create policy "Usuarios leen feedback propio" on public.feedback_suggestions
for select to authenticated using (user_id = auth.uid() or public.has_role('admin'));
create policy "Admins actualizan feedback" on public.feedback_suggestions
for update to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Usuarios leen sus notificaciones" on public.notifications
for select to authenticated using (user_id = auth.uid());
create policy "Usuarios actualizan sus notificaciones" on public.notifications
for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "Usuarios crean notificaciones internas" on public.notifications
for insert to authenticated with check (true);

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_feedback_suggestions_updated_at on public.feedback_suggestions;
create trigger set_feedback_suggestions_updated_at
before update on public.feedback_suggestions
for each row execute function public.set_updated_at();

insert into public.discipleship_tracks (title, description, level, duration_days, is_active)
values
  ('7 dias: Fundamentos de fe', 'Un camino inicial para afirmar tu fe en Cristo.', 'inicial', 7, true),
  ('Identidad en Cristo', 'Reflexiones practicas sobre quien eres en Jesus.', 'inicial', 5, true),
  ('Oracion practica', 'Pasos sencillos para cultivar una vida de oracion.', 'inicial', 5, true),
  ('Servir con proposito', 'Aprende a servir desde el amor y la Palabra.', 'intermedio', 5, true)
on conflict do nothing;

insert into public.discipleship_steps (
  track_id,
  day_number,
  title,
  content,
  action_step,
  verse_reference,
  sort_order
)
select
  track.id,
  step.day_number,
  step.title,
  step.content,
  step.action_step,
  step.verse_reference,
  step.day_number
from public.discipleship_tracks track
join (
  values
    (1, 'Volver a Cristo', 'Empieza recordando que la fe nace en Jesus, no en tu rendimiento.', 'Ora cinco minutos y entrega tu semana a Cristo.', 'Hebreos 12:2'),
    (2, 'Escuchar la Palabra', 'La Palabra ordena la mente y enciende el corazon.', 'Lee un pasaje breve y escribe una frase que te hable.', 'Salmo 119:105'),
    (3, 'Caminar en comunidad', 'Nadie crece solo. La fe se fortalece al compartirla.', 'Escribe a alguien de la Red para animarlo.', 'Hebreos 10:24'),
    (4, 'Orar con honestidad', 'Dios no pide palabras perfectas, sino un corazon sincero.', 'Presenta una peticion concreta en la Sala de Oracion.', 'Filipenses 4:6'),
    (5, 'Servir hoy', 'La fe madura cuando se convierte en amor practico.', 'Haz una accion sencilla de servicio hoy.', 'Galatas 5:13'),
    (6, 'Resistir con esperanza', 'Las pruebas no cancelan la presencia de Dios.', 'Escribe una promesa biblica para recordar.', 'Romanos 5:3-4'),
    (7, 'Compartir luz', 'Tu testimonio puede encender fe en otro joven.', 'Comparte una reflexion breve en Foros.', 'Mateo 5:14')
) as step(day_number, title, content, action_step, verse_reference)
  on track.title = '7 dias: Fundamentos de fe'
on conflict do nothing;

insert into public.events (
  title,
  description,
  event_type,
  modality,
  country,
  city,
  location_text,
  meeting_link,
  starts_at,
  ends_at,
  is_active
)
values
  (
    'Oracion global del piloto',
    'Encuentro online para orar por la nueva generacion.',
    'oracion',
    'online',
    'Global',
    'Online',
    'Sala virtual de Red de Jovenes',
    'https://red-de-jovenes.vercel.app/app/oracion',
    now() + interval '3 days',
    now() + interval '3 days 1 hour',
    true
  ),
  (
    'Foro abierto: identidad en Cristo',
    'Conversacion guiada para jovenes sobre identidad, proposito y comunidad.',
    'estudio',
    'hibrida',
    'Bolivia',
    'Santa Cruz de la Sierra',
    'Comunidad piloto Red de Jovenes',
    null,
    now() + interval '7 days',
    now() + interval '7 days 2 hours',
    true
  )
on conflict do nothing;

create index if not exists events_active_starts_idx on public.events(is_active, starts_at);
create index if not exists notifications_user_read_idx on public.notifications(user_id, read_at, created_at desc);
create index if not exists user_follows_follower_idx on public.user_follows(follower_id, created_at desc);
