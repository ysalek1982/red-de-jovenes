import { supabase } from '../../lib/supabase'

export interface CreatePostInput {
  userId: string
  body: string
  verseReference?: string
  verseText?: string
}

export async function getRecentPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) throw error
  return data ?? []
}

export async function createPost(input: CreatePostInput) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: input.userId,
      body: input.body,
      verse_reference: input.verseReference || null,
      verse_text: input.verseText || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}
