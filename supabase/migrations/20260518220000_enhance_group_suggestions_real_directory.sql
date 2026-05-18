alter table public.group_suggestions
add column if not exists description text;

create index if not exists group_suggestions_user_created_idx
on public.group_suggestions (user_id, created_at desc);

create index if not exists groups_active_country_city_idx
on public.groups (is_active, country, city);
