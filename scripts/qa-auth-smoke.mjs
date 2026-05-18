import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.local', '.env.qa.local']
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

    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    for (const line of lines) {
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

function classifyAuthError(message) {
  const normalized = message.toLowerCase()
  if (normalized.includes('email not confirmed')) {
    return 'BLOCKED_EMAIL_CONFIRMATION'
  }
  if (normalized.includes('rate limit')) {
    return 'BLOCKED_EMAIL_RATE_LIMIT'
  }
  return 'FAILED_AUTH'
}

function missingKeys() {
  return REQUIRED_KEYS.filter((key) => !process.env[key])
}

function safeResult(result) {
  return JSON.stringify(result, null, 2)
}

async function signIn(label, email, password) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )

  const login = await supabase.auth.signInWithPassword({ email, password })
  if (login.error) {
    return {
      label,
      status: classifyAuthError(login.error.message),
      message: login.error.message,
    }
  }

  const sessionResult = await supabase.auth.getSession()
  if (sessionResult.error || !sessionResult.data.session?.user) {
    return {
      label,
      status: 'FAILED_SESSION',
      message: sessionResult.error?.message ?? 'No se obtuvo sesion.',
    }
  }

  const userId = sessionResult.data.session.user.id

  const [profile, devotionals, posts, prayers] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, username, city, country, church_name, bio')
      .eq('id', userId)
      .maybeSingle(),
    supabase
      .from('devotionals')
      .select('id, title, devotional_date')
      .order('devotional_date', { ascending: false })
      .limit(1),
    supabase
      .from('posts')
      .select('id, user_id, body, verse_reference')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('prayer_requests')
      .select('id, user_id, title, is_answered, visibility')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  await supabase.auth.signOut()

  const errors = [profile, devotionals, posts, prayers]
    .map((result) => result.error?.message)
    .filter(Boolean)

  return {
    label,
    status: errors.length ? 'FAILED_READS' : 'OK',
    session: 'OK',
    profile: profile.data ? 'OK' : 'EMPTY',
    devotionals: devotionals.data?.length ?? 0,
    posts: posts.data?.length ?? 0,
    prayers: prayers.data?.length ?? 0,
    errors,
  }
}

async function main() {
  loadLocalEnv()

  const missing = missingKeys()
  if (missing.length) {
    console.log(
      safeResult({
        status: 'BLOCKED_MISSING_QA_ENV',
        missing,
        hint: 'Configura variables QA locales en .env.qa.local o .env.local.',
      }),
    )
    return
  }

  const userA = await signIn(
    'USER_A',
    process.env.QA_USER_A_EMAIL,
    process.env.QA_USER_A_PASSWORD,
  )
  const userB = await signIn(
    'USER_B',
    process.env.QA_USER_B_EMAIL,
    process.env.QA_USER_B_PASSWORD,
  )

  const results = [userA, userB]
  const blocked = results.find((result) => result.status.startsWith('BLOCKED_'))
  const failed = results.find((result) => result.status.startsWith('FAILED_'))

  console.log(
    safeResult({
      status: blocked?.status ?? (failed ? 'FAILED' : 'OK'),
      users: results,
    }),
  )

  if (failed && !blocked) process.exitCode = 1
}

await main()
