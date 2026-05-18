create policy "Admins pueden leer todos los grupos"
on public.groups
for select
to authenticated
using (public.has_role('admin'));
