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

  const ownScore = await userA.supabase
    .from('game_scores')
    .insert({
      user_id: userA.user.id,
      game_key: 'versiculo-rapido',
      score: 2,
      total: 4,
    })
    .select('id')
    .single()

  const ownRead = await userA.supabase
    .from('game_scores')
    .select('id')
    .eq('user_id', userA.user.id)
    .limit(1)

  const crossInsert = await userB.supabase.from('game_scores').insert({
    user_id: userA.user.id,
    game_key: 'trivia-biblica',
    score: 1,
    total: 4,
  })

  if (ownScore.data?.id) {
    await userA.supabase.from('game_scores').delete().eq('id', ownScore.data.id)
  }

  await userA.supabase.auth.signOut()
  await userB.supabase.auth.signOut()

  const status =
    ownScore.data &&
    !ownRead.error &&
    crossInsert.error?.code === '42501'
      ? 'QA_GAMES_OK'
      : 'QA_GAMES_FAILED'

  if (status !== 'QA_GAMES_OK') process.exitCode = 1

  console.log(
    JSON.stringify(
      {
        status,
        ownScore: ownScore.data ? 'OK' : 'FAILED',
        ownRead: ownRead.error ? 'FAILED' : 'OK',
        crossUserScore: crossInsert.error ? 'DENIED' : 'FAILED',
      },
      null,
      2,
    ),
  )
}

await main()
