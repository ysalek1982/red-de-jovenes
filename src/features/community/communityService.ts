import { supabase } from '../../lib/supabase'
import type { Post, PostComment, PostReaction } from '../../types/database'

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
  post_comments?: PostCommentWithAuthor[]
  post_reactions?: PostReaction[]
  commentsCount: number
  amenCount: number
  reactedByMe: boolean
}

export type PostCommentWithAuthor = PostComment & {
  profiles: Pick<PostAuthor, 'full_name' | 'username'> | null
}

function mapPost(
  post: Post & {
    profiles: PostAuthor | null
    post_comments?: PostCommentWithAuthor[]
    post_reactions?: PostReaction[]
  },
  userId?: string,
): PostWithAuthor {
  const reactions = post.post_reactions ?? []
  const comments = post.post_comments ?? []
  return {
    ...post,
    commentsCount: comments.length,
    amenCount: reactions.filter((reaction) => reaction.reaction === 'amen').length,
    reactedByMe: Boolean(
      userId &&
        reactions.some(
          (reaction) =>
            reaction.user_id === userId && reaction.reaction === 'amen',
        ),
    ),
  }
}

export async function getRecentPosts(userId?: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(
      '*, profiles:user_id(full_name, username, city, country), post_comments(id, post_id, user_id, body, created_at, profiles:user_id(full_name, username)), post_reactions(id, post_id, user_id, reaction, created_at)',
    )
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return ((data ?? []) as Array<
    Post & {
      profiles: PostAuthor | null
      post_comments?: PostCommentWithAuthor[]
      post_reactions?: PostReaction[]
    }
  >).map((post) => mapPost(post, userId))
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

export async function updateOwnPost(input: {
  postId: string
  userId: string
  body: string
  verseReference?: string
  verseText?: string
}) {
  const { data, error } = await supabase
    .from('posts')
    .update({
      body: input.body,
      verse_reference: input.verseReference || null,
      verse_text: input.verseText || null,
    })
    .eq('id', input.postId)
    .eq('user_id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createPostComment(input: {
  postId: string
  userId: string
  body: string
}) {
  const { data, error } = await supabase
    .from('post_comments')
    .insert({
      post_id: input.postId,
      user_id: input.userId,
      body: input.body,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOwnPostComment(input: {
  commentId: string
  userId: string
  body: string
}) {
  const { data, error } = await supabase
    .from('post_comments')
    .update({ body: input.body })
    .eq('id', input.commentId)
    .eq('user_id', input.userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteOwnPostComment(input: {
  commentId: string
  userId: string
}) {
  const { error } = await supabase
    .from('post_comments')
    .delete()
    .eq('id', input.commentId)
    .eq('user_id', input.userId)

  if (error) throw error
}

export async function toggleAmenReaction(input: {
  postId: string
  userId: string
  hasReacted: boolean
}) {
  if (input.hasReacted) {
    const { error } = await supabase
      .from('post_reactions')
      .delete()
      .eq('post_id', input.postId)
      .eq('user_id', input.userId)
      .eq('reaction', 'amen')

    if (error) throw error
    return null
  }

  const { data, error } = await supabase
    .from('post_reactions')
    .upsert(
      {
        post_id: input.postId,
        user_id: input.userId,
        reaction: 'amen',
      },
      { onConflict: 'post_id,user_id,reaction' },
    )
    .select()
    .single()

  if (error) throw error
  return data
}
