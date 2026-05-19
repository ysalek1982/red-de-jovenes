import { supabase } from '../../lib/supabase'
import type { Group, GroupMember, GroupSuggestion } from '../../types/database'

export type GroupMemberCount = {
  group_id: string
  members_count: number
}

export type GroupWithMembership = Group & {
  membersCount: number
  isMember: boolean
}

export type MyGroupMembership = GroupMember & {
  group: GroupWithMembership | null
}

function applyMembership(
  groups: Group[],
  counts: GroupMemberCount[],
  memberships: GroupMember[],
): GroupWithMembership[] {
  const countMap = new Map(
    counts.map((item) => [item.group_id, Number(item.members_count)]),
  )
  const membershipSet = new Set(memberships.map((item) => item.group_id))

  return groups.map((group) => ({
    ...group,
    membersCount: countMap.get(group.id) ?? 0,
    isMember: membershipSet.has(group.id),
  }))
}

export async function getActiveGroups(userId?: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('is_active', true)
    .order('country', { ascending: true })
    .order('city', { ascending: true })

  if (error) throw error

  const [{ data: counts, error: countError }, memberships] = await Promise.all([
    supabase.rpc('get_group_member_counts'),
    userId ? getMyGroupMembershipRows(userId) : Promise.resolve([]),
  ])

  if (countError) throw countError

  return applyMembership(
    data ?? [],
    (counts ?? []) as GroupMemberCount[],
    memberships,
  )
}

async function getMyGroupMembershipRows(userId: string) {
  const { data, error } = await supabase
    .from('group_members')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('joined_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as GroupMember[]
}

export async function getMyGroupMemberships(
  userId: string,
): Promise<MyGroupMembership[]> {
  const [memberships, groups] = await Promise.all([
    getMyGroupMembershipRows(userId),
    getActiveGroups(userId),
  ])
  const groupsById = new Map(groups.map((group) => [group.id, group]))

  return memberships.map((membership) => ({
    ...membership,
    group: groupsById.get(membership.group_id) ?? null,
  }))
}

export async function joinGroup(input: { groupId: string; userId: string }) {
  const { data, error } = await supabase
    .from('group_members')
    .upsert(
      {
        group_id: input.groupId,
        user_id: input.userId,
        role: 'member',
        status: 'active',
      },
      { onConflict: 'group_id,user_id' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}

export async function leaveGroup(input: { groupId: string; userId: string }) {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('group_id', input.groupId)
    .eq('user_id', input.userId)

  if (error) throw error
}

export async function getMyGroupSuggestions(userId: string) {
  const { data, error } = await supabase
    .from('group_suggestions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as GroupSuggestion[]
}

export async function getPendingGroupSuggestionsCount() {
  const { count, error } = await supabase
    .from('group_suggestions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  if (error) throw error
  return count ?? 0
}

export async function suggestGroup(input: {
  userId: string
  name: string
  country: string
  city?: string
  churchName?: string
  contactUrl?: string
  meetingInfo?: string
  description?: string
  modality?: string
  moderatorNote?: string
}) {
  const { data, error } = await supabase
    .from('group_suggestions')
    .insert({
      user_id: input.userId,
      name: input.name,
      country: input.country,
      city: input.city || null,
      church_name: input.churchName || null,
      contact_url: input.contactUrl || null,
      meeting_info: input.meetingInfo || null,
      description: input.description || null,
      modality: input.modality || 'presencial',
      moderator_note: input.moderatorNote || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
