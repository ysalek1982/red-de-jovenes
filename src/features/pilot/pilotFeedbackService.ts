import { supabase } from '../../lib/supabase'
import type { PilotFeedback } from '../../types/database'

export const pilotFeedbackCategories = [
  'bug',
  'mejora',
  'confuso',
  'contenido',
  'comunidad',
  'pwa',
  'ia',
  'biblia',
  'otro',
] as const

export type PilotFeedbackCategory = (typeof pilotFeedbackCategories)[number]
export type PilotFeedbackStatus =
  | 'new'
  | 'reviewing'
  | 'planned'
  | 'resolved'
  | 'dismissed'

function isQaPilotFeedback(item: PilotFeedback) {
  return (
    item.module?.trim().toUpperCase() === 'QA' ||
    item.device?.trim().toUpperCase() === 'QA' ||
    item.title.trim().toUpperCase().startsWith('QA ')
  )
}

export async function createPilotFeedback(input: {
  userId: string
  category: PilotFeedbackCategory
  module?: string
  rating?: number
  title: string
  detail?: string
  device?: string
  browser?: string
}) {
  const { data, error } = await supabase
    .from('pilot_feedback')
    .insert({
      user_id: input.userId,
      category: input.category,
      module: input.module || null,
      rating: input.rating ?? null,
      title: input.title,
      detail: input.detail || null,
      device: input.device || null,
      browser: input.browser || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyPilotFeedback(userId: string) {
  const { data, error } = await supabase
    .from('pilot_feedback')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as PilotFeedback[]
}

export async function getAdminPilotFeedback() {
  const { data, error } = await supabase
    .from('pilot_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return ((data ?? []) as PilotFeedback[])
    .filter((item) => !isQaPilotFeedback(item))
    .slice(0, 50)
}

export async function getAdminQaPilotFeedback() {
  const { data, error } = await supabase
    .from('pilot_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) throw error
  return ((data ?? []) as PilotFeedback[])
    .filter(isQaPilotFeedback)
    .slice(0, 50)
}

export async function updatePilotFeedbackStatus(input: {
  feedbackId: string
  status: PilotFeedbackStatus
  adminNote?: string
}) {
  const { data, error } = await supabase
    .from('pilot_feedback')
    .update({
      status: input.status,
      admin_note: input.adminNote || null,
    })
    .eq('id', input.feedbackId)
    .select()
    .single()

  if (error) throw error
  return data
}

export function summarizePilotFeedback(items: PilotFeedback[]) {
  const realItems = items.filter((item) => !isQaPilotFeedback(item))
  const byCategory = new Map<string, number>()
  const byModule = new Map<string, number>()
  let ratingSum = 0
  let ratingCount = 0

  for (const item of realItems) {
    byCategory.set(item.category, (byCategory.get(item.category) ?? 0) + 1)
    if (item.module) byModule.set(item.module, (byModule.get(item.module) ?? 0) + 1)
    if (typeof item.rating === 'number') {
      ratingSum += item.rating
      ratingCount += 1
    }
  }

  return {
    total: realItems.length,
    newCount: realItems.filter((item) => item.status === 'new').length,
    averageRating: ratingCount ? Number((ratingSum / ratingCount).toFixed(1)) : 0,
    byCategory: Array.from(byCategory.entries()).map(([label, value]) => ({
      label,
      value,
    })),
    byModule: Array.from(byModule.entries()).map(([label, value]) => ({
      label,
      value,
    })),
  }
}
