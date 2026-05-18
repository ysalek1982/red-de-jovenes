alter table public.groups
add column if not exists contact_url text,
add column if not exists meeting_info text,
add column if not exists is_active boolean not null default true,
add column if not exists latitude numeric,
add column if not exists longitude numeric;

create table if not exists public.group_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  country text not null,
  city text,
  church_name text,
  contact_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

alter table public.group_suggestions enable row level security;

drop policy if exists "Usuarios autenticados pueden leer grupos" on public.groups;

create policy "Usuarios autenticados pueden leer grupos activos"
on public.groups
for select
to authenticated
using (is_active = true);

create policy "Usuarios pueden crear sugerencias de grupos"
on public.group_suggestions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Usuarios pueden leer sus sugerencias de grupos"
on public.group_suggestions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Admins pueden leer sugerencias de grupos"
on public.group_suggestions
for select
to authenticated
using (public.has_role('admin'));

create policy "Admins pueden actualizar sugerencias de grupos"
on public.group_suggestions
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

update public.groups
set
  contact_url = coalesce(contact_url, 'https://reddejovenes.example/comunidad'),
  meeting_info = coalesce(meeting_info, 'Encuentros juveniles semanales y grupos de oración.'),
  is_active = true
where contact_url is null
   or meeting_info is null;
