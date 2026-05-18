import { useMemo, useState } from 'react'
import { EventCard } from '../components/cards/EventCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/button'
import { events, type EventStatus } from '../data/mockData'

type CategoryFilter = 'Todas' | (typeof events)[number]['category']
type StatusFilter = 'Todos' | EventStatus

export function Events() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('Todas')
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('Todos')

  const categories = useMemo<CategoryFilter[]>(
    () => ['Todas', ...Array.from(new Set(events.map((event) => event.category)))],
    [],
  )
  const statuses: StatusFilter[] = ['Todos', 'Próximo', 'En curso', 'Finalizado']

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === 'Todas' || event.category === selectedCategory
    const matchesStatus = selectedStatus === 'Todos' || event.status === selectedStatus
    return matchesCategory && matchesStatus
  })

  return (
    <>
      <PageHeader
        eyebrow="Eventos"
        title="Actividades para aprender, conectar y servir"
        description="Explora encuentros, talleres, brigadas y foros de la Red. La inscripción es visual por ahora y queda preparada para una integración futura."
      />

      <section className="bg-slate-50 py-12">
        <div className="section-shell space-y-8">
          <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-brand-900">Filtrar por categoría</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    type="button"
                    size="sm"
                    variant={selectedCategory === category ? 'primary' : 'secondary'}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-900">Filtrar por estado</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={selectedStatus === status ? 'accent' : 'secondary'}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
