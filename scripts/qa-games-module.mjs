import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'QA_USER_B_EMAIL',
  'QA_USER_B_PASSWORD',
]
const GAME_KEYS = [
  'versiculo-rapido',
  'trivia-biblica',
  'adivina-historia',
  'memory-match',
  'desafio-fe',
]

function loadLocalEnv() {
  for (const file of LOCAL_ENV_FILES) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue
      const key = trimmed.slice(0, separatorIndex).trim()
      const value = trimmed.slice(separatorIndex + 1).trim()
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function makeClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}

async function signIn(email, password) {
  const supabase = makeClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error || !data.user) throw error ?? new Error('No se obtuvo usuario.')
  return { supabase, user: data.user }
}

async function main() {
  loadLocalEnv()
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_QA_ENV', missing }, null, 2))
    return
  }

  const userA = await signIn(
    process.env.QA_USER_A_EMAIL,
    process.env.QA_USER_A_PASSWORD,
  )
  const userB = await signIn(
    process.env.QA_USER_B_EMAIL,
    process.env.QA_USER_B_PASSWORD,
  )

  const insertedIds = []
  const gameResults = {}

  for (const [index, gameKey] of GAME_KEYS.entries()) {
    const score = await userA.supabase
      .from('game_scores')
      .insert({
        user_id: userA.user.id,
        game_key: gameKey,
        score: index + 1,
        total: GAME_KEYS.length,
      })
      .select('id, game_key')
      .single()

    if (score.data?.id) insertedIds.push(score.data.id)
    gameResults[gameKey] = score.data?.game_key === gameKey ? 'OK' : 'FAILED'
  }

  const ownHistory = await userA.supabase
    .from('game_scores')
    .select('id, game_key')
    .eq('user_id', userA.user.id)
    .in('game_key', GAME_KEYS)

  const crossInsert = await userB.supabase.from('game_scores').insert({
    user_id: userA.user.id,
    game_key: 'trivia-biblica',
    score: 1,
    total: 4,
  })

  const invalidScore = await userA.supabase.from('game_scores').insert({
    user_id: userA.user.id,
    game_key: 'versiculo-rapido',
    score: 9,
    total: 4,
  })

  const invalidGameKey = await userA.supabase.from('game_scores').insert({
    user_id: userA.user.id,
    game_key: 'juego-inexistente',
    score: 1,
    total: 4,
  })

  if (insertedIds.length) {
    await userA.supabase.from('game_scores').delete().in('id', insertedIds)
  }

  await userA.supabase.auth.signOut()
  await userB.supabase.auth.signOut()

  const allGameKeysOk = Object.values(gameResults).every((result) => result === 'OK')
  const ownHistoryOk =
    !ownHistory.error &&
    GAME_KEYS.every((gameKey) =>
      (ownHistory.data ?? []).some((row) => row.game_key === gameKey),
    )
  const crossUserDenied = crossInsert.error?.code === '42501'
  const invalidScoreDenied = invalidScore.error?.code === '23514'
  const invalidGameKeyDenied = invalidGameKey.error?.code === '23514'

  const status =
    allGameKeysOk &&
    ownHistoryOk &&
    crossUserDenied &&
    invalidScoreDenied &&
    invalidGameKeyDenied
      ? 'QA_GAMES_OK'
      : 'QA_GAMES_FAILED'

  if (status !== 'QA_GAMES_OK') process.exitCode = 1

  console.log(
    JSON.stringify(
      {
        status,
        gameScores: gameResults,
        ownHistory: ownHistoryOk ? 'OK' : 'FAILED',
        crossUserScore: crossUserDenied ? 'DENIED' : 'FAILED',
        invalidScore: invalidScoreDenied ? 'DENIED' : 'FAILED',
        invalidGameKey: invalidGameKeyDenied ? 'DENIED' : 'FAILED',
      },
      null,
      2,
    ),
  )
}

await main()
