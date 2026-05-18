import { supabase } from '../../lib/supabase'
import type { Post } from '../../types/database'

export interface CreatePostInput {
  userId: string
  body: string
  verseReference?: string
  verseText?: string
}

export interface PostAuthor {
  full_name: string
  username: string | null
  city: string | null
  country: string | null
}

export type PostWithAuthor = Post & {
  profiles: PostAuthor | null
}

export async function getRecentPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles:user_id(full_name, username, city, country)')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []) as PostWithAuthor[]
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

export async function deleteOwnPost(input: { postId: string; userId: string }) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', input.postId)
    .eq('user_id', input.userId)

  if (error) throw error
}
