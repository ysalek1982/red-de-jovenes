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
      <div className="pointer-events-none absolute bottom-0 left-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
    </>
  )
}

function HeroCross() {
  return (
    <div className="pointer-events-none absolute right-6 top-28 hidden h-56 w-56 overflow-hidden rounded-full opacity-75 shadow-[0_0_70px_rgba(252,211,77,0.22)] lg:block">
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
    <div className="overflow-hidden bg-slate-950 text-white">
      <section
        id="comunidad"
        className="relative isolate min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.7), rgba(2, 6, 23, 0.9) 52%, #020617 100%), url(${worshipImage})`,
        }}
      >
        <Glow />
        <HeroCross />
        <div className="section-shell relative flex min-h-screen flex-col items-center justify-center pb-16 pt-36 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 shadow-2xl shadow-black/20 backdrop-blur">
            <Sparkles className="h-4 w-4 text-amber-300" aria-hidden="true" />
            La red social cristiana de la nueva generación
          </div>

          <h1 className="mt-8 max-w-6xl text-5xl font-black leading-[0.96] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Conectando jóvenes
            <span className="block bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 bg-clip-text font-serif italic font-normal text-transparent">
              en Cristo.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70 md:text-xl">
            Donde la fe se vive juntos. Comunidad, oración, eventos, foros
            anclados en la Palabra y juegos para crecer en grupo.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/crear-cuenta"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-8 text-base font-bold text-slate-950 shadow-2xl shadow-amber-500/20 transition hover:scale-[1.02]"
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

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5 text-sm text-white/60">
            {heroBenefits.map((benefit) => (
              <span key={benefit} className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-300" aria-hidden="true" />
                {benefit}
              </span>
            ))}
          </div>

          <div className="mt-14 grid w-full max-w-5xl grid-cols-2 gap-3 rounded-3xl border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-black/30 backdrop-blur-xl md:grid-cols-4">
            {landingMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-6"
              >
                <p className="text-3xl font-black text-white md:text-4xl">{metric.value}</p>
                <p className="mt-1 text-sm font-medium text-white/60">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="mision" className="relative border-y border-white/10 bg-slate-950 py-24">
        <Glow />
        <div className="section-shell relative text-center">
          <SectionLabel>Nuestra misión</SectionLabel>
          <div className="mx-auto mt-8 max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-12">
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

      <section id="funciones" className="relative bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(251,191,36,0.12),transparent_28%)]" />
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
                  className="group rounded-[1.75rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.09]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-amber-200 ring-1 ring-white/10">
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

      <section className="relative border-y border-white/10 bg-slate-950 py-24">
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
              className="mt-9 inline-flex h-14 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
            >
              Probar ahora
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-emerald-300/20 via-indigo-400/[0.15] to-amber-300/20 blur-3xl" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-4 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-slate-950 to-indigo-950 p-5">
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
                    <p className="mt-4 text-sm text-white/70">Oración en vivo</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-4">
                    <Map className="h-5 w-5 text-amber-300" aria-hidden="true" />
                    <p className="mt-4 text-sm text-white/70">47 países</p>
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
                    <p className="text-sm font-bold">Lucía amó tu post</p>
                    <p className="text-xs text-slate-500">Ahora</p>
                  </div>
                  <Smartphone className="ml-auto h-5 w-5 text-slate-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonios" className="relative bg-gradient-to-b from-slate-950 to-indigo-950 py-24">
        <div className="section-shell">
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Voces de la Red</SectionLabel>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">
              Vidas transformadas
            </h2>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {landingTestimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-7 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <p className="text-lg leading-8 text-white/80">“{testimonial.quote}”</p>
                <div className="mt-8 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 text-lg font-black text-slate-950">
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

      <section className="relative bg-slate-950 py-24">
        <div className="section-shell">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] via-indigo-500/10 to-amber-300/10 p-8 text-center shadow-2xl shadow-black/30 backdrop-blur md:p-14">
            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="relative">
              <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl">
                Tu generación. Tu Red.
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
                Más de 12,400 jóvenes, 320 iglesias y 47 países ya están
                conectados. Sé parte.
              </p>
              <Link
                to="/crear-cuenta"
                className="mt-9 inline-flex h-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-9 text-base font-black text-slate-950 shadow-2xl shadow-amber-500/20 transition hover:scale-[1.02]"
              >
                Crear mi cuenta gratis
              </Link>
              <p className="mt-5 text-sm font-medium text-white/50">
                Gratis para siempre · Sin anuncios · Espacio moderado
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
