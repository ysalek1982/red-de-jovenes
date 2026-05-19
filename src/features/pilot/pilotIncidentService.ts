import { supabase } from '../../lib/supabase'
import type { PilotIncident } from '../../types/database'

export type PilotIncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type PilotIncidentStatus = 'open' | 'triage' | 'resolved' | 'closed'

export async function createPilotIncident(input: {
  reportedBy: string
  severity: PilotIncidentSeverity
  module?: string
  title: string
  description?: string
}) {
  const { data, error } = await supabase
    .from('pilot_incidents')
    .insert({
      reported_by: input.reportedBy,
      severity: input.severity,
      module: input.module || null,
      title: input.title,
      description: input.description || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAdminPilotIncidents() {
  const { data, error } = await supabase
    .from('pilot_incidents')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) throw error
  return (data ?? []) as PilotIncident[]
}

export async function updatePilotIncident(input: {
  incidentId: string
  status: PilotIncidentStatus
  resolution?: string
  resolvedBy?: string
}) {
  const isResolved = input.status === 'resolved' || input.status === 'closed'
  const { data, error } = await supabase
    .from('pilot_incidents')
    .update({
      status: input.status,
      resolution: input.resolution || null,
      resolved_by: isResolved ? input.resolvedBy ?? null : null,
      resolved_at: isResolved ? new Date().toISOString() : null,
    })
    .eq('id', input.incidentId)
    .select()
    .single()

  if (error) throw error
  return data
}

export function summarizePilotIncidents(items: PilotIncident[]) {
  const open = items.filter((item) => item.status === 'open' || item.status === 'triage')
  const critical = open.filter((item) => item.severity === 'critical')
  const resolved = items.filter(
    (item) => item.status === 'resolved' || item.status === 'closed',
  )

  return {
    total: items.length,
    open: open.length,
    critical: critical.length,
    resolved: resolved.length,
  }
}
