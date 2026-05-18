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

      const separator = trimmed.indexOf('=')
      if (separator === -1) continue

      const key = trimmed.slice(0, separator).trim()
      const value = parseEnvValue(trimmed.slice(separator + 1))
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

function fail(status, details = {}) {
  console.error(JSON.stringify({ status, ...details }, null, 2))
  process.exit(1)
}

async function signIn(label, email, password) {
  const supabase = makeClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    const message = error?.message?.toLowerCase() ?? ''
    if (message.includes('email not confirmed')) {
      fail('BLOCKED_EMAIL_CONFIRMATION', { label })
    }
    if (message.includes('rate limit')) {
      fail('BLOCKED_EMAIL_RATE_LIMIT', { label })
    }
    fail('FAILED_JOURNEY_AUTH', {
      label,
      error: error?.message ?? 'No se obtuvo usuario.',
    })
  }

  return { label, supabase, user: data.user }
}

function okNoRows(response) {
  return !response.error && (!response.data || response.data.length === 0)
}

loadLocalEnv()

const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
if (missing.length) {
  fail('BLOCKED_MISSING_QA_ENV', { missing })
}

const suffix = new Date().toISOString().replace(/[:.]/g, '-')
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

const originalProfile = await userA.supabase
  .from('profiles')
  .select('bio, city, country, church_name')
  .eq('id', userA.user.id)
  .maybeSingle()

const profileUpdate = await userA.supabase
  .from('profiles')
  .update({
    bio: `QA journey perfil ${suffix}`,
    city: 'Santa Cruz de la Sierra',
    country: 'Bolivia',
    church_name: 'Comunidad QA',
  })
  .eq('id', userA.user.id)
  .select('id')
  .single()

if (profileUpdate.error || !profileUpdate.data) {
  fail('FAILED_JOURNEY_PROFILE_UPDATE', { error: profileUpdate.error?.message })
}

const devotional = await userA.supabase
  .from('devotionals')
  .select('id,title')
  .eq('is_active', true)
  .order('devotional_date', { ascending: false })
  .limit(1)
  .maybeSingle()

if (devotional.error || !devotional.data) {
  fail('FAILED_JOURNEY_DEVOTIONAL_READ', { error: devotional.error?.message })
}

const devotionalRead = await userA.supabase
  .from('devotional_reads')
  .upsert(
    {
      user_id: userA.user.id,
      devotional_id: devotional.data.id,
    },
    { onConflict: 'devotional_id,user_id' },
  )
  .select('id')
  .single()

const devotionalFavorite = await userA.supabase
  .from('devotional_favorites')
  .upsert(
    {
      user_id: userA.user.id,
      devotional_id: devotional.data.id,
    },
    { onConflict: 'devotional_id,user_id' },
  )
  .select('id')
  .single()

if (devotionalRead.error || devotionalFavorite.error) {
  fail('FAILED_JOURNEY_DEVOTIONAL_PROGRESS', {
    readError: devotionalRead.error?.message,
    favoriteError: devotionalFavorite.error?.message,
  })
}

const prayer = await userA.supabase
  .from('prayer_requests')
  .insert({
    user_id: userA.user.id,
    title: `QA journey oracion ${suffix}`,
    body: 'Peticion temporal para escenario real de usuario.',
    visibility: 'public',
    category: 'fe',
    is_anonymous: false,
  })
  .select('id')
  .single()

if (prayer.error || !prayer.data) {
  fail('FAILED_JOURNEY_PRAYER_CREATE', { error: prayer.error?.message })
}

const prayerSupport = await userB.supabase
  .from('prayer_supports')
  .insert({
    prayer_request_id: prayer.data.id,
    user_id: userB.user.id,
  })
  .select('id')
  .single()

if (prayerSupport.error || !prayerSupport.data) {
  fail('FAILED_JOURNEY_PRAYER_SUPPORT', { error: prayerSupport.error?.message })
}

const post = await userA.supabase
  .from('posts')
  .insert({
    user_id: userA.user.id,
    body: `QA journey foro ${suffix}`,
    verse_reference: 'Mateo 5:14',
    verse_text: 'Vosotros sois la luz del mundo.',
  })
  .select('id')
  .single()

if (post.error || !post.data) {
  fail('FAILED_JOURNEY_POST_CREATE', { error: post.error?.message })
}

const comment = await userB.supabase
  .from('post_comments')
  .insert({
    post_id: post.data.id,
    user_id: userB.user.id,
    body: 'Comentario temporal para escenario de participante.',
  })
  .select('id')
  .single()

const reaction = await userB.supabase
  .from('post_reactions')
  .insert({
    post_id: post.data.id,
    user_id: userB.user.id,
    reaction: 'amen',
  })
  .select('id')
  .single()

if (comment.error || reaction.error) {
  fail('FAILED_JOURNEY_FORUM_INTERACTION', {
    commentError: comment.error?.message,
    reactionError: reaction.error?.message,
  })
}

const gameScore = await userA.supabase
  .from('game_scores')
  .insert({
    user_id: userA.user.id,
    game_key: 'trivia-biblica',
    score: 12,
    total: 15,
  })
  .select('id')
  .single()

if (gameScore.error || !gameScore.data) {
  fail('FAILED_JOURNEY_GAME_SCORE', { error: gameScore.error?.message })
}

