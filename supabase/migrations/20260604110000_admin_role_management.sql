do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'user_roles'
      and policyname = 'Admins leen todos los roles'
  ) then
    create policy "Admins leen todos los roles"
    on public.user_roles
    for select
    to authenticated
    using (public.has_role('admin'));
  end if;
end;
$$;

create or replace function public.admin_assign_user_role(
  p_user_id uuid,
  p_role text
)
returns public.user_roles
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role public.user_roles;
begin
  if not public.has_role('admin') then
    raise exception 'FORBIDDEN';
  end if;

  if p_role not in ('admin', 'moderator', 'member') then
    raise exception 'INVALID_ROLE';
  end if;

  insert into public.user_roles (user_id, role)
  values (p_user_id, p_role)
  on conflict (user_id, role) do update
    set role = excluded.role
  returning * into assigned_role;

  return assigned_role;
end;
$$;

create or replace function public.admin_revoke_user_role(
  p_user_id uuid,
  p_role text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count integer;
begin
  if not public.has_role('admin') then
    raise exception 'FORBIDDEN';
  end if;

  if p_role not in ('admin', 'moderator', 'member') then
    raise exception 'INVALID_ROLE';
  end if;

  if p_role = 'admin' then
    select count(distinct user_id)
    into admin_count
    from public.user_roles
    where role = 'admin';

    if admin_count <= 1 and exists (
      select 1
      from public.user_roles
      where user_id = p_user_id
        and role = 'admin'
    ) then
      raise exception 'LAST_ADMIN_REQUIRED';
    end if;
  end if;

  delete from public.user_roles
  where user_id = p_user_id
    and role = p_role;
end;
$$;

revoke all on function public.admin_assign_user_role(uuid, text) from public;
revoke all on function public.admin_revoke_user_role(uuid, text) from public;
grant execute on function public.admin_assign_user_role(uuid, text) to authenticated;
grant execute on function public.admin_revoke_user_role(uuid, text) to authenticated;
