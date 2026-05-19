create table if not exists public.bible_reading_plans (
  id uuid primary key default gen_random_uuid(),
  plan_key text unique not null,
  title text not null,
  description text,
  duration_days integer not null,
  theme text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.bible_reading_plan_days (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.bible_reading_plans(id) on delete cascade,
  day_number integer not null,
  title text not null,
  description text,
  reading_reference text not null,
  book_code text references public.bible_books(code) on delete set null,
  start_chapter integer,
  start_verse integer,
  end_chapter integer,
  end_verse integer,
  reflection_prompt text,
  created_at timestamptz default now(),
  unique(plan_id, day_number)
);

create table if not exists public.bible_plan_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  plan_id uuid references public.bible_reading_plans(id) on delete cascade,
  day_id uuid references public.bible_reading_plan_days(id) on delete cascade,
  completed_at timestamptz default now(),
  note text,
  unique(user_id, day_id)
);

create index if not exists bible_reading_plan_days_plan_idx
on public.bible_reading_plan_days(plan_id, day_number);

create index if not exists bible_plan_progress_user_idx
on public.bible_plan_progress(user_id, completed_at desc);

alter table public.bible_reading_plans enable row level security;
alter table public.bible_reading_plan_days enable row level security;
alter table public.bible_plan_progress enable row level security;

create policy "Usuarios leen planes biblicos activos"
on public.bible_reading_plans
for select to authenticated
using (is_active = true or public.has_role('admin'));

create policy "Admins gestionan planes biblicos"
on public.bible_reading_plans
for all to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Usuarios leen dias de planes activos"
on public.bible_reading_plan_days
for select to authenticated
using (
  exists (
    select 1
    from public.bible_reading_plans p
    where p.id = bible_reading_plan_days.plan_id
      and (p.is_active = true or public.has_role('admin'))
  )
);

create policy "Admins gestionan dias de planes biblicos"
on public.bible_reading_plan_days
for all to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Usuarios gestionan su progreso de planes biblicos"
on public.bible_plan_progress
for all to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Admins leen progreso de planes biblicos"
on public.bible_plan_progress
for select to authenticated
using (public.has_role('admin'));

drop trigger if exists set_bible_reading_plans_updated_at on public.bible_reading_plans;
create trigger set_bible_reading_plans_updated_at
before update on public.bible_reading_plans
for each row execute function public.set_updated_at();

insert into public.bible_reading_plans (
  plan_key,
  title,
  description,
  duration_days,
  theme,
  is_active
)
values
  ('jesus-7', '7 dias con Jesus', 'Una semana mirando el caracter de Jesus y respondiendo con fe practica.', 7, 'evangelios', true),
  ('oracion-7', '7 dias de oracion', 'Un recorrido breve para aprender a hablar con Dios con honestidad.', 7, 'oracion', true),
  ('identidad-14', '14 dias de identidad en Cristo', 'Verdades biblicas para recordar quien eres en Cristo.', 14, 'identidad', true),
  ('salmos-21', '21 dias en los Salmos', 'Oracion, confianza y esperanza para caminar con Dios.', 21, 'salmos', true),
  ('proverbios-decisiones', 'Proverbios para decidir mejor', 'Sabiduria practica para decisiones, amistades y proposito.', 10, 'sabiduria', true)
on conflict (plan_key) do update
set title = excluded.title,
    description = excluded.description,
    duration_days = excluded.duration_days,
    theme = excluded.theme,
    is_active = excluded.is_active;