const suggestion = await userA.supabase
  .from('group_suggestions')
  .insert({
    user_id: userA.user.id,
    name: `QA journey comunidad ${suffix}`,
    country: 'Bolivia',
    city: 'Santa Cruz de la Sierra',
    church_name: 'Comunidad QA',
    meeting_info: 'Reunion temporal para escenario QA.',
    description: 'Sugerencia temporal creada por escenario end-to-end.',
  })
  .select('id,name,country,city,church_name,meeting_info,description')
  .single()

if (suggestion.error || !suggestion.data) {
  fail('FAILED_JOURNEY_GROUP_SUGGESTION', {
    error: suggestion.error?.message,
  })
}

const report = await userB.supabase
  .from('content_reports')
  .insert({
    reporter_id: userB.user.id,
    target_type: 'post',
    target_id: post.data.id,
    reason: 'QA escenario seguridad',
    details: 'Reporte temporal para validar escenario de seguridad.',
  })
  .select('id')
  .single()

if (report.error || !report.data) {
  fail('FAILED_JOURNEY_REPORT_CREATE', { error: report.error?.message })
}

const reportHiddenFromOtherUser = await userA.supabase
  .from('content_reports')
  .select('id')
  .eq('id', report.data.id)

const reportModeration = await admin.supabase
  .from('content_reports')
  .update({
    status: 'reviewed',
    internal_note: 'Revisado por escenario QA end-to-end.',
  })
  .eq('id', report.data.id)
  .select('id,status')
  .single()

const suggestionApproval = await admin.supabase
  .from('group_suggestions')
  .update({
    status: 'approved',
    internal_note: 'Aprobada por escenario QA end-to-end.',
    reviewed_by: admin.user.id,
    reviewed_at: new Date().toISOString(),
  })
  .eq('id', suggestion.data.id)
  .select('id,status')
  .single()

const groupInsert = await admin.supabase
  .from('groups')
  .insert({
    name: suggestion.data.name,
    country: suggestion.data.country,
    city: suggestion.data.city,
    church_name: suggestion.data.church_name,
    meeting_info: suggestion.data.meeting_info,
    description: suggestion.data.description,
    is_active: true,
  })
  .select('id')
  .single()

if (reportModeration.error || suggestionApproval.error || groupInsert.error) {
  fail('FAILED_JOURNEY_ADMIN_ACTIONS', {
    reportError: reportModeration.error?.message,
    suggestionError: suggestionApproval.error?.message,
    groupError: groupInsert.error?.message,
  })
}

const normalUserAdminBlocked = await userB.supabase.rpc('has_role', {
  required_role: 'admin',
})

if (normalUserAdminBlocked.data !== false) {
  fail('FAILED_JOURNEY_NON_ADMIN_ROLE_CHECK')
}

if (!okNoRows(reportHiddenFromOtherUser)) {
  fail('FAILED_JOURNEY_REPORT_PRIVACY')
}

if (groupInsert.data?.id) {
  const cleanupGroup = await admin.supabase
    .from('groups')
    .update({ is_active: false })
    .eq('id', groupInsert.data.id)
  if (cleanupGroup.error) warnings.push('No se pudo desactivar grupo QA.')
}

const cleanupPost = await userA.supabase
  .from('posts')
  .delete()
  .eq('id', post.data.id)
  .eq('user_id', userA.user.id)
if (cleanupPost.error) warnings.push('No se pudo limpiar post QA.')

const cleanupPrayer = await userA.supabase
  .from('prayer_requests')
  .delete()
  .eq('id', prayer.data.id)
  .eq('user_id', userA.user.id)
if (cleanupPrayer.error) warnings.push('No se pudo limpiar peticion QA.')

const cleanupScore = await userA.supabase
  .from('game_scores')
  .delete()
  .eq('id', gameScore.data.id)
  .eq('user_id', userA.user.id)
if (cleanupScore.error) warnings.push('No se pudo limpiar puntaje QA.')

if (originalProfile.data) {
  const cleanupProfile = await userA.supabase
    .from('profiles')
    .update({
      bio: originalProfile.data.bio,
      city: originalProfile.data.city,
      country: originalProfile.data.country,
      church_name: originalProfile.data.church_name,
    })
    .eq('id', userA.user.id)
  if (cleanupProfile.error) warnings.push('No se pudo restaurar perfil QA.')
}

await userA.supabase.auth.signOut()
await userB.supabase.auth.signOut()
await admin.supabase.auth.signOut()

console.log(
  JSON.stringify(
    {
      status: 'QA_JOURNEYS_OK',
      newUserJourney: {
        profile: 'OK',
        devotional: 'OK',
        prayer: 'OK',
        forum: 'OK',
        game: 'OK',
        mapSuggestion: 'OK',
      },
      participantJourney: {
        prayerSupport: 'OK',
        forumComment: 'OK',
        forumReaction: 'OK',
        report: 'OK',
      },
      adminJourney: {
        reportModeration: 'OK',
        suggestionApproval: 'OK',
        groupCreated: 'OK',
        nonAdminBlocked: 'OK',
      },
      securityJourney: {
        reportPrivacy: 'OK',
      },
      cleanupWarnings: warnings,
    },
    null,
    2,
  ),
)
