do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_roles_user_id_role_key'
      and conrelid = 'public.user_roles'::regclass
  ) then
    if exists (
      select 1
      from pg_class
      where relname = 'user_roles_user_id_role_idx'
        and relnamespace = 'public'::regnamespace
    ) then
      alter table public.user_roles
      add constraint user_roles_user_id_role_key
      unique using index user_roles_user_id_role_idx;
    else
      alter table public.user_roles
      add constraint user_roles_user_id_role_key
      unique (user_id, role);
    end if;
  end if;
end;
$$;
