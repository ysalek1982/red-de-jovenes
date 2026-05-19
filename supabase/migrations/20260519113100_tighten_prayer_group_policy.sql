drop policy if exists "Cada usuario puede crear sus peticiones" on public.prayer_requests;

drop policy if exists "Cada usuario puede crear peticiones" on public.prayer_requests;
create policy "Cada usuario puede crear peticiones"
on public.prayer_requests
for insert
to authenticated
with check (
  auth.uid() = user_id
  and (
    group_id is null
    or exists (
      select 1
      from public.group_members
      join public.groups on groups.id = group_members.group_id
      where group_members.group_id = prayer_requests.group_id
        and group_members.user_id = auth.uid()
        and group_members.status = 'active'
        and groups.is_active = true
    )
  )
);
