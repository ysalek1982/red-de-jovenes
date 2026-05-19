create table if not exists public.pilot_incidents (
  id uuid primary key default gen_random_uuid(),
  reported_by uuid references public.profiles(id) on delete set null,
  severity text not null default 'medium' check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  module text,
  title text not null,
  description text,
  status text not null default 'open' check (
    status in ('open', 'triage', 'resolved', 'closed')
  ),
  resolution text,
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists pilot_incidents_status_idx
on public.pilot_incidents(status, created_at desc);

create index if not exists pilot_incidents_severity_idx
on public.pilot_incidents(severity, created_at desc);

alter table public.pilot_incidents enable row level security;

create policy "Admins leen incidentes piloto"
on public.pilot_incidents
for select
to authenticated
using (public.has_role('admin'));

create policy "Admins crean incidentes piloto"
on public.pilot_incidents
for insert
to authenticated
with check (public.has_role('admin') and reported_by = auth.uid());

create policy "Admins actualizan incidentes piloto"
on public.pilot_incidents
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

drop trigger if exists set_pilot_incidents_updated_at on public.pilot_incidents;
create trigger set_pilot_incidents_updated_at
before update on public.pilot_incidents
for each row execute function public.set_updated_at();
