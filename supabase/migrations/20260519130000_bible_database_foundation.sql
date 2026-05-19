create table if not exists public.bible_translations (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  language text not null default 'es',
  license text,
  source_name text,
  source_url text,
  is_public_domain boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bible_books (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  testament text not null check (testament in ('old', 'new')),
  book_order integer not null,
  chapters_count integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.bible_verses (
  id uuid primary key default gen_random_uuid(),
  translation_code text not null references public.bible_translations(code) on delete cascade,
  book_code text not null references public.bible_books(code) on delete cascade,
  chapter integer not null check (chapter > 0),
  verse integer not null check (verse > 0),
  verse_text text not null,
  normalized_text text,
  created_at timestamptz not null default now(),
  unique(translation_code, book_code, chapter, verse)
);

create table if not exists public.bible_daily_verses (
  id uuid primary key default gen_random_uuid(),
  translation_code text references public.bible_translations(code) on delete cascade,
  book_code text references public.bible_books(code) on delete cascade,
  chapter integer not null check (chapter > 0),
  verse integer not null check (verse > 0),
  devotional_hint text,
  active_date date unique,
  created_at timestamptz not null default now()
);

create index if not exists bible_verses_lookup_idx
on public.bible_verses(translation_code, book_code, chapter, verse);

create index if not exists bible_verses_book_chapter_idx
on public.bible_verses(book_code, chapter);

create index if not exists bible_verses_translation_idx
on public.bible_verses(translation_code);

create index if not exists bible_verses_text_search_idx
on public.bible_verses
using gin (to_tsvector('spanish', coalesce(normalized_text, verse_text)));

alter table public.bible_translations enable row level security;
alter table public.bible_books enable row level security;
alter table public.bible_verses enable row level security;
alter table public.bible_daily_verses enable row level security;

create policy "Usuarios leen traducciones activas" on public.bible_translations
for select to authenticated using (is_active = true or public.has_role('admin'));

create policy "Admins gestionan traducciones" on public.bible_translations
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Usuarios leen libros biblicos" on public.bible_books
for select to authenticated using (true);

create policy "Admins gestionan libros biblicos" on public.bible_books
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Usuarios leen versiculos biblicos" on public.bible_verses
for select to authenticated using (
  exists (
    select 1
    from public.bible_translations
    where bible_translations.code = bible_verses.translation_code
      and (bible_translations.is_active = true or public.has_role('admin'))
  )
);

create policy "Admins gestionan versiculos biblicos" on public.bible_verses
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy "Usuarios leen versiculos diarios" on public.bible_daily_verses
for select to authenticated using (true);

create policy "Admins gestionan versiculos diarios" on public.bible_daily_verses
for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

insert into public.bible_translations (
  code,
  name,
  language,
  license,
  source_name,
  source_url,
  is_public_domain,
  is_active
)
values (
  'RVR1909',
  'Reina-Valera 1909',
  'es',
  'Dominio publico. Validar fuente completa antes de importar texto completo.',
  'Reina-Valera 1909',
  'https://en.wikisource.org/wiki/Bible_(Reina-Valera)',
  true,
  true
)
on conflict (code) do update set
  name = excluded.name,
  language = excluded.language,
  license = excluded.license,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  is_public_domain = excluded.is_public_domain,
  is_active = excluded.is_active;

insert into public.bible_books (code, name, testament, book_order, chapters_count)
values
  ('GEN', 'Genesis', 'old', 1, 50),
  ('EXO', 'Exodo', 'old', 2, 40),
  ('LEV', 'Levitico', 'old', 3, 27),
  ('NUM', 'Numeros', 'old', 4, 36),
  ('DEU', 'Deuteronomio', 'old', 5, 34),
  ('JOS', 'Josue', 'old', 6, 24),
  ('JDG', 'Jueces', 'old', 7, 21),
  ('RUT', 'Rut', 'old', 8, 4),
  ('1SA', '1 Samuel', 'old', 9, 31),
  ('2SA', '2 Samuel', 'old', 10, 24),
  ('1KI', '1 Reyes', 'old', 11, 22),
  ('2KI', '2 Reyes', 'old', 12, 25),
  ('1CH', '1 Cronicas', 'old', 13, 29),
  ('2CH', '2 Cronicas', 'old', 14, 36),
  ('EZR', 'Esdras', 'old', 15, 10),
  ('NEH', 'Nehemias', 'old', 16, 13),
  ('EST', 'Ester', 'old', 17, 10),
  ('JOB', 'Job', 'old', 18, 42),
  ('PSA', 'Salmos', 'old', 19, 150),
  ('PRO', 'Proverbios', 'old', 20, 31),
  ('ECC', 'Eclesiastes', 'old', 21, 12),
  ('SNG', 'Cantares', 'old', 22, 8),
  ('ISA', 'Isaias', 'old', 23, 66),
  ('JER', 'Jeremias', 'old', 24, 52),
  ('LAM', 'Lamentaciones', 'old', 25, 5),
  ('EZK', 'Ezequiel', 'old', 26, 48),
  ('DAN', 'Daniel', 'old', 27, 12),
  ('HOS', 'Oseas', 'old', 28, 14),
  ('JOL', 'Joel', 'old', 29, 3),
  ('AMO', 'Amos', 'old', 30, 9),
  ('OBA', 'Abdias', 'old', 31, 1),
  ('JON', 'Jonas', 'old', 32, 4),
  ('MIC', 'Miqueas', 'old', 33, 7),
  ('NAM', 'Nahum', 'old', 34, 3),
  ('HAB', 'Habacuc', 'old', 35, 3),
  ('ZEP', 'Sofonias', 'old', 36, 3),
  ('HAG', 'Haggeo', 'old', 37, 2),
  ('ZEC', 'Zacarias', 'old', 38, 14),
  ('MAL', 'Malaquias', 'old', 39, 4),
  ('MAT', 'Mateo', 'new', 40, 28),
  ('MRK', 'Marcos', 'new', 41, 16),
  ('LUK', 'Lucas', 'new', 42, 24),
  ('JHN', 'Juan', 'new', 43, 21),
  ('ACT', 'Hechos', 'new', 44, 28),
  ('ROM', 'Romanos', 'new', 45, 16),
  ('1CO', '1 Corintios', 'new', 46, 16),
  ('2CO', '2 Corintios', 'new', 47, 13),
  ('GAL', 'Galatas', 'new', 48, 6),
  ('EPH', 'Efesios', 'new', 49, 6),
  ('PHP', 'Filipenses', 'new', 50, 4),
  ('COL', 'Colosenses', 'new', 51, 4),
  ('1TH', '1 Tesalonicenses', 'new', 52, 5),
  ('2TH', '2 Tesalonicenses', 'new', 53, 3),
  ('1TI', '1 Timoteo', 'new', 54, 6),
  ('2TI', '2 Timoteo', 'new', 55, 4),
  ('TIT', 'Tito', 'new', 56, 3),
  ('PHM', 'Filemon', 'new', 57, 1),
  ('HEB', 'Hebreos', 'new', 58, 13),
  ('JAS', 'Santiago', 'new', 59, 5),
  ('1PE', '1 Pedro', 'new', 60, 5),
  ('2PE', '2 Pedro', 'new', 61, 3),
  ('1JN', '1 Juan', 'new', 62, 5),
  ('2JN', '2 Juan', 'new', 63, 1),
  ('3JN', '3 Juan', 'new', 64, 1),
  ('JUD', 'Judas', 'new', 65, 1),
  ('REV', 'Apocalipsis', 'new', 66, 22)
on conflict (code) do update set
  name = excluded.name,
  testament = excluded.testament,
  book_order = excluded.book_order,
  chapters_count = excluded.chapters_count;

insert into public.bible_verses (
  translation_code,
  book_code,
  chapter,
  verse,
  verse_text,
  normalized_text
)
values
  ('RVR1909', 'JHN', 3, 16, 'Porque de tal manera amo Dios al mundo, que ha dado a su Hijo unigenito, para que todo aquel que en el cree, no se pierda, mas tenga vida eterna.', 'porque de tal manera amo dios al mundo que ha dado a su hijo unigenito para que todo aquel que en el cree no se pierda mas tenga vida eterna'),
  ('RVR1909', 'PSA', 23, 1, 'Jehova es mi pastor; nada me faltara.', 'jehova es mi pastor nada me faltara'),
  ('RVR1909', 'PHP', 4, 13, 'Todo lo puedo en Cristo que me fortalece.', 'todo lo puedo en cristo que me fortalece'),
  ('RVR1909', 'ROM', 8, 28, 'Y sabemos que a los que a Dios aman, todas las cosas les ayudan a bien, es a saber, a los que conforme al proposito son llamados.', 'y sabemos que a los que a dios aman todas las cosas les ayudan a bien'),
  ('RVR1909', 'MAT', 6, 33, 'Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os seran anadidas.', 'mas buscad primeramente el reino de dios y su justicia'),
  ('RVR1909', 'JER', 29, 11, 'Porque yo se los pensamientos que tengo acerca de vosotros, dice Jehova, pensamientos de paz, y no de mal, para daros el fin que esperais.', 'porque yo se los pensamientos que tengo acerca de vosotros'),
  ('RVR1909', 'PRO', 3, 5, 'Fiate de Jehova de todo tu corazon, y no estribes en tu prudencia.', 'fiate de jehova de todo tu corazon'),
  ('RVR1909', 'ISA', 41, 10, 'No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo.', 'no temas que yo soy contigo no desmayes'),
  ('RVR1909', 'PSA', 119, 105, 'Lampara es a mis pies tu palabra, y lumbrera a mi camino.', 'lampara es a mis pies tu palabra y lumbrera a mi camino'),
  ('RVR1909', 'GAL', 5, 22, 'Mas el fruto del Espiritu es: caridad, gozo, paz, tolerancia, benignidad, bondad, fe.', 'mas el fruto del espiritu es caridad gozo paz tolerancia benignidad bondad fe'),
  ('RVR1909', 'EPH', 2, 8, 'Porque por gracia sois salvos por la fe; y esto no de vosotros, pues es don de Dios.', 'porque por gracia sois salvos por la fe'),
  ('RVR1909', '1CO', 13, 4, 'La caridad es sufrida, es benigna; la caridad no tiene envidia, la caridad no hace sin razon, no se ensancha.', 'la caridad es sufrida es benigna'),
  ('RVR1909', 'HEB', 11, 1, 'Es pues la fe la sustancia de las cosas que se esperan, la demostracion de las cosas que no se ven.', 'es pues la fe la sustancia de las cosas que se esperan'),
  ('RVR1909', 'JAS', 1, 5, 'Y si alguno de vosotros tiene falta de sabiduria, demandela a Dios, el cual da a todos abundantemente, y no zahiere; y le sera dada.', 'si alguno tiene falta de sabiduria demandela a dios'),
  ('RVR1909', '1PE', 5, 7, 'Echando toda vuestra solicitud en el, porque el tiene cuidado de vosotros.', 'echando toda vuestra solicitud en el porque el tiene cuidado de vosotros')
on conflict (translation_code, book_code, chapter, verse) do update set
  verse_text = excluded.verse_text,
  normalized_text = excluded.normalized_text;

insert into public.bible_daily_verses (
  translation_code,
  book_code,
  chapter,
  verse,
  devotional_hint,
  active_date
)
values (
  'RVR1909',
  'PHP',
  4,
  13,
  'Recuerda que la fuerza para hoy viene de Cristo, no de tu rendimiento.',
  current_date
)
on conflict (active_date) do update set
  translation_code = excluded.translation_code,
  book_code = excluded.book_code,
  chapter = excluded.chapter,
  verse = excluded.verse,
  devotional_hint = excluded.devotional_hint;

create or replace function public.get_random_bible_verse(
  p_translation_code text default 'RVR1909',
  p_testament text default null,
  p_book_code text default null
)
returns table (
  translation_code text,
  book_code text,
  book_name text,
  chapter integer,
  verse integer,
  reference text,
  verse_text text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    v.translation_code,
    v.book_code,
    b.name as book_name,
    v.chapter,
    v.verse,
    b.name || ' ' || v.chapter::text || ':' || v.verse::text as reference,
    v.verse_text
  from public.bible_verses v
  join public.bible_books b on b.code = v.book_code
  join public.bible_translations t on t.code = v.translation_code
  where v.translation_code = coalesce(p_translation_code, 'RVR1909')
    and t.is_active = true
    and (p_testament is null or b.testament = p_testament)
    and (p_book_code is null or v.book_code = p_book_code)
  order by random()
  limit 1;
$$;

create or replace function public.get_bible_chapter(
  p_translation_code text,
  p_book_code text,
  p_chapter integer
)
returns table (
  translation_code text,
  book_code text,
  book_name text,
  chapter integer,
  verse integer,
  reference text,
  verse_text text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    v.translation_code,
    v.book_code,
    b.name as book_name,
    v.chapter,
    v.verse,
    b.name || ' ' || v.chapter::text || ':' || v.verse::text as reference,
    v.verse_text
  from public.bible_verses v
  join public.bible_books b on b.code = v.book_code
  join public.bible_translations t on t.code = v.translation_code
  where v.translation_code = p_translation_code
    and v.book_code = p_book_code
    and v.chapter = p_chapter
    and t.is_active = true
  order by v.verse asc;
$$;

grant execute on function public.get_random_bible_verse(text, text, text) to authenticated;
grant execute on function public.get_bible_chapter(text, text, integer) to authenticated;
