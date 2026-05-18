import { ArrowRight, BookOpen, Heart, Plus, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  actionTo: string
}

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
}: PlaceholderPageProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-36 text-white">
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-300/[0.14] blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="mx-auto grid min-h-[70vh] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-7 max-w-2xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">{description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to={actionTo}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-300 via-lime-200 to-amber-300 px-8 text-base font-bold text-slate-950"
            >
              {actionLabel}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <Link
              to="/"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-8 text-base font-bold text-white backdrop-blur"
            >
              Volver al inicio
            </Link>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="grid gap-4">
            {[
              { icon: Heart, title: 'Oración en comunidad' },
              { icon: BookOpen, title: 'Foros con la Palabra' },
              { icon: ShieldCheck, title: 'Espacio moderado' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/40 p-5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-amber-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-bold text-white">{item.title}</p>
                    <p className="mt-1 text-sm text-white/50">Disponible próximamente</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
