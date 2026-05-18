import type { FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  CheckCircle2,
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
  type PrayerRequestWithAuthor,
} from '../features/prayer/prayerService'

function formatDate(value: string | null) {
  if (!value) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getAuthor(prayer: PrayerRequestWithAuthor) {
  return prayer.profiles?.full_name || 'Joven de la Red'
}

export function PrayerRoomPage() {
  const { user } = useAuth()
  const [prayers, setPrayers] = useState<PrayerRequestWithAuthor[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyPrayerId, setBusyPrayerId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadPrayers = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError('')
    try {
      const prayerData = await getPublicPrayerRequests()
      setPrayers(prayerData)
    } catch {
      setError('No pudimos cargar la sala de oración.')
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      })
      setTitle('')
      setBody('')
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
      await markPrayerRequestAnswered({ prayerId, userId: user.id })
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
                {prayers.length} peticiones
              </span>
            </div>

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
            ) : prayers.length ? (
              <div className="mt-6 grid gap-4">
                {prayers.map((prayer) => {
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
                        <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/70">
                          {prayer.is_answered ? 'Respondida' : 'En oración'}
                        </span>
                      </div>
                      <p className="mt-4 leading-7 text-white/65">{prayer.body}</p>

                      {isOwner ? (
                        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                          {!prayer.is_answered ? (
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
                        </div>
                      ) : null}
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
