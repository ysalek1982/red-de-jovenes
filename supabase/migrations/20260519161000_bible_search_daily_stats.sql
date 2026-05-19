create index if not exists bible_verses_normalized_text_idx
on public.bible_verses using gin (to_tsvector('spanish', coalesce(normalized_text, verse_text, '')));

create or replace function public.search_bible_verses(
  p_query text,
  p_translation_code text default 'RVR1909',
  p_book_code text default null,
  p_limit integer default 25
)
returns table (
  translation_code text,
  book_code text,
  book_name text,
  chapter integer,
  verse integer,
  reference text,
  verse_text text,
  rank real
)
language sql
stable
security invoker
set search_path = public
as $$
  with normalized as (
    select
      trim(coalesce(p_query, '')) as query,
      least(greatest(coalesce(p_limit, 25), 1), 50) as max_rows
  ),
  parsed_ref as (
    select
      regexp_match(query, '^([[:alpha:]0-9 ]+)[ ]+([0-9]+)(:([0-9]+))?$', 'i') as parts,
      query,
      max_rows
    from normalized
  )
  select
    v.translation_code,
    v.book_code,
    b.name as book_name,
    v.chapter,
    v.verse,
    b.name || ' ' || v.chapter || ':' || v.verse as reference,
    v.verse_text,
    greatest(
      ts_rank(
        to_tsvector('spanish', coalesce(v.normalized_text, v.verse_text, '')),
        plainto_tsquery('spanish', (select query from normalized))
      ),
      case
        when v.verse_text ilike '%' || (select query from normalized) || '%' then 0.2
        else 0
      end
    )::real as rank
  from public.bible_verses v
  join public.bible_books b on b.code = v.book_code
  join public.bible_translations t on t.code = v.translation_code
  cross join parsed_ref r
  where t.is_active = true
    and v.translation_code = coalesce(nullif(p_translation_code, ''), 'RVR1909')
    and (p_book_code is null or p_book_code = '' or v.book_code = p_book_code)
    and (
      (r.query <> '' and to_tsvector('spanish', coalesce(v.normalized_text, v.verse_text, '')) @@ plainto_tsquery('spanish', r.query))
      or (r.query <> '' and v.verse_text ilike '%' || r.query || '%')
      or (
        r.parts is not null
        and lower(b.name) ilike '%' || lower(r.parts[1]) || '%'
        and v.chapter = (r.parts[2])::integer
        and (r.parts[4] is null or v.verse = (r.parts[4])::integer)
      )
    )
  order by rank desc, b.book_order, v.chapter, v.verse
  limit (select max_rows from normalized);
$$;

create or replace function public.get_daily_bible_verse(
  p_date date default current_date,
  p_translation_code text default 'RVR1909'
)
returns table (
  translation_code text,
  book_code text,
  book_name text,
  chapter integer,
  verse integer,
  reference text,
  verse_text text,
  devotional_hint text
)
language sql
stable
security invoker
set search_path = public
as $$
  with scheduled as (
    select
      v.translation_code,
      v.book_code,
      b.name as book_name,
      v.chapter,
      v.verse,
      b.name || ' ' || v.chapter || ':' || v.verse as reference,
      v.verse_text,
      d.devotional_hint
    from public.bible_daily_verses d
    join public.bible_verses v
      on v.translation_code = d.translation_code
     and v.book_code = d.book_code
     and v.chapter = d.chapter
     and v.verse = d.verse
    join public.bible_books b on b.code = v.book_code
    join public.bible_translations t on t.code = v.translation_code
    where d.active_date = p_date
      and v.translation_code = p_translation_code
      and t.is_active = true
    limit 1
  ),
  fallback_pool as (
    select
      v.translation_code,
      v.book_code,
      b.name as book_name,
      v.chapter,
      v.verse,
      b.name || ' ' || v.chapter || ':' || v.verse as reference,
      v.verse_text,
      null::text as devotional_hint
    from public.bible_verses v
    join public.bible_books b on b.code = v.book_code
    join public.bible_translations t on t.code = v.translation_code
    where v.translation_code = p_translation_code
      and t.is_active = true
      and (
        (select count(*) from public.bible_verses where translation_code = p_translation_code) <= 7
        or not exists (
          select 1
          from public.bible_daily_verses recent
          where recent.translation_code = v.translation_code
            and recent.book_code = v.book_code
            and recent.chapter = v.chapter
            and recent.verse = v.verse
            and recent.active_date between p_date - interval '7 days' and p_date - interval '1 day'
        )
      )
    order by random()
    limit 1
  )
  select * from scheduled
  union all
  select * from fallback_pool
  where not exists (select 1 from scheduled)
  limit 1;
$$;

create or replace view public.bible_translation_stats as
select
  t.code,
  t.name,
  t.language,
  t.license,
  t.source_name,
  t.source_url,
  t.is_public_domain,
  t.is_active,
  count(distinct v.book_code)::integer as books_with_verses,
  count(distinct (v.book_code, v.chapter))::integer as chapters_with_verses,
  count(v.id)::integer as verses_count,
  round(
    (
      count(distinct (v.book_code, v.chapter))::numeric /
      nullif((select sum(chapters_count)::numeric from public.bible_books), 0)
    ) * 100,
    2
  ) as estimated_completion_percent
from public.bible_translations t
cross join public.bible_books b
left join public.bible_verses v
  on v.translation_code = t.code
 and v.book_code = b.code
group by t.code, t.name, t.language, t.license, t.source_name, t.source_url, t.is_public_domain, t.is_active;

create or replace view public.bible_missing_chapters_report as
select
  t.code as translation_code,
  b.code as book_code,
  b.name as book_name,
  gs.chapter
from public.bible_translations t
cross join public.bible_books b
cross join lateral generate_series(1, b.chapters_count) as gs(chapter)
where t.is_active = true
  and not exists (
    select 1
    from public.bible_verses v
    where v.translation_code = t.code
      and v.book_code = b.code
      and v.chapter = gs.chapter
  );

grant execute on function public.search_bible_verses(text, text, text, integer) to authenticated;
grant execute on function public.get_daily_bible_verse(date, text) to authenticated;
