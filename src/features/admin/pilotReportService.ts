import { supabase } from '../../lib/supabase'
import type { PilotFeedback, PilotIncident } from '../../types/database'
import { getPilotMetrics, type PilotMetrics } from './pilotMetricsService'

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

async function getRowsInRange<T extends 'pilot_feedback' | 'pilot_incidents'>(
  table: T,
  from: string,
  to: string,
) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .gte('created_at', from)
    .lte('created_at', to)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

function metricLine(label: string, value: number) {
  return `- ${label}: ${value}`
}

export async function generatePilotReport(input: {
  from: string
  to: string
}) {
  const fromIso = new Date(`${input.from}T00:00:00.000Z`).toISOString()
  const toIso = new Date(`${input.to}T23:59:59.999Z`).toISOString()
  const [metrics, feedback, incidents] = await Promise.all([
    getPilotMetrics(),
    getRowsInRange('pilot_feedback', fromIso, toIso) as Promise<PilotFeedback[]>,
    getRowsInRange('pilot_incidents', fromIso, toIso) as Promise<PilotIncident[]>,
  ])

  return buildPilotReportMarkdown({
    from: input.from,
    to: input.to,
    metrics,
    feedback,
    incidents,
  })
}

function buildPilotReportMarkdown(input: {
  from: string
  to: string
  metrics: PilotMetrics
  feedback: PilotFeedback[]
  incidents: PilotIncident[]
}) {
  const { metrics, feedback, incidents } = input
  const openIncidents = incidents.filter(
    (incident) => incident.status === 'open' || incident.status === 'triage',
  )
  const averageRating =
    feedback.reduce((sum, item) => sum + (item.rating ?? 0), 0) /
    Math.max(1, feedback.filter((item) => item.rating).length)

  return `# Reporte de cierre del piloto

## 1. Resumen ejecutivo

Periodo evaluado: ${formatDate(input.from)} al ${formatDate(input.to)}.

Estado sugerido: revisar con el equipo pastoral antes de decidir beta.

## 2. Participacion

${metricLine('Usuarios registrados', metrics.adoption.users)}
${metricLine('Nuevos registros hoy', metrics.daily.newRegistrations)}
${metricLine('Usuarios activos hoy', metrics.daily.activeUsersToday)}
${metricLine('Perfiles incompletos', metrics.daily.incompleteProfiles)}

## 3. Uso por modulo

${metricLine('Publicaciones', metrics.community.posts)}
${metricLine('Comentarios', metrics.community.comments)}
${metricLine('Oraciones', metrics.community.prayers)}
${metricLine('Apoyos de oracion', metrics.community.prayerSupports)}
${metricLine('Juegos jugados', metrics.games.gameScores)}
${metricLine('Eventos activos', metrics.events.events)}
${metricLine('Mensajes enviados', metrics.messages.messages)}

## 4. Comunidad

${metricLine('Comunidades activas', metrics.community.approvedGroups)}
${metricLine('Miembros en comunidades', metrics.community.groupMembers)}
${metricLine('Sugerencias de comunidad', metrics.community.groupSuggestions)}

## 5. Contenido espiritual

${metricLine('Versiculos guardados', metrics.bible.savedVerses)}
${metricLine('Lecturas biblicas registradas', metrics.bible.bibleReads)}

## 6. IA y Biblia

${metricLine('Solicitudes IA', metrics.ai.aiActions)}
${metricLine('Eventos de costo IA', metrics.ai.aiCostEvents)}
${metricLine('Errores IA hoy', metrics.daily.aiErrorsToday)}

## 7. Seguridad y moderacion

${metricLine('Reportes pendientes', metrics.moderation.reportsPending)}
${metricLine('Reportes resueltos', metrics.moderation.reportsResolved)}
${metricLine('Incidentes abiertos', openIncidents.length)}

## 8. Feedback de usuarios

${metricLine('Feedback recibido', feedback.length)}
${metricLine('Rating promedio', Number.isFinite(averageRating) ? Number(averageRating.toFixed(1)) : 0)}

## 9. Incidentes

${metricLine('Incidentes registrados', incidents.length)}
${metricLine('Incidentes abiertos', openIncidents.length)}
${metricLine('Incidentes criticos abiertos', openIncidents.filter((item) => item.severity === 'critical').length)}

## 10. Hallazgos

- Completar con observaciones del equipo durante la reunion de cierre.
- Revisar primero incidentes criticos, feedback de categoria bug y reportes pendientes.

## 11. Recomendaciones

- Mantener monitoreo diario mientras dure el piloto.
- No pasar a beta si hay incidentes criticos abiertos.
- Revisar costos IA antes de ampliar el grupo.

## 12. Decision

- [ ] Continuar piloto.
- [ ] Pasar a beta.
- [ ] Corregir antes de beta.
- [ ] Detener.`
}
