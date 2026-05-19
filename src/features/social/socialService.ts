import { supabase } from '../../lib/supabase'
import type { Profile, UserFollow } from '../../types/database'

export type SuggestedProfile = Pick<
  Profile,
  'id' | 'full_name' | 'username' | 'avatar_url' | 'city' | 'country' | 'church_name'
> & {
  isFollowing: boolean
}

export async function getMyFollows(userId: string) {
  const { data, error } = await supabase
    .from('user_follows')
    .select('*')
    .or(`follower_id.eq.${userId},following_id.eq.${userId}`)

  if (error) throw error
  return (data ?? []) as UserFollow[]
}

export async function getSuggestedProfiles(userId: string) {
  const [profilesResult, follows] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, username, avatar_url, city, country, church_name')
      .neq('id', userId)
      .order('created_at', { ascending: false })
      .limit(12),
    getMyFollows(userId),
  ])

  if (profilesResult.error) throw profilesResult.error
  const following = new Set(
    follows
      .filter((follow) => follow.follower_id === userId)
      .map((follow) => follow.following_id),
  )

  return ((profilesResult.data ?? []) as Omit<SuggestedProfile, 'isFollowing'>[]).map(
    (profile) => ({
      ...profile,
      isFollowing: following.has(profile.id),
    }),
  )
}

export async function followUser(input: { userId: string; followingId: string }) {
  const { data, error } = await supabase
    .from('user_follows')
    .upsert(
      {
        follower_id: input.userId,
        following_id: input.followingId,
      },
      { onConflict: 'follower_id,following_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function unfollowUser(input: {
  userId: string
  followingId: string
}) {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', input.userId)
    .eq('following_id', input.followingId)

  if (error) throw error
}
