create table if not exists public.content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text not null check (
    target_type in ('post', 'comment', 'prayer_request', 'profile')
  ),
  target_id uuid not null,
  reason text not null,
  details text,
  status text not null default 'pending' check (
    status in ('pending', 'reviewed', 'dismissed')
  ),
  created_at timestamptz not null default now()
);

alter table public.content_reports enable row level security;

create policy "Usuarios pueden crear reportes"
on public.content_reports
for insert
to authenticated
with check (auth.uid() = reporter_id);

create policy "Usuarios pueden leer sus reportes"
on public.content_reports
for select
to authenticated
using (auth.uid() = reporter_id);

create policy "Admins pueden leer reportes"
on public.content_reports
for select
to authenticated
using (public.has_role('admin'));

create policy "Admins pueden actualizar reportes"
on public.content_reports
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));
