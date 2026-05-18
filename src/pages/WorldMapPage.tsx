import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Globe2,
  Loader2,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'
import { getActiveGroups, suggestGroup } from '../features/map/worldMapService'
import type { Group } from '../types/database'

const mapPoints = [
  { label: 'AR', className: 'left-[34%] top-[62%]' },
  { label: 'MX', className: 'left-[22%] top-[42%]' },
  { label: 'USA', className: 'left-[25%] top-[31%]' },
  { label: 'ES', className: 'left-[48%] top-[34%]' },
  { label: 'BR', className: 'left-[39%] top-[58%]' },
  { label: 'UK', className: 'left-[47%] top-[27%]' },
  { label: 'BO', className: 'left-[35%] top-[55%]' },
  { label: 'CO', className: 'left-[30%] top-[48%]' },
]

const safePrinciples = [
  {
    title: 'Moderación con sabiduría',
    text: 'Conversaciones cuidadas, sin ataques y con foco en edificar.',
  },
  {
    title: 'Jóvenes protegidos',
    text: 'Reportes visibles, reglas simples y acompañamiento pastoral.',
  },
  {
    title: 'Palabra al centro',
    text: 'Los debates se orientan con versículos y respeto por la fe.',
  },
]

function normalize(value: string | null) {
  return value?.trim() || 'Sin dato'
}

