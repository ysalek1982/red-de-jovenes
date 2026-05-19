import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Gamepad2,
  GraduationCap,
  Globe2,
  Hammer,
  Heart,
  Loader2,
  MessageCircle,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  createPost,
  getRecentPosts,
  type PostWithAuthor,
} from '../features/community/communityService'
import {
  getDailyBibleVerse,
  verseOfTheMoment,
  type BibleVerseResult,
} from '../features/bible/bibleService'
import { getTodayDevotional } from '../features/devotionals/devotionalService'
import { getUpcomingEvents, type EventWithRsvps } from '../features/events/eventService'
import { getActiveGroups, type GroupWithMembership } from '../features/map/worldMapService'
import {
  getPublicPrayerRequests,
  type PrayerRequestWithAuthor,
} from '../features/prayer/prayerService'
import { getProfile } from '../features/profile/profileService'
import {
  getMyFaithProgress,
  type FaithProgressSummary,
} from '../features/progress/progressService'
import { useAuth } from '../features/auth/useAuth'
import type { Devotional, Profile } from '../types/database'

const quickActions = [
  {
    title: 'Biblia',
    text: 'Guarda versiculos, marca lecturas y comparte la Palabra.',
    to: '/app/biblia',
    icon: BookOpen,
  },
  {
    title: 'Sala de oración global',
    text: 'Comparte peticiones y ora con jóvenes de la Red.',
    to: '/app/oracion',
    icon: Heart,
  },
  {
    title: 'Foros con la Palabra',
    text: 'Publica reflexiones, testimonios y versículos.',
    to: '/app/foros',
    icon: MessageCircle,
  },
  {
    title: 'Devocional',
    text: 'Vuelve a la Palabra con una reflexión diaria.',
    to: '/app/devocional',
    icon: BookOpen,
  },
  {
    title: 'Juegos de fe',
    text: 'Aprende jugando con Versículo Rápido y trivia bíblica.',
    to: '/app/juegos',
    icon: Gamepad2,
  },
  {
    title: 'Mapa mundial',
    text: 'Explora iglesias y grupos juveniles conectados.',
    to: '/app/mapa',
    icon: Globe2,
  },
  {
    title: 'Eventos',
    text: 'Encuentra encuentros, estudios y oraciones de la Red.',
    to: '/app/eventos',
    icon: CalendarDays,
  },
  {
    title: 'Discipulado',
    text: 'Camina planes cortos para crecer con proposito.',
    to: '/app/discipulado',
    icon: GraduationCap,
  },
  {
    title: 'Construir la Red',
    text: 'Invita, sugiere comunidades y comparte mejoras.',
    to: '/app/construir',
    icon: Hammer,
  },
  {
    title: 'Perfil',
    text: 'Actualiza tu identidad dentro de la Red.',
    to: '/app/perfil',
    icon: UserRound,
  },
]

const onboardingSteps = [
  {
    title: 'Completa tu perfil',
    text: 'Agrega ciudad, país, iglesia y una bio breve para que otros jóvenes sepan cómo conectar contigo.',
    to: '/app/perfil',
  },
  {
    title: 'Ora con alguien hoy',
    text: 'Publica una petición o marca "Estoy orando" en una necesidad de la comunidad.',
    to: '/app/oracion',
  },
  {
    title: 'Participa con la Palabra',
    text: 'Comparte una reflexión, un versículo o una pregunta honesta en los foros.',
    to: '/app/foros',
  },
]

function ProgressStat({
  label,
  value,
  to,
}: {
  label: string
  value: number
  to: string
}) {
  return (
    <Link
      to={to}
      className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 transition hover:bg-white/10"
    >
      <span className="text-3xl font-black text-white">{value}</span>
      <span className="mt-2 block text-sm font-semibold leading-5 text-white/62">
        {label}
      </span>
    </Link>
  )
}

