import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  BookMarked,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Copy,
  MessageCircle,
  RefreshCw,
  Save,
  Search,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  bibleReadingPlans,
  bibleReadingSamples,
  createHighlight,
  getActiveBibleTranslations,
  getBibleBooks,
  getBibleChapter,
  getBibleReadingPlans,
  getDailyBibleVerse,
  getMyHighlights,
  getMyBiblePlanProgress,
  getMyReadingProgress,
  getMySavedVerses,
  getRandomBibleVerse,
  markBiblePlanDayComplete,
  markReadingDayComplete,
  saveVerse,
  searchBibleVerses,
  type BibleDailyVerseResult,
  type BibleReadingPlanWithDays,
  type BibleSearchResult,
  type BibleVerseResult,
} from '../features/bible/bibleService'
import { createPost } from '../features/community/communityService'
import { generateAiContent } from '../features/ai/aiService'
import { useAuth } from '../features/auth/useAuth'
import { scrollElementIntoView } from '../lib/scroll'
import type {
  BibleBook,
  BibleHighlight,
  BiblePlanProgress,
  BibleReadingProgress,
  BibleSavedVerse,
  BibleTranslation,
} from '../types/database'

export function BiblePage() {
  const { user } = useAuth()
  const userId = user?.id
  const pageTopRef = useRef<HTMLElement>(null)
  const readerRef = useRef<HTMLElement>(null)
  const chapterListRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const [translations, setTranslations] = useState<BibleTranslation[]>([])
  const [books, setBooks] = useState<BibleBook[]>([])
  const [chapterVerses, setChapterVerses] = useState<BibleVerseResult[]>([])
  const [searchResults, setSearchResults] = useState<BibleSearchResult[]>([])
  const [dailyVerse, setDailyVerse] = useState<BibleDailyVerseResult | null>(null)
  const [randomVerse, setRandomVerse] = useState<BibleVerseResult | null>(null)
  const [saved, setSaved] = useState<BibleSavedVerse[]>([])
  const [progress, setProgress] = useState<BibleReadingProgress[]>([])
  const [dbPlans, setDbPlans] = useState<BibleReadingPlanWithDays[]>([])
  const [dbPlanProgress, setDbPlanProgress] = useState<BiblePlanProgress[]>([])
  const [highlights, setHighlights] = useState<BibleHighlight[]>([])
  const [selectedTranslation, setSelectedTranslation] = useState('RVR1909')
  const [selectedTestament, setSelectedTestament] = useState<'all' | 'old' | 'new'>('all')
  const [selectedBook, setSelectedBook] = useState('JHN')
  const [selectedChapter, setSelectedChapter] = useState(3)
  const [selectedPlan, setSelectedPlan] = useState(bibleReadingPlans[0].key)
  const [selectedPlanDayId, setSelectedPlanDayId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [note, setNote] = useState('')
  const [planNote, setPlanNote] = useState('')
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
  const currentDbPlan = dbPlans.find((plan) => plan.plan_key === selectedPlan)
  const currentDbDay =
    currentDbPlan?.bible_reading_plan_days.find((day) => day.id === selectedPlanDayId) ??
    currentDbPlan?.bible_reading_plan_days[0]
  const selectedBookMeta = books.find((book) => book.code === selectedBook)
  const visibleBooks = books.filter(
    (book) => selectedTestament === 'all' || book.testament === selectedTestament,
  )
  const completedSet = new Set(
    progress.map((item) => `${item.plan_key}:${item.day_number}`),
  )
  const completedDbDayIds = new Set(dbPlanProgress.map((item) => item.day_id))
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
        dailyData,
        savedData,
        progressData,
        planData,
        dbProgressData,
        highlightData,
      ] = await Promise.all([
        getActiveBibleTranslations(),
        getBibleBooks(),
        getRandomBibleVerse({ translationCode: selectedTranslation }),
        getDailyBibleVerse({ translationCode: selectedTranslation }),
        getMySavedVerses(userId),
        getMyReadingProgress(userId),
        getBibleReadingPlans(),
        getMyBiblePlanProgress(userId),
        getMyHighlights(userId),
      ])
      setTranslations(translationData)
      setBooks(bookData)
      setRandomVerse(randomData)
      setDailyVerse(dailyData)
      setSaved(savedData)
      setProgress(progressData)
      setDbPlans(planData)
      setDbPlanProgress(dbProgressData)
      if (planData.length && !planData.some((plan) => plan.plan_key === selectedPlan)) {
        setSelectedPlan(planData[0].plan_key)
        setSelectedPlanDayId(planData[0].bible_reading_plan_days[0]?.id ?? '')
      } else if (!selectedPlanDayId) {
        const activePlan = planData.find((plan) => plan.plan_key === selectedPlan)
        setSelectedPlanDayId(activePlan?.bible_reading_plan_days[0]?.id ?? '')
      }
      setHighlights(highlightData)
      await loadChapter()
    } catch {
      setError('No pudimos cargar la Biblia. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [loadChapter, selectedPlan, selectedPlanDayId, selectedTranslation, userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  function revealNode(target: HTMLElement | null, behavior: ScrollBehavior = 'auto') {
    window.requestAnimationFrame(() => {
      scrollElementIntoView(target, behavior)
    })
  }

  function revealReader() {
    chapterListRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    revealNode(readerRef.current)
  }

  async function handleRandomVerse() {
    setRandomVerse(
      await getRandomBibleVerse({ translationCode: selectedTranslation }),
    )
    setStatus('Versiculo actualizado.')
    revealNode(pageTopRef.current)
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setStatus('Escribe una palabra, frase o referencia para buscar.')
      return
    }
    const results = await searchBibleVerses({
      query: searchQuery.trim(),
      translationCode: selectedTranslation,
      bookCode: selectedBook || null,
    })
    setSearchResults(results)
    setStatus(results.length ? 'Busqueda completada.' : 'No encontramos resultados para esa busqueda.')
    revealNode(searchRef.current)
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

  async function handleCompleteDbPlanDay() {
    if (!userId || !currentDbPlan || !currentDbDay) return
    await markBiblePlanDayComplete({
      userId,
      planId: currentDbPlan.id,
      dayId: currentDbDay.id,
      note: planNote,
    })
    setStatus('Dia del plan marcado como completado.')
    setPlanNote('')
    setDbPlanProgress(await getMyBiblePlanProgress(userId))
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
      result?.text ||
        'Gemini no esta configurado todavia. La solicitud quedo registrada para revision.',
    )
    setStatus('Explicacion generada para revisar.')
    revealNode(aiRef.current, 'smooth')
  }

  async function handleBibleAiAction(
    actionType:
      | 'create_bible_reflection'
      | 'create_bible_group_question'
      | 'create_bible_prayer'
      | 'suggest_bible_forum_post',
    verse = activeVerse,
  ) {
    const result = await generateAiContent({
      actionType,
      prompt: `${verse.reference}: ${verse.verse_text}`,
    })
    setAiExplanation(
      result?.text ||
        'La IA aun no esta configurada por el administrador.',
    )
    setStatus('Sugerencia IA generada para revisar antes de compartir.')
    revealNode(aiRef.current, 'smooth')
  }

  async function handleLoadChapter() {
    await loadChapter()
    setStatus('Capitulo cargado.')
    revealReader()
  }

  async function handlePreviousChapter() {
    const currentBookIndex = books.findIndex((book) => book.code === selectedBook)
    if (selectedChapter > 1) {
      setSelectedChapter((current) => current - 1)
      revealReader()
      return
    }
    const previousBook = books[currentBookIndex - 1]
    if (previousBook) {
      setSelectedBook(previousBook.code)
      setSelectedChapter(previousBook.chapters_count)
      revealReader()
    }
  }

  async function handleNextChapter() {
    const currentBookIndex = books.findIndex((book) => book.code === selectedBook)
    const maxChapter = selectedBookMeta?.chapters_count ?? selectedChapter
    if (selectedChapter < maxChapter) {
      setSelectedChapter((current) => current + 1)
      revealReader()
      return
    }
    const nextBook = books[currentBookIndex + 1]
    if (nextBook) {
      setSelectedBook(nextBook.code)
      setSelectedChapter(1)
      revealReader()
    }
  }

  return (
    <section className="app-page">
      <div className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article ref={pageTopRef} className="app-card-accent">
            <p className="app-kicker">Biblia</p>
            <h1 data-page-title className="mt-3 text-4xl font-black">Versiculo del dia</h1>
            {dailyVerse ? (
              <div className="app-card-soft mt-5">
                <p className="text-2xl leading-10 text-white">
                  "{dailyVerse.verse_text}"
                </p>
                <p className="mt-3 font-bold text-amber-200">
                  {dailyVerse.reference}
                </p>
                {dailyVerse.devotional_hint ? (
                  <p className="mt-3 text-sm leading-6 text-white/60">
                    {dailyVerse.devotional_hint}
                  </p>
                ) : null}
              </div>
            ) : null}
            <h2 className="mt-8 text-2xl font-black">Versiculo aleatorio</h2>
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
              className="app-input mt-6"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleRandomVerse()} className="app-button-primary bg-emerald-200 hover:bg-emerald-100">
                <RefreshCw className="h-4 w-4" /> Otro versiculo
              </button>
              <button type="button" onClick={() => void handleSaveVerse()} className="app-button-primary">
                <Save className="h-4 w-4" /> Guardar
              </button>
              <button type="button" onClick={() => void handleShareInForum()} className="app-button-secondary">
                <MessageCircle className="h-4 w-4" /> Compartir
              </button>
              <button type="button" onClick={() => void handleCopy()} className="app-button-secondary">
                <Copy className="h-4 w-4" /> Copiar
              </button>
              <button type="button" onClick={() => void handleExplainVerse()} className="app-button-secondary border-emerald-300/20 bg-emerald-300/10 text-emerald-100">
                Explicar con IA
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleBibleAiAction('create_bible_reflection')} className="app-chip text-xs">
                <Sparkles className="h-4 w-4" /> Reflexion IA
              </button>
              <button type="button" onClick={() => void handleBibleAiAction('create_bible_group_question')} className="app-chip text-xs">
                Pregunta grupo
              </button>
              <button type="button" onClick={() => void handleBibleAiAction('create_bible_prayer')} className="app-chip text-xs">
                Oracion breve
              </button>
              <button type="button" onClick={() => void handleBibleAiAction('suggest_bible_forum_post')} className="app-chip text-xs">
                Post sugerido
              </button>
            </div>
            {aiExplanation ? (
              <div ref={aiRef} className="app-card-soft mt-4 text-sm leading-6 text-white/70">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                  Sugerido por IA · revisa antes de compartir
                </p>
                {aiExplanation}
              </div>
            ) : null}
            {status ? <p className="mt-4 text-sm font-semibold text-emerald-200">{status}</p> : null}
            {error ? <p className="mt-4 text-sm font-semibold text-amber-100">{error}</p> : null}
            {!saved.length && !progress.length ? (
              <div className="app-card-soft mt-5">
                <p className="text-sm font-black text-amber-200">
                  Primer paso en Biblia
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Empieza con el versiculo del dia, Juan 3 o Salmos 23. Guarda
                  una referencia que quieras recordar esta semana.
                </p>
              </div>
            ) : null}
          </article>

          <article ref={readerRef} className="app-card">
            <p className="text-sm font-semibold text-emerald-200">Leer por capitulo</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              <select value={selectedTranslation} onChange={(event) => { setSelectedTranslation(event.target.value); revealReader() }} className="app-select">
                {translations.map((translation) => (
                  <option key={translation.code} value={translation.code}>{translation.code}</option>
                ))}
              </select>
              <select value={selectedTestament} onChange={(event) => { setSelectedTestament(event.target.value as 'all' | 'old' | 'new'); revealReader() }} className="app-select">
                <option value="all">Toda</option>
                <option value="old">Antiguo</option>
                <option value="new">Nuevo</option>
              </select>
              <select value={selectedBook} onChange={(event) => { setSelectedBook(event.target.value); revealReader() }} className="app-select">
                {visibleBooks.map((book) => (
                  <option key={book.code} value={book.code}>{book.name}</option>
                ))}
              </select>
              <input type="number" min={1} max={selectedBookMeta?.chapters_count ?? 150} value={selectedChapter} onChange={(event) => { setSelectedChapter(Number(event.target.value)); revealReader() }} className="app-input h-11 py-0 font-semibold" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handlePreviousChapter()} className="app-button-secondary">
                <ChevronLeft className="h-4 w-4" /> Anterior
              </button>
              <button type="button" onClick={() => void handleLoadChapter()} className="app-button-primary">
                Cargar capitulo
              </button>
              <button type="button" onClick={() => void handleNextChapter()} className="app-button-secondary">
                Siguiente <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div ref={chapterListRef} data-scroll-root className="mt-5 max-h-96 space-y-3 overflow-y-auto pr-1">
              {isLoading ? <p className="text-white/60">Cargando Biblia...</p> : null}
              {!isLoading && !chapterVerses.length ? (
                <p className="app-empty text-left">
                  La Biblia completa todavia no fue importada. Ya puedes usar versiculos base y cargar una traduccion autorizada desde administracion.
                </p>
              ) : null}
              {chapterVerses.map((verse) => (
                <div key={verse.reference} className="app-card-soft">
                  <p className="text-xs font-bold text-amber-200">{verse.reference}</p>
                  <p className="mt-2 text-sm leading-6 text-white/75">{verse.verse_text}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => void handleSaveVerse(verse)} className="app-chip min-h-8 px-3 text-xs text-emerald-200">Guardar</button>
                    <button type="button" onClick={() => void handleHighlight(verse)} className="app-chip min-h-8 px-3 text-xs text-amber-200">Subrayar</button>
                    <button type="button" onClick={() => void handleCopy(verse)} className="app-chip min-h-8 px-3 text-xs">Copiar</button>
                    <button type="button" onClick={() => void handleExplainVerse(verse)} className="app-chip min-h-8 px-3 text-xs text-emerald-100">IA</button>
                    <button type="button" onClick={() => void handleShareInForum(verse)} className="app-chip min-h-8 px-3 text-xs">Foros</button>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        <article ref={searchRef} className="mt-6 rounded-2xl border border-sky-300/20 bg-sky-300/10 p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-sky-200" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-sky-100">Buscar en la Biblia</p>
              <h2 className="mt-1 text-2xl font-black">Palabra, frase o referencia</h2>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 lg:flex-row">
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void handleSearch()
              }}
              placeholder="Ej. amor, Juan 3:16, Salmo 23"
              className="app-input h-12 flex-1 py-0"
            />
            <button
              type="button"
              onClick={() => void handleSearch()}
              className="app-button-primary h-12"
            >
              <Search className="h-4 w-4" /> Buscar
            </button>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {searchResults.length ? null : (
              <p className="app-empty md:col-span-2">
                Busca en los versiculos importados. Si el corpus completo aun no
                fue cargado, los resultados se limitan a los versiculos base.
              </p>
            )}
            {searchResults.map((verse) => (
              <div key={`${verse.reference}-${verse.rank}`} className="app-card-soft">
                <p className="text-xs font-bold text-sky-200">{verse.reference}</p>
                <p className="mt-2 text-sm leading-6 text-white/75">{verse.verse_text}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void handleSaveVerse(verse)} className="app-chip min-h-8 px-3 text-xs text-emerald-200">Guardar</button>
                  <button type="button" onClick={() => void handleHighlight(verse)} className="app-chip min-h-8 px-3 text-xs text-amber-200">Subrayar</button>
                  <button type="button" onClick={() => void handleCopy(verse)} className="app-chip min-h-8 px-3 text-xs">Copiar</button>
                  <button type="button" onClick={() => void handleExplainVerse(verse)} className="app-chip min-h-8 px-3 text-xs text-emerald-100">Explicar IA</button>
                  <button type="button" onClick={() => void handleShareInForum(verse)} className="app-chip min-h-8 px-3 text-xs">Foros</button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <article className="app-card">
            <p className="text-sm font-semibold text-emerald-200">Lectura de hoy</p>
            <h2 className="mt-2 text-2xl font-black">
              {currentDbPlan?.title ?? currentPlan?.title}
            </h2>
            <select
              value={selectedPlan}
              onChange={(event) => {
                setSelectedPlan(event.target.value)
                const nextPlan = dbPlans.find((plan) => plan.plan_key === event.target.value)
                setSelectedPlanDayId(nextPlan?.bible_reading_plan_days[0]?.id ?? '')
              }}
              className="app-select mt-5"
            >
              {(dbPlans.length ? dbPlans : bibleReadingPlans).map((plan) => (
                <option key={'plan_key' in plan ? plan.plan_key : plan.key} value={'plan_key' in plan ? plan.plan_key : plan.key}>{plan.title}</option>
              ))}
            </select>
            {currentDbPlan ? (
              <select
                value={selectedPlanDayId}
                onChange={(event) => setSelectedPlanDayId(event.target.value)}
                className="app-select mt-3"
              >
                {currentDbPlan.bible_reading_plan_days.map((day) => (
                  <option key={day.id} value={day.id}>
                    Dia {day.day_number}: {day.title}
                  </option>
                ))}
              </select>
            ) : null}
            <div className="app-card-soft mt-5">
              <p className="text-sm font-bold text-amber-200">
                {currentDbDay?.reading_reference ?? sample.reference}
              </p>
              <p className="mt-3 text-lg leading-8 text-white/85">
                {currentDbDay?.title ?? sample.excerpt}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/60">
                {currentDbDay?.reflection_prompt ?? sample.action}
              </p>
            </div>
            {currentDbDay ? (
              <textarea
                value={planNote}
                onChange={(event) => setPlanNote(event.target.value)}
                rows={3}
                placeholder="Reflexion personal opcional"
                className="app-input mt-4"
              />
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => currentDbDay ? void handleCompleteDbPlanDay() : void handleCompleteDay()} className="app-button-primary bg-emerald-200 hover:bg-emerald-100">
                <CheckCircle2 className="h-4 w-4" /> Marcar leido
              </button>
              <button type="button" onClick={() => void handleHighlight()} className="app-button-secondary">
                <BookMarked className="h-4 w-4" /> Subrayar
              </button>
            </div>
            <p className="mt-4 text-sm text-white/55">
              {currentDbDay
                ? completedDbDayIds.has(currentDbDay.id)
                  ? 'Este dia del plan ya esta completado.'
                  : 'Marca este dia cuando hayas meditado la referencia.'
                : completedSet.has(`${selectedPlan}:${sample.dayNumber}`)
                ? 'Este dia ya esta completado.'
                : 'Marca la lectura cuando hayas meditado el fragmento.'}
            </p>
          </article>

          <article className="app-card">
            <h2 className="text-2xl font-black">Versiculos guardados</h2>
            <div className="mt-5 space-y-3">
              {!saved.length ? <p className="text-sm text-white/60">Guarda tu primer versiculo para volver a el durante la semana.</p> : null}
              {saved.slice(0, 8).map((item) => (
                <div key={item.id} className="app-card-soft">
                  <p className="font-bold text-amber-200">{item.reference}</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{item.verse_text}</p>
                  {item.note ? <p className="mt-2 text-xs text-white/45">{item.note}</p> : null}
                </div>
              ))}
            </div>
          </article>

          <article className="app-card">
            <h2 className="text-2xl font-black">Subrayados</h2>
            <div className="mt-5 space-y-3">
              {!highlights.length ? <p className="text-sm text-white/60">Subraya fragmentos breves que quieras recordar.</p> : null}
              {highlights.slice(0, 8).map((item) => (
                <div key={item.id} className="app-card-soft">
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
