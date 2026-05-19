import { useCallback, useEffect, useMemo, useState } from 'react'
import { BookMarked, CheckCircle2, Copy, MessageCircle, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  bibleReadingPlans,
  bibleReadingSamples,
  createHighlight,
  getMyHighlights,
  getMyReadingProgress,
  getMySavedVerses,
  markReadingDayComplete,
  saveVerse,
  verseOfTheMoment,
} from '../features/bible/bibleService'
import { createPost } from '../features/community/communityService'
import { useAuth } from '../features/auth/useAuth'
import type {
  BibleHighlight,
  BibleReadingProgress,
  BibleSavedVerse,
} from '../types/database'

export function BiblePage() {
  const { user } = useAuth()
  const userId = user?.id
  const [saved, setSaved] = useState<BibleSavedVerse[]>([])
  const [progress, setProgress] = useState<BibleReadingProgress[]>([])
  const [highlights, setHighlights] = useState<BibleHighlight[]>([])
  const [selectedPlan, setSelectedPlan] = useState(bibleReadingPlans[0].key)
  const [note, setNote] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const sample = useMemo(
    () =>
      bibleReadingSamples.find((item) => item.planKey === selectedPlan) ??
      bibleReadingSamples[0],
    [selectedPlan],
  )
  const currentPlan = bibleReadingPlans.find((plan) => plan.key === selectedPlan)
  const completedSet = new Set(progress.map((item) => `${item.plan_key}:${item.day_number}`))

  const loadData = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const [savedData, progressData, highlightData] = await Promise.all([
        getMySavedVerses(userId),
        getMyReadingProgress(userId),
        getMyHighlights(userId),
      ])
      setSaved(savedData)
      setProgress(progressData)
      setHighlights(highlightData)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  async function handleSaveVerse() {
    if (!userId) return
    await saveVerse({
      userId,
      reference: verseOfTheMoment.reference,
      verseText: verseOfTheMoment.text,
      note,
    })
    setStatus('Versiculo guardado en tu Biblia.')
    setNote('')
    await loadData()
  }

  async function handleCompleteDay() {
    if (!userId) return
    await markReadingDayComplete({
      userId,
      planKey: selectedPlan,
      dayNumber: sample.dayNumber,
    })
    setStatus('Lectura marcada como completada.')
    await loadData()
  }

  async function handleHighlight() {
    if (!userId) return
    await createHighlight({
      userId,
      reference: sample.reference,
      highlightText: sample.excerpt,
      note: 'Subrayado desde lectura de hoy.',
    })
    setStatus('Fragmento subrayado.')
    await loadData()
  }

  async function handleShareInForum() {
    if (!userId) return
    await createPost({
      userId,
      body: `Hoy estoy meditando en ${verseOfTheMoment.reference}: ${verseOfTheMoment.note}`,
      verseReference: verseOfTheMoment.reference,
      verseText: verseOfTheMoment.text,
    })
    setStatus('Compartido en Foros con la Palabra.')
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(
      `${verseOfTheMoment.text} - ${verseOfTheMoment.reference}`,
    )
    setStatus('Versiculo copiado.')
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-32 pt-32 text-white">
      <div className="section-shell">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-sm font-semibold text-amber-100">Biblia</p>
            <h1 className="mt-3 text-4xl font-black">Versiculo del momento</h1>
            <p className="mt-5 text-2xl leading-10 text-white">
              "{verseOfTheMoment.text}"
            </p>
            <p className="mt-3 font-bold text-amber-200">
              {verseOfTheMoment.reference}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/65">
              {verseOfTheMoment.note}
            </p>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              placeholder="Agrega una nota personal opcional"
              className="mt-6 w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-amber-200"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleSaveVerse()} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950">
                <Save className="h-4 w-4" /> Guardar
              </button>
              <button type="button" onClick={() => void handleShareInForum()} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white">
                <MessageCircle className="h-4 w-4" /> Compartir
              </button>
              <button type="button" onClick={() => void handleCopy()} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 px-5 text-sm font-bold text-white">
                <Copy className="h-4 w-4" /> Copiar
              </button>
            </div>
            {status ? <p className="mt-4 text-sm font-semibold text-emerald-200">{status}</p> : null}
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <p className="text-sm font-semibold text-emerald-200">Lectura de hoy</p>
            <h2 className="mt-2 text-2xl font-black">{currentPlan?.title}</h2>
            <select
              value={selectedPlan}
              onChange={(event) => setSelectedPlan(event.target.value)}
              className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm font-semibold text-white"
            >
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
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <h2 className="text-2xl font-black">Versiculos guardados</h2>
            <div className="mt-5 space-y-3">
              {isLoading ? <p className="text-white/60">Cargando...</p> : null}
              {!isLoading && !saved.length ? (
                <p className="text-sm text-white/60">Guarda tu primer versiculo para volver a el durante la semana.</p>
              ) : null}
              {saved.map((item) => (
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
              {!highlights.length ? (
                <p className="text-sm text-white/60">Subraya fragmentos breves que quieras recordar.</p>
              ) : null}
              {highlights.map((item) => (
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
