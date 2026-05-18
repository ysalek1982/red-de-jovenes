import {
  CalendarDays,
  FileText,
  GraduationCap,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import {
  dashboardEvents,
  opportunities,
  programs,
  stats,
  youthRecords,
  type EventStatus,
  type YouthStatus,
} from '../data/mockData'

function getEventVariant(status: EventStatus) {
  if (status === 'Próximo') return 'success'
  if (status === 'En curso') return 'warning'
  return 'muted'
}

function getYouthVariant(status: YouthStatus) {
  if (status === 'Activo') return 'success'
  if (status === 'Nuevo') return 'brand'
  return 'warning'
}

const quickActions = [
  { label: 'Nuevo evento', icon: CalendarDays },
  { label: 'Registrar joven', icon: Plus },
  { label: 'Publicar oportunidad', icon: FileText },
  { label: 'Configurar módulos', icon: Settings },
]

export function Dashboard() {
  const kpis = [
    {
      label: 'Jóvenes registrados',
      value: stats[0].value,
      helper: 'Base simulada',
      icon: Users,
    },
    {
      label: 'Programas activos',
      value: String(programs.length),
      helper: 'Categorías disponibles',
      icon: GraduationCap,
    },
    {
      label: 'Eventos visibles',
      value: String(dashboardEvents.length),
      helper: 'Calendario inicial',
      icon: CalendarDays,
    },
    {
      label: 'Oportunidades',
      value: String(opportunities.length),
      helper: 'Publicaciones vigentes',
      icon: FileText,
    },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Panel inicial preparado para futuro login"
        description="Vista administrativa sin autenticación real todavía. Muestra KPIs, registros simulados, eventos y accesos rápidos para la siguiente fase."
      />

      <section className="bg-slate-50 py-12">
        <div className="section-shell space-y-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon
              return (
                <Card key={kpi.label} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{kpi.label}</p>
                      <p className="mt-3 text-3xl font-bold text-brand-900">{kpi.value}</p>
                      <p className="mt-2 text-sm text-slate-500">{kpi.helper}</p>
                    </div>
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-youth-50 text-youth-700">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              )
            })}
          </div>

          <Card className="p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-brand-900">Accesos rápidos</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Controles visuales preparados para conectar permisos y acciones reales.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button key={action.label} type="button" variant="secondary" size="sm">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </Card>

          <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-brand-900">Jóvenes registrados</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Tabla simulada para validar estructura antes de integrar base de datos.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="px-6 py-3 font-semibold">ID</th>
                      <th className="px-6 py-3 font-semibold">Nombre</th>
                      <th className="px-6 py-3 font-semibold">Edad</th>
                      <th className="px-6 py-3 font-semibold">Ciudad</th>
                      <th className="px-6 py-3 font-semibold">Programa</th>
                      <th className="px-6 py-3 font-semibold">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {youthRecords.map((record) => (
                      <tr key={record.id} className="bg-white">
                        <td className="px-6 py-4 font-semibold text-brand-800">{record.id}</td>
                        <td className="px-6 py-4 text-slate-800">{record.name}</td>
                        <td className="px-6 py-4 text-slate-600">{record.age}</td>
                        <td className="px-6 py-4 text-slate-600">{record.city}</td>
                        <td className="px-6 py-4 text-slate-600">{record.program}</td>
                        <td className="px-6 py-4">
                          <Badge variant={getYouthVariant(record.status)}>{record.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-2xl font-bold text-brand-900">Eventos</h2>
                <p className="mt-2 text-sm text-slate-600">Seguimiento inicial de cupos.</p>
              </div>
              <div className="divide-y divide-slate-100">
                {dashboardEvents.map((event) => (
                  <div key={event.id} className="space-y-3 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900">{event.title}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {event.registered} de {event.capacity} inscritos
                        </p>
                      </div>
                      <Badge variant={getEventVariant(event.status)}>{event.status}</Badge>
                    </div>
                    <div className="h-2 overflow-hidden rounded-sm bg-slate-100">
                      <div
                        className="h-full rounded-sm bg-youth-600"
                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
