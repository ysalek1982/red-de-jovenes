create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique,
  city text,
  country text,
  church_name text,
  avatar_url text,
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  is_answered boolean default false,
  visibility text default 'public',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  verse_reference text,
  verse_text text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.devotionals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  verse_reference text not null,
  verse_text text not null,
  reflection text not null,
  devotional_date date not null unique,
  created_at timestamptz default now()
);

create table if not exists public.testimonies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  body text not null,
  is_approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.groups (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  country text,
  church_name text,
  description text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.prayer_requests enable row level security;
alter table public.posts enable row level security;
alter table public.devotionals enable row level security;
alter table public.testimonies enable row level security;
alter table public.groups enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger set_prayer_requests_updated_at
before update on public.prayer_requests
for each row execute function public.set_updated_at();

create trigger set_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    city,
    country,
    church_name
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Joven de la Red'),
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'church_name'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create policy "Usuarios autenticados pueden ver perfiles"
on public.profiles
for select
to authenticated
using (true);

create policy "Cada usuario puede insertar su perfil"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

create policy "Cada usuario puede actualizar su perfil"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Usuarios autenticados pueden ver peticiones publicas"
on public.prayer_requests
for select
to authenticated
using (visibility = 'public' or auth.uid() = user_id);

create policy "Cada usuario puede crear sus peticiones"
on public.prayer_requests
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Cada usuario puede actualizar sus peticiones"
on public.prayer_requests
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Cada usuario puede eliminar sus peticiones"
on public.prayer_requests
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Usuarios autenticados pueden ver posts"
on public.posts
for select
to authenticated
using (true);

create policy "Cada usuario puede crear posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Cada usuario puede actualizar sus posts"
on public.posts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Cada usuario puede eliminar sus posts"
on public.posts
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Usuarios autenticados pueden leer devocionales"
on public.devotionals
for select
to authenticated
using (true);

create policy "Usuarios autenticados pueden leer testimonios aprobados"
on public.testimonies
for select
to authenticated
using (is_approved = true);

create policy "Usuarios autenticados pueden crear testimonios"
on public.testimonies
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Usuarios autenticados pueden leer grupos"
on public.groups
for select
to authenticated
using (true);

insert into public.devotionals (
  title,
  verse_reference,
  verse_text,
  reflection,
  devotional_date
)
values (
  'Confianza que enciende el día',
  'Proverbios 3:5',
  'Confía en el Señor de todo corazón, y no te apoyes en tu propia prudencia.',
  'Antes de abrir cualquier feed, vuelve tu corazón a Cristo. Él ordena tus pasos y hace de tu día un lugar para amar, servir y escuchar.',
  '2026-01-01'
)
on conflict (devotional_date) do nothing;

insert into public.groups (
  name,
  city,
  country,
  church_name,
  description
)
values
  (
    'Jóvenes Luz del Mundo',
    'Buenos Aires',
    'Argentina',
    'Comunidad Centro',
    'Grupo juvenil enfocado en oración, discipulado y servicio urbano.'
  ),
  (
    'Generación Mateo 5:14',
    'Bogotá',
    'Colombia',
    'Iglesia Vida Nueva',
    'Comunidad de jóvenes que conecta fe, creatividad y misión.'
  ),
  (
    'Red Fe Viva',
    'Ciudad de México',
    'México',
    'Casa de Oración',
    'Espacio para devocionales, acompañamiento y encuentros juveniles.'
  );
