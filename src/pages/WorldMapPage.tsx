import { ArrowRight, Globe2, MapPin, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { connectedGroups, safePrinciples } from '../data/appDemoData'

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

export function WorldMapPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-20 pt-32 text-white">
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
              Puntos de luz en 47 países.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              Conecta con iglesias y grupos juveniles alrededor del mundo. La
              Red crece cuando cada ciudad prende su luz.
            </p>
            <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
              {[
                ['12.4K', 'jóvenes'],
                ['320', 'iglesias'],
                ['47', 'países'],
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
                Comunidad global
              </p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Mapa visual simulado, preparado para integrarse con ubicaciones
                reales de grupos e iglesias.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Iglesias y grupos conectados
                </p>
                <h2 className="mt-2 text-3xl font-black">Comunidad global</h2>
              </div>
              <button
                type="button"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Proponer ciudad
              </button>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {connectedGroups.map((group) => (
                <article
                  key={group.name}
                  className="flex items-center gap-4 rounded-3xl border border-white/10 bg-slate-950/45 p-4"
                >
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-slate-950">
                    {group.initial}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold">{group.name}</h3>
                    <p className="mt-1 flex items-center gap-1 truncate text-sm text-white/50">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                      {group.city}, {group.country} · {group.members}
                    </p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 flex-none text-amber-200" aria-hidden="true" />
                </article>
              ))}
            </div>
          </article>

          <aside className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
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
                <article key={principle.title} className="rounded-3xl bg-slate-950/45 p-4">
                  <h3 className="font-bold">{principle.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">{principle.text}</p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
