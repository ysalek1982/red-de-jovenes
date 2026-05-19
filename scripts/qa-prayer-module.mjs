import { readFileSync, existsSync } from 'node:fs'
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

    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separator = trimmed.indexOf('=')
      if (separator === -1) continue

      const key = trimmed.slice(0, separator)
      const value = trimmed.slice(separator + 1)
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function fail(status, details = {}) {
  console.error(JSON.stringify({ status, ...details }, null, 2))
  process.exit(1)
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

  if (error) {
    const message = error.message.toLowerCase()
    if (message.includes('email not confirmed')) {
      fail('BLOCKED_EMAIL_CONFIRMATION', { label })
    }
    if (message.includes('rate limit')) {
      fail('BLOCKED_EMAIL_RATE_LIMIT', { label })
    }
    fail('FAILED_PRAYER_AUTH', { label, error: error.message })
  }

  return { supabase, user: data.user, label }
}

function okNoRows(response) {
  return !response.error && (!response.data || response.data.length === 0)
}

function denied(response) {
  return Boolean(response.error) || !response.data || response.data.length === 0
}

loadLocalEnv()

const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
if (missing.length) {
  fail('BLOCKED_MISSING_QA_ENV', { missing })
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

const suffix = Date.now()
const warnings = []

const activeGroup = await userA.supabase
  .from('groups')
  .select('id,name')
  .eq('is_active', true)
  .limit(1)
  .maybeSingle()

if (activeGroup.error || !activeGroup.data) {
  fail('FAILED_PRAYER_GROUP_READ', { error: activeGroup.error?.message })
}

let membership = await userA.supabase
  .from('group_members')
  .select('id')
  .eq('group_id', activeGroup.data.id)
  .eq('user_id', userA.user.id)
  .maybeSingle()

if (!membership.data && !membership.error) {
  membership = await userA.supabase
    .from('group_members')
    .insert({
      group_id: activeGroup.data.id,
      user_id: userA.user.id,
      role: 'member',
      status: 'active',
    })
    .select('id')
    .single()

  if (membership.error?.code === '23505') {
    membership = await userA.supabase
      .from('group_members')
      .select('id')
      .eq('group_id', activeGroup.data.id)
      .eq('user_id', userA.user.id)
      .maybeSingle()
  }
}

if (membership.error || !membership.data) {
  fail('FAILED_PRAYER_GROUP_MEMBERSHIP', { error: membership.error?.message })
}

const prayer = await userA.supabase
  .from('prayer_requests')
  .insert({
    user_id: userA.user.id,
    title: `QA Oracion ${suffix}`,
    body: 'Peticion temporal para auditoria funcional de sala de oracion.',
    visibility: 'public',
    category: 'fe',
    is_anonymous: true,
    group_id: activeGroup.data.id,
  })
  .select('id,is_answered,user_id,category,is_anonymous,group_id')
  .single()

if (prayer.error || !prayer.data) {
  fail('FAILED_PRAYER_CREATE', { error: prayer.error?.message })
}

const support = await userA.supabase
  .from('prayer_supports')
  .insert({
    prayer_request_id: prayer.data.id,
    user_id: userA.user.id,
  })
  .select('id')
  .single()

if (support.error || !support.data) {
  fail('FAILED_PRAYER_SUPPORT', { error: support.error?.message })
}

const duplicateSupport = await userA.supabase.from('prayer_supports').insert({
  prayer_request_id: prayer.data.id,
  user_id: userA.user.id,
})

const duplicateDenied = duplicateSupport.error?.code === '23505'

const crossUserUpdate = await userB.supabase
  .from('prayer_requests')
  .update({ is_answered: true })
  .eq('id', prayer.data.id)
  .select('id')

const crossUserDenied = okNoRows(crossUserUpdate)

const crossUserGroupPrayer = await userB.supabase
  .from('prayer_requests')
  .insert({
    user_id: userB.user.id,
    title: `Intento QA comunidad ajena ${suffix}`,
    body: 'No debe permitirse en comunidad ajena.',
    visibility: 'public',
    category: 'fe',
    is_anonymous: false,
    group_id: activeGroup.data.id,
  })
  .select('id')

const markAnswered = await userA.supabase
  .from('prayer_requests')
  .update({
    is_answered: true,
    answered_testimony: 'Testimonio temporal QA.',
    answered_at: new Date().toISOString(),
  })
  .eq('id', prayer.data.id)
  .eq('user_id', userA.user.id)
  .select('id,is_answered')
  .single()

if (markAnswered.error || markAnswered.data?.is_answered !== true) {
  fail('FAILED_PRAYER_MARK_ANSWERED', { error: markAnswered.error?.message })
}

if (
  prayer.data.category !== 'fe' ||
  prayer.data.is_anonymous !== true ||
  prayer.data.group_id !== activeGroup.data.id
) {
  fail('FAILED_PRAYER_CATEGORY_ANONYMITY')
}

const readBack = await userA.supabase
  .from('prayer_requests')
  .select('id,group_id,groups:group_id(id,name),prayer_supports(id,user_id)')
  .eq('id', prayer.data.id)
  .single()

if (
  readBack.error ||
  readBack.data?.group_id !== activeGroup.data.id ||
  !readBack.data?.groups ||
  readBack.data?.prayer_supports?.length !== 1
) {
  fail('FAILED_PRAYER_SUPPORT_COUNT', { error: readBack.error?.message })
}

const deleted = await userA.supabase
  .from('prayer_requests')
  .delete()
  .eq('id', prayer.data.id)
  .eq('user_id', userA.user.id)

if (deleted.error) warnings.push('No se pudo limpiar la peticion QA.')

const cleanupMembership = await userA.supabase
  .from('group_members')
  .delete()
  .eq('id', membership.data.id)

if (cleanupMembership.error) warnings.push('No se pudo limpiar membresia QA.')

const crossUserGroupPrayerDenied = denied(crossUserGroupPrayer)

if (!duplicateDenied || !crossUserDenied || !crossUserGroupPrayerDenied) {
  fail('FAILED_PRAYER_RLS_EXPECTATION', {
    duplicateDenied,
    crossUserDenied,
    crossUserGroupPrayerDenied,
    duplicateError: duplicateSupport.error?.code,
    crossUserError: crossUserUpdate.error?.message,
    crossUserGroupPrayerError: crossUserGroupPrayer.error?.message,
  })
}

console.log(
  JSON.stringify(
    {
      status: 'QA_PRAYER_OK',
      createPrayer: 'OK',
      supportPrayer: 'OK',
      duplicateSupport: 'DENIED',
      crossUserMarkAnswered: 'DENIED',
      ownMarkAnswered: 'OK',
      category: 'OK',
      anonymity: 'OK',
      groupContext: 'OK',
      crossUserGroupPrayer: 'DENIED',
      supportCount: 1,
      cleanupWarnings: warnings,
    },
    null,
    2,
  ),
)