with plan_data as (
  select id, plan_key from public.bible_reading_plans
),
days as (
  select * from (
    values
      ('jesus-7', 1, 'Ven y ve', 'Juan 1:35-39', 'JHN', 1, 35, 1, 39, 'Que significa acercarte a Jesus hoy?'),
      ('jesus-7', 2, 'Nueva vida', 'Juan 3:1-16', 'JHN', 3, 1, 3, 16, 'Que parte de tu vida necesita nacer de nuevo?'),
      ('jesus-7', 3, 'Pan de vida', 'Juan 6:35', 'JHN', 6, 35, 6, 35, 'Que estas buscando para sentirte lleno?'),
      ('jesus-7', 4, 'Luz del mundo', 'Juan 8:12', 'JHN', 8, 12, 8, 12, 'Donde necesitas luz esta semana?'),
      ('jesus-7', 5, 'Buen pastor', 'Juan 10:11', 'JHN', 10, 11, 10, 11, 'Como escuchas la voz de Jesus?'),
      ('jesus-7', 6, 'Permanecer', 'Juan 15:1-5', 'JHN', 15, 1, 15, 5, 'Que habito te ayuda a permanecer?'),
      ('jesus-7', 7, 'Mision', 'Mateo 28:18-20', 'MAT', 28, 18, 28, 20, 'A quien puedes animar esta semana?'),
      ('oracion-7', 1, 'Oracion sencilla', 'Mateo 6:6', 'MAT', 6, 6, 6, 6, 'Busca un lugar tranquilo y ora con honestidad.'),
      ('oracion-7', 2, 'Padre nuestro', 'Mateo 6:9-13', 'MAT', 6, 9, 6, 13, 'Que frase del Padre Nuestro necesitas vivir?'),
      ('oracion-7', 3, 'Pedir sabiduria', 'Santiago 1:5', 'JAS', 1, 5, 1, 5, 'Que decision quieres poner delante de Dios?'),
      ('oracion-7', 4, 'Descanso', '1 Pedro 5:7', '1PE', 5, 7, 5, 7, 'Escribe una carga y entregala a Dios.'),
      ('oracion-7', 5, 'Gracias', 'Filipenses 4:6-7', 'PHP', 4, 6, 4, 7, 'Haz una lista de tres motivos de gratitud.'),
      ('oracion-7', 6, 'Interceder', '1 Timoteo 2:1', '1TI', 2, 1, 2, 1, 'Ora por un amigo por nombre.'),
      ('oracion-7', 7, 'Perseverar', 'Romanos 12:12', 'ROM', 12, 12, 12, 12, 'Como sostendras tu vida de oracion?')
  ) as d(plan_key, day_number, title, reading_reference, book_code, start_chapter, start_verse, end_chapter, end_verse, reflection_prompt)
  union all
  select 'identidad-14', day_number, title, reading_reference, book_code, start_chapter, start_verse, end_chapter, end_verse, reflection_prompt
  from (
    values
      (1, 'Nueva criatura', '2 Corintios 5:17', '2CO', 5, 17, 5, 17, 'Que mentira sobre ti cambia esta verdad?'),
      (2, 'Hijo amado', 'Juan 1:12', 'JHN', 1, 12, 1, 12, 'Como cambia tu dia saber que eres recibido por Dios?'),
      (3, 'Escogido', 'Efesios 1:4', 'EPH', 1, 4, 1, 4, 'Que significa vivir con proposito?'),
      (4, 'Perdonado', 'Efesios 1:7', 'EPH', 1, 7, 1, 7, 'Que culpa necesitas entregar?'),
      (5, 'Luz', 'Mateo 5:14', 'MAT', 5, 14, 5, 14, 'Donde puedes ser luz hoy?'),
      (6, 'Amado', 'Romanos 8:39', 'ROM', 8, 39, 8, 39, 'Que nada te separa del amor de Dios?'),
      (7, 'Valiente', 'Isaías 41:10', 'ISA', 41, 10, 41, 10, 'Que miedo quieres enfrentar con Dios?'),
      (8, 'Obra de Dios', 'Efesios 2:10', 'EPH', 2, 10, 2, 10, 'Que buena obra puedes practicar?'),
      (9, 'Libre', 'Gálatas 5:1', 'GAL', 5, 1, 5, 1, 'Que habito te quiere esclavizar?'),
      (10, 'Templo', '1 Corintios 6:19', '1CO', 6, 19, 6, 19, 'Como cuidaras tu vida integral?'),
      (11, 'Fuerte en Cristo', 'Filipenses 4:13', 'PHP', 4, 13, 4, 13, 'Que desafio enfrentaras en Cristo?'),
      (12, 'Con esperanza', 'Romanos 15:13', 'ROM', 15, 13, 15, 13, 'Donde necesitas esperanza?'),
      (13, 'Con paz', 'Juan 14:27', 'JHN', 14, 27, 14, 27, 'Que ansiedad entregas a Jesus?'),
      (14, 'Enviado', 'Mateo 28:19', 'MAT', 28, 19, 28, 19, 'A quien puedes compartir esperanza?')
  ) as d(day_number, title, reading_reference, book_code, start_chapter, start_verse, end_chapter, end_verse, reflection_prompt)
  union all
  select 'salmos-21', gs, 'Salmo dia ' || gs, 'Salmo ' || gs, 'PSA', gs, null, gs, null, 'Que palabra de este salmo quieres convertir en oracion?'
  from generate_series(1, 21) as gs
  union all
  select 'proverbios-decisiones', gs, 'Sabiduria dia ' || gs, 'Proverbios ' || gs, 'PRO', gs, null, gs, null, 'Que decision quieres revisar con sabiduria?'
  from generate_series(1, 10) as gs
)
insert into public.bible_reading_plan_days (
  plan_id,
  day_number,
  title,
  description,
  reading_reference,
  book_code,
  start_chapter,
  start_verse,
  end_chapter,
  end_verse,
  reflection_prompt
)
select
  p.id,
  d.day_number,
  d.title,
  'Lectura guiada para el piloto.',
  d.reading_reference,
  d.book_code,
  d.start_chapter,
  d.start_verse,
  d.end_chapter,
  d.end_verse,
  d.reflection_prompt
from days d
join plan_data p on p.plan_key = d.plan_key
on conflict (plan_id, day_number) do update
set title = excluded.title,
    description = excluded.description,
    reading_reference = excluded.reading_reference,
    book_code = excluded.book_code,
    start_chapter = excluded.start_chapter,
    start_verse = excluded.start_verse,
    end_chapter = excluded.end_chapter,
    end_verse = excluded.end_verse,
    reflection_prompt = excluded.reflection_prompt;
