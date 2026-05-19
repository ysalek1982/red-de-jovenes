import { ensureQaEnv, printOk, signInQaUser } from './qa-shared.mjs'

const ACTIONS = [
  'explain_bible_verse',
  'create_bible_reflection',
  'create_bible_group_question',
  'create_bible_prayer',
  'suggest_bible_forum_post',
]

async function main() {
  if (!ensureQaEnv()) return
  const userA = await signInQaUser('A')
  const statuses = []

  for (const actionType of ACTIONS) {
    const result = await userA.supabase.functions.invoke('ai-generate', {
      body: {
        actionType,
        prompt: 'Juan 3:16: Explica o prepara una ayuda breve para jovenes.',
      },
    })

    if (result.error && result.context?.status !== 429) throw result.error
    const status = result.data?.status ?? (result.context?.status === 429 ? 'AI_DAILY_LIMIT_REACHED' : null)
    if (!['AI_PROVIDER_NOT_CONFIGURED', 'AI_GENERATION_OK', 'AI_DAILY_LIMIT_REACHED'].includes(status)) {
      throw new Error(`Estado IA inesperado para ${actionType}: ${status}`)
    }
    statuses.push(`${actionType}:${status}`)
  }

  const logs = await userA.supabase
    .from('ai_action_logs')
    .select('id, action_type')
    .in('action_type', ACTIONS)
    .limit(5)
  if (logs.error) throw logs.error

  printOk('QA_BIBLE_AI_OK', {
    actions: ACTIONS.length,
    statuses,
    logsVisible: logs.data?.length ?? 0,
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
