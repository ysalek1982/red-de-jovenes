import { supabase } from '../../lib/supabase'
import type { GameScore } from '../../types/database'
import type { FaithGameKey } from '../../data/faithGamesData'

const validGameKeys = new Set<FaithGameKey>([
  'versiculo-rapido',
  'trivia-biblica',
  'adivina-historia',
  'memory-match',
  'desafio-fe',
])

export async function saveGameScore(input: {
  userId: string
  gameKey: FaithGameKey
  score: number
  total: number
}) {
  if (!validGameKeys.has(input.gameKey)) {
    throw new Error('Juego no valido.')
  }

  if (input.total <= 0 || input.score < 0 || input.score > input.total) {
    throw new Error('Puntaje no valido.')
  }

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
    .select('id, user_id, game_key, score, total, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(60)

  if (error) throw error
  return (data ?? []) satisfies GameScore[]
}
