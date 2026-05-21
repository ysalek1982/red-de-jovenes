import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types/database'

export type OnboardingStepKey =
  | 'profile'
  | 'readBible'
  | 'saveVerse'
  | 'prayer'
  | 'forum'
  | 'game'
  | 'community'

type UserCountTable =
  | 'bible_saved_verses'
  | 'bible_reading_progress'
  | 'bible_plan_progress'
  | 'prayer_requests'
  | 'prayer_supports'
  | 'posts'
  | 'post_comments'
  | 'game_scores'
  | 'group_members'

interface PilotFeedbackOnboardingRow {
  id: string
  module: string | null
  title: string
  device: string | null
}

export interface ProfileCompletionInput {
  fullName?: string | null
  city?: string | null
  country?: string | null
  churchName?: string | null
  bio?: string | null
  avatarUrl?: string | null
}

export interface ProfileCompletionField {
  key: keyof ProfileCompletionInput
  label: string
  isComplete: boolean
}

export interface ProfileCompletionSummary {
  completed: number
  total: number
  percentage: number
  isComplete: boolean
  fields: ProfileCompletionField[]
  missingLabels: string[]
}

export interface OnboardingStepStatus {
  key: OnboardingStepKey
  title: string
  text: string
  cta: string
  to: string
  isComplete: boolean
}

export interface OnboardingStatus {
  steps: OnboardingStepStatus[]
  completedCount: number
  totalCount: number
  percentage: number
  isActivated: boolean
  profileCompletion: ProfileCompletionSummary
  feedbackSent: boolean
}

const profileFields: Array<{
  key: keyof ProfileCompletionInput
  label: string
}> = [
  { key: 'fullName', label: 'nombre' },
  { key: 'city', label: 'ciudad' },
  { key: 'country', label: 'pais' },
  { key: 'churchName', label: 'iglesia o comunidad' },
  { key: 'bio', label: 'bio' },
  { key: 'avatarUrl', label: 'foto o avatar' },
]

function hasValue(value: string | null | undefined) {
  return Boolean(value?.trim())
}

function isQaPilotFeedback(row: PilotFeedbackOnboardingRow) {
  return (
    row.module?.trim().toUpperCase() === 'QA' ||
    row.device?.trim().toUpperCase() === 'QA' ||
    row.title.trim().toUpperCase().startsWith('QA ')
  )
}

export function getProfileCompletion(
  input: ProfileCompletionInput,
): ProfileCompletionSummary {
  const fields = profileFields.map((field) => ({
    ...field,
    isComplete: hasValue(input[field.key]),
  }))
  const completed = fields.filter((field) => field.isComplete).length
  const total = fields.length
  const percentage = total ? Math.round((completed / total) * 100) : 0

  return {
    completed,
    total,
    percentage,
    isComplete: completed === total,
    fields,
    missingLabels: fields
      .filter((field) => !field.isComplete)
      .map((field) => field.label),
  }
}

function profileToCompletion(profile: Profile | null) {
  return getProfileCompletion({
    fullName: profile?.full_name,
    city: profile?.city,
    country: profile?.country,
    churchName: profile?.church_name,
    bio: profile?.bio,
    avatarUrl: profile?.avatar_url,
  })
}

async function hasUserRows(
  table: UserCountTable,
  column: string,
  userId: string,
) {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq(column, userId)

  if (error) throw error
  return (count ?? 0) > 0
}

async function getRealPilotFeedbackSent(userId: string) {
  const { data, error } = await supabase
    .from('pilot_feedback')
    .select('id, module, title, device')
    .eq('user_id', userId)
    .limit(100)

  if (error) throw error
  return ((data ?? []) as PilotFeedbackOnboardingRow[]).some(
    (row) => !isQaPilotFeedback(row),
  )
}

export async function getOnboardingStatus(
  userId: string,
): Promise<OnboardingStatus> {
  const [
    profileResult,
    savedVerse,
    bibleReading,
    biblePlanReading,
    prayerCreated,
    prayerSupported,
    postCreated,
    commentCreated,
    gamePlayed,
    communityJoined,
    feedbackSent,
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, city, country, church_name, bio, avatar_url')
      .eq('id', userId)
      .maybeSingle(),
    hasUserRows('bible_saved_verses', 'user_id', userId),
    hasUserRows('bible_reading_progress', 'user_id', userId),
    hasUserRows('bible_plan_progress', 'user_id', userId),
    hasUserRows('prayer_requests', 'user_id', userId),
    hasUserRows('prayer_supports', 'user_id', userId),
    hasUserRows('posts', 'user_id', userId),
    hasUserRows('post_comments', 'user_id', userId),
    hasUserRows('game_scores', 'user_id', userId),
    hasUserRows('group_members', 'user_id', userId),
    getRealPilotFeedbackSent(userId),
  ])

  if (profileResult.error) throw profileResult.error

  const profileCompletion = profileToCompletion(
    profileResult.data as Profile | null,
  )
  const hasBibleRead = bibleReading || biblePlanReading
  const hasPrayerAction = prayerCreated || prayerSupported
  const hasForumAction = postCreated || commentCreated

  const steps: OnboardingStepStatus[] = [
    {
      key: 'profile',
      title: 'Completa tu perfil',
      text: profileCompletion.isComplete
        ? 'Tu perfil ya ayuda a otros jovenes a conocerte.'
        : `Te faltan: ${profileCompletion.missingLabels.join(', ')}.`,
      cta: 'Completar perfil',
      to: '/app/perfil',
      isComplete: profileCompletion.isComplete,
    },
    {
      key: 'readBible',
      title: 'Lee tu primer versiculo',
      text: 'Empieza con el versiculo del dia, Juan 3 o Salmos 23.',
      cta: 'Abrir Biblia',
      to: '/app/biblia',
      isComplete: hasBibleRead,
    },
    {
      key: 'saveVerse',
      title: 'Guarda un versiculo',
      text: 'Marca una Palabra que quieras recordar durante la semana.',
      cta: 'Guardar versiculo',
      to: '/app/biblia',
      isComplete: savedVerse,
    },
    {
      key: 'prayer',
      title: 'Ora con alguien',
      text: 'Pide oracion o acompana una peticion de la comunidad.',
      cta: 'Ir a oracion',
      to: '/app/oracion',
      isComplete: hasPrayerAction,
    },
    {
      key: 'forum',
      title: 'Participa en Foros',
      text: 'Comparte una reflexion, pregunta o testimonio breve.',
      cta: 'Abrir Foros',
      to: '/app/foros',
      isComplete: hasForumAction,
    },
    {
      key: 'game',
      title: 'Juega tu primer juego',
      text: 'Aprende jugando y guarda tu primer puntaje.',
      cta: 'Jugar ahora',
      to: '/app/juegos',
      isComplete: gamePlayed,
    },
    {
      key: 'community',
      title: 'Unete a una comunidad',
      text: 'Encuentra jovenes cerca de ti o sugiere tu comunidad.',
      cta: 'Ver mapa',
      to: '/app/mapa',
      isComplete: communityJoined,
    },
  ]
  const completedCount = steps.filter((step) => step.isComplete).length
  const totalCount = steps.length
  const percentage = Math.round((completedCount / totalCount) * 100)

  return {
    steps,
    completedCount,
    totalCount,
    percentage,
    isActivated: completedCount >= 5,
    profileCompletion,
    feedbackSent,
  }
}
