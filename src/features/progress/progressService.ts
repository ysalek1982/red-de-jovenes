import { supabase } from '../../lib/supabase'
import { faithGames } from '../../data/faithGamesData'

export interface FaithProgressSummary {
  devotionalReads: number
  gamesPlayed: number
  prayerSupports: number
  totalGamePoints: number
  lastGame: {
    title: string
    score: number
    total: number
  } | null
}

function getGameTitle(gameKey: string) {
  return faithGames.find((game) => game.key === gameKey)?.title ?? gameKey
}

export async function getMyFaithProgress(
  userId: string,
): Promise<FaithProgressSummary> {
  const [devotionalReads, games, prayerSupports, lastGame] = await Promise.all([
    supabase
      .from('devotional_reads')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('game_scores')
      .select('score')
      .eq('user_id', userId),
    supabase
      .from('prayer_supports')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId),
    supabase
      .from('game_scores')
      .select('game_key, score, total')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  for (const result of [devotionalReads, games, prayerSupports, lastGame]) {
    if (result.error) throw result.error
  }

  return {
    devotionalReads: devotionalReads.count ?? 0,
    gamesPlayed: games.data?.length ?? 0,
    prayerSupports: prayerSupports.count ?? 0,
    totalGamePoints:
      games.data?.reduce((total, item) => total + item.score, 0) ?? 0,
    lastGame: lastGame.data
      ? {
          title: getGameTitle(lastGame.data.game_key),
          score: lastGame.data.score,
          total: lastGame.data.total,
        }
      : null,
  }
}
