import type { User } from '@supabase/supabase-js'
import { supabase } from '../../lib/supabase'
import type { Profile } from '../../types/database'

export interface UpdateProfileInput {
  userId: string
  fullName: string
  username?: string | null
  city?: string | null
  country?: string | null
  churchName?: string | null
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

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
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
      city: nullableText(getMetadataText(user, 'city')),
      country: nullableText(getMetadataText(user, 'country')),
      church_name: nullableText(getMetadataText(user, 'church_name')),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(input: UpdateProfileInput) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      full_name: input.fullName.trim(),
      username: nullableText(input.username),
      city: nullableText(input.city),
      country: nullableText(input.country),
      church_name: nullableText(input.churchName),
      bio: nullableText(input.bio),
    })
    .eq('id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data satisfies Profile
}
