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
]

const publicRoutes = [
  '/',
  '/landing',
  '/demo',
  '/entrar',
  '/crear-cuenta',
  '/recuperar',
  '/actualizar-contrasena',
]

const privateRoutes = [
  '/app',
  '/app/oracion',
  '/app/foros',
  '/app/devocional',
  '/app/juegos',
  '/app/mapa',
  '/app/seguridad',
  '/app/perfil',
  '/app/admin',
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

async function signIn(label, email, password) {
  const supabase = makeClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    return {
      label,
      status: 'FAILED_AUTH',
      error: error?.message ?? 'No se obtuvo usuario.',
    }
  }

  return { label, status: 'OK', supabase, user: data.user }
}

async function checkRoutes(baseUrl) {
  const results = []
  for (const route of [...publicRoutes, ...privateRoutes]) {
    try {
      const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' })
      results.push({
        route,
        status: response.status,
        ok: response.status >= 200 && response.status < 400,
      })
    } catch (error) {
      results.push({
        route,
        status: 'FETCH_FAILED',
        ok: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      })
    }
  }

  return results
}

async function runModuleSmoke(userA, userB) {
  const suffix = new Date().toISOString()
  const warnings = []

  const profile = await userA.supabase
    .from('profiles')
    .select('bio')
    .eq('id', userA.user.id)
    .maybeSingle()
  const originalBio = profile.data?.bio ?? null

  const profileUpdate = await userA.supabase
    .from('profiles')
    .update({ bio: `QA funcional perfil ${suffix}` })
    .eq('id', userA.user.id)
    .select('id')
    .maybeSingle()

  const prayer = await userA.supabase
    .from('prayer_requests')
    .insert({
      user_id: userA.user.id,
      title: `QA funcional oración ${suffix}`,
      body: 'Petición temporal para validar flujo funcional.',
      visibility: 'public',
    })
    .select('id')
    .single()

  const prayerSupport = prayer.data?.id
    ? await userA.supabase
        .from('prayer_supports')
        .upsert(
          {
            prayer_request_id: prayer.data.id,
            user_id: userA.user.id,
          },
          { onConflict: 'prayer_request_id,user_id' },
        )
        .select('id')
        .single()
    : { data: null, error: new Error('No se creó oración QA.') }

  const post = await userA.supabase
    .from('posts')
    .insert({
      user_id: userA.user.id,
      body: `QA funcional post ${suffix}`,
      verse_reference: 'Mateo 5:14',
      verse_text: 'Vosotros sois la luz del mundo.',
    })
    .select('id')
    .single()

  const comment = post.data?.id
    ? await userA.supabase
        .from('post_comments')
        .insert({
          post_id: post.data.id,
          user_id: userA.user.id,
          body: `QA funcional comentario ${suffix}`,
        })
        .select('id')
        .single()
    : { data: null, error: new Error('No se creó post QA.') }

  const reaction = post.data?.id
    ? await userA.supabase
        .from('post_reactions')
        .upsert(
          {
            post_id: post.data.id,
            user_id: userA.user.id,
            reaction: 'amen',
          },
          { onConflict: 'post_id,user_id,reaction' },
        )
        .select('id')
        .single()
    : { data: null, error: new Error('No se creó post QA.') }

  const devotional = await userA.supabase
    .from('devotionals')
    .select('id')
    .order('devotional_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  let devotionalRead = { data: null, error: new Error('No hay devocional QA.') }
  if (devotional.data?.id) {
    devotionalRead = await userA.supabase
      .from('devotional_reads')
      .insert({
        devotional_id: devotional.data.id,
        user_id: userA.user.id,
      })
      .select('id')
      .single()

    if (devotionalRead.error?.code === '23505') {
      devotionalRead = await userA.supabase
        .from('devotional_reads')
        .select('id')
        .eq('devotional_id', devotional.data.id)
        .eq('user_id', userA.user.id)
        .maybeSingle()
    }
  }

  const devotionalFavorite = devotional.data?.id
    ? await userA.supabase
        .from('devotional_favorites')
        .upsert(
          {
            devotional_id: devotional.data.id,
            user_id: userA.user.id,
          },
          { onConflict: 'devotional_id,user_id' },
        )
        .select('id')
        .single()
    : { data: null, error: new Error('No hay devocional QA.') }

  const groups = await userA.supabase.from('groups').select('id').limit(1)

  const groupSuggestion = await userA.supabase
    .from('group_suggestions')
    .insert({
      user_id: userA.user.id,
      name: `QA Comunidad ${suffix}`,
      country: 'Bolivia',
      city: 'Santa Cruz de la Sierra',
      church_name: 'Red de Jóvenes QA',
    })
    .select('id')
    .single()

  const report = post.data?.id
    ? await userA.supabase
        .from('content_reports')
        .insert({
          reporter_id: userA.user.id,
          target_type: 'post',
          target_id: post.data.id,
          reason: 'QA funcional release candidate',
          details: 'Reporte temporal de QA.',
        })
        .select('id')
        .single()
    : { data: null, error: new Error('No se creó post QA.') }

  const preferences = await userA.supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: userA.user.id,
        daily_devotional: true,
        prayer_updates: true,
        community_updates: true,
      },
      { onConflict: 'user_id' },
    )
    .select('id')
    .single()

  const userBAdminRole = await userB.supabase.rpc('has_role', {
    required_role: 'admin',
  })

  if (post.data?.id) {
    const deletedPost = await userA.supabase
      .from('posts')
      .delete()
      .eq('id', post.data.id)
      .eq('user_id', userA.user.id)
    if (deletedPost.error) warnings.push('No se pudo limpiar post QA.')
  }

  if (prayer.data?.id) {
    const deletedPrayer = await userA.supabase
      .from('prayer_requests')
      .delete()
      .eq('id', prayer.data.id)
      .eq('user_id', userA.user.id)
    if (deletedPrayer.error) warnings.push('No se pudo limpiar oración QA.')
  }

  if (devotional.data?.id) {
    const deletedFavorite = await userA.supabase
      .from('devotional_favorites')
      .delete()
      .eq('devotional_id', devotional.data.id)
      .eq('user_id', userA.user.id)
    if (deletedFavorite.error) warnings.push('No se pudo limpiar favorito QA.')
  }

  const restoredProfile = await userA.supabase
    .from('profiles')
    .update({ bio: originalBio })
    .eq('id', userA.user.id)
  if (restoredProfile.error) warnings.push('No se pudo restaurar perfil QA.')

  return {
    profile: profileUpdate.error || !profileUpdate.data ? 'FAILED' : 'OK',
    prayer: prayer.error || !prayer.data ? 'FAILED' : 'OK',
    prayerSupport:
      prayerSupport.error || !prayerSupport.data ? 'FAILED' : 'OK',
    post: post.error || !post.data ? 'FAILED' : 'OK',
    comment: comment.error || !comment.data ? 'FAILED' : 'OK',
    reaction: reaction.error || !reaction.data ? 'FAILED' : 'OK',
    devotionalRead:
      devotionalRead.error || !devotionalRead.data ? 'FAILED' : 'OK',
    devotionalFavorite:
      devotionalFavorite.error || !devotionalFavorite.data ? 'FAILED' : 'OK',
    groups: groups.error ? 'FAILED' : 'OK',
    groupSuggestion:
      groupSuggestion.error || !groupSuggestion.data ? 'FAILED' : 'OK',
    report: report.error || !report.data ? 'FAILED' : 'OK',
    preferences: preferences.error || !preferences.data ? 'FAILED' : 'OK',
    nonAdminAccess:
      userBAdminRole.error || userBAdminRole.data === true ? 'FAILED' : 'OK',
    cleanupWarnings: warnings,
  }
}

