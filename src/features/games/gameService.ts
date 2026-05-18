import { supabase } from '../../lib/supabase'
import type { GameScore } from '../../types/database'
import type { FaithGameKey } from '../../data/faithGamesData'

export async function saveGameScore(input: {
  userId: string
  gameKey: FaithGameKey
  score: number
  total: number
}) {
  const { data, error } = await supabase
    .from('game_scores')
    .insert({
      user_id: input.userId,
      game_key: input.gameKey,
      score: input.score,
      total: input.total,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getMyGameScores(userId: string) {
  const { data, error } = await supabase
    .from('game_scores')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(12)

  if (error) throw error
  return (data ?? []) satisfies GameScore[]
}
