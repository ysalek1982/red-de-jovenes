import { CalendarDays, MapPin, Ticket } from 'lucide-react'
import type { Event, EventStatus } from '../../data/mockData'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

interface EventCardProps {
  event: Event
}

function getStatusVariant(status: EventStatus) {
  if (status === 'Próximo') return 'success'
  if (status === 'En curso') return 'warning'
  return 'muted'
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <img
        src={event.image}
        alt=""
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getStatusVariant(event.status)}>{event.status}</Badge>
          <Badge variant="brand">{event.category}</Badge>
        </div>
        <div>
          <h3 className="text-xl font-bold text-brand-900">{event.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{event.description}</p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-youth-600" aria-hidden="true" />
            {event.date} · {event.time}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-youth-600" aria-hidden="true" />
            {event.location}
          </span>
          <span className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-youth-600" aria-hidden="true" />
            {event.spots} cupos disponibles
          </span>
        </div>
        <Button
          type="button"
          variant={event.status === 'Finalizado' ? 'secondary' : 'accent'}
          disabled={event.status === 'Finalizado'}
          className="w-full"
        >
          {event.status === 'Finalizado' ? 'Inscripción cerrada' : 'Inscribirme'}
        </Button>
      </div>
    </Card>
  )
}
