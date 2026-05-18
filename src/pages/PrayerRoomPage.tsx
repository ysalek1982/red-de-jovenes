import type { FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle2,
  Flag,
  Heart,
  Loader2,
  Send,
  Trash2,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { useAuth } from '../features/auth/useAuth'
import {
  createPrayerRequest,
  deleteOwnPrayerRequest,
  getPublicPrayerRequests,
  markPrayerRequestAnswered,
  removePrayerSupport,
  supportPrayer,
  type PrayerRequestWithAuthor,
} from '../features/prayer/prayerService'
import { createContentReport } from '../features/safety/safetyService'

const prayerCategories = [
  ['familia', 'Familia'],
  ['salud', 'Salud'],
  ['estudios', 'Estudios'],
  ['trabajo', 'Trabajo'],
  ['fe', 'Fe'],
  ['agradecimiento', 'Agradecimiento'],
  ['otro', 'Otro'],
]

function formatDate(value: string | null) {
  if (!value) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getAuthor(prayer: PrayerRequestWithAuthor) {
  if (prayer.is_anonymous) return 'Joven de la Red'
  return prayer.profiles?.full_name || 'Joven de la Red'
}

export function PrayerRoomPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [prayers, setPrayers] = useState<PrayerRequestWithAuthor[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('otro')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [answeredTestimony, setAnsweredTestimony] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyPrayerId, setBusyPrayerId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'answered' | 'mine' | 'supporting'
  >('all')
  const [error, setError] = useState('')

  const loadPrayers = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError('')
    try {
      const prayerData = await getPublicPrayerRequests(userId)
      setPrayers(prayerData)
    } catch {
      setError('No pudimos cargar la sala de oración.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPrayers()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadPrayers])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !title.trim() || !body.trim()) return

    setIsSubmitting(true)
    setError('')
    try {
      await createPrayerRequest({
        userId: user.id,
        title: title.trim(),
        body: body.trim(),
        category,
        isAnonymous,
      })
      setTitle('')
      setBody('')
      setCategory('otro')
      setIsAnonymous(false)
      await loadPrayers(false)
    } catch {
      setError('No pudimos publicar tu petición de oración.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleMarkAnswered(prayerId: string) {
    if (!user) return
    setBusyPrayerId(prayerId)
    setError('')
    try {
      await markPrayerRequestAnswered({
        prayerId,
        userId: user.id,
        answeredTestimony: answeredTestimony[prayerId]?.trim(),
      })
      await loadPrayers(false)
    } catch {
      setError('Solo puedes marcar como respondidas tus propias peticiones.')
    } finally {
      setBusyPrayerId(null)
    }
  }

  async function handleDelete(prayerId: string) {
    if (!user) return
    setBusyPrayerId(prayerId)
    setError('')
    try {
      await deleteOwnPrayerRequest({ prayerId, userId: user.id })
      await loadPrayers(false)
    } catch {
      setError('Solo puedes eliminar tus propias peticiones.')
    } finally {
      setBusyPrayerId(null)
    }
  }

  async function handlePrayerSupport(prayer: PrayerRequestWithAuthor) {
    if (!user) return
    setBusyPrayerId(prayer.id)
    setError('')
    try {
      if (prayer.supportedByMe) {
        await removePrayerSupport({ prayerId: prayer.id, userId: user.id })
      } else {
        await supportPrayer({ prayerId: prayer.id, userId: user.id })
      }
      await loadPrayers(false)
    } catch {
      setError('No pudimos actualizar tu oración por esta petición.')
    } finally {
      setBusyPrayerId(null)
    }
  }

  async function handleReportPrayer(prayerId: string) {
    if (!user) return

    setBusyPrayerId(prayerId)
    setError('')
    try {
      await createContentReport({
        reporterId: user.id,
        targetType: 'prayer_request',
        targetId: prayerId,
        reason: 'Revisión pastoral solicitada',
      })
      setError('Reporte enviado para revisión. Gracias por cuidar la sala.')
    } catch {
      setError('No pudimos enviar el reporte.')
    } finally {
      setBusyPrayerId(null)
    }
  }

  const visiblePrayers = prayers.filter((prayer) => {
    if (statusFilter === 'active') return !prayer.is_answered
    if (statusFilter === 'answered') return prayer.is_answered
    if (statusFilter === 'mine') return prayer.user_id === userId
    if (statusFilter === 'supporting') return prayer.supportedByMe
    return true
  })
  const activePrayers = prayers.filter((prayer) => !prayer.is_answered).length
  const totalSupports = prayers.reduce(
    (total, prayer) => total + prayer.supportsCount,
    0,
  )

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed left-0 top-24 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur md:p-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200">
              <Heart className="h-4 w-4" aria-hidden="true" />
              Sala de oración global
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
              Ora con otros jóvenes.
            </h1>
            <p className="mt-4 text-white/65">
              Comparte una petición y permite que la comunidad camine contigo
              en oración.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4">
                <p className="text-3xl font-black">{totalSupports}</p>
                <p className="mt-1 text-sm text-white/60">
                  apoyos de oración registrados
                </p>
              </div>
              <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 p-4">
                <p className="text-sm font-bold text-amber-200">
                  {activePrayers} peticiones activas
                </p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Inhala Su paz · sostén Su nombre · exhala tu carga.
                </p>
              </div>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <label className="text-sm font-semibold" htmlFor="prayerTitle">
                  Título
                </label>
                <Input
                  id="prayerTitle"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Necesito oración por..."
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="prayerBody">
                  Petición
                </label>
                <Textarea
                  id="prayerBody"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Comparte lo necesario para que podamos orar contigo."
                  className="mt-2"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div>
                  <label className="text-sm font-semibold" htmlFor="prayerCategory">
                    Categoria
                  </label>
                  <select
                    id="prayerCategory"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-100"
                  >
                    {prayerCategories.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="mt-7 flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.06] px-4 text-sm font-semibold text-white/75">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(event) => setIsAnonymous(event.target.checked)}
                    className="h-4 w-4 accent-amber-300"
                  />
                  Mostrar anonima
                </label>
              </div>
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !title.trim() || !body.trim()}
              >
                <Send className="h-5 w-5" aria-hidden="true" />
                {isSubmitting ? 'Publicando...' : 'Publicar petición'}
              </Button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Peticiones públicas
                </p>
                <h2 className="mt-2 text-3xl font-black">En oración</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-white/60">
                {prayers.length} peticiones públicas
              </span>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                ['all', 'Todas'],
                ['active', 'En oración'],
                ['answered', 'Respondidas'],
                ['mine', 'Mias'],
                ['supporting', 'Estoy orando'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setStatusFilter(
                      value as
                        | 'all'
                        | 'active'
                        | 'answered'
                        | 'mine'
                        | 'supporting',
                    )
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    statusFilter === value
                      ? 'border-amber-300/30 bg-amber-300/15 text-amber-100'
                      : 'border-white/10 bg-white/[0.05] text-white/55 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <article className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
              <p className="text-sm font-bold text-amber-200">Oración del día</p>
              <p className="mt-3 leading-7 text-white/70">
                Padre, hoy entrego mis cargas. Llena mi corazón de Tu paz, mis
                labios de Tu nombre y mis manos de Tu obra. En el nombre de
                Jesús, amén.
              </p>
              <p className="mt-3 text-sm font-semibold text-emerald-300">
                Oración sugerida para acompañar la sala.
              </p>
            </article>

            {error ? (
              <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-8 flex items-center gap-3 text-white/65">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Cargando peticiones...
              </div>
            ) : visiblePrayers.length ? (
              <div className="mt-6 grid gap-4">
                {visiblePrayers.map((prayer) => {
                  const isOwner = prayer.user_id === user?.id
                  return (
                    <article
                      key={prayer.id}
                      className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                            {getAuthor(prayer)} · {formatDate(prayer.created_at)}
                          </p>
                          <h3 className="mt-2 text-xl font-bold">{prayer.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                            {prayer.is_answered ? 'Respondida' : 'En oración'}
                          </span>
                          <span className="w-fit rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-100">
                            {prayer.supportsCount} orando
                          </span>
                          <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                            {prayerCategories.find(([value]) => value === prayer.category)?.[1] ??
                              'Otro'}
                          </span>
                        </div>
                      </div>
                      <p className="mt-4 leading-7 text-white/65">{prayer.body}</p>
                      {prayer.answered_testimony ? (
                        <div className="mt-4 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm leading-6 text-emerald-50">
                          Testimonio: {prayer.answered_testimony}
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <Button
                          type="button"
                          variant={prayer.supportedByMe ? 'secondary' : 'accent'}
                          size="sm"
                          onClick={() => void handlePrayerSupport(prayer)}
                          disabled={busyPrayerId === prayer.id}
                        >
                          <Heart className="h-4 w-4" aria-hidden="true" />
                          {prayer.supportedByMe ? 'Ya estoy orando' : 'Estoy orando'}
                        </Button>
                        {isOwner ? (
                          <>
                          {!prayer.is_answered ? (
                            <div className="flex min-w-52 flex-col gap-2">
                              <Input
                                value={answeredTestimony[prayer.id] ?? ''}
                                onChange={(event) =>
                                  setAnsweredTestimony((current) => ({
                                    ...current,
                                    [prayer.id]: event.target.value,
                                  }))
                                }
                                placeholder="Testimonio breve, opcional"
                              />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => void handleMarkAnswered(prayer.id)}
                              disabled={busyPrayerId === prayer.id}
                            >
                              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                              Marcar respondida
                            </Button>
                            </div>
                          ) : null}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => void handleDelete(prayer.id)}
                            disabled={busyPrayerId === prayer.id}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Eliminar
                          </Button>
                          </>
                        ) : null}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void handleReportPrayer(prayer.id)}
                          disabled={busyPrayerId === prayer.id}
                        >
                          <Flag className="h-4 w-4" aria-hidden="true" />
                          Reportar
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-8 text-center text-white/60">
                Todavía no hay peticiones públicas. Puedes ser el primero en
                compartir una necesidad de oración.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
