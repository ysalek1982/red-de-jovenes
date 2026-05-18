import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EventCard } from '../cards/EventCard'
import { events } from '../../data/mockData'
import { buttonVariants } from '../ui/buttonVariants'
import { SectionHeading } from './SectionHeading'

export function UpcomingEventsSection() {
  const visibleEvents = events.filter((event) => event.status !== 'Finalizado').slice(0, 3)

  return (
    <section className="bg-white py-20">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Próximas actividades"
          title="Encuentros para conectar y activar"
          description="Eventos presenciales, virtuales e híbridos para jóvenes que quieren participar, aprender y servir."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/eventos" className={buttonVariants({ variant: 'secondary', size: 'lg' })}>
            Explorar calendario
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
