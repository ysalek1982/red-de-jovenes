create table if not exists public.ai_usage_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  usage_date date not null default current_date,
  action_type text not null,
  requests_count integer not null default 0 check (requests_count >= 0),
  tokens_estimated integer not null default 0 check (tokens_estimated >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, usage_date, action_type)
);

create table if not exists public.ai_usage_limits (
  id uuid primary key default gen_random_uuid(),
  scope text not null check (scope in ('global', 'role', 'user')),
  role text,
  user_id uuid references public.profiles(id) on delete cascade,
  action_type text not null,
  daily_request_limit integer not null default 20 check (daily_request_limit >= 0),
  daily_token_limit integer not null default 20000 check (daily_token_limit >= 0),
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (scope = 'global' and role is null and user_id is null)
    or (scope = 'role' and role is not null and user_id is null)
    or (scope = 'user' and role is null and user_id is not null)
  )
);

create unique index if not exists ai_usage_limits_global_unique_idx
on public.ai_usage_limits(action_type)
where scope = 'global';

create unique index if not exists ai_usage_limits_role_unique_idx
on public.ai_usage_limits(role, action_type)
where scope = 'role';

create unique index if not exists ai_usage_limits_user_unique_idx
on public.ai_usage_limits(user_id, action_type)
where scope = 'user';

create table if not exists public.ai_cost_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action_type text not null,
  provider text not null default 'gemini',
  model text,
  input_chars integer not null default 0 check (input_chars >= 0),
  output_chars integer not null default 0 check (output_chars >= 0),
  tokens_estimated integer not null default 0 check (tokens_estimated >= 0),
  status text not null default 'ok',
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_daily_user_date_idx
on public.ai_usage_daily(user_id, usage_date desc);

create index if not exists ai_cost_events_user_created_idx
on public.ai_cost_events(user_id, created_at desc);

create index if not exists ai_cost_events_action_created_idx
on public.ai_cost_events(action_type, created_at desc);

alter table public.ai_usage_daily enable row level security;
alter table public.ai_usage_limits enable row level security;
alter table public.ai_cost_events enable row level security;

create policy "Usuarios leen uso IA propio" on public.ai_usage_daily
for select to authenticated using (user_id = auth.uid() or public.has_role('admin'));

create policy "Admins gestionan uso IA diario" on public.ai_usage_daily
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Admins leen limites IA" on public.ai_usage_limits
for select to authenticated using (public.has_role('admin'));

create policy "Admins gestionan limites IA" on public.ai_usage_limits
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Usuarios leen costos IA propios" on public.ai_cost_events
for select to authenticated using (user_id = auth.uid() or public.has_role('admin'));

create policy "Admins gestionan costos IA" on public.ai_cost_events
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

drop trigger if exists set_ai_usage_daily_updated_at on public.ai_usage_daily;
create trigger set_ai_usage_daily_updated_at
before update on public.ai_usage_daily
for each row execute function public.set_updated_at();

drop trigger if exists set_ai_usage_limits_updated_at on public.ai_usage_limits;
create trigger set_ai_usage_limits_updated_at
before update on public.ai_usage_limits
for each row execute function public.set_updated_at();

insert into public.ai_usage_limits (
  scope,
  action_type,
  daily_request_limit,
  daily_token_limit,
  is_enabled
)
values
  ('global', 'explain_bible_verse', 20, 20000, true),
  ('global', 'suggest_forum_reply', 15, 16000, true),
  ('global', 'suggest_prayer_response', 15, 16000, true),
  ('global', 'generate_devotional_draft', 8, 20000, true),
  ('global', 'summarize_report', 20, 16000, true),
  ('global', 'classify_content_report', 20, 12000, true),
  ('global', 'generate_event_description', 12, 16000, true),
  ('global', 'create_discipleship_reflection', 10, 20000, true),
  ('global', 'summarize_community_activity', 10, 20000, true)
on conflict do nothing;
