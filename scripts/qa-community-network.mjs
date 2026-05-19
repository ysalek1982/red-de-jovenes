import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local', '.env.admin.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'QA_USER_B_EMAIL',
  'QA_USER_B_PASSWORD',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
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
      const value = parseEnvValue(trimmed.slice(separatorIndex + 1))
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function fail(status, details = {}) {
  console.error(JSON.stringify({ status, ...details }, null, 2))
  process.exit(1)
}

function denied(response) {
  return Boolean(response.error) || !response.data || response.data.length === 0
}

async function signIn(label, email, password) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    const message = error?.message.toLowerCase() ?? ''
    if (message.includes('email not confirmed')) {
      fail('BLOCKED_EMAIL_CONFIRMATION', { label })
    }
    if (message.includes('rate limit')) {
      fail('BLOCKED_EMAIL_RATE_LIMIT', { label })
    }
    fail('FAILED_COMMUNITY_AUTH', { label, error: error?.message })
  }

  return { supabase, user: data.user, label }
}

loadLocalEnv()

const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
if (missing.length) {
  fail('BLOCKED_MISSING_QA_ENV', { missing })
}

const suffix = Date.now()
const warnings = []

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
const admin = await signIn('ADMIN', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

const activeGroup = await userA.supabase
  .from('groups')
  .select('id,name')
  .eq('is_active', true)
  .limit(1)
  .maybeSingle()

if (activeGroup.error || !activeGroup.data) {
  fail('FAILED_COMMUNITY_GROUP_READ', { error: activeGroup.error?.message })
}

const membership = await userA.supabase
  .from('group_members')
  .upsert(
    {
      group_id: activeGroup.data.id,
      user_id: userA.user.id,
      role: 'member',
      status: 'active',
    },
    { onConflict: 'group_id,user_id' },
  )
  .select('id,group_id,user_id')
  .single()

if (membership.error || !membership.data) {
  fail('FAILED_COMMUNITY_JOIN', { error: membership.error?.message })
}

const myMemberships = await userA.supabase
  .from('group_members')
  .select('id,group_id')
  .eq('user_id', userA.user.id)

const post = await userA.supabase
  .from('posts')
  .insert({
    user_id: userA.user.id,
    body: `QA red comunitaria ${suffix}`,
    verse_reference: 'Hebreos 10:24',
    group_id: activeGroup.data.id,
  })
  .select('id,group_id')
  .single()

const prayer = await userA.supabase
  .from('prayer_requests')
  .insert({
    user_id: userA.user.id,
    title: `QA oracion comunitaria ${suffix}`,
    body: 'Peticion temporal para validar red comunitaria.',
    visibility: 'public',
    category: 'fe',
    is_anonymous: false,
    group_id: activeGroup.data.id,
  })
  .select('id,group_id')
  .single()

const crossUserPost = await userB.supabase
  .from('posts')
  .insert({
    user_id: userB.user.id,
    body: `Intento comunidad ajena ${suffix}`,
    group_id: activeGroup.data.id,
  })
  .select('id')

const crossUserPrayer = await userB.supabase
  .from('prayer_requests')
  .insert({
    user_id: userB.user.id,
    title: `Intento oracion ajena ${suffix}`,
    body: 'No debe permitirse.',
    visibility: 'public',
    category: 'fe',
    group_id: activeGroup.data.id,
  })
  .select('id')

const report = post.data?.id
  ? await userA.supabase
      .from('content_reports')
      .insert({
        reporter_id: userA.user.id,
        target_type: 'post',
        target_id: post.data.id,
        reason: 'QA red comunitaria',
        details: 'Reporte temporal de QA community.',
      })
      .select('id')
      .single()
  : { data: null, error: post.error ?? new Error('No se creo post.') }

const adminReports = await admin.supabase
  .from('content_reports')
  .select('id,status')
  .eq('status', 'pending')
  .limit(5)

const adminRole = await admin.supabase.rpc('has_role', {
  required_role: 'admin',
})

const cleanupPost = post.data?.id
  ? await userA.supabase.from('posts').delete().eq('id', post.data.id)
  : { error: null }
if (cleanupPost.error) warnings.push('No se pudo limpiar post comunitario QA.')

const cleanupPrayer = prayer.data?.id
  ? await userA.supabase.from('prayer_requests').delete().eq('id', prayer.data.id)
  : { error: null }
if (cleanupPrayer.error) warnings.push('No se pudo limpiar oracion comunitaria QA.')

const cleanupMembership = membership.data?.id
  ? await userA.supabase.from('group_members').delete().eq('id', membership.data.id)
  : { error: null }
if (cleanupMembership.error) warnings.push('No se pudo limpiar membresia QA.')

await userA.supabase.auth.signOut()
await userB.supabase.auth.signOut()
await admin.supabase.auth.signOut()

const checks = {
  joinCommunity: membership.data ? 'OK' : 'FAILED',
  myCommunities: myMemberships.data?.length ? 'OK' : 'FAILED',
  communityPost: post.data?.group_id === activeGroup.data.id ? 'OK' : 'FAILED',
  communityPrayer:
    prayer.data?.group_id === activeGroup.data.id ? 'OK' : 'FAILED',
  crossUserPost: denied(crossUserPost) ? 'DENIED' : 'FAILED_ALLOWED',
  crossUserPrayer: denied(crossUserPrayer) ? 'DENIED' : 'FAILED_ALLOWED',
  reportCreate: report.data ? 'OK' : 'FAILED',
  adminReports: adminReports.error ? 'FAILED' : 'OK',
  adminRole: adminRole.data === true ? 'OK' : 'FAILED',
}

const failed = Object.values(checks).some(
  (value) => value !== 'OK' && value !== 'DENIED',
)

if (failed) {
  fail('QA_COMMUNITY_FAILED', {
    ...checks,
    postError: post.error?.message,
    prayerError: prayer.error?.message,
    reportError: report.error?.message,
    adminReportsError: adminReports.error?.message,
    adminRoleError: adminRole.error?.message,
    crossUserPostError: crossUserPost.error?.message,
    crossUserPrayerError: crossUserPrayer.error?.message,
    warnings,
  })
}

console.log(
  JSON.stringify(
    {
      status: 'QA_COMMUNITY_OK',
      ...checks,
      cleanupWarnings: warnings,
    },
    null,
    2,
  ),
)