export function WorldMapPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [groups, setGroups] = useState<Group[]>([])
  const [countryFilter, setCountryFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [suggestion, setSuggestion] = useState({
    name: '',
    country: '',
    city: '',
    churchName: '',
    contactUrl: '',
    meetingInfo: '',
  })

  const loadGroups = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await getActiveGroups()
      setGroups(data)
    } catch {
      setError('No pudimos cargar las comunidades conectadas.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadGroups()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadGroups])

  const countries = useMemo(
    () =>
      Array.from(new Set(groups.map((group) => normalize(group.country)))).sort(
        (a, b) => a.localeCompare(b, 'es'),
      ),
    [groups],
  )

  const countryCounts = useMemo(
    () =>
      countries.map((country) => ({
        country,
        count: groups.filter((group) => normalize(group.country) === country).length,
      })),
    [countries, groups],
  )

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return groups.filter((group) => {
      const matchesCountry =
        countryFilter === 'todos' || normalize(group.country) === countryFilter
      const searchable = [
        group.name,
        group.city,
        group.country,
        group.church_name,
        group.description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesCountry && (!term || searchable.includes(term))
    })
  }, [countryFilter, groups, searchTerm])

  async function handleSuggestionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId) return

    if (!suggestion.name.trim() || !suggestion.country.trim()) {
      setFormMessage('El nombre y el país son obligatorios.')
      return
    }

    setIsSubmitting(true)
    setFormMessage('')
    try {
      await suggestGroup({
        userId,
        name: suggestion.name.trim(),
        country: suggestion.country.trim(),
        city: suggestion.city.trim(),
        churchName: suggestion.churchName.trim(),
        contactUrl: suggestion.contactUrl.trim(),
        meetingInfo: suggestion.meetingInfo.trim(),
      })
      setSuggestion({
        name: '',
        country: '',
        city: '',
        churchName: '',
        contactUrl: '',
        meetingInfo: '',
      })
      setFormMessage('Sugerencia enviada para revisión.')
    } catch {
      setFormMessage('No pudimos enviar la sugerencia. Inténtalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-24 pt-32 text-white">
      <div className="pointer-events-none fixed left-1/2 top-28 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-10 right-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="section-shell relative">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              Mapa mundial
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Comunidades cristianas conectadas.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              Explora iglesias y grupos juveniles activos en la Red. La lista
              crece con comunidades revisadas y sugerencias del piloto.
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              {[
                [String(groups.length), 'comunidades'],
                [String(countries.length), 'países'],
                [String(filteredGroups.length), 'visibles'],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 text-center shadow-2xl shadow-black/20 backdrop-blur"
                >
                  <p className="text-3xl font-black">{value}</p>
                  <p className="mt-1 text-sm text-white/50">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/30 backdrop-blur md:min-h-[30rem]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(52,211,153,0.22),transparent_18%),radial-gradient(circle_at_58%_45%,rgba(251,191,36,0.2),transparent_20%),radial-gradient(circle_at_70%_28%,rgba(129,140,248,0.2),transparent_24%)]" />
            <div className="absolute inset-6 rounded-[2rem] border border-white/10 bg-slate-950/40" />
            <div className="absolute left-[10%] top-[22%] h-[2px] w-[80%] rotate-6 bg-gradient-to-r from-transparent via-emerald-300/30 to-transparent" />
            <div className="absolute left-[20%] top-[68%] h-[2px] w-[62%] -rotate-12 bg-gradient-to-r from-transparent via-amber-300/30 to-transparent" />
            {mapPoints.map((point) => (
              <span
                key={point.label}
                className={`absolute ${point.className} flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-xs font-black text-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.28)]`}
              >
                {point.label}
              </span>
            ))}
            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/10 bg-slate-950/75 p-4 backdrop-blur">
              <p className="flex items-center gap-2 font-bold">
                <Sparkles className="h-4 w-4 text-amber-200" aria-hidden="true" />
                Mapa visual de referencia
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Los puntos orientan la experiencia. La lista inferior usa datos
                reales conectados a Supabase.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Iglesias y grupos conectados
                </p>
                <h2 className="mt-2 text-3xl font-black">Comunidad global</h2>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Buscar ciudad o iglesia"
                    className="h-11 w-full rounded-full border border-white/10 bg-slate-950/45 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-amber-200/60"
                  />
                </label>
                <select
                  value={countryFilter}
                  onChange={(event) => setCountryFilter(event.target.value)}
                  className="h-11 rounded-full border border-white/10 bg-slate-950/80 px-4 text-sm font-bold text-white outline-none transition focus:border-amber-200/60"
                  aria-label="Filtrar por país"
                >
                  <option value="todos">Todos</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-8 flex items-center justify-center gap-3 text-white/60">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Cargando comunidades...
              </div>
            ) : filteredGroups.length ? (
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {filteredGroups.map((group) => (
                  <article
                    key={group.id}
                    className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4"
                  >
                    <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-slate-950">
                      {group.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold">{group.name}</h3>
                      <p className="mt-1 flex items-center gap-1 truncate text-sm text-white/50">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        {normalize(group.city)}, {normalize(group.country)}
                      </p>
                      <p className="mt-1 truncate text-xs text-white/40">
                        {group.meeting_info || group.description || 'Grupo juvenil conectado.'}
                      </p>
                    </div>
                    <ArrowRight
                      className="ml-auto h-4 w-4 flex-none text-amber-200"
                      aria-hidden="true"
                    />
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-8 text-center text-white/55">
                No encontramos comunidades con esos filtros.
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {countryCounts.map((item) => (
                <button
                  key={item.country}
                  type="button"
                  onClick={() => setCountryFilter(item.country)}
                  className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-bold text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  {item.country} · {item.count}
                </button>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <form
              onSubmit={(event) => void handleSuggestionSubmit(event)}
              className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-6 w-6 text-amber-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Sugerir comunidad</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                ¿Tu iglesia o grupo juvenil todavía no aparece? Envíalo para
                revisión.
              </p>
              <div className="mt-5 grid gap-3">
                <input
                  value={suggestion.name}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Nombre del grupo"
                  className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={suggestion.country}
                    onChange={(event) =>
                      setSuggestion((current) => ({
                        ...current,
                        country: event.target.value,
                      }))
                    }
                    placeholder="País"
                    className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                  />
                  <input
                    value={suggestion.city}
                    onChange={(event) =>
                      setSuggestion((current) => ({
                        ...current,
                        city: event.target.value,
                      }))
                    }
                    placeholder="Ciudad"
                    className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                  />
                </div>
                <input
                  value={suggestion.churchName}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      churchName: event.target.value,
                    }))
                  }
                  placeholder="Iglesia o comunidad"
                  className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                />
                <input
                  value={suggestion.contactUrl}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      contactUrl: event.target.value,
                    }))
                  }
                  placeholder="Link de contacto, opcional"
                  className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                />
                <textarea
                  value={suggestion.meetingInfo}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      meetingInfo: event.target.value,
                    }))
                  }
                  placeholder="Informacion de reuniones, opcional"
                  className="min-h-24 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar sugerencia'}
              </button>
              {formMessage ? (
                <p className="mt-3 text-sm font-semibold text-amber-100">
                  {formMessage}
                </p>
              ) : null}
            </form>

            <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Espacio seguro</h2>
              </div>
              <p className="mt-3 leading-7 text-white/65">
                La comunidad global crece con reglas simples, acompañamiento y
                conversaciones que edifican.
              </p>
              <div className="mt-6 space-y-3">
                {safePrinciples.map((principle) => (
                  <article
                    key={principle.title}
                    className="rounded-3xl bg-slate-950/45 p-4"
                  >
                    <h3 className="font-bold">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {principle.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
