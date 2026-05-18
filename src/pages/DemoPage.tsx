import {
  ArrowRight,
  BookOpen,
  Gamepad2,
  Globe2,
  Heart,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  appStories,
  connectedGroups,
  demoFeedPosts,
  gameCards,
  safePrinciples,
} from '../data/appDemoData'

const demoModules = [
  {
    title: 'Devocional diario',
    text: 'Un versículo, una reflexión y un paso concreto para empezar el día.',
    icon: Sun,
  },
  {
    title: 'Sala de oración global',
    text: 'Peticiones en vivo, alabanzas y jóvenes orando juntos.',
    icon: Heart,
  },
  {
    title: 'Foros con la Palabra',
    text: 'Debates anclados en versículos, profundos y sanos.',
    icon: MessageCircle,
  },
  {
    title: 'Juegos de fe',
    text: 'Versículo Rápido, Batallas de Fe y trivia bíblica.',
    icon: Gamepad2,
  },
  {
    title: 'Mapa mundial',
    text: 'Iglesias y grupos juveniles conectados en 47 países.',
    icon: Globe2,
  },
  {
    title: 'Espacio seguro',
    text: 'Moderación con sabiduría y protección para cada joven.',
    icon: ShieldCheck,
  },
]

export function DemoPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-20 pt-32 text-white">
      <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 right-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="section-shell relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Demo de la app
          </p>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">
            Así se vive la Red por dentro.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/70">
            Una vista pública del feed, oración, devocional, juegos, mapa mundial
            y espacio seguro. No necesitas iniciar sesión para verla.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="border-b border-white/10 bg-white/[0.04] p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-300 font-black text-slate-950">
                  +
                </span>
                <div>
                  <p className="font-black">Red de Jóvenes en Cristo</p>
                  <p className="text-xs text-white/50">Versículo del momento · Fil 4:13</p>
                </div>
              </div>
              <div className="flex min-h-11 items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 text-sm text-white/45">
                <Search className="h-4 w-4" aria-hidden="true" />
                Buscar amigos, versículos, secciones...
              </div>
            </div>
          </div>

          <div className="grid gap-0 lg:grid-cols-[15rem_minmax(0,1fr)_20rem]">
            <aside className="border-b border-white/10 p-4 lg:border-b-0 lg:border-r">
              <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1" aria-label="Demo">
                {demoModules.map((module) => {
                  const Icon = module.icon
                  return (
                    <a
                      key={module.title}
                      href={`#${module.title.toLowerCase().replaceAll(' ', '-')}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm font-semibold text-white/70 transition hover:bg-white/[0.08] hover:text-white"
                    >
                      <Icon className="h-4 w-4 text-amber-200" aria-hidden="true" />
                      <span className="min-w-0 truncate">{module.title}</span>
                    </a>
                  )
                })}
              </nav>
            </aside>

            <main className="p-4 md:p-6">
              <article
                id="devocional-diario"
                className="rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-6"
              >
                <div className="flex items-center gap-3 text-amber-200">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                  <p className="text-sm font-bold">Devocional del día</p>
                </div>
                <blockquote className="mt-5 text-2xl font-semibold leading-tight">
                  “Confía en el Señor de todo corazón, y no en tu propia inteligencia.”
                </blockquote>
                <p className="mt-4 font-bold text-amber-200">Proverbios 3:5</p>
                <p className="mt-4 leading-7 text-white/70">
                  Cuando soltamos el control y descansamos en Su sabiduría, el
                  camino se abre. Hoy: pausa 5 minutos, respira y entrega lo que
                  pesa.
                </p>
              </article>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                <div className="flex min-w-20 flex-col items-center rounded-3xl border border-dashed border-white/15 bg-white/[0.04] p-3 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-black text-slate-950">
                    +
                  </span>
                  <span className="mt-2 text-xs text-white/60">Tu historia</span>
                </div>
                {appStories.map((story) => (
                  <div
                    key={story.name}
                    className="flex min-w-20 flex-col items-center rounded-3xl border border-white/10 bg-white/[0.04] p-3 text-center"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-slate-950">
                      {story.initial}
                    </span>
                    <span className="mt-2 text-xs text-white/70">{story.name}</span>
                  </div>
                ))}
              </div>

              <div id="foros-con-la-palabra" className="mt-5 space-y-4">
                {demoFeedPosts.map((post) => (
                  <article
                    key={post.author}
                    className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-slate-950">
                        {post.initial}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold">{post.author}</p>
                        <p className="text-xs text-white/45">
                          {post.username} · {post.type}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 leading-7 text-white/75">{post.body}</p>
                    {post.verse ? (
                      <p className="mt-3 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-sm font-semibold text-amber-200">
                        {post.verse}
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm text-white/45">{post.stats}</p>
                  </article>
                ))}
              </div>
            </main>

            <aside className="space-y-4 border-t border-white/10 p-4 md:p-6 lg:border-l lg:border-t-0">
              <div
                id="sala-de-oracion-global"
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5"
              >
                <p className="text-sm font-bold text-emerald-300">Sala de oración global</p>
                <p className="mt-3 text-3xl font-black">1,247</p>
                <p className="text-sm text-white/55">jóvenes orando en vivo</p>
                <button className="mt-5 h-11 w-full rounded-full bg-white text-sm font-black text-slate-950">
                  Estoy orando
                </button>
              </div>

              <div id="juegos-de-fe" className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm font-bold text-amber-200">Juegos de fe</p>
                <div className="mt-4 space-y-3">
                  {gameCards.slice(0, 3).map((game) => (
                    <div key={game.title} className="rounded-2xl bg-slate-950/45 p-3">
                      <p className="font-bold">{game.title}</p>
                      <p className="mt-1 text-xs text-white/50">{game.meta}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div id="mapa-mundial" className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5">
                <p className="text-sm font-bold text-emerald-300">Mapa mundial</p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  320 iglesias · 47 países · una sola Red.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {connectedGroups.slice(0, 4).map((group) => (
                    <div key={group.name} className="rounded-2xl bg-slate-950/45 p-3">
                      <p className="font-bold">{group.initial}</p>
                      <p className="mt-1 truncate text-xs text-white/55">{group.city}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div id="espacio-seguro" className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5">
                <p className="text-sm font-bold text-emerald-200">Espacio seguro</p>
                <div className="mt-3 space-y-2">
                  {safePrinciples.map((principle) => (
                    <p key={principle.title} className="text-sm leading-6 text-white/65">
                      <span className="font-bold text-white">{principle.title}:</span>{' '}
                      {principle.text}
                    </p>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/crear-cuenta"
            className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-8 text-base font-bold text-slate-950 shadow-2xl shadow-amber-500/20"
          >
            Crear mi cuenta gratis
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <Link
            to="/entrar"
            className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-8 text-base font-bold text-white backdrop-blur"
          >
            Entrar
          </Link>
        </div>
      </div>
    </section>
  )
}
