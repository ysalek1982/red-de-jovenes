import { supabase } from '../../lib/supabase'
import type {
  DiscipleshipProgress,
  DiscipleshipStep,
  DiscipleshipTrack,
} from '../../types/database'

export type TrackWithSteps = DiscipleshipTrack & {
  discipleship_steps?: DiscipleshipStep[]
}

export async function getActiveTracks() {
  const { data, error } = await supabase
    .from('discipleship_tracks')
    .select('*, discipleship_steps(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as TrackWithSteps[]
}

export async function getMyDiscipleshipProgress(userId: string) {
  const { data, error } = await supabase
    .from('discipleship_progress')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as DiscipleshipProgress[]
}

export async function completeDiscipleshipStep(input: {
  userId: string
  trackId: string
  stepId: string
}) {
  const { data, error } = await supabase
    .from('discipleship_progress')
    .upsert(
      {
        user_id: input.userId,
        track_id: input.trackId,
        step_id: input.stepId,
      },
      { onConflict: 'user_id,step_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createDiscipleshipTrack(input: {
  title: string
  description?: string
  level?: string
  durationDays?: number
}) {
  const { data, error } = await supabase
    .from('discipleship_tracks')
    .insert({
      title: input.title,
      description: input.description || null,
      level: input.level || 'inicial',
      duration_days: input.durationDays || 7,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
