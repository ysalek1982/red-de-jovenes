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

function denied(result) {
  return Boolean(result.error) || !result.data || result.data.length === 0
}

async function main() {
  loadLocalEnv()
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_QA_ENV', missing }, null, 2))
    return
  }

  const suffix = new Date().toISOString().replace(/[:.]/g, '-')
  const groupName = `QA comunidad mapa ${suffix}`
  const country = 'Bolivia'
  const city = 'Santa Cruz de la Sierra'

  const userA = await signIn(
    process.env.QA_USER_A_EMAIL,
    process.env.QA_USER_A_PASSWORD,
  )
  const userB = await signIn(
    process.env.QA_USER_B_EMAIL,
    process.env.QA_USER_B_PASSWORD,
  )
  const admin = await signIn(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

  const groupsRead = await userA.supabase
    .from('groups')
    .select('id, name, country, city')
    .eq('is_active', true)
    .limit(5)

  const suggestion = await userA.supabase
    .from('group_suggestions')
    .insert({
      user_id: userA.user.id,
      name: groupName,
      country,
      city,
      church_name: 'Red de Jovenes QA',
      contact_url: 'https://example.com/red-jovenes-qa',
      meeting_info: 'Reunion temporal de QA.',
      description: 'Sugerencia temporal para validar el mapa mundial.',
    })
    .select('id, name, country, city, status')
    .single()

  const ownSuggestionRead = suggestion.data?.id
    ? await userA.supabase
        .from('group_suggestions')
        .select('id, status')
        .eq('id', suggestion.data.id)
        .maybeSingle()
    : { data: null, error: suggestion.error ?? new Error('No se creo sugerencia.') }

  const crossUserSuggestionUpdate = suggestion.data?.id
    ? await userB.supabase
        .from('group_suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestion.data.id)
        .select('id')
    : { data: null, error: suggestion.error ?? new Error('No se creo sugerencia.') }

  const normalGroupInsert = await userA.supabase
    .from('groups')
    .insert({
      name: `${groupName} directa`,
      country,
      city,
      is_active: true,
    })
    .select('id')

  const suggestionApproval = suggestion.data?.id
    ? await admin.supabase
        .from('group_suggestions')
        .update({
          status: 'approved',
          internal_note: 'Aprobada por QA automatizado.',
          reviewed_by: admin.user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', suggestion.data.id)
        .select('id, status')
        .single()
    : { data: null, error: suggestion.error ?? new Error('No se creo sugerencia.') }

  const groupInsert = suggestionApproval.data
    ? await admin.supabase
        .from('groups')
        .insert({
          name: groupName,
          country,
          city,
          church_name: 'Red de Jovenes QA',
          contact_url: 'https://example.com/red-jovenes-qa',
          meeting_info: 'Reunion temporal de QA.',
          description: 'Grupo activo temporal aprobado por QA.',
          is_active: true,
        })
        .select('id')
        .single()
    : { data: null, error: suggestionApproval.error ?? new Error('No se aprobo.') }

  const activeGroupRead = groupInsert.data?.id
    ? await userA.supabase
        .from('groups')
        .select('id, name, country, city')
        .eq('id', groupInsert.data.id)
        .eq('is_active', true)
        .maybeSingle()
    : { data: null, error: groupInsert.error ?? new Error('No se creo grupo.') }

  const membership = activeGroupRead.data?.id
    ? await userA.supabase
        .from('group_members')
        .upsert(
          {
            group_id: activeGroupRead.data.id,
            user_id: userA.user.id,
            role: 'member',
            status: 'active',
          },
          { onConflict: 'group_id,user_id' },
        )
        .select('id, group_id, user_id, status')
        .single()
    : { data: null, error: activeGroupRead.error ?? new Error('No se encontro grupo.') }

  const ownMembershipRead = membership.data?.id
    ? await userA.supabase
        .from('group_members')
        .select('id, group_id, user_id, status')
        .eq('id', membership.data.id)
        .maybeSingle()
    : { data: null, error: membership.error ?? new Error('No se creo membresia.') }

  const crossUserMembershipInsert = activeGroupRead.data?.id
    ? await userB.supabase
        .from('group_members')
        .insert({
          group_id: activeGroupRead.data.id,
          user_id: userA.user.id,
          role: 'member',
          status: 'active',
        })
        .select('id')
    : { data: null, error: activeGroupRead.error ?? new Error('No se encontro grupo.') }

  const crossUserMembershipDelete = membership.data?.id
    ? await userB.supabase
        .from('group_members')
        .delete()
        .eq('id', membership.data.id)
        .select('id')
    : { data: null, error: membership.error ?? new Error('No se creo membresia.') }

  const memberCounts = await userA.supabase.rpc('get_group_member_counts')

  const leaveMembership = activeGroupRead.data?.id
    ? await userA.supabase
        .from('group_members')
        .delete()
        .eq('group_id', activeGroupRead.data.id)
        .eq('user_id', userA.user.id)
        .select('id')
    : { data: null, error: activeGroupRead.error ?? new Error('No se encontro grupo.') }

  const countryFilter = await userA.supabase
    .from('groups')
    .select('id')
    .eq('is_active', true)
    .eq('country', country)
    .limit(1)

  const cityFilter = await userA.supabase
    .from('groups')
    .select('id')
    .eq('is_active', true)
    .eq('city', city)
    .limit(1)

  const searchFilter = await userA.supabase
    .from('groups')
    .select('id')
    .eq('is_active', true)
    .ilike('name', `%${groupName}%`)
    .limit(1)

  const cleanupGroup = groupInsert.data?.id
    ? await admin.supabase
        .from('groups')
        .update({ is_active: false })
        .eq('id', groupInsert.data.id)
    : { error: null }

  await userA.supabase.auth.signOut()
  await userB.supabase.auth.signOut()
  await admin.supabase.auth.signOut()

  const statusChecks = {
    groupsRead: groupsRead.error ? 'FAILED' : 'OK',
    suggestionCreate: suggestion.data ? 'OK' : 'FAILED',
    ownSuggestionRead: ownSuggestionRead.data ? 'OK' : 'FAILED',
    crossUserSuggestionUpdate: denied(crossUserSuggestionUpdate)
      ? 'DENIED'
      : 'FAILED_ALLOWED',
    normalGroupInsert: denied(normalGroupInsert) ? 'DENIED' : 'FAILED_ALLOWED',
    suggestionApproval:
      suggestionApproval.data?.status === 'approved' ? 'OK' : 'FAILED',
    activeGroupCreated: activeGroupRead.data ? 'OK' : 'FAILED',
    membershipCreate: membership.data ? 'OK' : 'FAILED',
    ownMembershipRead: ownMembershipRead.data ? 'OK' : 'FAILED',
    crossUserMembershipInsert: denied(crossUserMembershipInsert)
      ? 'DENIED'
      : 'FAILED_ALLOWED',
    crossUserMembershipDelete: denied(crossUserMembershipDelete)
      ? 'DENIED'
      : 'FAILED_ALLOWED',
    memberCounts: memberCounts.error ? 'FAILED' : 'OK',
    leaveMembership: leaveMembership.data?.length ? 'OK' : 'FAILED',
    countryFilter: countryFilter.data?.length ? 'OK' : 'FAILED',
    cityFilter: cityFilter.data?.length ? 'OK' : 'FAILED',
    searchFilter: searchFilter.data?.length ? 'OK' : 'FAILED',
    cleanup: cleanupGroup.error ? 'WARNING' : 'OK',
  }

  const status = Object.entries(statusChecks).some(
    ([key, value]) =>
      key !== 'cleanup' &&
      value !== 'OK' &&
      value !== 'DENIED',
  )
    ? 'QA_MAP_FAILED'
    : 'QA_MAP_OK'

  if (status !== 'QA_MAP_OK') process.exitCode = 1

  console.log(
    JSON.stringify(
      {
        status,
        ...statusChecks,
        cleanupError: cleanupGroup.error?.message,
      },
      null,
      2,
    ),
  )
}

await main()
