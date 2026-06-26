import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  Bell,
  BookOpen,
  CheckCircle2,
  Flame,
  Globe2,
  Heart,
  Map,
  Play,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Trophy,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  heroBenefits,
  landingFeatures,
  landingMetrics,
  landingTestimonials,
  pwaItems,
  type FeatureIcon,
} from '../data/landingData'

const worshipImage = '/assets/hero-youth.jpg'
const crossImage = '/assets/cross-glow.jpg'
const bibleStudyImage = '/assets/bible-study.jpg'

const featureIcons: Record<FeatureIcon, LucideIcon> = {
  prayer: Heart,
  bible: BookOpen,
  games: Trophy,
  map: Globe2,
  devotional: Sun,
  safe: ShieldCheck,
}

function Glow() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-28 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-40 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[rgba(142,214,208,0.16)] blur-3xl" />
    </>
  )
}

function HeroCross() {
  return (
    <div className="pointer-events-none absolute right-6 top-28 hidden h-56 w-56 overflow-hidden rounded-full opacity-75 shadow-[0_0_70px_rgba(252,211,77,0.22)] xl:block">
      <img
        src={crossImage}
        alt=""
        className="h-full w-full object-cover mix-blend-screen"
      />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-sm font-semibold tracking-wide text-amber-200/80">
      {children}
    </p>
  )
}

