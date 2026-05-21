import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { CalendarDays, MapPin, UsersRound } from 'lucide-react'
import {
  cancelEventRsvp,
  createEvent,
  getUpcomingEvents,
  setEventRsvp,
  type EventWithRsvps,
} from '../features/events/eventService'
import { hasRole } from '../features/auth/roleService'
import { useAuth } from '../features/auth/useAuth'

export function EventsPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [events, setEvents] = useState<EventWithRsvps[]>([])
  const [filter, setFilter] = useState('todos')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [weekLimit] = useState(() => Date.now() + 7 * 86_400_000)
  const [form, setForm] = useState({
    title: '',
    description: '',
    modality: 'presencial',
    city: '',
    country: '',
    startsAt: '',
  })

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      setEvents(await getUpcomingEvents(userId))
      setIsAdmin(await hasRole('admin'))
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadEvents()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadEvents])

  const filteredEvents = useMemo(() => {
    if (filter === 'online') return events.filter((event) => event.modality === 'online')
    if (filter === 'esta-semana') {
      return events.filter((event) => new Date(event.starts_at).getTime() <= weekLimit)
    }
    if (filter === 'confirmados') return events.filter((event) => event.myRsvp)
    return events
  }, [events, filter, weekLimit])

  async function handleRsvp(event: EventWithRsvps) {
    if (!userId) return
    if (event.myRsvp) {
      await cancelEventRsvp({ eventId: event.id, userId })
      setStatus('Asistencia cancelada.')
    } else {
      await setEventRsvp({ eventId: event.id, userId, status: 'going' })
      setStatus('Confirmaste tu asistencia.')
    }
    await loadEvents()
  }

  async function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId || !form.title.trim() || !form.startsAt) return
    await createEvent({
      userId,
      title: form.title,
      description: form.description,
      modality: form.modality,
      city: form.city,
      country: form.country,
      startsAt: new Date(form.startsAt).toISOString(),
    })
    setStatus('Evento creado.')
    setForm({ title: '', description: '', modality: 'presencial', city: '', country: '', startsAt: '' })
    await loadEvents()
  }

  return (
    <section className="app-page">
      <div className="section-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-200">Eventos</p>
            <h1 className="mt-2 text-4xl font-black">Encuentros de la Red</h1>
            <p className="mt-3 max-w-2xl text-white/62">Reuniones, estudios, juegos y momentos de oracion para crecer juntos.</p>
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="app-select w-fit rounded-full">
            <option value="todos">Todos</option>
            <option value="online">Online</option>
            <option value="esta-semana">Esta semana</option>
            <option value="confirmados">Mis confirmados</option>
          </select>
        </div>
        {status ? <p className="app-alert mt-5">{status}</p> : null}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {isLoading ? <p className="text-white/60">Cargando eventos...</p> : null}
          {!isLoading && !filteredEvents.length ? (
            <div className="app-empty">Aun no hay eventos para este filtro. Pronto la Red tendra mas encuentros.</div>
          ) : null}
          {filteredEvents.map((event) => (
            <article key={event.id} className="app-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="inline-flex rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-amber-100">{event.modality}</p>
                  <h2 className="mt-4 text-2xl font-black">{event.title}</h2>
                </div>
                <CalendarDays className="h-7 w-7 text-amber-200" />
              </div>
              <p className="mt-4 text-sm leading-6 text-white/65">{event.description || 'Encuentro comunitario de Red de Jovenes.'}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white/60">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"><MapPin className="h-3 w-3" /> {event.city || 'Online'} {event.country ? `- ${event.country}` : ''}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"><UsersRound className="h-3 w-3" /> {event.rsvpCount} confirmados</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-emerald-200">{new Date(event.starts_at).toLocaleString('es-BO')}</p>
              <button type="button" onClick={() => void handleRsvp(event)} className="app-button-primary mt-5">
                {event.myRsvp ? 'Cancelar asistencia' : 'Confirmar asistencia'}
              </button>
            </article>
          ))}
        </div>
        {isAdmin ? (
          <form onSubmit={(event) => void handleCreateEvent(event)} className="app-card mt-8">
            <h2 className="text-2xl font-black">Crear evento</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Titulo" className="app-input" />
              <input type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} className="app-input" />
              <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Ciudad" className="app-input" />
              <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} placeholder="Pais" className="app-input" />
            </div>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Descripcion" rows={3} className="app-input mt-3" />
            <button type="submit" className="app-button-primary mt-4 bg-emerald-200 hover:bg-emerald-100">Crear</button>
          </form>
        ) : null}
      </div>
    </section>
  )
}
