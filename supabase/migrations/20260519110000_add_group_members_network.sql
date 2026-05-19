alter table public.groups
add column if not exists modality text not null default 'presencial',
add column if not exists created_from_suggestion_id uuid references public.group_suggestions(id) on delete set null;

alter table public.groups
drop constraint if exists groups_modality_check;

alter table public.groups
add constraint groups_modality_check
check (modality in ('presencial', 'online', 'hibrida'));

alter table public.group_suggestions
add column if not exists modality text not null default 'presencial';

alter table public.group_suggestions
drop constraint if exists group_suggestions_modality_check;

alter table public.group_suggestions
add constraint group_suggestions_modality_check
check (modality in ('presencial', 'online', 'hibrida'));

create table if not exists public.group_members (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  status text not null default 'active',
  joined_at timestamptz not null default now(),
  unique(group_id, user_id),
  check (role in ('member', 'leader', 'moderator')),
  check (status in ('active', 'left', 'removed'))
);

alter table public.group_members enable row level security;

drop policy if exists "Usuarios pueden leer sus membresias" on public.group_members;
create policy "Usuarios pueden leer sus membresias"
on public.group_members
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins pueden leer membresias" on public.group_members;
create policy "Admins pueden leer membresias"
on public.group_members
for select
to authenticated
using (public.has_role('admin'));

drop policy if exists "Usuarios pueden unirse a comunidades activas" on public.group_members;
create policy "Usuarios pueden unirse a comunidades activas"
on public.group_members
for insert
to authenticated
with check (
  auth.uid() = user_id
  and role = 'member'
  and status = 'active'
  and exists (
    select 1
    from public.groups
    where groups.id = group_members.group_id
      and groups.is_active = true
  )
);

drop policy if exists "Usuarios pueden salir de sus comunidades" on public.group_members;
create policy "Usuarios pueden salir de sus comunidades"
on public.group_members
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Admins pueden gestionar membresias" on public.group_members;
create policy "Admins pueden gestionar membresias"
on public.group_members
for all
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create index if not exists group_members_user_idx
on public.group_members(user_id, joined_at desc);

create index if not exists group_members_group_status_idx
on public.group_members(group_id, status);

create or replace function public.get_group_member_counts()
returns table(group_id uuid, members_count bigint)
language sql
security definer
set search_path = public
as $$
  select gm.group_id, count(*)::bigint as members_count
  from public.group_members gm
  join public.groups g on g.id = gm.group_id
  where gm.status = 'active'
    and g.is_active = true
  group by gm.group_id
$$;

grant execute on function public.get_group_member_counts() to authenticated;
