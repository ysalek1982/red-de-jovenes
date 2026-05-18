import { useMemo, useState } from 'react'
import { ProgramCard } from '../components/cards/ProgramCard'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/button'
import { programs } from '../data/mockData'

type ProgramFilter = 'Todos' | (typeof programs)[number]['category']

export function Programs() {
  const [selectedCategory, setSelectedCategory] = useState<ProgramFilter>('Todos')

  const categories = useMemo<ProgramFilter[]>(
    () => ['Todos', ...Array.from(new Set(programs.map((program) => program.category)))],
    [],
  )

  const filteredPrograms =
    selectedCategory === 'Todos'
      ? programs
      : programs.filter((program) => program.category === selectedCategory)

  return (
    <>
      <PageHeader
        eyebrow="Programas"
        title="Rutas de formación y participación juvenil"
        description="Programas listos para crecer hacia inscripciones, cohortes, seguimiento de participantes y reportes de impacto."
      />

      <section className="bg-slate-50 py-12">
        <div className="section-shell space-y-8">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-semibold text-brand-900">Categorías</p>
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
