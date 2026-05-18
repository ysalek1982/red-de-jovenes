alter table public.content_reports
add column if not exists internal_note text,
add column if not exists updated_at timestamptz not null default now();

alter table public.content_reports
drop constraint if exists content_reports_status_check;

alter table public.content_reports
add constraint content_reports_status_check
check (status in ('pending', 'reviewed', 'dismissed', 'action_taken'));

drop trigger if exists set_content_reports_updated_at
on public.content_reports;

create trigger set_content_reports_updated_at
before update on public.content_reports
for each row execute function public.set_updated_at();

alter table public.devotionals
add column if not exists prayer text,
add column if not exists is_active boolean not null default true,
add column if not exists created_by uuid references public.profiles(id) on delete set null,
add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_devotionals_updated_at
on public.devotionals;

create trigger set_devotionals_updated_at
before update on public.devotionals
for each row execute function public.set_updated_at();

drop policy if exists "Usuarios autenticados pueden leer devocionales"
on public.devotionals;

create policy "Usuarios autenticados pueden leer devocionales activos"
on public.devotionals
for select
to authenticated
using (is_active = true);

create policy "Admins pueden leer todos los devocionales"
on public.devotionals
for select
to authenticated
using (public.has_role('admin'));

alter table public.prayer_requests
add column if not exists category text not null default 'otro',
add column if not exists is_anonymous boolean not null default false,
add column if not exists answered_testimony text,
add column if not exists answered_at timestamptz;

alter table public.prayer_requests
drop constraint if exists prayer_requests_category_check;

alter table public.prayer_requests
add constraint prayer_requests_category_check
check (
  category in (
    'familia',
    'salud',
    'estudios',
    'trabajo',
    'fe',
    'agradecimiento',
    'otro'
  )
);

alter table public.post_comments
add column if not exists updated_at timestamptz not null default now();

drop trigger if exists set_post_comments_updated_at
on public.post_comments;

create trigger set_post_comments_updated_at
before update on public.post_comments
for each row execute function public.set_updated_at();

create policy "Cada usuario puede actualizar sus comentarios"
on public.post_comments
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Admins pueden moderar comentarios"
on public.post_comments
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Admins pueden eliminar comentarios"
on public.post_comments
for delete
to authenticated
using (public.has_role('admin'));

alter table public.group_suggestions
add column if not exists meeting_info text,
add column if not exists reviewed_at timestamptz,
add column if not exists reviewed_by uuid references public.profiles(id) on delete set null,
add column if not exists internal_note text;

create policy "Admins pueden crear grupos"
on public.groups
for insert
to authenticated
with check (public.has_role('admin'));

create policy "Admins pueden actualizar grupos"
on public.groups
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  game_key text not null,
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now(),
  check (game_key in ('versiculo-rapido', 'trivia-biblica')),
  check (total > 0),
  check (score >= 0 and score <= total)
);

alter table public.game_scores enable row level security;

create policy "Cada usuario puede leer sus puntajes"
on public.game_scores
for select
to authenticated
using (auth.uid() = user_id);

create policy "Cada usuario puede guardar sus puntajes"
on public.game_scores
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Admins pueden leer puntajes"
on public.game_scores
for select
to authenticated
using (public.has_role('admin'));

create index if not exists game_scores_user_created_idx
on public.game_scores(user_id, created_at desc);

create index if not exists prayer_requests_category_idx
on public.prayer_requests(category);

create index if not exists content_reports_status_idx
on public.content_reports(status);
