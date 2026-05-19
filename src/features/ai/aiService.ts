import { supabase } from '../../lib/supabase'
import type {
  AiActionQueue,
  AiPromptTemplate,
  AiUsageLimit,
  AiUsageDaily,
  AiCostEvent,
  BibleDailyVerse,
  BibleMissingChapterReport,
  BibleReadingPlan,
  BibleReadingPlanDay,
  BibleTranslation,
  BibleTranslationStats,
} from '../../types/database'
import type { AiActionType } from './aiGuardrails'

export interface AiProviderStatus {
  provider: string
  key_last4: string | null
  model: string | null
  is_enabled: boolean | null
  configured_at: string | null
  last_tested_at: string | null
  last_test_status: string | null
}

export type AdminBibleReadingPlan = BibleReadingPlan & {
  bible_reading_plan_days?: BibleReadingPlanDay[]
}

export interface AdminBibleStatus {
  status: string
  translations: BibleTranslation[]
  booksCount: number
  versesCount: number
  recentDailyVerses: BibleDailyVerse[]
  translationStats: BibleTranslationStats[]
  missingChapters: BibleMissingChapterReport[]
  readingPlans: AdminBibleReadingPlan[]
}

async function invokeAiFunction<T>(name: string, body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke<T>(name, { body })
  if (error) throw error
  return data
}

export async function getAiProviderStatus() {
  return invokeAiFunction<{ status: string; provider: AiProviderStatus | null }>(
    'admin-ai-settings',
    { action: 'get_provider_status' },
  )
}

export async function saveAiProviderKey(input: {
  apiKey: string
  model: string
}) {
  return invokeAiFunction<{ status: string; key_last4: string; model: string }>(
    'admin-ai-settings',
    {
      action: 'save_provider_key',
      apiKey: input.apiKey,
      model: input.model,
    },
  )
}

export async function testAiProviderKey() {
  return invokeAiFunction<{ status: string; last_tested_at?: string }>(
    'admin-ai-settings',
    { action: 'test_provider_key' },
  )
}

export async function disableAiProvider() {
  return invokeAiFunction<{ status: string }>('admin-ai-settings', {
    action: 'disable_provider',
  })
}

export async function getAiUsageSummary() {
  return invokeAiFunction<{
    status: string
    today: string
    usage: AiUsageDaily[]
    limits: AiUsageLimit[]
    costs: AiCostEvent[]
  }>('admin-ai-settings', { action: 'get_usage_summary' })
}

export async function saveAiUsageLimit(input: {
  actionType: AiActionType
  dailyRequestLimit: number
  dailyTokenLimit: number
  isEnabled: boolean
}) {
  return invokeAiFunction<{ status: string; limit: AiUsageLimit }>(
    'admin-ai-settings',
    {
      action: 'set_usage_limit',
      actionType: input.actionType,
      dailyRequestLimit: input.dailyRequestLimit,
      dailyTokenLimit: input.dailyTokenLimit,
      isEnabled: input.isEnabled,
    },
  )
}

export async function getAiPromptTemplates() {
  return invokeAiFunction<{ status: string; templates: AiPromptTemplate[] }>(
    'admin-ai-settings',
    { action: 'get_prompt_templates' },
  )
}

export async function createAiPromptTemplate(input: {
  actionType: AiActionType
  title: string
  systemPrompt: string
  userPromptTemplate: string
  safetyNotes?: string
}) {
  return invokeAiFunction<{ status: string; template: AiPromptTemplate }>(
    'admin-ai-settings',
    {
      action: 'create_prompt_template',
      actionType: input.actionType,
      title: input.title,
      systemPrompt: input.systemPrompt,
      userPromptTemplate: input.userPromptTemplate,
      safetyNotes: input.safetyNotes ?? '',
    },
  )
}

export async function activateAiPromptTemplate(templateId: string) {
  return invokeAiFunction<{ status: string; template: AiPromptTemplate }>(
    'admin-ai-settings',
    { action: 'activate_prompt_template', templateId },
  )
}

export async function getAdminBibleStatus() {
  const status = await invokeAiFunction<Partial<AdminBibleStatus>>('admin-ai-settings', {
    action: 'get_bible_admin_status',
  })
  const response = status ?? {}
  if (
    response.translationStats &&
    response.missingChapters &&
    response.readingPlans
  ) {
    return response as AdminBibleStatus
  }

  const [stats, missing, plans] = await Promise.all([
    supabase.from('bible_translation_stats').select('*').order('code'),
    supabase.from('bible_missing_chapters_report').select('*').limit(12),
    supabase
      .from('bible_reading_plans')
      .select('*, bible_reading_plan_days(*)')
      .order('created_at', { ascending: false })
      .limit(20),
  ])
  if (stats.error) throw stats.error
  if (missing.error) throw missing.error
  if (plans.error) throw plans.error

  return {
    status: response.status ?? 'OK',
    translations: response.translations ?? [],
    booksCount: response.booksCount ?? 0,
    versesCount: response.versesCount ?? 0,
    recentDailyVerses: response.recentDailyVerses ?? [],
    translationStats: stats.data ?? [],
    missingChapters: missing.data ?? [],
    readingPlans: plans.data ?? [],
  } as AdminBibleStatus
}

export async function saveDailyBibleVerse(input: {
  translationCode: string
  bookCode: string
  chapter: number
  verse: number
  activeDate: string
  devotionalHint?: string
}) {
  return invokeAiFunction<{ status: string; dailyVerse: BibleDailyVerse }>(
    'admin-ai-settings',
    {
      action: 'set_daily_bible_verse',
      translationCode: input.translationCode,
      bookCode: input.bookCode,
      chapter: input.chapter,
      verse: input.verse,
      activeDate: input.activeDate,
      devotionalHint: input.devotionalHint ?? '',
    },
  )
}

export async function testRandomBibleVerseFromAdmin() {
  return invokeAiFunction<{ status: string; verse: unknown }>('admin-ai-settings', {
    action: 'test_random_bible_verse',
  })
}

export async function generateAiContent(input: {
  actionType: AiActionType
  prompt: string
  targetType?: string
  targetId?: string
}) {
  return invokeAiFunction<{
    status: string
    text?: string
    queue?: AiActionQueue
  }>('ai-generate', input)
}

export async function approveAiAction(queueId: string) {
  return invokeAiFunction<{ status: string; item: AiActionQueue }>(
    'ai-action-executor',
    { action: 'approve', queueId },
  )
}

export async function rejectAiAction(queueId: string) {
  return invokeAiFunction<{ status: string; item: AiActionQueue }>(
    'ai-action-executor',
    { action: 'reject', queueId },
  )
}

export async function getPendingAiActions() {
  const { data, error } = await supabase
    .from('ai_action_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as AiActionQueue[]
}
