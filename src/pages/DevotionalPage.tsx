import { useCallback, useEffect, useState } from 'react'
import {
  BookMarked,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Sparkles,
  Sun,
} from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'
import {
  getDevotionalProgress,
  getReadDevotionalsCount,
  getRecentDevotionals,
  getTodayDevotional,
  markDevotionalRead,
  toggleDevotionalFavorite,
} from '../features/devotionals/devotionalService'
import type { Devotional } from '../types/database'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`))
}

export function DevotionalPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [recentDevotionals, setRecentDevotionals] = useState<Devotional[]>([])
  const [isRead, setIsRead] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [readCount, setReadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProgress, setIsSavingProgress] = useState(false)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const loadDevotional = useCallback(async () => {
    setIsLoading(true)
    setError('')
    setActionMessage('')
    try {
      const [todayData, recentData] = await Promise.all([
        getTodayDevotional(),
        getRecentDevotionals(),
      ])
      setDevotional(todayData)
      setRecentDevotionals(recentData)

      if (userId && todayData) {
        const [progress, totalReads] = await Promise.all([
          getDevotionalProgress(userId, todayData.id),
          getReadDevotionalsCount(userId),
        ])
        setIsRead(progress.isRead)
        setIsFavorite(progress.isFavorite)
        setReadCount(totalReads)
      }
    } catch {
      setError('No pudimos cargar el devocional diario.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDevotional()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadDevotional])

  async function handleMarkAsRead() {
    if (!userId || !devotional || isRead) return

    setIsSavingProgress(true)
    setActionMessage('')
    try {
      await markDevotionalRead({
        userId,
        devotionalId: devotional.id,
      })
      setIsRead(true)
      setReadCount((currentCount) => currentCount + 1)
      setActionMessage('Devocional marcado como leído.')
    } catch {
      setActionMessage('No pudimos guardar tu progreso. Inténtalo nuevamente.')
    } finally {
      setIsSavingProgress(false)
    }
  }

  async function handleToggleFavorite() {
    if (!userId || !devotional) return

    setIsSavingProgress(true)
    setActionMessage('')
    try {
      await toggleDevotionalFavorite({
        userId,
        devotionalId: devotional.id,
        isFavorite,
      })
      setIsFavorite((currentValue) => !currentValue)
      setActionMessage(
        isFavorite
          ? 'Devocional quitado de guardados.'
          : 'Devocional guardado para volver a leerlo.',
      )
    } catch {
      setActionMessage('No pudimos actualizar tus guardados.')
    } finally {
      setIsSavingProgress(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed left-1/2 top-24 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <Sun className="h-4 w-4" aria-hidden="true" />
              Devocional diario
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
              Un versículo, una reflexión, un paso.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/65">
              Empieza el día con la Palabra antes que con el ruido.
            </p>
          </div>

          {error ? (
            <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              {error}
            </div>
          ) : null}

          {isLoading ? (
            <div className="mt-12 flex items-center justify-center gap-3 text-white/65">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Cargando devocional...
            </div>
          ) : devotional ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <article className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.07] p-7 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
                <div className="absolute right-0 top-0 h-52 w-52 rounded-full bg-amber-300/10 blur-3xl" />
                <div className="relative">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-semibold text-amber-200">
                      <CalendarDays className="h-4 w-4" aria-hidden="true" />
                      {formatDate(devotional.devotional_date)}
                    </span>
                    <Sparkles className="h-6 w-6 text-amber-200" aria-hidden="true" />
                  </div>

                  <h2 className="mt-8 text-3xl font-black tracking-tight md:text-5xl">
                    {devotional.title}
                  </h2>
                  <blockquote className="mt-8 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
                    <p className="text-xl font-semibold leading-8 text-white md:text-2xl">
                      “{devotional.verse_text}”
                    </p>
                    <p className="mt-4 font-bold text-amber-200">
                      {devotional.verse_reference}
                    </p>
                  </blockquote>
                  <p className="mt-8 text-lg leading-8 text-white/70">
                    {devotional.reflection}
                  </p>
                  <div className="mt-8 rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5">
                    <h3 className="font-bold text-emerald-100">Reflexión guiada</h3>
                    <ol className="mt-3 space-y-2 text-sm leading-6 text-white/70">
                      <li>1. ¿Qué me dice este pasaje sobre quién es Dios?</li>
                      <li>2. ¿Qué me dice sobre quién soy yo en Cristo?</li>
                      <li>3. ¿Qué paso concreto puedo dar hoy en obediencia?</li>
                    </ol>
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleMarkAsRead}
                      disabled={isSavingProgress || isRead}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:bg-amber-300/50"
                    >
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      {isRead ? 'Leído hoy' : 'Marcar como leído'}
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleFavorite}
                      disabled={isSavingProgress}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <BookMarked className="h-4 w-4" aria-hidden="true" />
                      {isFavorite ? 'Guardado' : 'Guardar'}
                    </button>
                  </div>
                  {actionMessage ? (
                    <p className="mt-4 text-sm font-semibold text-emerald-200">
                      {actionMessage}
                    </p>
                  ) : null}
                </div>
              </article>

              <aside className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <h2 className="text-2xl font-bold">Progreso espiritual</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Tu caminar diario se construye con pasos pequeños y fieles.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-3xl font-black text-amber-200">{readCount}</p>
                      <p className="mt-1 text-xs font-semibold uppercase text-white/45">
                        Devocionales leídos
                      </p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                      <p className="text-3xl font-black text-emerald-200">
                        {isFavorite ? 'Sí' : 'No'}
                      </p>
                      <p className="mt-1 text-xs font-semibold uppercase text-white/45">
                        Guardado hoy
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <h2 className="text-2xl font-bold">¿Cómo está tu corazón hoy?</h2>
                  <p className="mt-2 text-sm text-white/60">
                    Dios conoce tu estado y te encuentra ahí.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {['Gozo', 'Paz', 'Ansiedad', 'Gratitud', 'Duda', 'Esperanza'].map(
                      (mood) => (
                        <button
                          key={mood}
                          type="button"
                          className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                        >
                          {mood}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-emerald-300" aria-hidden="true" />
                    <h2 className="text-2xl font-bold">Historial breve</h2>
                  </div>
                  <div className="mt-6 space-y-3">
                    {recentDevotionals.length ? (
                      recentDevotionals.map((item) => (
                        <article
                          key={item.id}
                          className="rounded-3xl border border-white/10 bg-slate-950/45 p-4"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                            {formatDate(item.devotional_date)}
                          </p>
                          <h3 className="mt-2 font-bold">{item.title}</h3>
                          <p className="mt-2 text-sm text-amber-200">
                            {item.verse_reference}
                          </p>
                        </article>
                      ))
                    ) : (
                      <p className="text-sm text-white/60">
                        Aún no hay devocionales recientes.
                      </p>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.05] p-8 text-center text-white/60">
              Aún no hay devocionales disponibles.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
