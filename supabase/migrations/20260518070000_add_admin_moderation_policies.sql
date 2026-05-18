create policy "Admins pueden crear devocionales"
on public.devotionals
for insert
to authenticated
with check (public.has_role('admin'));

create policy "Admins pueden actualizar devocionales"
on public.devotionals
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Admins pueden eliminar devocionales"
on public.devotionals
for delete
to authenticated
using (public.has_role('admin'));

create policy "Admins pueden ver todas las peticiones"
on public.prayer_requests
for select
to authenticated
using (public.has_role('admin'));

create policy "Admins pueden moderar peticiones"
on public.prayer_requests
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Admins pueden eliminar peticiones"
on public.prayer_requests
for delete
to authenticated
using (public.has_role('admin'));

create policy "Admins pueden moderar posts"
on public.posts
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Admins pueden eliminar posts"
on public.posts
for delete
to authenticated
using (public.has_role('admin'));

create policy "Admins pueden actualizar testimonios"
on public.testimonies
for update
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));
