import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Loader2,
  LogOut,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { hasRole } from '../features/auth/roleService'
import { useAuth } from '../features/auth/useAuth'
import {
  getActiveGroups,
  joinGroup,
  getMyGroupSuggestions,
  getPendingGroupSuggestionsCount,
  leaveGroup,
  suggestGroup,
  type GroupWithMembership,
} from '../features/map/worldMapService'
import { scrollElementIntoView } from '../lib/scroll'
import type { GroupSuggestion } from '../types/database'

const mapNodePositions = [
  'left-[18%] top-[30%]',
  'left-[28%] top-[48%]',
  'left-[39%] top-[58%]',
  'left-[48%] top-[34%]',
  'left-[58%] top-[45%]',
  'left-[70%] top-[35%]',
  'left-[78%] top-[58%]',
  'left-[34%] top-[68%]',
]

const suggestionStatusLabels: Record<GroupSuggestion['status'], string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
}

const safePrinciples = [
  {
    title: 'Moderacion con sabiduria',
    text: 'Conversaciones cuidadas, sin ataques y con foco en edificar.',
  },
  {
    title: 'Jovenes protegidos',
    text: 'Reportes visibles, reglas simples y acompanamiento pastoral.',
  },
  {
    title: 'Palabra al centro',
    text: 'Los debates se orientan con versiculos y respeto por la fe.',
  },
]

function normalize(value: string | null) {
  return value?.trim() || 'Sin dato'
}

const modalityLabels: Record<string, string> = {
  presencial: 'Presencial',
  online: 'Online',
  hibrida: 'Hibrida',
}

