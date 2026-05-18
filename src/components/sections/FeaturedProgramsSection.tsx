import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgramCard } from '../cards/ProgramCard'
import { programs } from '../../data/mockData'
import { buttonVariants } from '../ui/buttonVariants'
import { SectionHeading } from './SectionHeading'

export function FeaturedProgramsSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Programas destacados"
          title="Rutas para crecer, servir y liderar"
          description="Cada programa está pensado para convertir entusiasmo juvenil en capacidades, comunidad y proyectos concretos."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs.slice(0, 3).map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/programas" className={buttonVariants({ variant: 'primary', size: 'lg' })}>
            Ver todos los programas
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
