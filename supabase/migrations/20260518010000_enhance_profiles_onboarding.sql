alter table public.profiles
add column if not exists age_range text,
add column if not exists community_guidelines_accepted_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_username_format_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
    add constraint profiles_username_format_check
    check (
      username is null
      or username ~ '^[a-z0-9._-]{3,30}$'
    );
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_age_range_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
    add constraint profiles_age_range_check
    check (
      age_range is null
      or age_range in ('13-17', '18-24', '25-30', '31+')
    );
  end if;
end;
$$;

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
    username,
    city,
    country,
    church_name,
    age_range,
    community_guidelines_accepted_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'Joven de la Red'),
    nullif(lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'username', ''), '\s+', '', 'g')), ''),
    new.raw_user_meta_data ->> 'city',
    new.raw_user_meta_data ->> 'country',
    new.raw_user_meta_data ->> 'church_name',
    new.raw_user_meta_data ->> 'age_range',
    case
      when coalesce((new.raw_user_meta_data ->> 'accepted_community_guidelines')::boolean, false)
      then now()
      else null
    end
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