export function WorldMapPage() {
  const { user } = useAuth()
  const userId = user?.id
  const directoryRef = useRef<HTMLElement>(null)
  const detailRef = useRef<HTMLElement>(null)
  const suggestionFormRef = useRef<HTMLFormElement>(null)
  const [groups, setGroups] = useState<GroupWithMembership[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupWithMembership | null>(
    null,
  )
  const [mySuggestions, setMySuggestions] = useState<GroupSuggestion[]>([])
  const [myCommunities, setMyCommunities] = useState<GroupWithMembership[]>([])
  const [pendingSuggestionsCount, setPendingSuggestionsCount] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const [countryFilter, setCountryFilter] = useState('todos')
  const [cityFilter, setCityFilter] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyGroupId, setBusyGroupId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [formMessage, setFormMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const [suggestion, setSuggestion] = useState({
    name: '',
    country: '',
    city: '',
    churchName: '',
    contactUrl: '',
    meetingInfo: '',
    description: '',
    modality: 'presencial',
    moderatorNote: '',
  })

  const loadGroups = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [data, suggestions, admin] = await Promise.all([
        getActiveGroups(userId),
        userId ? getMyGroupSuggestions(userId) : Promise.resolve([]),
        hasRole('admin').catch(() => false),
      ])

      setGroups(data)
      setMyCommunities(data.filter((group) => group.isMember))
      setSelectedGroup((current) =>
        current ? data.find((group) => group.id === current.id) ?? null : null,
      )
      setMySuggestions(suggestions)
      setIsAdmin(admin)
      setPendingSuggestionsCount(
        admin ? await getPendingGroupSuggestionsCount() : 0,
      )
    } catch {
      setError('No pudimos cargar las comunidades conectadas.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadGroups()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadGroups])

  function revealNode(target: HTMLElement | null, behavior: ScrollBehavior = 'auto') {
    window.requestAnimationFrame(() => {
      scrollElementIntoView(target, behavior)
    })
  }

  function selectGroup(group: GroupWithMembership) {
    setSelectedGroup(group)
    revealNode(detailRef.current, 'smooth')
  }

  const countries = useMemo(
    () =>
      Array.from(new Set(groups.map((group) => normalize(group.country)))).sort(
        (a, b) => a.localeCompare(b, 'es'),
      ),
    [groups],
  )

  const cities = useMemo(() => {
    const scopedGroups =
      countryFilter === 'todos'
        ? groups
        : groups.filter((group) => normalize(group.country) === countryFilter)

    return Array.from(
      new Set(scopedGroups.map((group) => normalize(group.city))),
    ).sort((a, b) => a.localeCompare(b, 'es'))
  }, [countryFilter, groups])

  const countryCounts = useMemo(
    () =>
      countries.map((country) => ({
        country,
        count: groups.filter((group) => normalize(group.country) === country)
          .length,
      })),
    [countries, groups],
  )

  const mapNodes = useMemo(
    () =>
      countryCounts.slice(0, mapNodePositions.length).map((item, index) => ({
        ...item,
        className: mapNodePositions[index],
      })),
    [countryCounts],
  )

  const filteredGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return groups.filter((group) => {
      const matchesCountry =
        countryFilter === 'todos' || normalize(group.country) === countryFilter
      const matchesCity =
        cityFilter === 'todos' || normalize(group.city) === cityFilter
      const searchable = [
        group.name,
        group.city,
        group.country,
        group.church_name,
        group.meeting_info,
        group.description,
        group.contact_url,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return matchesCountry && matchesCity && (!term || searchable.includes(term))
    })
  }, [cityFilter, countryFilter, groups, searchTerm])

  function clearFilters() {
    setCountryFilter('todos')
    setCityFilter('todos')
    setSearchTerm('')
    revealNode(directoryRef.current)
  }

  function handleCountryClick(country: string) {
    setCountryFilter(country)
    setCityFilter('todos')
    revealNode(directoryRef.current)
  }

  async function handleSuggestionSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId) return

    if (!suggestion.name.trim() || !suggestion.country.trim() || !suggestion.city.trim()) {
      setFormMessage('El nombre, el pais y la ciudad son obligatorios.')
      revealNode(suggestionFormRef.current)
      return
    }

    if (
      suggestion.contactUrl.trim() &&
      !/^https?:\/\/\S+\.\S+/.test(suggestion.contactUrl.trim())
    ) {
      setFormMessage('El link de contacto debe comenzar con http:// o https://.')
      revealNode(suggestionFormRef.current)
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
        description: suggestion.description.trim(),
        modality: suggestion.modality,
        moderatorNote: suggestion.moderatorNote.trim(),
      })
      setSuggestion({
        name: '',
        country: '',
        city: '',
        churchName: '',
        contactUrl: '',
        meetingInfo: '',
        description: '',
        modality: 'presencial',
        moderatorNote: '',
      })
      const [suggestions, data] = await Promise.all([
        getMyGroupSuggestions(userId),
        getActiveGroups(userId),
      ])
      setMySuggestions(suggestions)
      setGroups(data)
      setMyCommunities(data.filter((group) => group.isMember))
      revealNode(suggestionFormRef.current)
      setFormMessage('Tu comunidad fue sugerida para revisión.')
    } catch {
      setFormMessage('No pudimos enviar la sugerencia. Intentalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleMembership(group: GroupWithMembership) {
    if (!userId) return

    setBusyGroupId(group.id)
    setError('')
    setActionMessage('')
    try {
      if (group.isMember) {
        await leaveGroup({ groupId: group.id, userId })
        setActionMessage(`Saliste de ${group.name}. Puedes volver cuando quieras.`)
      } else {
        await joinGroup({ groupId: group.id, userId })
        setActionMessage(`Ya eres parte de ${group.name}. Bienvenido a conectar.`)
      }
      const data = await getActiveGroups(userId)
      setGroups(data)
      setMyCommunities(data.filter((item) => item.isMember))
      setSelectedGroup((current) =>
        current ? data.find((item) => item.id === current.id) ?? null : null,
      )
      revealNode(detailRef.current ?? directoryRef.current, 'smooth')
    } catch {
      setError('No pudimos actualizar tu comunidad. Intentalo nuevamente.')
    } finally {
      setBusyGroupId(null)
    }
  }

  const kpis = [
    [String(groups.length), 'comunidades activas'],
    [String(countries.length), 'paises'],
    [String(cities.length), 'ciudades'],
    [String(myCommunities.length), 'mis comunidades'],
    [
      String(isAdmin ? pendingSuggestionsCount : mySuggestions.length),
      isAdmin ? 'sugerencias pendientes' : 'mis sugerencias',
    ],
  ]

  return (
    <section className="app-page overflow-hidden">
      <div className="section-shell relative">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="app-kicker">
              <Globe2 className="h-4 w-4" aria-hidden="true" />
              Mapa mundial
            </p>
            <h1 data-page-title className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Encuentra jovenes cerca de ti.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              Explora iglesias y grupos juveniles activos en la Red. Este
              directorio usa datos reales revisados y sugerencias del piloto.
            </p>
            <div className="mt-7 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-5">
              {kpis.map(([value, label]) => (
                <div
                  key={label}
                  className="app-card-soft text-center"
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

            {mapNodes.length ? (
              mapNodes.map((point) => (
                <button
                  key={point.country}
                  type="button"
                  onClick={() => handleCountryClick(point.country)}
                  className={`absolute ${point.className} flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-center text-[0.65rem] font-black text-amber-200 shadow-[0_0_35px_rgba(251,191,36,0.28)] transition hover:scale-105 hover:border-amber-200/60`}
                  title={`Filtrar ${point.country}`}
                >
                  <span>
                    {point.country.slice(0, 3).toUpperCase()}
                    <span className="block text-[0.55rem] text-white/55">
                      {point.count}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-white/55">
                Aun no hay paises con comunidades activas.
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 rounded-[1.5rem] border border-white/10 bg-slate-950/75 p-4 backdrop-blur">
              <p className="flex items-center gap-2 font-bold">
                <Sparkles className="h-4 w-4 text-amber-200" aria-hidden="true" />
                Mapa visual de comunidades
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Cada nodo representa un pais con comunidades activas. Toca un
                pais para filtrar el directorio.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <article ref={directoryRef} className="app-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Iglesias y grupos conectados
                </p>
                <h2 className="mt-2 text-3xl font-black">Directorio real</h2>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="app-button-secondary w-fit"
              >
                Limpiar filtros
              </button>
            </div>

            <div className="mt-5 grid gap-2 lg:grid-cols-[1.1fr_0.75fr_0.75fr]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar nombre, iglesia, ciudad o pais"
                  className="app-input h-11 rounded-full py-0 pl-9"
                />
              </label>
              <select
                value={countryFilter}
                onChange={(event) => {
                  setCountryFilter(event.target.value)
                  setCityFilter('todos')
                }}
                className="app-select rounded-full"
                aria-label="Filtrar por pais"
              >
                <option value="todos">Todos los paises</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <select
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
                className="app-select rounded-full"
                aria-label="Filtrar por ciudad"
              >
                <option value="todos">Todas las ciudades</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {error ? (
              <div className="app-alert-warning mt-5">
                {error}
              </div>
            ) : null}
            {actionMessage ? (
              <div className="app-alert mt-5">
                {actionMessage}
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
                    className="app-card-soft"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-slate-950">
                        {group.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">{group.name}</h3>
                        <p className="mt-1 flex items-center gap-1 truncate text-sm text-white/50">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {normalize(group.city)}, {normalize(group.country)}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/45">
                          {group.church_name || 'Comunidad juvenil cristiana'}
                        </p>
                      </div>
                      {group.isMember ? (
                        <span className="mt-1 flex flex-none items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Mi comunidad
                        </span>
                      ) : (
                        <ArrowRight
                          className="mt-1 h-4 w-4 flex-none text-amber-200"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/55">
                      {group.meeting_info ||
                        group.description ||
                        'Grupo juvenil conectado a Red de Jovenes.'}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/60">
                        <Users className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                        {group.membersCount} miembros
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/60">
                        {modalityLabels[group.modality] ?? 'Presencial'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => selectGroup(group)}
                        className="app-chip min-h-9 px-4 text-xs"
                      >
                        Ver comunidad
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleMembership(group)}
                        disabled={busyGroupId === group.id}
                        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          group.isMember
                            ? 'border border-white/10 text-white/65 hover:bg-white/10 hover:text-white'
                            : 'bg-white text-slate-950 hover:bg-amber-100'
                        }`}
                      >
                        {group.isMember ? (
                          <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {group.isMember ? 'Salir' : 'Unirme'}
                      </button>
                      {group.contact_url ? (
                        <a
                          href={group.contact_url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/15"
                        >
                          Contacto
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="app-empty mt-8">
                {groups.length
                  ? 'No encontramos comunidades con esos filtros.'
                  : 'Aun no hay comunidades registradas. Se el primero en sugerir una.'}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {countryCounts.map((item) => (
                <button
                  key={item.country}
                  type="button"
                  onClick={() => handleCountryClick(item.country)}
                  className="app-chip"
                >
                  {item.country} - {item.count}
                </button>
              ))}
            </div>

            {selectedGroup ? (
              <article ref={detailRef} className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-200">
                      Comunidad seleccionada
                    </p>
                    <h3 className="mt-2 text-2xl font-black">
                      {selectedGroup.name}
                    </h3>
                    <p className="mt-2 text-sm text-white/65">
                      {normalize(selectedGroup.city)}, {normalize(selectedGroup.country)}
                    </p>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-bold text-white/70">
                    {selectedGroup.membersCount} miembros
                  </span>
                </div>
                <p className="mt-4 leading-7 text-white/70">
                  {selectedGroup.description ||
                    selectedGroup.meeting_info ||
                    'Comunidad juvenil conectada a la Red.'}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                      Reunion
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/70">
                      {selectedGroup.meeting_info || 'Informacion pendiente.'}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-white/40">
                      Modalidad
                    </p>
                    <p className="mt-2 text-sm font-bold text-white/75">
                      {modalityLabels[selectedGroup.modality] ?? 'Presencial'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void handleMembership(selectedGroup)}
                    disabled={busyGroupId === selectedGroup.id}
                    className="app-button-primary min-h-10 px-4 disabled:opacity-60"
                  >
                    {selectedGroup.isMember ? 'Salir de comunidad' : 'Unirme'}
                  </button>
                  <Link
                    to="/app/foros"
                    className="app-button-secondary min-h-10 px-4"
                  >
                    Ir a foros
                  </Link>
                  <Link
                    to="/app/oracion"
                    className="app-button-secondary min-h-10 px-4"
                  >
                    Pedir oracion
                  </Link>
                </div>
              </article>
            ) : null}
          </article>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Mis comunidades</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Tus grupos conectados aparecen aqui. Puedes unirte desde el
                directorio y salir cuando lo necesites.
              </p>
              <div className="mt-5 space-y-3">
                {myCommunities.length ? (
                  myCommunities.slice(0, 4).map((group) => (
                    <article
                      key={group.id}
                      className="app-card-soft"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{group.name}</h3>
                          <p className="mt-1 text-sm text-white/50">
                            {normalize(group.city)}, {normalize(group.country)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => selectGroup(group)}
                          className="app-chip min-h-8 px-3 text-xs"
                        >
                          Ver
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="app-empty">
                    Aun no te uniste a una comunidad. Explora el mapa y elige
                    una para comenzar a conectar.
                  </div>
                )}
              </div>
            </div>

            <form
              ref={suggestionFormRef}
              onSubmit={(event) => void handleSuggestionSubmit(event)}
              className="app-card-accent"
            >
              <div className="flex items-center gap-3">
                <Plus className="h-6 w-6 text-amber-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Sugerir comunidad</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Si tu iglesia o grupo juvenil no aparece, envialo para revision.
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
                  className="app-input h-11 py-0"
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
                    placeholder="Pais"
                    className="app-input h-11 py-0"
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
                    className="app-input h-11 py-0"
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
                  className="app-input h-11 py-0"
                />
                <select
                  value={suggestion.modality}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      modality: event.target.value,
                    }))
                  }
                  className="app-select"
                  aria-label="Modalidad de la comunidad"
                >
                  <option value="presencial">Presencial</option>
                  <option value="online">Online</option>
                  <option value="hibrida">Hibrida</option>
                </select>
                <input
                  value={suggestion.contactUrl}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      contactUrl: event.target.value,
                    }))
                  }
                  placeholder="Link de contacto, opcional"
                  className="app-input h-11 py-0"
                />
                <textarea
                  value={suggestion.meetingInfo}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      meetingInfo: event.target.value,
                    }))
                  }
                  placeholder="Informacion de reuniones"
                  className="app-input min-h-24"
                />
                <textarea
                  value={suggestion.description}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Descripcion breve, opcional"
                  className="app-input min-h-20"
                />
                <textarea
                  value={suggestion.moderatorNote}
                  onChange={(event) =>
                    setSuggestion((current) => ({
                      ...current,
                      moderatorNote: event.target.value,
                    }))
                  }
                  placeholder="Nota para el moderador, opcional"
                  className="app-input min-h-20"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="app-button-primary mt-5 w-full"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar sugerencia'}
              </button>
              {formMessage ? (
                <p className="mt-3 text-sm font-semibold text-amber-100">
                  {formMessage}
                </p>
              ) : null}
            </form>

            <div className="app-card">
              <h2 className="text-2xl font-black">Mis sugerencias</h2>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Puedes seguir el estado de las comunidades que enviaste.
              </p>
              <div className="mt-5 space-y-3">
                {mySuggestions.length ? (
                  mySuggestions.slice(0, 4).map((item) => (
                    <article
                      key={item.id}
                      className="app-card-soft"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold">{item.name}</h3>
                          <p className="mt-1 text-sm text-white/50">
                            {normalize(item.city)}, {normalize(item.country)}
                          </p>
                          <p className="mt-1 text-xs text-white/40">
                            {modalityLabels[item.modality] ?? 'Presencial'}
                          </p>
                        </div>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-amber-100">
                          {suggestionStatusLabels[item.status]}
                        </span>
                      </div>
                      {item.status === 'approved' ? (
                        <button
                          type="button"
                          onClick={() => {
                            const approvedGroup = groups.find(
                              (group) =>
                                group.name === item.name &&
                                group.country === item.country &&
                                (group.city ?? '') === (item.city ?? ''),
                            )
                            if (approvedGroup) selectGroup(approvedGroup)
                          }}
                          className="mt-3 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100"
                        >
                          Ver comunidad
                        </button>
                      ) : null}
                      {item.status === 'rejected' && item.internal_note ? (
                        <p className="mt-3 text-xs leading-5 text-white/50">
                          Nota: {item.internal_note}
                        </p>
                      ) : null}
                    </article>
                  ))
                ) : (
                  <div className="app-empty">
                    Todavia no enviaste sugerencias.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Cuidado comunitario</h2>
              </div>
              <p className="mt-3 leading-7 text-white/65">
                La comunidad global crece con reglas simples, acompanamiento y
                conversaciones que edifican.
              </p>
              <div className="mt-6 space-y-3">
                {safePrinciples.map((principle) => (
                  <article
                    key={principle.title}
                    className="app-card-soft"
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
