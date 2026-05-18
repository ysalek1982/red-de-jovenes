create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  reaction text not null default 'amen',
  created_at timestamptz default now(),
  unique (post_id, user_id, reaction)
);

alter table public.post_comments enable row level security;
alter table public.post_reactions enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'post_comments'
      and policyname = 'Usuarios autenticados pueden leer comentarios'
  ) then
    create policy "Usuarios autenticados pueden leer comentarios"
    on public.post_comments
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'post_comments'
      and policyname = 'Usuarios autenticados pueden comentar'
  ) then
    create policy "Usuarios autenticados pueden comentar"
    on public.post_comments
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'post_comments'
      and policyname = 'Cada usuario puede eliminar sus comentarios'
  ) then
    create policy "Cada usuario puede eliminar sus comentarios"
    on public.post_comments
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'post_reactions'
      and policyname = 'Usuarios autenticados pueden leer reacciones'
  ) then
    create policy "Usuarios autenticados pueden leer reacciones"
    on public.post_reactions
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'post_reactions'
      and policyname = 'Usuarios autenticados pueden reaccionar'
  ) then
    create policy "Usuarios autenticados pueden reaccionar"
    on public.post_reactions
    for insert
    to authenticated
    with check (auth.uid() = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'post_reactions'
      and policyname = 'Cada usuario puede quitar sus reacciones'
  ) then
    create policy "Cada usuario puede quitar sus reacciones"
    on public.post_reactions
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end;
$$;
