import { useMemo, useState } from 'react'
import { OpportunityCard } from '../components/cards/OpportunityCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/button'
import { opportunities } from '../data/mockData'

type OpportunityFilter = 'Todas' | (typeof opportunities)[number]['type']

export function Opportunities() {
  const [selectedType, setSelectedType] = useState<OpportunityFilter>('Todas')

  const types = useMemo<OpportunityFilter[]>(
    () => ['Todas', ...Array.from(new Set(opportunities.map((item) => item.type)))],
    [],
  )

  const filteredOpportunities =
    selectedType === 'Todas'
      ? opportunities
      : opportunities.filter((opportunity) => opportunity.type === selectedType)

  return (
    <>
      <PageHeader
        eyebrow="Oportunidades"
        title="Becas, cursos, convocatorias y caminos de empleabilidad"
        description="Un espacio para centralizar oportunidades juveniles con información clara, requisitos visibles y preparación para postulaciones reales."
      />

      <section className="bg-slate-50 py-12">
        <div className="section-shell space-y-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-brand-900">Filtrar por tipo</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  type="button"
                  size="sm"
                  variant={selectedType === type ? 'accent' : 'secondary'}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
