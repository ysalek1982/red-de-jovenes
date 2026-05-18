import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILE = '.env.admin.local'
const REQUIRED_KEYS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
]

function loadLocalEnv() {
  if (!existsSync(LOCAL_ENV_FILE)) return

  for (const line of readFileSync(LOCAL_ENV_FILE, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const separatorIndex = trimmed.indexOf('=')
    if (separatorIndex === -1) continue

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

function requireEnv() {
  const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_ADMIN_ENV',
          missing,
          hint: 'Copia .env.admin.local.example a .env.admin.local y completa solo valores locales.',
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }
}

function nullableText(value) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function getAdminMetadata() {
  return {
    full_name: process.env.ADMIN_FULL_NAME || 'Administrador Red de Jovenes',
    username: process.env.ADMIN_USERNAME || null,
    city: process.env.ADMIN_CITY || null,
    country: process.env.ADMIN_COUNTRY || null,
    church_name: process.env.ADMIN_CHURCH_NAME || null,
  }
}

async function findUserByEmail(supabase, email) {
  const normalizedEmail = email.toLowerCase()
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage,
    })

    if (error) throw error

    const found = data.users.find(
      (user) => user.email?.toLowerCase() === normalizedEmail,
    )
    if (found) return found
    if (data.users.length < perPage) return null
    page += 1
  }
}

async function createOrUpdateAdminUser(supabase, email, password, metadata) {
  const existingUser = await findUserByEmail(supabase, email)
  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        email_confirm: true,
        user_metadata: metadata,
      },
    )
    if (error) throw error
    return { user: data.user, created: false }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata,
  })

  if (error) throw error
  return { user: data.user, created: true }
}

async function ensureProfile(supabase, userId, metadata) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        full_name: metadata.full_name,
        username: nullableText(metadata.username),
        city: nullableText(metadata.city),
        country: nullableText(metadata.country),
        church_name: nullableText(metadata.church_name),
      },
      { onConflict: 'id' },
    )
    .select('id')
    .single()

  if (error) throw error
  return data
}

async function ensureAdminRole(supabase, userId) {
  const { data, error } = await supabase
    .from('user_roles')
    .upsert(
      {
        user_id: userId,
        role: 'admin',
      },
      { onConflict: 'user_id,role' },
    )
    .select('id, role')
    .single()

  if (error) throw error
  return data
}

async function main() {
  loadLocalEnv()
  requireEnv()

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  const metadata = getAdminMetadata()
  const { user, created } = await createOrUpdateAdminUser(
    supabase,
    process.env.ADMIN_EMAIL,
    process.env.ADMIN_PASSWORD,
    metadata,
  )

  if (!user?.id) {
    throw new Error('No se pudo obtener el usuario administrador.')
  }

  await ensureProfile(supabase, user.id, metadata)
  const role = await ensureAdminRole(supabase, user.id)

  console.log(
    JSON.stringify(
      {
        status: 'ADMIN_USER_READY',
        userCreated: created,
        profileReady: true,
        role: role.role,
      },
      null,
      2,
    ),
  )
}

await main()
