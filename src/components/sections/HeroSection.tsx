import { ArrowRight, CalendarDays, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { heroImage, stats } from '../../data/mockData'
import { buttonVariants } from '../ui/buttonVariants'

export function HeroSection() {
  return (
    <section
      className="relative isolate min-h-[78vh] overflow-hidden bg-cover bg-center text-white"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(13, 31, 85, 0.92), rgba(13, 31, 85, 0.64), rgba(15, 111, 97, 0.54)), url(${heroImage})`,
      }}
    >
      <div className="section-shell flex min-h-[78vh] items-center py-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-semibold ring-1 ring-white/25">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Comunidad, fe, servicio y oportunidades
          </p>
          <h1 className="mt-6 max-w-2xl text-5xl font-bold leading-tight md:text-7xl">
            Red de Jóvenes
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 md:text-xl">
            Una plataforma institucional para conectar jóvenes con propósito,
            programas de formación, actividades comunitarias y oportunidades de
            crecimiento.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/contacto" className={buttonVariants({ variant: 'accent', size: 'lg' })}>
              <Users className="h-5 w-5" aria-hidden="true" />
              Unirme a la Red
            </Link>
            <Link to="/eventos" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
              Ver actividades
            </Link>
            <Link to="/programas" className={buttonVariants({ variant: 'outline', size: 'lg' })}>
              Conocer programas
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      <div className="section-shell pb-8">
        <div className="grid gap-3 rounded-lg border border-white/18 bg-white/10 p-3 backdrop-blur md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/12 p-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm font-semibold text-white/90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
