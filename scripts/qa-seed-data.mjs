import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
import { faithGames } from '../src/data/faithGamesData.ts'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
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

function fail(status, details = {}) {
  console.error(JSON.stringify({ status, ...details }, null, 2))
  process.exit(1)
}

function hasDuplicateKeys(items, keyFactory) {
  const seen = new Set()
  const duplicates = []
  for (const item of items) {
    const key = keyFactory(item)
    if (seen.has(key)) duplicates.push(key)
    seen.add(key)
  }
  return duplicates
}

function validateGameBank() {
  const results = {}

  for (const game of faithGames) {
    const duplicateIds = hasDuplicateKeys(game.questions, (question) => question.id)
    const emptyOptions = game.questions.filter((question) =>
      question.options.some((option) => !option.trim()),
    )
    const invalidAnswers = game.questions.filter(
      (question) => !question.options.includes(question.correctAnswer),
    )
    const duplicatePrompts = hasDuplicateKeys(game.questions, (question) =>
      question.prompt.trim().toLowerCase(),
    )

    results[game.key] = {
      questions: game.questions.length,
      minimumQuestions: game.questions.length >= 15 ? 'OK' : 'FAILED',
      duplicateIds: duplicateIds.length ? 'FAILED' : 'OK',
      duplicatePrompts: duplicatePrompts.length ? 'FAILED' : 'OK',
      emptyOptions: emptyOptions.length ? 'FAILED' : 'OK',
      validCorrectAnswers: invalidAnswers.length ? 'FAILED' : 'OK',
    }
  }

  return results
}

loadLocalEnv()

const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
if (missing.length) {
  fail('BLOCKED_MISSING_QA_ENV', { missing })
}

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
)

const { data: authData, error: authError } =
  await supabase.auth.signInWithPassword({
    email: process.env.QA_USER_A_EMAIL,
    password: process.env.QA_USER_A_PASSWORD,
  })

if (authError || !authData.user) {
  const message = authError?.message?.toLowerCase() ?? ''
  if (message.includes('email not confirmed')) {
    fail('BLOCKED_EMAIL_CONFIRMATION')
  }
  if (message.includes('rate limit')) {
    fail('BLOCKED_EMAIL_RATE_LIMIT')
  }
  fail('FAILED_SEED_AUTH', { error: authError?.message })
}

const devotionals = await supabase
  .from('devotionals')
  .select('id,title,verse_reference,reflection,prayer,devotional_date,is_active')
  .eq('is_active', true)
  .order('devotional_date', { ascending: true })

if (devotionals.error) {
  fail('FAILED_DEVOTIONAL_SEED_READ', { error: devotionals.error.message })
}

const devotionalRows = devotionals.data ?? []
const pilotDevotionals = devotionalRows.filter((item) =>
  item.devotional_date?.startsWith('2026-05-'),
)
const duplicateDevotionalDates = hasDuplicateKeys(
  devotionalRows,
  (item) => item.devotional_date,
)
const incompleteDevotionals = pilotDevotionals.filter(
  (item) =>
    !item.title?.trim() ||
    !item.verse_reference?.trim() ||
    !item.reflection?.trim() ||
    !item.prayer?.trim() ||
    !/^\d{4}-\d{2}-\d{2}$/.test(item.devotional_date ?? ''),
)

const today = new Date().toISOString().slice(0, 10)
const todayDevotional = await supabase
  .from('devotionals')
  .select('id,title,devotional_date')
  .eq('devotional_date', today)
  .eq('is_active', true)
  .maybeSingle()

const fallbackDevotional = await supabase
  .from('devotionals')
  .select('id,title,devotional_date')
  .lte('devotional_date', today)
  .eq('is_active', true)
  .order('devotional_date', { ascending: false })
  .limit(1)
  .maybeSingle()

const groups = await supabase
  .from('groups')
  .select('id,name,country,city,church_name,contact_url,is_active')
  .eq('is_active', true)

if (groups.error) {
  fail('FAILED_GROUP_SEED_READ', { error: groups.error.message })
}

const groupRows = groups.data ?? []
const duplicateGroups = hasDuplicateKeys(groupRows, (item) =>
  [item.name, item.country, item.city]
    .map((value) => (value ?? '').trim().toLowerCase())
    .join('|'),
)
const requiredGroups = [
  ['Bolivia', 'Santa Cruz de la Sierra'],
  ['Bolivia', 'La Paz'],
  ['Bolivia', 'Cochabamba'],
]
const requiredGroupStatus = Object.fromEntries(
  requiredGroups.map(([country, city]) => [
    `${country}/${city}`,
    groupRows.some(
      (group) =>
        group.country === country &&
        group.city === city &&
        group.name.toLowerCase().includes('piloto'),
    )
      ? 'OK'
      : 'FAILED',
  ]),
)
const internationalPilotGroups = groupRows.filter(
  (group) => group.country !== 'Bolivia' && group.name.toLowerCase().includes('piloto'),
)
const suspiciousContacts = groupRows.filter((group) => {
  const contact = group.contact_url?.trim()
  if (!contact) return false
  return !/^https?:\/\/\S+\.\S+$/.test(contact)
})

const countryFilter = await supabase
  .from('groups')
  .select('id')
  .eq('is_active', true)
  .eq('country', 'Bolivia')
  .limit(1)
const cityFilter = await supabase
  .from('groups')
  .select('id')
  .eq('is_active', true)
  .eq('city', 'Santa Cruz de la Sierra')
  .limit(1)
const searchFilter = await supabase
  .from('groups')
  .select('id')
  .eq('is_active', true)
  .ilike('name', '%piloto%')
  .limit(1)

const gameBank = validateGameBank()

await supabase.auth.signOut()

const statusChecks = {
  devotionals: {
    activeCount: devotionalRows.length,
    pilotCount: pilotDevotionals.length,
    sevenPilotDevotionals:
      pilotDevotionals.length >= 7 ? 'OK' : 'FAILED',
    noDuplicateDates: duplicateDevotionalDates.length ? 'FAILED' : 'OK',
    completeFields: incompleteDevotionals.length ? 'FAILED' : 'OK',
    todayAvailable:
      todayDevotional.data || fallbackDevotional.data ? 'OK' : 'FAILED',
    fallbackAvailable: fallbackDevotional.data ? 'OK' : 'FAILED',
  },
  groups: {
    activeCount: groupRows.length,
    requiredBolivia: requiredGroupStatus,
    internationalPilotCount: internationalPilotGroups.length,
    hasInternationalNodes:
      internationalPilotGroups.length >= 2 ? 'OK' : 'FAILED',
    noDuplicateNameCountryCity: duplicateGroups.length ? 'FAILED' : 'OK',
    noSuspiciousContacts: suspiciousContacts.length ? 'FAILED' : 'OK',
    countryFilter: countryFilter.data?.length ? 'OK' : 'FAILED',
    cityFilter: cityFilter.data?.length ? 'OK' : 'FAILED',
    searchFilter: searchFilter.data?.length ? 'OK' : 'FAILED',
  },
  games: gameBank,
}

const hasFailure = JSON.stringify(statusChecks).includes('FAILED')
const status = hasFailure ? 'QA_SEED_DATA_FAILED' : 'QA_SEED_DATA_OK'

if (hasFailure) process.exitCode = 1

console.log(JSON.stringify({ status, ...statusChecks }, null, 2))
