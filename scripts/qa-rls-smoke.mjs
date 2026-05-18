import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local']
const QA_KEYS = new Set([
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'QA_USER_B_EMAIL',
  'QA_USER_B_PASSWORD',
])
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'QA_USER_B_EMAIL',
  'QA_USER_B_PASSWORD',
]

function parseEnvValue(value) {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function loadLocalEnv() {
  for (const file of LOCAL_ENV_FILES) {
    if (!existsSync(file)) continue

    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue

      const separatorIndex = trimmed.indexOf('=')
      if (separatorIndex === -1) continue

      const key = trimmed.slice(0, separatorIndex).trim()
      if (QA_KEYS.has(key) && file !== '.env.qa.local') continue

      const value = parseEnvValue(trimmed.slice(separatorIndex + 1))
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

function makeClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}

async function signIn(label, email, password) {
  const supabase = makeClient()
  const login = await supabase.auth.signInWithPassword({ email, password })
  if (login.error) {
    return {
      label,
      status: classifyAuthError(login.error.message),
      message: login.error.message,
    }
  }

  const session = await supabase.auth.getSession()
  const user = session.data.session?.user
  if (session.error || !user) {
    return {
      label,
      status: 'FAILED_SESSION',
      message: session.error?.message ?? 'No se obtuvo sesion.',
    }
  }

  return { label, status: 'OK', supabase, user }
}

function summarizeDenied(result) {
  if (result.error) {
    return { status: 'DENIED', detail: result.error.code ?? 'ERROR' }
  }
  if (!result.data) {
    return { status: 'DENIED', detail: 'NO_ROWS' }
  }
  return { status: 'FAILED_ALLOWED', detail: 'ROW_UPDATED' }
}

async function cleanup(supabase, postId, prayerId, userId, originalBio) {
  const warnings = []

  if (postId) {
    const deletedPost = await supabase
      .from('posts')
      .delete()
      .eq('id', postId)
      .eq('user_id', userId)
    if (deletedPost.error) warnings.push('No se pudo limpiar post QA.')
  }

  if (prayerId) {
    const deletedPrayer = await supabase
      .from('prayer_requests')
      .delete()
      .eq('id', prayerId)
      .eq('user_id', userId)
    if (deletedPrayer.error) warnings.push('No se pudo limpiar oracion QA.')
  }

  const restoredProfile = await supabase
    .from('profiles')
    .update({ bio: originalBio })
    .eq('id', userId)
  if (restoredProfile.error) warnings.push('No se pudo restaurar bio QA.')

  return warnings
}

async function main() {
  loadLocalEnv()

  const missing = missingKeys()
  if (missing.length) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_QA_ENV',
          missing,
          hint: 'Configura dos usuarios QA confirmados en .env.qa.local o variables de entorno.',
        },
        null,
        2,
      ),
    )
    return
  }

  const userA = await signIn(
    'USER_A',
    process.env.QA_USER_A_EMAIL,
    process.env.QA_USER_A_PASSWORD,
  )
  if (userA.status !== 'OK') {
    console.log(JSON.stringify({ status: userA.status, users: [userA] }, null, 2))
    if (userA.status.startsWith('FAILED_')) process.exitCode = 1
    return
  }

  const userB = await signIn(
    'USER_B',
    process.env.QA_USER_B_EMAIL,
    process.env.QA_USER_B_PASSWORD,
  )
  if (userB.status !== 'OK') {
    await userA.supabase.auth.signOut()
    console.log(JSON.stringify({ status: userB.status, users: [userB] }, null, 2))
    if (userB.status.startsWith('FAILED_')) process.exitCode = 1
    return
  }

  const suffix = new Date().toISOString()
  const profileA = await userA.supabase
    .from('profiles')
    .select('id, bio')
    .eq('id', userA.user.id)
    .maybeSingle()

  const originalBio = profileA.data?.bio ?? null

  const ownProfileUpdate = await userA.supabase
    .from('profiles')
    .update({ bio: `QA RLS perfil ${suffix}` })
    .eq('id', userA.user.id)
    .select('id')
    .maybeSingle()

  const ownPost = await userA.supabase
    .from('posts')
    .insert({
      user_id: userA.user.id,
      body: `QA RLS post ${suffix}`,
      verse_reference: 'Mateo 5:14',
      verse_text: 'Vosotros sois la luz del mundo.',
    })
    .select('id')
    .single()

  const ownPrayer = await userA.supabase
    .from('prayer_requests')
    .insert({
      user_id: userA.user.id,
      title: `QA RLS oracion ${suffix}`,
      body: 'Peticion temporal para validar RLS.',
      visibility: 'public',
    })
    .select('id')
    .single()

  const readAllowed = await Promise.all([
    userB.supabase.from('posts').select('id').limit(1),
    userB.supabase
      .from('prayer_requests')
      .select('id')
      .eq('visibility', 'public')
      .limit(1),
    userB.supabase.from('devotionals').select('id').limit(1),
  ])

  const postUpdateByB = ownPost.data?.id
    ? await userB.supabase
        .from('posts')
        .update({ body: `QA RLS intento externo ${suffix}` })
        .eq('id', ownPost.data.id)
        .select('id')
        .maybeSingle()
    : { data: null, error: new Error('No se creo post A.') }

  const prayerUpdateByB = ownPrayer.data?.id
    ? await userB.supabase
        .from('prayer_requests')
        .update({ is_answered: true })
        .eq('id', ownPrayer.data.id)
        .select('id')
        .maybeSingle()
    : { data: null, error: new Error('No se creo oracion A.') }

  const profileUpdateByB = await userB.supabase
    .from('profiles')
    .update({ bio: `QA RLS intento perfil externo ${suffix}` })
    .eq('id', userA.user.id)
    .select('id')
    .maybeSingle()

  const cleanupWarnings = await cleanup(
    userA.supabase,
    ownPost.data?.id,
    ownPrayer.data?.id,
    userA.user.id,
    originalBio,
  )

  await userA.supabase.auth.signOut()
  await userB.supabase.auth.signOut()

  const result = {
    status: 'OK',
    ownWrites: {
      profile: ownProfileUpdate.error || !ownProfileUpdate.data ? 'FAILED' : 'OK',
      post: ownPost.error || !ownPost.data ? 'FAILED' : 'OK',
      prayer: ownPrayer.error || !ownPrayer.data ? 'FAILED' : 'OK',
    },
    allowedReads: {
      posts: readAllowed[0].error ? 'FAILED' : 'OK',
      prayers: readAllowed[1].error ? 'FAILED' : 'OK',
      devotionals: readAllowed[2].error ? 'FAILED' : 'OK',
    },
    deniedCrossUserWrites: {
      post: summarizeDenied(postUpdateByB),
      prayer: summarizeDenied(prayerUpdateByB),
      profile: summarizeDenied(profileUpdateByB),
    },
    cleanupWarnings,
  }

  const failedOwnWrite = Object.values(result.ownWrites).includes('FAILED')
  const failedRead = Object.values(result.allowedReads).includes('FAILED')
  const failedDenied = Object.values(result.deniedCrossUserWrites).some(
    (item) => item.status !== 'DENIED',
  )

  if (failedOwnWrite || failedRead || failedDenied) {
    result.status = 'FAILED_RLS'
    process.exitCode = 1
  }

  console.log(JSON.stringify(result, null, 2))
}

await main()
