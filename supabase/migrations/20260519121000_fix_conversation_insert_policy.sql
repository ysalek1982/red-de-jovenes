drop policy if exists "Usuarios crean conversaciones" on public.conversations;

create policy "Usuarios crean conversaciones" on public.conversations
for insert to authenticated
with check (created_by is null or created_by = auth.uid());