async function runAdminSmoke() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return 'BLOCKED_MISSING_ADMIN_LOGIN_ENV'
  }

  const admin = await signIn(
    'ADMIN',
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_PASSWORD,
  )
  if (admin.status !== 'OK') return 'FAILED_ADMIN_LOGIN'

  const role = await admin.supabase.rpc('has_role', {
    required_role: 'admin',
  })
  await admin.supabase.auth.signOut()

  if (role.error || role.data !== true) return 'FAILED_ADMIN_ROLE'
  return 'OK'
}

async function main() {
  loadLocalEnv()
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_QA_ENV',
          missing,
        },
        null,
        2,
      ),
    )
    return
  }

  const baseUrl = process.env.QA_APP_BASE_URL || 'http://127.0.0.1:8080'
  const routeResults = await checkRoutes(baseUrl)

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

  if (userA.status !== 'OK' || userB.status !== 'OK') {
    console.log(
      JSON.stringify(
        {
          status: 'FAILED_AUTH',
          routes: routeResults,
          users: [userA, userB],
        },
        null,
        2,
      ),
    )
    process.exitCode = 1
    return
  }

  const modules = await runModuleSmoke(userA, userB)
  const admin = await runAdminSmoke()

  await userA.supabase.auth.signOut()
  await userB.supabase.auth.signOut()

  const failedRoutes = routeResults.some((route) => !route.ok)
  const failedModules = Object.entries(modules).some(
    ([key, value]) => key !== 'cleanupWarnings' && value !== 'OK',
  )
  const failedAdmin = admin !== 'OK'

  const status =
    failedRoutes || failedModules || failedAdmin
      ? 'FAILED_FUNCTIONAL_ROUTES'
      : 'QA_FUNCTIONAL_ROUTES_OK'

  if (status !== 'QA_FUNCTIONAL_ROUTES_OK') process.exitCode = 1

  console.log(
    JSON.stringify(
      {
        status,
        baseUrl,
        routes: routeResults,
        modules,
        admin,
      },
      null,
      2,
    ),
  )
}

await main()
