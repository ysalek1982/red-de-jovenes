import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { OpportunityCard } from '../cards/OpportunityCard'
import { opportunities } from '../../data/mockData'
import { buttonVariants } from '../ui/buttonVariants'
import { SectionHeading } from './SectionHeading'

export function OpportunitiesSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Oportunidades"
          title="Puertas abiertas para el siguiente paso"
          description="Becas, cursos, voluntariados, pasantías y convocatorias reunidas en un solo lugar para facilitar la participación juvenil."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {opportunities.slice(0, 3).map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            to="/oportunidades"
            className={buttonVariants({ variant: 'primary', size: 'lg' })}
          >
            Ver oportunidades
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
