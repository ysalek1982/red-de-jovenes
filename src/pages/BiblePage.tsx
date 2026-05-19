import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BookMarked,
  CheckCircle2,
  Copy,
  MessageCircle,
  RefreshCw,
  Save,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  bibleReadingPlans,
  bibleReadingSamples,
  createHighlight,
  getActiveBibleTranslations,
  getBibleBooks,
  getBibleChapter,
  getMyHighlights,
  getMyReadingProgress,
  getMySavedVerses,
  getRandomBibleVerse,
  markReadingDayComplete,
  saveVerse,
  type BibleVerseResult,
} from '../features/bible/bibleService'
import { createPost } from '../features/community/communityService'
import { generateAiContent } from '../features/ai/aiService'
import { useAuth } from '../features/auth/useAuth'
import type {
  BibleBook,
  BibleHighlight,
  BibleReadingProgress,
  BibleSavedVerse,
  BibleTranslation,
} from '../types/database'

export function BiblePage() {
  const { user } = useAuth()
  const userId = user?.id
  const [translations, setTranslations] = useState<BibleTranslation[]>([])
  const [books, setBooks] = useState<BibleBook[]>([])
  const [chapterVerses, setChapterVerses] = useState<BibleVerseResult[]>([])
  const [randomVerse, setRandomVerse] = useState<BibleVerseResult | null>(null)
  const [saved, setSaved] = useState<BibleSavedVerse[]>([])
  const [progress, setProgress] = useState<BibleReadingProgress[]>([])
  const [highlights, setHighlights] = useState<BibleHighlight[]>([])
  const [selectedTranslation, setSelectedTranslation] = useState('RVR1909')
  const [selectedBook, setSelectedBook] = useState('JHN')
  const [selectedChapter, setSelectedChapter] = useState(3)
  const [selectedPlan, setSelectedPlan] = useState(bibleReadingPlans[0].key)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [aiExplanation, setAiExplanation] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const sample = useMemo(
    () =>
      bibleReadingSamples.find((item) => item.planKey === selectedPlan) ??
      bibleReadingSamples[0],
    [selectedPlan],
  )
  const currentPlan = bibleReadingPlans.find((plan) => plan.key === selectedPlan)
  const selectedBookMeta = books.find((book) => book.code === selectedBook)
  const completedSet = new Set(
    progress.map((item) => `${item.plan_key}:${item.day_number}`),
  )
  const activeVerse = randomVerse ?? {
    translation_code: 'RVR1909',
    book_code: 'PHP',
    book_name: 'Filipenses',
    chapter: 4,
    verse: 13,
    reference: 'Filipenses 4:13',
    verse_text: 'Todo lo puedo en Cristo que me fortalece.',
  }

  const loadChapter = useCallback(async () => {
    const verses = await getBibleChapter({
      translationCode: selectedTranslation,
      bookCode: selectedBook,
      chapter: selectedChapter,
    })
    setChapterVerses(verses)
  }, [selectedBook, selectedChapter, selectedTranslation])

  const loadData = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setError('')
    try {
      const [
        translationData,
        bookData,
        randomData,
        savedData,
        progressData,
        highlightData,
      ] = await Promise.all([
        getActiveBibleTranslations(),
        getBibleBooks(),
        getRandomBibleVerse({ translationCode: selectedTranslation }),
        getMySavedVerses(userId),
        getMyReadingProgress(userId),
        getMyHighlights(userId),
      ])
      setTranslations(translationData)
      setBooks(bookData)
      setRandomVerse(randomData)
      setSaved(savedData)
      setProgress(progressData)
      setHighlights(highlightData)
      await loadChapter()
    } catch {
      setError('No pudimos cargar la Biblia. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [loadChapter, selectedTranslation, userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  async function handleRandomVerse() {
    setRandomVerse(
      await getRandomBibleVerse({ translationCode: selectedTranslation }),
    )
    setStatus('Versiculo actualizado.')
  }

  async function handleSaveVerse(verse = activeVerse) {
    if (!userId) return
    await saveVerse({
      userId,
      reference: verse.reference,
      verseText: verse.verse_text,
      note,
    })
    setStatus('Versiculo guardado en tu Biblia.')
    setNote('')
    setSaved(await getMySavedVerses(userId))
  }

  async function handleCompleteDay() {
    if (!userId) return
    await markReadingDayComplete({
      userId,
      planKey: selectedPlan,
      dayNumber: sample.dayNumber,
    })
    setStatus('Lectura marcada como completada.')
    setProgress(await getMyReadingProgress(userId))
  }

  async function handleHighlight(verse = activeVerse) {
    if (!userId) return
    await createHighlight({
      userId,
      reference: verse.reference,
      highlightText: verse.verse_text,
      note: 'Subrayado desde Biblia.',
    })
    setStatus('Versiculo subrayado.')
    setHighlights(await getMyHighlights(userId))
  }

  async function handleShareInForum(verse = activeVerse) {
    if (!userId) return
    await createPost({
      userId,
      body: `Hoy estoy meditando en ${verse.reference}.`,
      verseReference: verse.reference,
      verseText: verse.verse_text,
    })
    setStatus('Compartido en Foros con la Palabra.')
  }

  async function handleCopy(verse = activeVerse) {
    await navigator.clipboard.writeText(`${verse.verse_text} - ${verse.reference}`)
    setStatus('Versiculo copiado.')
  }

  async function handleExplainVerse(verse = activeVerse) {
    const result = await generateAiContent({
      actionType: 'explain_bible_verse',
      prompt: `Explica brevemente ${verse.reference} para jovenes: ${verse.verse_text}`,
    })
    setAiExplanation(
      result.text ||
        'Gemini no esta configurado todavia. La solicitud quedo registrada para revision.',
    )
    setStatus('Explicacion generada para revisar.')
  }

  async function handleLoadChapter() {
    await loadChapter()
    setStatus('Capitulo cargado.')
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-32 pt-32 text-white">
      <div className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-sm font-semibold text-amber-100">Biblia</p>
            <h1 className="mt-3 text-4xl font-black">Versiculo aleatorio</h1>
            <p className="mt-5 text-2xl leading-10 text-white">
              "{activeVerse.verse_text}"
            </p>
            <p className="mt-3 font-bold text-amber-200">
              {activeVerse.reference}
            </p>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Agrega una nota personal opcional"
              className="mt-6 w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-amber-200"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleRandomVerse()} className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-200 px-5 text-sm font-black text-slate-950">
                <RefreshCw className="h-4 w-4" /> Otro versiculo
              </button>
              <button type="button" onClick={() => void handleSaveVerse()} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950">
                <Save className="h-4 w-4" /> Guardar
              </button>
              <button type="button" onClick={() => void handleShareInForum()} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white">
                <MessageCircle className="h-4 w-4" /> Compartir
              </button>
              <button type="button" onClick={() => void handleCopy()} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white">
                <Copy className="h-4 w-4" /> Copiar
              </button>
              <button type="button" onClick={() => void handleExplainVerse()} className="inline-flex h-11 items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-5 text-sm font-bold text-emerald-100">
                Explicar con IA
              </button>
            </div>
            {aiExplanation ? (
              <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-sm leading-6 text-white/70">
                {aiExplanation}
              </div>
            ) : null}
            {status ? <p className="mt-4 text-sm font-semibold text-emerald-200">{status}</p> : null}
            {error ? <p className="mt-4 text-sm font-semibold text-amber-100">{error}</p> : null}
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-sm font-semibold text-emerald-200">Leer por capitulo</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <select value={selectedTranslation} onChange={(event) => setSelectedTranslation(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white">
                {translations.map((translation) => (
                  <option key={translation.code} value={translation.code}>{translation.code}</option>
                ))}
              </select>
              <select value={selectedBook} onChange={(event) => setSelectedBook(event.target.value)} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white">
                {books.map((book) => (
                  <option key={book.code} value={book.code}>{book.name}</option>
                ))}
              </select>
              <input type="number" min={1} max={selectedBookMeta?.chapters_count ?? 150} value={selectedChapter} onChange={(event) => setSelectedChapter(Number(event.target.value))} className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white" />
            </div>
            <button type="button" onClick={() => void handleLoadChapter()} className="mt-4 h-11 rounded-full bg-white px-5 text-sm font-black text-slate-950">
              Cargar capitulo
            </button>
            <div className="mt-5 max-h-96 space-y-3 overflow-y-auto pr-1">
              {isLoading ? <p className="text-white/60">Cargando Biblia...</p> : null}
              {!isLoading && !chapterVerses.length ? (
                <p className="rounded-3xl border border-dashed border-white/10 bg-slate-950/45 p-5 text-sm leading-6 text-white/60">
                  La Biblia completa todavia no fue importada. Ya puedes usar versiculos base y cargar una traduccion autorizada desde administracion.
                </p>
              ) : null}
              {chapterVerses.map((verse) => (
                <div key={verse.reference} className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="text-xs font-bold text-amber-200">{verse.reference}</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{verse.verse_text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void handleSaveVerse(verse)} className="text-xs font-bold text-emerald-200">Guardar</button>
                    <button type="button" onClick={() => void handleHighlight(verse)} className="text-xs font-bold text-amber-200">Subrayar</button>
                    <button type="button" onClick={() => void handleShareInForum(verse)} className="text-xs font-bold text-white/70">Foros</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-sm font-semibold text-emerald-200">Lectura de hoy</p>
            <h2 className="mt-2 text-2xl font-black">{currentPlan?.title}</h2>
            <select value={selectedPlan} onChange={(event) => setSelectedPlan(event.target.value)} className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white">
              {bibleReadingPlans.map((plan) => (
                <option key={plan.key} value={plan.key}>{plan.title}</option>
              ))}
            </select>
            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-5">
              <p className="text-sm font-bold text-amber-200">{sample.reference}</p>
              <p className="mt-3 text-lg leading-8 text-white/85">"{sample.excerpt}"</p>
              <p className="mt-4 text-sm leading-6 text-white/60">{sample.action}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleCompleteDay()} className="inline-flex h-11 items-center gap-2 rounded-full bg-emerald-200 px-5 text-sm font-black text-slate-950">
                <CheckCircle2 className="h-4 w-4" /> Marcar leido
              </button>
              <button type="button" onClick={() => void handleHighlight()} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white">
                <BookMarked className="h-4 w-4" /> Subrayar
              </button>
            </div>
            <p className="mt-4 text-sm text-white/55">
              {completedSet.has(`${selectedPlan}:${sample.dayNumber}`)
                ? 'Este dia ya esta completado.'
                : 'Marca la lectura cuando hayas meditado el fragmento.'}
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <h2 className="text-2xl font-black">Versiculos guardados</h2>
            <div className="mt-5 space-y-3">
              {!saved.length ? <p className="text-sm text-white/60">Guarda tu primer versiculo para volver a el durante la semana.</p> : null}
              {saved.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="font-bold text-amber-200">{item.reference}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.verse_text}</p>
                  {item.note ? <p className="mt-2 text-xs text-white/45">{item.note}</p> : null}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <h2 className="text-2xl font-black">Subrayados</h2>
            <div className="mt-5 space-y-3">
              {!highlights.length ? <p className="text-sm text-white/60">Subraya fragmentos breves que quieras recordar.</p> : null}
              {highlights.slice(0, 8).map((item) => (
                <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                  <p className="font-bold text-emerald-200">{item.reference}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.highlight_text}</p>
                </div>
              ))}
            </div>
            <Link to="/app/discipulado" className="mt-5 inline-flex text-sm font-bold text-amber-200">
              Continuar con discipulado
            </Link>
          </article>
        </div>
      </div>
    </section>
  )
}
