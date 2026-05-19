alter table public.posts
add column if not exists group_id uuid references public.groups(id) on delete set null;

create index if not exists posts_group_created_idx
on public.posts(group_id, created_at desc);

drop policy if exists "Cada usuario puede crear posts" on public.posts;
create policy "Cada usuario puede crear posts"
on public.posts
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
      where group_members.group_id = posts.group_id
        and group_members.user_id = auth.uid()
        and group_members.status = 'active'
        and groups.is_active = true
    )
  )
);

drop policy if exists "Cada usuario puede actualizar sus posts" on public.posts;
create policy "Cada usuario puede actualizar sus posts"
on public.posts
for update
to authenticated
using (auth.uid() = user_id)
with check (
  auth.uid() = user_id
  and (
    group_id is null
    or exists (
      select 1
      from public.group_members
      join public.groups on groups.id = group_members.group_id
      where group_members.group_id = posts.group_id
        and group_members.user_id = auth.uid()
        and group_members.status = 'active'
        and groups.is_active = true
    )
  )
);
