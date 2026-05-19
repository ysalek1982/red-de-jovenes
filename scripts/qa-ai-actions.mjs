import { createClient } from '@supabase/supabase-js'
import { ensureQaEnv, loadLocalEnv, printOk } from './qa-shared.mjs'

async function signIn(email, password) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error || !data.user) throw error ?? new Error('No se obtuvo usuario.')
  return { supabase, user: data.user }
}

async function main() {
  loadLocalEnv()
  if (!ensureQaEnv()) return

  const userA = await signIn(process.env.QA_USER_A_EMAIL, process.env.QA_USER_A_PASSWORD)
  const result = await userA.supabase.functions.invoke('ai-generate', {
    body: {
      actionType: 'explain_bible_verse',
      prompt: 'Explica brevemente Filipenses 4:13 para jovenes.',
    },
  })
  if (result.error) throw result.error
  if (!['AI_PROVIDER_NOT_CONFIGURED', 'AI_GENERATION_OK'].includes(result.data?.status)) {
    throw new Error(`Estado IA inesperado: ${result.data?.status}`)
  }

  const invalid = await userA.supabase.functions.invoke('ai-generate', {
    body: {
      actionType: 'accion_no_permitida',
      prompt: 'No debe ejecutarse.',
    },
  })
  if (!invalid.data?.error && !invalid.error) {
    throw new Error('Accion IA invalida fue aceptada.')
  }

  printOk('QA_AI_ACTIONS_OK', {
    providerMode: result.data.status,
    invalidAction: 'DENIED',
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