function formatRelative(value: string | null) {
  if (!value) return 'hoy'
  const date = new Date(value)
  const diffMs = Date.now() - date.getTime()
  const diffHours = Math.floor(diffMs / 3_600_000)
  if (diffHours < 1) return 'hace unos minutos'
  if (diffHours < 24) return `hace ${diffHours} h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'ayer'
  return `hace ${diffDays} dias`
}

export function AppHome() {
  const { user } = useAuth()
  const userId = user?.id
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [prayers, setPrayers] = useState<PrayerRequestWithAuthor[]>([])
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [communities, setCommunities] = useState<GroupWithMembership[]>([])
  const [events, setEvents] = useState<EventWithRsvps[]>([])
  const [momentVerse, setMomentVerse] = useState<BibleVerseResult | null>(null)
  const [progress, setProgress] = useState<FaithProgressSummary | null>(null)
  const [quickPost, setQuickPost] = useState('')
  const [quickStatus, setQuickStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const displayName = useMemo(() => {
    const metadataName = user?.user_metadata.full_name
    if (typeof metadataName === 'string' && metadataName.trim()) {
      return metadataName.trim().split(' ')[0]
    }
    return user?.email?.split('@')[0] ?? 'joven'
  }, [user])

  const loadData = useCallback(async () => {
    setIsLoading(true)
    setError('')
    try {
      const [
        devotionalData,
        prayerData,
        postData,
        progressData,
        groupData,
        profileData,
        eventData,
        momentVerseData,
      ] = await Promise.all([
        getTodayDevotional(),
        getPublicPrayerRequests(),
        getRecentPosts(userId),
        userId ? getMyFaithProgress(userId) : Promise.resolve(null),
        getActiveGroups(userId),
        userId ? getProfile(userId) : Promise.resolve(null),
        getUpcomingEvents(userId),
        getDailyBibleVerse({ translationCode: 'RVR1909' }),
      ])
      setDevotional(devotionalData)
      setProfile(profileData)
      setPrayers(prayerData.slice(0, 4))
      setPosts(postData.slice(0, 4))
      setCommunities(groupData)
      setProgress(progressData)
      setEvents(eventData.slice(0, 3))
      setMomentVerse(momentVerseData)
    } catch {
      setError('No pudimos cargar tu Red. Revisa la conexión o intenta más tarde.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const myCommunities = communities.filter((community) => community.isMember)
  const highlightedCommunity =
    myCommunities[0] ?? communities.find((community) => community.membersCount > 0) ?? communities[0]
  const profileIncomplete =
    !profile?.city || !profile.country || !profile.bio || !profile.church_name
  const communityPulse = [
    ...posts.slice(0, 2).map((post) => ({
      title: 'Nueva reflexion en foros',
      text: post.body,
      to: '/app/foros',
      when: formatRelative(post.created_at),
    })),
    ...prayers.slice(0, 2).map((prayer) => ({
      title: prayer.is_answered ? 'Oracion respondida' : 'Peticion de oracion',
      text: prayer.title,
      to: '/app/oracion',
      when: formatRelative(prayer.created_at),
    })),
    ...(devotional
      ? [
          {
            title: 'Devocional de hoy',
            text: devotional.title,
            to: '/app/devocional',
            when: 'disponible',
          },
        ]
      : []),
    ...(progress?.lastGame
      ? [
          {
            title: 'Ultimo juego completado',
            text: `${progress.lastGame.title}: ${progress.lastGame.score}/${progress.lastGame.total}`,
            to: '/app/juegos',
            when: 'tu progreso',
          },
        ]
      : []),
    ...myCommunities.slice(0, 1).map((group) => ({
      title: 'Tu comunidad',
      text: group.name,
      to: '/app/mapa',
      when: `${group.membersCount} miembros`,
    })),
    ...events.slice(0, 2).map((event) => ({
      title: 'Evento proximo',
      text: event.title,
      to: '/app/eventos',
      when: formatRelative(event.starts_at),
    })),
  ].slice(0, 6)

  async function handleQuickPost() {
    if (!userId || !quickPost.trim()) return
    await createPost({ userId, body: quickPost.trim() })
    setQuickPost('')
    setQuickStatus('Tu publicacion quedo en Foros con la Palabra.')
    await loadData()
  }

  const displayedMomentVerse = momentVerse ?? {
    reference: verseOfTheMoment.reference,
    verse_text: verseOfTheMoment.text,
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed left-1/2 top-32 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Mi red
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Hola, {displayName}.
            </h1>
            <p className="mt-4 max-w-2xl text-white/65">
              Hoy tu red está activa: oración, foros con la Palabra,
              devocional, juegos de fe y comunidades conectadas.
            </p>
            <p className="mt-3 max-w-2xl text-sm font-semibold text-amber-100/80">
              Participa con un paso sencillo: ora, comparte, juega o encuentra
              una comunidad cercana.
            </p>
          </div>
          <Link
            to="/app/perfil"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-5 text-sm font-bold text-white shadow-2xl shadow-black/20 backdrop-blur transition hover:bg-white/10"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
            Editar perfil
          </Link>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm text-amber-100">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-12 flex items-center gap-3 text-white/70">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Cargando comunidad...
          </div>
        ) : (
          <div className="mt-10 space-y-6">
            <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
              <article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <p className="text-sm font-semibold text-amber-100">
                  Versiculo del momento
                </p>
                <p className="mt-4 text-2xl leading-10 text-white">
                  "{displayedMomentVerse.verse_text}"
                </p>
                <p className="mt-3 font-bold text-amber-200">
                  {displayedMomentVerse.reference}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to="/app/biblia"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-slate-950"
                  >
                    Guardar en Biblia
                  </Link>
                  <Link
                    to="/app/foros"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-bold text-white"
                  >
                    Compartir reflexion
                  </Link>
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <p className="text-sm font-semibold text-emerald-200">
                  Comparte con la Red
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Que esta haciendo Dios hoy?
                </h2>
                <textarea
                  value={quickPost}
                  onChange={(event) => setQuickPost(event.target.value)}
                  rows={3}
                  placeholder="Escribe una reflexion, testimonio o pregunta..."
                  className="mt-4 w-full rounded-3xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-amber-200"
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleQuickPost()}
                    className="h-11 rounded-full bg-emerald-200 px-5 text-sm font-black text-slate-950"
                  >
                    Publicar en Foros
                  </button>
                  {quickStatus ? (
                    <p className="text-sm font-semibold text-emerald-200">
                      {quickStatus}
                    </p>
                  ) : null}
                </div>
              </article>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="group rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.1]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-amber-200 ring-1 ring-white/10">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="mt-5 text-xl font-bold">{action.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {action.text}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-amber-200">
                      Abrir
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                )
              })}
            </div>

            <article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-100">
                    Primeros pasos
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    Empieza con una acción sencilla.
                  </h2>
                </div>
                <Sparkles className="h-8 w-8 text-amber-200" aria-hidden="true" />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {onboardingSteps.map((step, index) => (
                  <Link
                    key={step.to}
                    to={step.to}
                    className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 transition hover:bg-white/10"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-black text-slate-950">
                      {index + 1}
                    </span>
                    <h3 className="mt-4 font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/62">
                      {step.text}
                    </p>
                  </Link>
                ))}
              </div>
            </article>

            {progress ? (
              <article className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-emerald-100">
                      Tu progreso de fe
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Pasos reales dentro de la Red.
                    </h2>
                  </div>
                  <Sparkles className="h-8 w-8 text-emerald-200" aria-hidden="true" />
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <ProgressStat
                    label="Devocionales leidos"
                    value={progress.devotionalReads}
                    to="/app/devocional"
                  />
                  <ProgressStat
                    label="Juegos completados"
                    value={progress.gamesPlayed}
                    to="/app/juegos"
                  />
                  <ProgressStat
                    label="Puntos de juegos"
                    value={progress.totalGamePoints}
                    to="/app/juegos"
                  />
                  <ProgressStat
                    label="Oraciones apoyadas"
                    value={progress.prayerSupports}
                    to="/app/oracion"
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-white/65">
                  {progress.lastGame
                    ? `Ultimo juego: ${progress.lastGame.title} (${progress.lastGame.score}/${progress.lastGame.total}).`
                    : 'Completa tu primer juego para iniciar tu historial.'}
                </p>
              </article>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-amber-200">
                      Pulso de la comunidad
                    </p>
                    <h2 className="mt-2 text-2xl font-black">
                      Lo que está pasando en la Red
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-bold text-white/60">
                    {communityPulse.length} señales reales
                  </span>
                </div>
                <div className="mt-5 grid gap-3">
                  {communityPulse.length ? (
                    communityPulse.map((item) => (
                      <Link
                        key={`${item.title}-${item.text}`}
                        to={item.to}
                        className="rounded-3xl border border-white/10 bg-slate-950/45 p-4 transition hover:bg-white/10"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-white">
                              {item.title}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
                              {item.text}
                            </p>
                          </div>
                          <span className="flex-none rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-amber-100">
                            {item.when}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-6 text-sm leading-6 text-white/60">
                      Aún estamos empezando. Sé de los primeros en compartir,
                      orar o sugerir una comunidad.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <p className="text-sm font-semibold text-emerald-200">
                  Comunidad destacada
                </p>
                {highlightedCommunity ? (
                  <div className="mt-4">
                    <h2 className="text-2xl font-black">
                      {highlightedCommunity.name}
                    </h2>
                    <p className="mt-2 text-sm text-white/55">
                      {highlightedCommunity.city ?? 'Sin ciudad'},{' '}
                      {highlightedCommunity.country ?? 'Sin país'}
                    </p>
                    <p className="mt-4 line-clamp-4 text-sm leading-6 text-white/65">
                      {highlightedCommunity.description ||
                        highlightedCommunity.meeting_info ||
                        'Comunidad juvenil conectada a Red de Jóvenes.'}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs font-bold text-white/65">
                        {highlightedCommunity.membersCount} miembros
                      </span>
                      {highlightedCommunity.isMember ? (
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
                          Ya eres parte
                        </span>
                      ) : null}
                    </div>
                    <Link
                      to="/app/mapa"
                      className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-100"
                    >
                      Ver en mapa
                    </Link>
                  </div>
                ) : (
                  <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-6 text-sm leading-6 text-white/60">
                    Todavía no hay comunidades activas. Sugiere la primera
                    desde el mapa.
                  </div>
                )}
              </article>
            </div>

            {profileIncomplete ? (
              <article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <p className="text-sm font-semibold text-amber-100">
                  Perfil incompleto
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Ayuda a otros jóvenes a conectar contigo.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                  Agrega ciudad, país, iglesia y una bio breve. Así la Red se
                  siente más cercana y segura.
                </p>
                <Link
                  to="/app/perfil"
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-100"
                >
                  Completar perfil
                </Link>
              </article>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-amber-200" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Devocional del día</h2>
                </div>
                {devotional ? (
                  <div className="mt-5">
                    <h3 className="text-xl font-semibold">{devotional.title}</h3>
                    <p className="mt-4 text-lg leading-8 text-white/80">
                      “{devotional.verse_text}”
                    </p>
                    <p className="mt-3 font-semibold text-amber-200">
                      {devotional.verse_reference}
                    </p>
                    <p className="mt-5 leading-7 text-white/65">
                      {devotional.reflection}
                    </p>
                    <Link
                      to="/app/devocional"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-200"
                    >
                      Leer devocional
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                ) : (
                  <p className="mt-5 text-white/60">
                    Aún no hay devocional disponible.
                  </p>
                )}
              </article>

              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Heart className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                    Últimas oraciones
                  </h2>
                  <div className="mt-5 space-y-4">
                    {prayers.length ? (
                      prayers.map((prayer) => (
                        <div key={prayer.id} className="rounded-2xl bg-slate-950/45 p-4">
                          <p className="font-semibold">{prayer.title}</p>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/60">
                            {prayer.body}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/60">
                        Todavía no hay peticiones públicas. Puedes ser el
                        primero en compartir una necesidad de oración.
                      </p>
                    )}
                  </div>
                </article>

                <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <MessageCircle className="h-5 w-5 text-amber-200" aria-hidden="true" />
                    Foros recientes
                  </h2>
                  <div className="mt-5 space-y-4">
                    {posts.length ? (
                      posts.map((post) => (
                        <div key={post.id} className="rounded-2xl bg-slate-950/45 p-4">
                          <p className="line-clamp-4 text-sm leading-6 text-white/75">
                            {post.body}
                          </p>
                          {post.verse_reference ? (
                            <p className="mt-2 text-xs font-semibold text-amber-200">
                              {post.verse_reference}
                            </p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/60">
                        Todavía no hay debates en los foros. Comparte una
                        reflexión breve para iniciar la conversación.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
