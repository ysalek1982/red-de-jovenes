drop policy if exists "Usuarios crean conversaciones" on public.conversations;
drop policy if exists "Creadores agregan miembros" on public.conversation_members;

create policy "Usuarios crean conversaciones" on public.conversations
for insert to authenticated
with check (true);

create policy "Creadores agregan miembros" on public.conversation_members
for insert to authenticated
with check (public.is_conversation_creator(conversation_id));
