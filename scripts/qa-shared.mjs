import { existsSync, readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local']

export function loadLocalEnv() {
  for (const file of LOCAL_ENV_FILES) {
    if (!existsSync(file)) continue
    for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
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

export function ensureQaEnv() {
  loadLocalEnv()
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY',
    'QA_USER_A_EMAIL',
    'QA_USER_A_PASSWORD',
    'QA_USER_B_EMAIL',
    'QA_USER_B_PASSWORD',
  ]
  const missing = required.filter((key) => !process.env[key])
  if (missing.length) {
    console.log(JSON.stringify({ status: 'BLOCKED_MISSING_QA_ENV', missing }, null, 2))
    return false
  }
  return true
}

export function makeClient() {
  return createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
}

export async function signInQaUser(kind) {
  const supabase = makeClient()
  const emailKey = kind === 'A' ? 'QA_USER_A_EMAIL' : 'QA_USER_B_EMAIL'
  const passwordKey = kind === 'A' ? 'QA_USER_A_PASSWORD' : 'QA_USER_B_PASSWORD'
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env[emailKey],
    password: process.env[passwordKey],
  })
  if (error || !data.user) throw error ?? new Error(`No se obtuvo usuario ${kind}.`)
  return { supabase, user: data.user }
}

export function printOk(status, extra = {}) {
  console.log(JSON.stringify({ status, ...extra }, null, 2))
}
