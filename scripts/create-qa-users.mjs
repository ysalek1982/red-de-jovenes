import { randomBytes } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const ADMIN_ENV_FILE = '.env.admin.local'
const QA_ENV_FILE = '.env.qa.local'
const ENV_READ_FILES = [
  ADMIN_ENV_FILE,
  QA_ENV_FILE,
  '.env.local',
  '.env.local.example',
]

const REQUIRED_ADMIN_KEYS = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
const REQUIRED_QA_PUBLIC_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
]

const qaUsers = [
  {
    label: 'USER_A',
    email: 'qa.user.a+redjovenes@gmail.com',
    metadata: {
      full_name: 'Usuario QA A',
      username: 'qa_user_a',
      city: 'Santa Cruz de la Sierra',
      country: 'Bolivia',
      church_name: 'Red de Jóvenes QA',
    },
  },
  {
    label: 'USER_B',
    email: 'qa.user.b+redjovenes@gmail.com',
    metadata: {
      full_name: 'Usuario QA B',
      username: 'qa_user_b',
      city: 'La Paz',
      country: 'Bolivia',
      church_name: 'Red de Jóvenes QA',
    },
  },
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
  for (const file of ENV_READ_FILES) {
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

function requireEnvironment() {
  if (!existsSync(ADMIN_ENV_FILE)) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_ADMIN_ENV',
          missing: [ADMIN_ENV_FILE],
          hint: 'Crea .env.admin.local con SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.',
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  const missingAdmin = REQUIRED_ADMIN_KEYS.filter((key) => !process.env[key])
  if (missingAdmin.length) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_ADMIN_ENV',
          missing: missingAdmin,
          hint: 'Completa solo variables locales en .env.admin.local.',
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }

  if (!process.env.VITE_SUPABASE_URL) {
    process.env.VITE_SUPABASE_URL = process.env.SUPABASE_URL
  }

  const missingPublic = REQUIRED_QA_PUBLIC_KEYS.filter((key) => !process.env[key])
  if (missingPublic.length) {
    console.log(
      JSON.stringify(
        {
          status: 'BLOCKED_MISSING_QA_PUBLIC_ENV',
          missing: missingPublic,
          hint: 'Agrega VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY a .env.local.example o variables locales.',
        },
        null,
        2,
      ),
    )
    process.exit(0)
  }
}

function generatePassword() {
  return `Rdj-${randomBytes(18).toString('base64url')}-QA15!`
}

function nullableText(value) {
  const normalized = value?.trim()
  return normalized ? normalized : null
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

async function createOrUpdateQaUser(supabase, qaUser, password) {
  const existingUser = await findUserByEmail(supabase, qaUser.email)
  if (existingUser) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        email_confirm: true,
        user_metadata: qaUser.metadata,
      },
    )
    if (error) throw error
    return { user: data.user, created: false }
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: qaUser.email,
    password,
    email_confirm: true,
    user_metadata: qaUser.metadata,
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
        username: metadata.username,
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

async function ensureNoAdminRole(supabase, userId) {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .in('role', ['admin', 'moderator'])

  if (error) throw error
}

function writeQaEnv(passwordsByLabel) {
  const content = [
    `VITE_SUPABASE_URL=${process.env.VITE_SUPABASE_URL}`,
    `VITE_SUPABASE_PUBLISHABLE_KEY=${process.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    '',
    `QA_USER_A_EMAIL=${qaUsers[0].email}`,
    `QA_USER_A_PASSWORD=${passwordsByLabel.USER_A}`,
    `QA_USER_B_EMAIL=${qaUsers[1].email}`,
    `QA_USER_B_PASSWORD=${passwordsByLabel.USER_B}`,
    '',
  ].join('\n')

  writeFileSync(QA_ENV_FILE, content, 'utf8')
}

async function main() {
  loadLocalEnv()
  requireEnvironment()

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

  const passwordsByLabel = Object.fromEntries(
    qaUsers.map((qaUser) => [qaUser.label, generatePassword()]),
  )

  const results = []

  for (const qaUser of qaUsers) {
    const { user, created } = await createOrUpdateQaUser(
      supabase,
      qaUser,
      passwordsByLabel[qaUser.label],
    )
    if (!user?.id) throw new Error(`No se pudo preparar ${qaUser.label}.`)

    await ensureProfile(supabase, user.id, qaUser.metadata)
    await ensureNoAdminRole(supabase, user.id)

    results.push({
      label: qaUser.label,
      created,
      profileReady: true,
      adminRole: 'absent',
    })
  }

  writeQaEnv(passwordsByLabel)

  console.log(
    JSON.stringify(
      {
        status: 'QA_USERS_READY',
        users: results,
        qaEnvUpdated: true,
      },
      null,
      2,
    ),
  )
}

await main()
