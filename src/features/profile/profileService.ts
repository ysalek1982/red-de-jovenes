import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types/database'

export interface UpdateProfileInput {
  userId: string
  fullName: string
  username?: string | null
  avatarUrl?: string | null
  city?: string | null
  country?: string | null
  churchName?: string | null
  ageRange?: string | null
  bio?: string | null
}

function nullableText(value: string | null | undefined) {
  const normalized = value?.trim()
  return normalized ? normalized : null
}

function getMetadataText(user: User, key: string) {
  const value = user.user_metadata[key]
  return typeof value === 'string' ? value : ''
}

export function normalizeUsername(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase()
  return normalized ? normalized : null
}

export function isValidUsername(value: string | null | undefined) {
  const username = normalizeUsername(value)
  return !username || /^[a-z0-9._-]{3,30}$/.test(username)
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function isUsernameAvailable(username: string, currentUserId: string) {
  const normalizedUsername = normalizeUsername(username)
  if (!normalizedUsername) return true

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', normalizedUsername)
    .neq('id', currentUserId)
    .maybeSingle()

  if (error) throw error
  return !data
}

export async function ensureProfile(user: User) {
  const existingProfile = await getProfile(user.id)
  if (existingProfile) return existingProfile

  const fullName =
    getMetadataText(user, 'full_name').trim() ||
    user.email?.split('@')[0] ||
    'Joven de la Red'

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      full_name: fullName,
      username: normalizeUsername(getMetadataText(user, 'username')),
      city: nullableText(getMetadataText(user, 'city')),
      country: nullableText(getMetadataText(user, 'country')),
      church_name: nullableText(getMetadataText(user, 'church_name')),
      age_range: nullableText(getMetadataText(user, 'age_range')),
      community_guidelines_accepted_at:
        user.user_metadata.accepted_community_guidelines === true
          ? new Date().toISOString()
          : null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(input: UpdateProfileInput) {
  const username = normalizeUsername(input.username)
  if (username && !(await isUsernameAvailable(username, input.userId))) {
    throw new Error('USERNAME_TAKEN')
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName.trim(),
      username,
      avatar_url: nullableText(input.avatarUrl),
      city: nullableText(input.city),
      country: nullableText(input.country),
      church_name: nullableText(input.churchName),
      age_range: nullableText(input.ageRange),
      bio: nullableText(input.bio),
    })
    .eq('id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data satisfies Profile
}
