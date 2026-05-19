import { supabase } from '../../lib/supabase'
import type {
  BibleHighlight,
  BibleBook,
  BibleReadingProgress,
  BibleSavedVerse,
  BibleTranslation,
  BibleVerse,
} from '../../types/database'

export const verseOfTheMoment = {
  reference: 'Filipenses 4:13',
  text: 'Todo lo puedo en Cristo que me fortalece.',
  note: 'Una verdad breve para recordar que la fuerza viene de Cristo.',
}

export interface BibleVerseResult {
  translation_code: string
  book_code: string
  book_name: string
  chapter: number
  verse: number
  reference: string
  verse_text: string
}

export async function getActiveBibleTranslations() {
  const { data, error } = await supabase
    .from('bible_translations')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as BibleTranslation[]
}

export async function getBibleBooks() {
  const { data, error } = await supabase
    .from('bible_books')
    .select('*')
    .order('book_order', { ascending: true })

  if (error) throw error
  return (data ?? []) as BibleBook[]
}

export async function getRandomBibleVerse(input?: {
  translationCode?: string
  testament?: 'old' | 'new' | null
  bookCode?: string | null
}) {
  const { data, error } = await supabase.rpc('get_random_bible_verse', {
    p_translation_code: input?.translationCode || 'RVR1909',
    p_testament: input?.testament ?? undefined,
    p_book_code: input?.bookCode ?? undefined,
  })

  if (error) throw error
  return ((data ?? []) as BibleVerseResult[])[0] ?? null
}

export async function getBibleChapter(input: {
  translationCode: string
  bookCode: string
  chapter: number
}) {
  const { data, error } = await supabase.rpc('get_bible_chapter', {
    p_translation_code: input.translationCode,
    p_book_code: input.bookCode,
    p_chapter: input.chapter,
  })

  if (error) throw error
  return (data ?? []) as BibleVerseResult[]
}

export async function getBibleVerse(input: {
  translationCode: string
  bookCode: string
  chapter: number
  verse: number
}) {
  const { data, error } = await supabase
    .from('bible_verses')
    .select('*')
    .eq('translation_code', input.translationCode)
    .eq('book_code', input.bookCode)
    .eq('chapter', input.chapter)
    .eq('verse', input.verse)
    .maybeSingle()

  if (error) throw error
  return data as BibleVerse | null
}

export const bibleReadingPlans = [
  {
    key: 'salmos-21',
    title: '21 dias en los Salmos',
    description: 'Oracion, confianza y esperanza para caminar con Dios.',
    days: 21,
  },
  {
    key: 'jesus-evangelios',
    title: 'Jesus en los Evangelios',
    description: 'Mirar el caracter de Jesus y practicar sus pasos.',
    days: 14,
  },
  {
    key: 'identidad-cristo',
    title: 'Identidad en Cristo',
    description: 'Recordar quien eres cuando tu vida esta en Cristo.',
    days: 10,
  },
]

export const bibleReadingSamples = [
  {
    planKey: 'salmos-21',
    dayNumber: 1,
    reference: 'Salmo 23:1',
    excerpt: 'El Senor es mi pastor; nada me faltara.',
    action: 'Escribe una preocupacion y entragala en oracion.',
  },
  {
    planKey: 'jesus-evangelios',
    dayNumber: 1,
    reference: 'Juan 15:5',
    excerpt: 'Permaneced en mi, y yo en vosotros.',
    action: 'Haz una pausa y vuelve a conectar tu dia con Jesus.',
  },
  {
    planKey: 'identidad-cristo',
    dayNumber: 1,
    reference: '2 Corintios 5:17',
    excerpt: 'Si alguno esta en Cristo, nueva criatura es.',
    action: 'Anota una mentira sobre ti y reemplazala por esta verdad.',
  },
]

export async function getMySavedVerses(userId: string) {
  const { data, error } = await supabase
    .from('bible_saved_verses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as BibleSavedVerse[]
}

export async function saveVerse(input: {
  userId: string
  reference: string
  verseText: string
  note?: string
}) {
  const { data, error } = await supabase
    .from('bible_saved_verses')
    .upsert(
      {
        user_id: input.userId,
        reference: input.reference,
        verse_text: input.verseText,
        note: input.note || null,
      },
      { onConflict: 'user_id,reference' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSavedVerse(input: {
  userId: string
  reference: string
}) {
  const { error } = await supabase
    .from('bible_saved_verses')
    .delete()
    .eq('user_id', input.userId)
    .eq('reference', input.reference)

  if (error) throw error
}

export async function getMyReadingProgress(userId: string) {
  const { data, error } = await supabase
    .from('bible_reading_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as BibleReadingProgress[]
}

export async function markReadingDayComplete(input: {
  userId: string
  planKey: string
  dayNumber: number
}) {
  const { data, error } = await supabase
    .from('bible_reading_progress')
    .upsert(
      {
        user_id: input.userId,
        plan_key: input.planKey,
        day_number: input.dayNumber,
      },
      { onConflict: 'user_id,plan_key,day_number' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyHighlights(userId: string) {
  const { data, error } = await supabase
    .from('bible_highlights')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as BibleHighlight[]
}

export async function createHighlight(input: {
  userId: string
  reference: string
  highlightText: string
  color?: string
  note?: string
}) {
  const { data, error } = await supabase
    .from('bible_highlights')
    .insert({
      user_id: input.userId,
      reference: input.reference,
      highlight_text: input.highlightText,
      color: input.color || 'gold',
      note: input.note || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
