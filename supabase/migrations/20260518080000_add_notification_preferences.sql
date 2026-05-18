create table if not exists public.notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  daily_devotional boolean not null default true,
  prayer_updates boolean not null default true,
  community_updates boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.notification_preferences enable row level security;

drop trigger if exists set_notification_preferences_updated_at
on public.notification_preferences;

create trigger set_notification_preferences_updated_at
before update on public.notification_preferences
for each row execute function public.set_updated_at();

create policy "Usuarios pueden leer sus preferencias"
on public.notification_preferences
for select
to authenticated
using (auth.uid() = user_id);

create policy "Usuarios pueden crear sus preferencias"
on public.notification_preferences
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Usuarios pueden actualizar sus preferencias"
on public.notification_preferences
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
