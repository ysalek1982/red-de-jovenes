-- Cierra escrituras directas desde cliente para corpus biblico y eventos.
-- Las importaciones biblicas siguen usando procesos administrativos/Edge Functions.

drop policy if exists "Admins gestionan traducciones" on public.bible_translations;
drop policy if exists "Admins gestionan libros biblicos" on public.bible_books;
drop policy if exists "Admins gestionan versiculos biblicos" on public.bible_verses;
drop policy if exists "Admins gestionan versiculos diarios" on public.bible_daily_verses;

drop policy if exists "Usuarios crean eventos propios" on public.events;
drop policy if exists "Creador o admin actualiza eventos" on public.events;

create policy "Admins crean eventos desde CMS" on public.events
for insert to authenticated
with check (public.has_role('admin') and created_by = auth.uid());

create policy "Admins actualizan eventos desde CMS" on public.events
for update to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));
