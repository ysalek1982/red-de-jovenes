create table if not exists public.prayer_supports (
  id uuid primary key default gen_random_uuid(),
  prayer_request_id uuid not null references public.prayer_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (prayer_request_id, user_id)
);

alter table public.prayer_supports enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'prayer_supports'
      and policyname = 'Usuarios autenticados pueden leer apoyos de oracion'
  ) then
    create policy "Usuarios autenticados pueden leer apoyos de oracion"
    on public.prayer_supports
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'prayer_supports'
      and policyname = 'Cada usuario puede marcar que ora'
  ) then
    create policy "Cada usuario puede marcar que ora"
    on public.prayer_supports
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'prayer_supports'
      and policyname = 'Cada usuario puede quitar su apoyo de oracion'
  ) then
    create policy "Cada usuario puede quitar su apoyo de oracion"
    on public.prayer_supports
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end;
$$;
