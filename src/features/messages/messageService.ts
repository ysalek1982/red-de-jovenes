import { supabase } from '../../lib/supabase'
import type { Conversation, ConversationMember, Message } from '../../types/database'

export type ConversationWithMembers = Conversation & {
  conversation_members?: ConversationMember[]
  messages?: Message[]
}

export async function getMyConversations(userId: string) {
  const { data: memberships, error: membershipError } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', userId)
    .limit(100)

  if (membershipError) throw membershipError

  const conversationIds = Array.from(
    new Set((memberships ?? []).map((membership) => membership.conversation_id)),
  )
  if (!conversationIds.length) return []

  const { data, error } = await supabase
    .from('conversations')
    .select(
      [
        'id',
        'title',
        'conversation_type',
        'group_id',
        'created_by',
        'created_at',
        'updated_at',
        'conversation_members(id, conversation_id, user_id, role, joined_at)',
      ].join(', '),
    )
    .in('id', conversationIds)
    .order('updated_at', { ascending: false })
    .limit(25)

  if (error) throw error

  const conversations = (data ?? []) as unknown as ConversationWithMembers[]
  const scopedIds = conversations.map((conversation) => conversation.id)
  if (!scopedIds.length) return conversations

  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id, body, created_at, edited_at, deleted_at')
    .in('conversation_id', scopedIds)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(200)

  if (messagesError) throw messagesError

  const messagesByConversation = new Map<string, Message[]>()
  ;((messages ?? []) as Message[]).forEach((message) => {
    const current = messagesByConversation.get(message.conversation_id) ?? []
    current.push(message)
    messagesByConversation.set(message.conversation_id, current)
  })

  return conversations.map((conversation) => ({
    ...conversation,
    messages: messagesByConversation.get(conversation.id) ?? [],
  }))
}

export async function createDirectConversation(input: {
  userId: string
  recipientId: string
}) {
  const conversationId = crypto.randomUUID()
  const { error } = await supabase
    .from('conversations')
    .insert({
      id: conversationId,
      conversation_type: 'direct',
      title: null,
      created_by: input.userId,
    })

  if (error) throw error

  const { error: memberError } = await supabase.from('conversation_members').insert([
    {
      conversation_id: conversationId,
      user_id: input.userId,
      role: 'owner',
    },
    {
      conversation_id: conversationId,
      user_id: input.recipientId,
      role: 'member',
    },
  ])

  if (memberError) {
    const { error: cleanupError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (cleanupError) throw cleanupError
    throw memberError
  }
  const { data, error: readError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (readError) throw readError
  return data
}

export async function createGroupConversation(input: {
  userId: string
  groupId: string
  title: string
}) {
  const conversationId = crypto.randomUUID()
  const { error } = await supabase
    .from('conversations')
    .insert({
      id: conversationId,
      conversation_type: 'group',
      title: input.title,
      group_id: input.groupId,
      created_by: input.userId,
    })

  if (error) throw error

  const { error: memberError } = await supabase
    .from('conversation_members')
    .insert({
      conversation_id: conversationId,
      user_id: input.userId,
      role: 'owner',
    })

  if (memberError) {
    const { error: cleanupError } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (cleanupError) throw cleanupError
    throw memberError
  }
  const { data, error: readError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .single()

  if (readError) throw readError
  return data
}

export async function sendMessage(input: {
  conversationId: string
  userId: string
  body: string
}) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: input.conversationId,
      sender_id: input.userId,
      body: input.body,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function reportMessage(input: {
  messageId: string
  userId: string
  reason: string
  detail?: string
}) {
  const { data, error } = await supabase
    .from('message_reports')
    .insert({
      message_id: input.messageId,
      reporter_id: input.userId,
      reason: input.reason,
      detail: input.detail || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
