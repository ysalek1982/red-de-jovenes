import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { CheckCircle2, MessageCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  completeDiscipleshipStep,
  getActiveTracks,
  getMyDiscipleshipProgress,
  type TrackWithSteps,
} from '../features/discipleship/discipleshipService'
import { createPost } from '../features/community/communityService'
import { useAuth } from '../features/auth/useAuth'
import type { DiscipleshipProgress } from '../types/database'

export function DiscipleshipPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [tracks, setTracks] = useState<TrackWithSteps[]>([])
  const [progress, setProgress] = useState<DiscipleshipProgress[]>([])
  const [selectedTrackId, setSelectedTrackId] = useState('')
  const [reflection, setReflection] = useState('')
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const [trackData, progressData] = await Promise.all([
        getActiveTracks(),
        getMyDiscipleshipProgress(userId),
      ])
      setTracks(trackData)
      setProgress(progressData)
      setSelectedTrackId((current) => current || trackData[0]?.id || '')
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

  const selectedTrack = tracks.find((track) => track.id === selectedTrackId)
  const completed = new Set(progress.map((item) => item.step_id))
  const steps = useMemo(
    () =>
      [...(selectedTrack?.discipleship_steps ?? [])].sort(
        (a, b) => a.day_number - b.day_number,
      ),
    [selectedTrack],
  )
  const nextStep = steps.find((step) => !completed.has(step.id)) ?? steps[0]
  const completedCount = steps.filter((step) => completed.has(step.id)).length

  async function handleCompleteStep() {
    if (!userId || !selectedTrack || !nextStep) return
    await completeDiscipleshipStep({
      userId,
      trackId: selectedTrack.id,
      stepId: nextStep.id,
    })
    setStatus('Paso marcado como completado.')
    await loadData()
  }

  async function handleShare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId || !reflection.trim() || !nextStep) return
    await createPost({
      userId,
      body: reflection,
      verseReference: nextStep.verse_reference ?? undefined,
    })
    setReflection('')
    setStatus('Aprendizaje compartido en Foros.')
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-32 pt-32 text-white">
      <div className="section-shell">
        <div>
          <p className="text-sm font-semibold text-amber-200">Discipulado</p>
          <h1 className="mt-2 text-4xl font-black">Crece paso a paso</h1>
          <p className="mt-3 max-w-2xl text-white/62">
            Caminos cortos para afirmar tu fe, practicar la Palabra y compartir lo aprendido.
          </p>
        </div>
        {status ? <p className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-semibold text-emerald-100">{status}</p> : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-3">
            {isLoading ? <p className="text-white/60">Cargando caminos...</p> : null}
            {tracks.map((track) => (
              <button
                type="button"
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`w-full rounded-[1.5rem] border p-5 text-left transition ${
                  selectedTrackId === track.id
                    ? 'border-amber-300/30 bg-amber-300/10'
                    : 'border-white/10 bg-white/[0.06] hover:bg-white/10'
                }`}
              >
                <h2 className="font-black">{track.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">{track.description}</p>
                <p className="mt-3 text-xs font-bold text-amber-200">{track.duration_days} dias · {track.level}</p>
              </button>
            ))}
          </aside>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            {selectedTrack && nextStep ? (
              <>
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-200">
                      {completedCount}/{steps.length} pasos completados
                    </p>
                    <h2 className="mt-2 text-3xl font-black">{nextStep.title}</h2>
                  </div>
                  <Sparkles className="h-8 w-8 text-amber-200" />
                </div>
                <p className="mt-5 text-sm font-bold text-amber-200">
                  Dia {nextStep.day_number} · {nextStep.verse_reference}
                </p>
                <p className="mt-4 text-lg leading-8 text-white/75">{nextStep.content}</p>
                <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-5">
                  <p className="text-sm font-semibold text-white">Accion practica</p>
                  <p className="mt-2 text-sm leading-6 text-white/62">{nextStep.action_step}</p>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void handleCompleteStep()} className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950">
                    <CheckCircle2 className="h-4 w-4" /> Completar paso
                  </button>
                  <Link to="/app/oracion" className="inline-flex h-11 items-center rounded-full border border-white/10 px-5 text-sm font-bold text-white">
                    Pedir oracion
                  </Link>
                </div>
                <form onSubmit={(event) => void handleShare(event)} className="mt-6">
                  <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} rows={3} placeholder="Comparte un aprendizaje con la Red" className="w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none focus:border-amber-200" />
                  <button type="submit" className="mt-3 inline-flex h-11 items-center gap-2 rounded-full bg-emerald-200 px-5 text-sm font-black text-slate-950">
                    <MessageCircle className="h-4 w-4" /> Compartir
                  </button>
                </form>
              </>
            ) : (
              <p className="text-white/60">Aun no hay caminos activos de discipulado.</p>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}
