import { supabase } from '../../lib/supabase'
import type { Conversation, ConversationMember, Message } from '../../types/database'

export type ConversationWithMembers = Conversation & {
  conversation_members?: ConversationMember[]
  messages?: Message[]
}

export async function getMyConversations() {
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
        'messages(id, conversation_id, sender_id, body, created_at, edited_at, deleted_at)',
      ].join(', '),
    )
    .order('updated_at', { ascending: false })
    .order('created_at', { referencedTable: 'messages', ascending: false })
    .limit(25)
    .limit(40, { referencedTable: 'messages' })

  if (error) throw error
  return (data ?? []) as unknown as ConversationWithMembers[]
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

  if (memberError) throw memberError
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

  if (memberError) throw memberError
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
