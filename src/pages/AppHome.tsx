import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Globe2,
  Heart,
  Loader2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { safePrinciples } from '../data/appDemoData'
import { getRecentPosts, type PostWithAuthor } from '../features/community/communityService'
import { getTodayDevotional } from '../features/devotionals/devotionalService'
import {
  getPublicPrayerRequests,
  type PrayerRequestWithAuthor,
} from '../features/prayer/prayerService'
import { useAuth } from '../features/auth/useAuth'
import type { Devotional } from '../types/database'

const quickActions = [
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
    title: 'Espacio seguro',
    text: 'Conoce las normas y reporta contenido que necesite cuidado.',
    to: '/app/seguridad',
    icon: ShieldCheck,
  },
  {
    title: 'Perfil',
    text: 'Actualiza tu identidad dentro de la Red.',
    to: '/app/perfil',
    icon: UserRound,
  },
]

export function AppHome() {
  const { user } = useAuth()
  const userId = user?.id
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [prayers, setPrayers] = useState<PrayerRequestWithAuthor[]>([])
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
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
      const [devotionalData, prayerData, postData] = await Promise.all([
        getTodayDevotional(),
        getPublicPrayerRequests(),
        getRecentPosts(userId),
      ])
      setDevotional(devotionalData)
      setPrayers(prayerData.slice(0, 4))
      setPosts(postData.slice(0, 4))
    } catch {
      setError('No pudimos cargar tu Red. Revisa la conexión o intenta más tarde.')
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
              Tu espacio privado para oración, foros con la Palabra, devocional,
              juegos de fe y comunidad cristiana.
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
                        Todavía no hay peticiones públicas.
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
                        Todavía no hay debates en los foros.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </div>

            <article className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <h2 className="text-2xl font-bold">Espacio seguro</h2>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {safePrinciples.map((principle) => (
                  <div key={principle.title} className="rounded-3xl bg-slate-950/45 p-4">
                    <h3 className="font-bold">{principle.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {principle.text}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}
      </div>
    </section>
  )
}
