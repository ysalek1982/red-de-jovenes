create table if not exists public.ai_provider_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'gemini',
  encrypted_api_key text,
  key_last4 text,
  model text not null default 'gemini-2.0-flash',
  is_enabled boolean not null default false,
  configured_by uuid references public.profiles(id) on delete set null,
  configured_at timestamptz,
  last_tested_at timestamptz,
  last_test_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(provider)
);

create table if not exists public.ai_action_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action_type text not null,
  provider text not null default 'gemini',
  model text,
  prompt_summary text,
  input_ref_type text,
  input_ref_id uuid,
  output_summary text,
  status text not null default 'pending',
  error_message text,
  tokens_estimated integer,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_action_queue (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid references public.profiles(id) on delete set null,
  action_type text not null,
  target_type text,
  target_id uuid,
  prompt text not null,
  status text not null default 'pending',
  requires_approval boolean not null default true,
  proposed_result jsonb,
  approved_by uuid references public.profiles(id) on delete set null,
  approved_at timestamptz,
  executed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  check (status in ('pending', 'approved', 'rejected', 'executed', 'failed'))
);

create index if not exists ai_action_logs_user_idx on public.ai_action_logs(user_id, created_at desc);
create index if not exists ai_action_queue_status_idx on public.ai_action_queue(status, created_at desc);

alter table public.ai_provider_settings enable row level security;
alter table public.ai_action_logs enable row level security;
alter table public.ai_action_queue enable row level security;

create policy "Admins gestionan settings IA" on public.ai_provider_settings
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Admins leen logs IA" on public.ai_action_logs
for select to authenticated using (public.has_role('admin') or user_id = auth.uid());

create policy "Usuarios crean logs IA propios" on public.ai_action_logs
for insert to authenticated with check (user_id = auth.uid() or public.has_role('admin'));

create policy "Admins leen cola IA" on public.ai_action_queue
for select to authenticated using (public.has_role('admin') or requested_by = auth.uid());

create policy "Usuarios crean solicitudes IA propias" on public.ai_action_queue
for insert to authenticated with check (requested_by = auth.uid());

create policy "Admins actualizan cola IA" on public.ai_action_queue
for update to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

drop view if exists public.admin_ai_provider_status;
create view public.admin_ai_provider_status
with (security_invoker = true)
as
select
  provider,
  key_last4,
  model,
  is_enabled,
  configured_at,
  last_tested_at,
  last_test_status
from public.ai_provider_settings;

drop trigger if exists set_ai_provider_settings_updated_at on public.ai_provider_settings;
create trigger set_ai_provider_settings_updated_at
before update on public.ai_provider_settings
for each row execute function public.set_updated_at();

insert into public.ai_provider_settings (provider, model, is_enabled)
values ('gemini', 'gemini-2.0-flash', false)
on conflict (provider) do nothing;
