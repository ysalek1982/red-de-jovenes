import { supabase } from '../../lib/supabase'

export type ReportTargetType =
  | 'post'
  | 'comment'
  | 'prayer_request'
  | 'profile'

export async function createContentReport(input: {
  reporterId: string
  targetType: ReportTargetType
  targetId: string
  reason: string
  details?: string
}) {
  const { data, error } = await supabase
    .from('content_reports')
    .insert({
      reporter_id: input.reporterId,
      target_type: input.targetType,
      target_id: input.targetId,
      reason: input.reason,
      details: input.details || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyReports(userId: string) {
  const { data, error } = await supabase
    .from('content_reports')
    .select('*')
    .eq('reporter_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