export function Home() {
  return (
    <div className="overflow-hidden bg-[#06100d] text-white">
      <section
        id="comunidad"
        className="relative isolate min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6, 16, 13, 0.68), rgba(8, 23, 34, 0.9) 52%, #06100d 100%), url(${worshipImage})`,
        }}
      >
        <Glow />
        <HeroCross />
        <div className="section-shell relative flex min-h-screen flex-col items-center justify-center pb-16 pt-36 text-center">
          <div className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-center text-xs font-medium leading-5 text-white/70 shadow-2xl shadow-black/20 backdrop-blur sm:w-auto sm:max-w-full sm:text-sm">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            <span>La red social cristiana de la nueva generación</span>
          </div>

          <h1 className="mt-8 w-full max-w-6xl text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block md:inline">Conectando</span>
            <span className="block md:inline"> jóvenes</span>
            <span className="block bg-gradient-to-r from-amber-100 via-lime-100 to-emerald-200 bg-clip-text font-serif italic font-normal text-transparent">
              en Cristo.
            </span>
          </h1>

          <p className="mt-7 w-full max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
            Donde la fe se vive juntos. Comunidad, oración, eventos, foros
            anclados en la Palabra y juegos para crecer en grupo.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/crear-cuenta"
              className="faith-cta"
            >
              Unirme ahora
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/demo"
              className="inline-flex h-14 items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-8 text-base font-bold text-white shadow-2xl shadow-black/20 backdrop-blur transition hover:bg-white/10"
            >
              <Play className="h-5 w-5 text-emerald-300" aria-hidden="true" />
              Ver demo
            </Link>
          </div>

          <div className="mt-12 flex w-full flex-wrap items-center justify-center gap-5 text-sm text-white/60">
            {heroBenefits.map((benefit) => (
              <span key={benefit} className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </div>

          <div className="faith-panel mt-14 grid w-full max-w-5xl grid-cols-2 gap-3 p-3 md:grid-cols-4">
            {landingMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-[#06100d]/55 px-5 py-6"
              >
                <p className="text-3xl font-black text-white md:text-4xl">{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-white/60">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mision" className="faith-section">
        <Glow />
        <div className="section-shell relative text-center">
          <SectionLabel>Nuestra misión</SectionLabel>
          <div className="faith-panel mx-auto mt-8 max-w-4xl p-8 md:p-12">
            <Flame className="mx-auto h-10 w-10 text-amber-300" aria-hidden="true" />
            <blockquote className="mt-6 text-3xl font-semibold leading-tight text-white md:text-5xl">
              “Vosotros sois la luz del mundo.”
              <span className="mt-3 block text-xl text-amber-200 md:text-2xl">
                — Mateo 5:14
              </span>
            </blockquote>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
              Una generación conectada por algo más grande que un feed. Una red
              mundial de jóvenes encendidos por Cristo.
            </p>
          </div>
        </div>
      </section>

      <section id="funciones" className="relative bg-gradient-to-b from-[#06100d] via-[#0b2d25] to-[#06100d] py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(142,214,208,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(244,200,107,0.14),transparent_28%)]" />
        <div className="section-shell relative">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Funciones</SectionLabel>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
              Todo en un solo lugar
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {landingFeatures.map((feature) => {
              const Icon = featureIcons[feature.icon]
              return (
                <article
                  key={feature.title}
                  className="faith-feature-card group"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200/20 to-emerald-200/20 text-amber-100 ring-1 ring-amber-100/10">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/60">{feature.text}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="faith-section">
        <div className="section-shell grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <SectionLabel>Disponible en tu bolsillo</SectionLabel>
            <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Una app instalable, siempre contigo.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Llévala en tu pantalla de inicio. Sin descargar de la tienda.
              Funciona como una app nativa: rápida, fluida y sin distracciones.
            </p>
            <ul className="mt-8 space-y-4">
              {pwaItems.map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/70">
                  <CheckCircle2 className="h-5 w-5 flex-none text-emerald-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/demo"
              className="faith-cta mt-9 px-7 text-sm"
            >
              Probar ahora
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-amber-200/20 via-emerald-200/[0.14] to-amber-300/20 blur-3xl" />
            <div className="faith-phone-shell">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-[#06100d] to-[#0b2d25] p-5">
                <div className="mx-auto mb-5 h-1.5 w-20 rounded-full bg-white/20" />
                <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white/60">Devocional del día</span>
                    <Sun className="h-5 w-5 text-amber-300" aria-hidden="true" />
                  </div>
                  <p className="mt-8 text-2xl font-semibold leading-tight text-white">
                    “Confía en el Señor de todo corazón.”
                  </p>
                  <p className="mt-5 text-sm font-semibold text-amber-200">
                    Proverbios 3:5
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                    <Bell className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                    <p className="mt-4 text-sm text-white/70">Oración comunitaria</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                    <Map className="h-5 w-5 text-amber-300" aria-hidden="true" />
                    <p className="mt-4 text-sm text-white/70">Comunidad global</p>
                  </div>
                </div>

                <img
                  src={bibleStudyImage}
                  alt=""
                  className="mt-5 h-28 w-full rounded-3xl border border-white/10 object-cover opacity-85"
                  loading="lazy"
                />

                <div className="mt-5 flex items-center gap-3 rounded-3xl border border-white/10 bg-white p-4 text-slate-950 shadow-xl">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-bold">
                    L
                  </span>
                  <div>
                    <p className="text-sm font-bold">Nuevo Amén recibido</p>
                    <p className="text-xs text-slate-500">Ahora</p>
                  </div>
                  <Smartphone className="ml-auto h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mapa-comunidad" className="faith-section">
        <Glow />
        <div className="section-shell relative">
          <div className="grid gap-12 items-center lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[22rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/35 backdrop-blur md:min-h-[28rem]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(52,211,153,0.18),transparent_22%),radial-gradient(circle_at_70%_28%,rgba(244,200,107,0.15),transparent_24%)]" />
              <div className="absolute inset-5 rounded-[2rem] border border-white/10 bg-slate-950/40" />
              
              <svg className="absolute inset-0 h-full w-full opacity-35" aria-hidden="true">
                <path d="M 120 150 Q 200 220 280 240 T 400 180 T 520 250" fill="none" stroke="rgba(255,241,191,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 280 240 Q 320 120 400 180" fill="none" stroke="rgba(142,214,208,0.25)" strokeWidth="1.5" strokeDasharray="3 3" />
              </svg>

              {[
                { country: 'Bolivia', count: 12, pos: 'left-[22%] top-[32%]' },
                { country: 'Colombia', count: 8, pos: 'left-[38%] top-[52%]' },
                { country: 'México', count: 15, pos: 'left-[46%] top-[36%]' },
                { country: 'Argentina', count: 10, pos: 'left-[58%] top-[62%]' },
                { country: 'España', count: 6, pos: 'left-[72%] top-[28%]' },
                { country: 'Perú', count: 9, pos: 'left-[30%] top-[48%]' },
              ].map((node) => (
                <div
                  key={node.country}
                  className={`absolute ${node.pos} flex h-12 w-12 items-center justify-center rounded-full border border-amber-100/20 bg-slate-950/90 text-center text-[0.62rem] font-black text-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.22)] animate-pulse`}
                  style={{ animationDuration: `${(node.count % 3) + 2.5}s` }}
                >
                  <div>
                    <span className="block font-black">{node.country.slice(0, 3).toUpperCase()}</span>
                    <span className="block text-[0.55rem] text-white/50">{node.count}</span>
                  </div>
                </div>
              ))}
              
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.25rem] border border-white/10 bg-slate-950/75 p-3.5 backdrop-blur text-left">
                <p className="flex items-center gap-2 text-xs font-bold text-amber-200">
                  <Globe2 className="h-4 w-4" />
                  Presencia global en vivo
                </p>
                <p className="mt-1 text-xs text-white/55">
                  Jóvenes conectados compartiendo fe y oración en tiempo real.
                </p>
              </div>
            </div>

            <div className="text-left">
              <SectionLabel>Comunidad global</SectionLabel>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
                Nuestra Red no tiene fronteras.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/70">
                Desde grupos de estudio bíblico locales hasta iglesias conectadas en todo el mundo. Encuentra un espacio donde compartir tu fe, pedir oración y caminar junto a otros jóvenes.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/60">
                ¿No ves tu grupo o iglesia? Al unirte podrás registrar tu comunidad y ser luz en tu ciudad.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/crear-cuenta" className="faith-cta">
                  Registrar mi comunidad
                </Link>
                <Link to="/demo" className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-8 text-base font-bold text-white shadow-2xl shadow-black/20 backdrop-blur transition hover:bg-white/10">
                  Ver demo del mapa
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonios" className="relative bg-gradient-to-b from-[#06100d] to-[#211225] py-24">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Escenarios de uso</SectionLabel>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
              Diseñada para acompañar
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {landingTestimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="faith-feature-card"
              >
                <p className="text-lg leading-8 text-white/80">{testimonial.quote}</p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-emerald-200 text-lg font-black text-slate-950">
                    {testimonial.initial}
                  </span>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/50">{testimonial.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="faith-section border-b-0">
        <div className="section-shell">
          <div className="faith-panel p-8 text-center md:p-14">
            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Tu generación. Tu Red.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Una comunidad cristiana joven, segura y preparada para crecer.
                Sé parte de esta primera red.
              </p>
              <Link
                to="/crear-cuenta"
                className="faith-cta mt-9 px-9"
              >
                Crear mi cuenta
              </Link>
              <p className="mt-5 text-sm font-medium text-white/50">
                Piloto cerrado · Sin anuncios en esta etapa · Espacio moderado
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
