import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AlertCircle, CalendarDays, MapPin, UsersRound } from 'lucide-react'
import {
  cancelEventRsvp,
  createEvent,
  getUpcomingEvents,
  setEventRsvp,
  updateEvent,
  type EventWithRsvps,
} from '../features/events/eventService'
import { hasRole } from '../features/auth/roleService'
import { useAuth } from '../features/auth/useAuth'
import { scrollElementIntoView } from '../lib/scroll'

function isPastEventDate(date: Date) {
  return date.getTime() < Date.now() - 60_000
}

function toDateTimeLocalInput(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offsetMs = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16)
}

const initialEventForm = {
  title: '',
  description: '',
  modality: 'presencial',
  city: '',
  country: '',
  startsAt: '',
}

export function EventsPage() {
  const { user } = useAuth()
  const userId = user?.id
  const listTopRef = useRef<HTMLDivElement>(null)
  const [events, setEvents] = useState<EventWithRsvps[]>([])
  const [filter, setFilter] = useState('todos')
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [busyEventId, setBusyEventId] = useState<string | null>(null)
  const [editingEventId, setEditingEventId] = useState<string | null>(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [weekLimit] = useState(() => Date.now() + 7 * 86_400_000)
  const [form, setForm] = useState(initialEventForm)

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [eventData, adminStatus] = await Promise.all([
        getUpcomingEvents(userId),
        hasRole('admin'),
      ])
      setEvents(eventData)
      setIsAdmin(adminStatus)
    } catch {
      setError('No pudimos cargar los eventos. Intenta nuevamente en un momento.')
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
  const confirmedEvents = events.filter((event) => event.myRsvp).length
  const onlineEvents = events.filter((event) => event.modality === 'online').length

  async function handleRsvp(event: EventWithRsvps) {
    if (!userId) {
      setError('Inicia sesión para confirmar asistencia a un evento.')
      return
    }
    setBusyEventId(event.id)
    setError('')
    setStatus('')
    try {
      if (event.myRsvp) {
        await cancelEventRsvp({ eventId: event.id, userId })
        setStatus('Asistencia cancelada.')
      } else {
        await setEventRsvp({ eventId: event.id, userId, status: 'going' })
        setStatus('Confirmaste tu asistencia.')
      }
      await loadEvents()
      window.requestAnimationFrame(() => scrollElementIntoView(listTopRef.current))
    } catch {
      setError('No pudimos actualizar tu asistencia. Intenta de nuevo.')
    } finally {
      setBusyEventId(null)
    }
  }

  function resetEventForm() {
    setForm(initialEventForm)
    setEditingEventId(null)
  }

  function handleEditEvent(event: EventWithRsvps) {
    setEditingEventId(event.id)
    setForm({
      title: event.title,
      description: event.description ?? '',
      modality: event.modality ?? 'presencial',
      city: event.city ?? '',
      country: event.country ?? '',
      startsAt: toDateTimeLocalInput(event.starts_at),
    })
    window.requestAnimationFrame(() => scrollElementIntoView(document.getElementById('crear-evento')))
  }

  async function handleDeactivateEvent(event: EventWithRsvps) {
    if (!window.confirm(`Desactivar "${event.title}"? Dejara de mostrarse, pero no se borrara.`)) {
      return
    }

    setBusyEventId(event.id)
    setError('')
    setStatus('')
    try {
      await updateEvent({
        eventId: event.id,
        title: event.title,
        description: event.description ?? '',
        modality: event.modality ?? 'presencial',
        city: event.city ?? '',
        country: event.country ?? '',
        startsAt: event.starts_at,
        isActive: false,
      })
      setStatus('Evento desactivado. No se borro ningun dato.')
      if (editingEventId === event.id) resetEventForm()
      await loadEvents()
    } catch {
      setError('No pudimos desactivar el evento. Intenta nuevamente.')
    } finally {
      setBusyEventId(null)
    }
  }

  async function handleEventSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId) {
      setError('Inicia sesión como administrador para crear eventos.')
      return
    }
    if (!form.title.trim() || !form.startsAt) {
      setError('Completa el título y la fecha del evento.')
      return
    }

    const startsAt = new Date(form.startsAt)
    if (Number.isNaN(startsAt.getTime())) {
      setError('La fecha del evento no es válida.')
      return
    }

    if (!editingEventId && isPastEventDate(startsAt)) {
      setError('Elige una fecha futura para el evento.')
      return
    }

    setIsCreating(true)
    setError('')
    setStatus('')
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        modality: form.modality,
        city: form.city.trim(),
        country: form.country.trim(),
        startsAt: startsAt.toISOString(),
      }

      if (editingEventId) {
        await updateEvent({
          eventId: editingEventId,
          ...payload,
          isActive: true,
        })
        setStatus('Evento actualizado y visible para la Red.')
      } else {
        await createEvent({
          userId,
          ...payload,
        })
        setStatus('Evento creado y visible para la Red.')
      }
      resetEventForm()
      await loadEvents()
      window.requestAnimationFrame(() => scrollElementIntoView(listTopRef.current))
    } catch {
      setError('No pudimos guardar el evento. Revisa los datos e intenta nuevamente.')
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <section className="app-page">
      <div className="section-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-200">Eventos</p>
            <h1 data-page-title className="mt-2 text-4xl font-black">Encuentros de la Red</h1>
            <p className="mt-3 max-w-2xl text-white/62">Reuniones, estudios, juegos y momentos de oración para crecer juntos.</p>
          </div>
          <select
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value)
              window.requestAnimationFrame(() => scrollElementIntoView(listTopRef.current))
            }}
            className="app-select w-fit rounded-full"
          >
            <option value="todos">Todos</option>
            <option value="online">Online</option>
            <option value="esta-semana">Esta semana</option>
            <option value="confirmados">Mis confirmados</option>
          </select>
        </div>
        {status ? <p className="app-alert mt-5">{status}</p> : null}
        {error ? <p className="app-alert-warning mt-5">{error}</p> : null}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="app-card-soft">
            <p className="text-2xl font-black">{events.length}</p>
            <p className="mt-1 text-sm text-white/60">eventos próximos</p>
          </div>
          <div className="app-card-soft">
            <p className="text-2xl font-black">{confirmedEvents}</p>
            <p className="mt-1 text-sm text-white/60">confirmados por ti</p>
          </div>
          <div className="app-card-soft">
            <p className="text-2xl font-black">{onlineEvents}</p>
            <p className="mt-1 text-sm text-white/60">disponibles online</p>
          </div>
        </div>
        <div ref={listTopRef} className="mt-8 grid gap-5 lg:grid-cols-2">
          {isLoading ? <p className="text-white/60">Cargando eventos...</p> : null}
          {!isLoading && !filteredEvents.length ? (
            <div className="app-empty">
              <AlertCircle className="mx-auto mb-3 h-6 w-6 text-amber-200" aria-hidden="true" />
              Aun no hay eventos para este filtro. Prueba con "Todos" o vuelve
              pronto para confirmar asistencia a un encuentro de la Red.
            </div>
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
              <p className="mt-4 text-sm leading-6 text-white/65">{event.description || 'Encuentro comunitario de Red de Jóvenes.'}</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold text-white/60">
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"><MapPin className="h-3 w-3" /> {event.city || 'Online'} {event.country ? `- ${event.country}` : ''}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"><UsersRound className="h-3 w-3" /> {event.rsvpCount} confirmados</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-emerald-200">{new Date(event.starts_at).toLocaleString('es-BO')}</p>
              <button
                type="button"
                onClick={() => void handleRsvp(event)}
                disabled={busyEventId === event.id}
                className="app-button-primary mt-5"
              >
                {busyEventId === event.id
                  ? 'Actualizando...'
                  : event.myRsvp
                    ? 'Cancelar asistencia'
                    : 'Confirmar asistencia'}
              </button>
              {isAdmin ? (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => handleEditEvent(event)}
                    className="app-button-secondary"
                  >
                    Editar evento
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeactivateEvent(event)}
                    disabled={busyEventId === event.id}
                    className="app-button-danger"
                  >
                    {busyEventId === event.id ? 'Desactivando...' : 'Desactivar'}
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
        {isAdmin ? (
          <form id="crear-evento" onSubmit={(event) => void handleEventSubmit(event)} className="app-card mt-8">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200">
              CMS de eventos
            </p>
            <h2 className="mt-2 text-2xl font-black">
              {editingEventId ? 'Editar evento' : 'Crear evento'}
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              {editingEventId
                ? 'Actualiza la informacion visible del evento seleccionado. No se borran datos ni asistencias.'
                : 'Publica encuentros para la Red. Completa fecha, modalidad y lugar para que los jovenes sepan como participar.'}
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-black text-white">Titulo del evento</span>
                <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Ej. Noche de oración juvenil" className="app-input" required />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black text-white">Fecha y hora</span>
                <input type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} className="app-input" required />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black text-white">Modalidad</span>
                <select value={form.modality} onChange={(event) => setForm({ ...form, modality: event.target.value })} className="app-select">
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                  <option value="hibrida">Hibrida</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-black text-white">Ciudad</span>
                <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} placeholder="Ej. La Paz" autoComplete="address-level2" className="app-input" />
              </label>
              <label className="grid gap-2 md:col-span-2">
                <span className="text-sm font-black text-white">País</span>
                <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} placeholder="Ej. Bolivia" autoComplete="country-name" className="app-input" />
              </label>
            </div>
            <label className="mt-4 grid gap-2">
              <span className="text-sm font-black text-white">Descripcion</span>
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Cuenta brevemente que pasara y a quien va dirigido." rows={3} className="app-input" />
            </label>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button type="submit" disabled={isCreating} className="app-button-primary bg-emerald-200 hover:bg-emerald-100">
                {isCreating
                  ? 'Guardando...'
                  : editingEventId
                    ? 'Guardar cambios'
                    : 'Crear evento'}
              </button>
              {editingEventId ? (
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="app-button-secondary"
                >
                  Cancelar edicion
                </button>
              ) : null}
            </div>
          </form>
        ) : null}
      </div>
    </section>
  )
}
