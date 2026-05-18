create table if not exists public.devotional_reads (
  id uuid primary key default gen_random_uuid(),
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz default now(),
  unique (devotional_id, user_id)
);

create table if not exists public.devotional_favorites (
  id uuid primary key default gen_random_uuid(),
  devotional_id uuid not null references public.devotionals(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique (devotional_id, user_id)
);

alter table public.devotional_reads enable row level security;
alter table public.devotional_favorites enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'devotional_reads'
      and policyname = 'Cada usuario puede leer sus lecturas'
  ) then
    create policy "Cada usuario puede leer sus lecturas"
    on public.devotional_reads
    for select
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
      and tablename = 'devotional_reads'
      and policyname = 'Cada usuario puede marcar devocional leido'
  ) then
    create policy "Cada usuario puede marcar devocional leido"
    on public.devotional_reads
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
      and tablename = 'devotional_favorites'
      and policyname = 'Cada usuario puede leer sus favoritos'
  ) then
    create policy "Cada usuario puede leer sus favoritos"
    on public.devotional_favorites
    for select
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
      and tablename = 'devotional_favorites'
      and policyname = 'Cada usuario puede guardar favoritos'
  ) then
    create policy "Cada usuario puede guardar favoritos"
    on public.devotional_favorites
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
      and tablename = 'devotional_favorites'
      and policyname = 'Cada usuario puede quitar favoritos'
  ) then
    create policy "Cada usuario puede quitar favoritos"
    on public.devotional_favorites
    for delete
    to authenticated
    using (auth.uid() = user_id);
  end if;
end;
$$;
