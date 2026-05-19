create table if not exists public.pilot_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  category text not null check (
    category in (
      'bug',
      'mejora',
      'confuso',
      'contenido',
      'comunidad',
      'pwa',
      'ia',
      'biblia',
      'otro'
    )
  ),
  module text,
  rating integer check (rating between 1 and 5),
  title text not null,
  detail text,
  device text,
  browser text,
  status text not null default 'new' check (
    status in ('new', 'reviewing', 'planned', 'resolved', 'dismissed')
  ),
  admin_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists pilot_feedback_user_idx
on public.pilot_feedback(user_id, created_at desc);

create index if not exists pilot_feedback_status_idx
on public.pilot_feedback(status, created_at desc);

create index if not exists pilot_feedback_category_idx
on public.pilot_feedback(category, created_at desc);

alter table public.pilot_feedback enable row level security;

create policy "Usuarios crean feedback piloto propio"
on public.pilot_feedback
for insert
to authenticated
with check (user_id = auth.uid());

create policy "Usuarios leen feedback piloto propio"
on public.pilot_feedback
for select
to authenticated
using (user_id = auth.uid() or public.has_role('admin'));

create policy "Admins actualizan feedback piloto"
on public.pilot_feedback
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

drop trigger if exists set_pilot_feedback_updated_at on public.pilot_feedback;
create trigger set_pilot_feedback_updated_at
before update on public.pilot_feedback
for each row execute function public.set_updated_at();
