import { readFileSync, existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const LOCAL_ENV_FILES = ['.env.qa.local', '.env.local']
const REQUIRED_KEYS = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'QA_USER_A_EMAIL',
  'QA_USER_A_PASSWORD',
  'QA_USER_B_EMAIL',
  'QA_USER_B_PASSWORD',
]

function loadLocalEnv() {
  for (const file of LOCAL_ENV_FILES) {
    if (!existsSync(file)) continue

    const lines = readFileSync(file, 'utf8').split(/\r?\n/)
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separator = trimmed.indexOf('=')
      if (separator === -1) continue

      const key = trimmed.slice(0, separator)
      const value = trimmed.slice(separator + 1)
      if (!process.env[key]) process.env[key] = value
    }
  }
}

function fail(status, details = {}) {
  console.error(JSON.stringify({ status, ...details }, null, 2))
  process.exit(1)
}

async function signIn(label, email, password) {
  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    const message = error.message.toLowerCase()
    if (message.includes('email not confirmed')) {
      fail('BLOCKED_EMAIL_CONFIRMATION', { label })
    }
    if (message.includes('rate limit')) {
      fail('BLOCKED_EMAIL_RATE_LIMIT', { label })
    }
    fail('FAILED_FORUM_AUTH', { label, error: error.message })
  }

  return { supabase, user: data.user, label }
}

function okNoRows(response) {
  return !response.error && (!response.data || response.data.length === 0)
}

function denied(response) {
  return Boolean(response.error) || !response.data || response.data.length === 0
}

loadLocalEnv()

const missing = REQUIRED_KEYS.filter((key) => !process.env[key])
if (missing.length) {
  fail('BLOCKED_MISSING_QA_ENV', { missing })
}

const userA = await signIn(
  'USER_A',
  process.env.QA_USER_A_EMAIL,
  process.env.QA_USER_A_PASSWORD,
)
const userB = await signIn(
  'USER_B',
  process.env.QA_USER_B_EMAIL,
  process.env.QA_USER_B_PASSWORD,
)

const suffix = Date.now()
const warnings = []

const activeGroup = await userA.supabase
  .from('groups')
  .select('id,name')
  .eq('is_active', true)
  .limit(1)
  .maybeSingle()

if (activeGroup.error || !activeGroup.data) {
  fail('FAILED_FORUM_GROUP_READ', { error: activeGroup.error?.message })
}

let membership = await userA.supabase
  .from('group_members')
  .select('id')
  .eq('group_id', activeGroup.data.id)
  .eq('user_id', userA.user.id)
  .maybeSingle()

if (!membership.data && !membership.error) {
  membership = await userA.supabase
    .from('group_members')
    .insert({
      group_id: activeGroup.data.id,
      user_id: userA.user.id,
      role: 'member',
      status: 'active',
    })
    .select('id')
    .single()
}

if (membership.error || !membership.data) {
  fail('FAILED_FORUM_GROUP_MEMBERSHIP', { error: membership.error?.message })
}

const post = await userA.supabase
  .from('posts')
  .insert({
    user_id: userA.user.id,
    body: `QA foro con la Palabra ${suffix}`,
    verse_reference: 'Mateo 5:14',
    verse_text: 'Vosotros sois la luz del mundo.',
    group_id: activeGroup.data.id,
  })
  .select('id,user_id,group_id')
  .single()

if (post.error || !post.data) {
  fail('FAILED_FORUM_POST_CREATE', { error: post.error?.message })
}

const comment = await userA.supabase
  .from('post_comments')
  .insert({
    post_id: post.data.id,
    user_id: userA.user.id,
    body: 'Comentario temporal QA.',
  })
  .select('id,user_id')
  .single()

if (comment.error || !comment.data) {
  fail('FAILED_FORUM_COMMENT_CREATE', { error: comment.error?.message })
}

const reaction = await userA.supabase
  .from('post_reactions')
  .insert({
    post_id: post.data.id,
    user_id: userA.user.id,
    reaction: 'amen',
  })
  .select('id')
  .single()

if (reaction.error || !reaction.data) {
  fail('FAILED_FORUM_REACTION_CREATE', { error: reaction.error?.message })
}

const duplicateReaction = await userA.supabase.from('post_reactions').insert({
  post_id: post.data.id,
  user_id: userA.user.id,
  reaction: 'amen',
})

const duplicateDenied = duplicateReaction.error?.code === '23505'

const reportComment = await userA.supabase
  .from('content_reports')
  .insert({
    reporter_id: userA.user.id,
    target_type: 'comment',
    target_id: comment.data.id,
    reason: 'QA reporte de comentario',
    details: 'Reporte temporal creado por QA de foros.',
  })
  .select('id')
  .single()

if (reportComment.error || !reportComment.data) {
  fail('FAILED_FORUM_COMMENT_REPORT', { error: reportComment.error?.message })
}

const ownPostUpdate = await userA.supabase
  .from('posts')
  .update({ body: `QA foro editado ${suffix}` })
  .eq('id', post.data.id)
  .eq('user_id', userA.user.id)
  .select('id')
  .single()

if (ownPostUpdate.error || !ownPostUpdate.data) {
  fail('FAILED_FORUM_POST_UPDATE', { error: ownPostUpdate.error?.message })
}

const ownCommentUpdate = await userA.supabase
  .from('post_comments')
  .update({ body: 'Comentario temporal QA editado.' })
  .eq('id', comment.data.id)
  .eq('user_id', userA.user.id)
  .select('id')
  .single()

if (ownCommentUpdate.error || !ownCommentUpdate.data) {
  fail('FAILED_FORUM_COMMENT_UPDATE', { error: ownCommentUpdate.error?.message })
}

const crossUserPostUpdate = await userB.supabase
  .from('posts')
  .update({ body: 'Intento QA no autorizado' })
  .eq('id', post.data.id)
  .select('id')

const crossUserCommentDelete = await userB.supabase
  .from('post_comments')
  .delete()
  .eq('id', comment.data.id)
  .select('id')

const crossUserGroupPost = await userB.supabase
  .from('posts')
  .insert({
    user_id: userB.user.id,
    body: `Intento QA comunidad ajena ${suffix}`,
    group_id: activeGroup.data.id,
  })
  .select('id')

const readBack = await userA.supabase
  .from('posts')
  .select('id,group_id,groups:group_id(id,name),post_comments(id),post_reactions(id,reaction)')
  .eq('id', post.data.id)
  .single()

if (
  readBack.error ||
  readBack.data?.group_id !== activeGroup.data.id ||
  !readBack.data?.groups ||
  readBack.data?.post_comments?.length !== 1 ||
  readBack.data?.post_reactions?.length !== 1
) {
  fail('FAILED_FORUM_COUNTS', { error: readBack.error?.message })
}

const deleted = await userA.supabase
  .from('posts')
  .delete()
  .eq('id', post.data.id)
  .eq('user_id', userA.user.id)

if (deleted.error) warnings.push('No se pudo limpiar post QA.')

const cleanupMembership = await userA.supabase
  .from('group_members')
  .delete()
  .eq('id', membership.data.id)

if (cleanupMembership.error) warnings.push('No se pudo limpiar membresia QA.')

const crossUserPostDenied = okNoRows(crossUserPostUpdate)
const crossUserCommentDenied = okNoRows(crossUserCommentDelete)
const crossUserGroupPostDenied = denied(crossUserGroupPost)

if (
  !duplicateDenied ||
  !crossUserPostDenied ||
  !crossUserCommentDenied ||
  !crossUserGroupPostDenied
) {
  fail('FAILED_FORUM_RLS_EXPECTATION', {
    duplicateDenied,
    crossUserPostDenied,
    crossUserCommentDenied,
    crossUserGroupPostDenied,
    duplicateError: duplicateReaction.error?.code,
    postUpdateError: crossUserPostUpdate.error?.message,
    commentDeleteError: crossUserCommentDelete.error?.message,
    groupPostError: crossUserGroupPost.error?.message,
  })
}

console.log(
  JSON.stringify(
    {
      status: 'QA_FORUMS_OK',
      createPost: 'OK',
      createComment: 'OK',
      createReaction: 'OK',
      updatePost: 'OK',
      updateComment: 'OK',
      groupContext: 'OK',
      duplicateReaction: 'DENIED',
      reportComment: 'OK',
      crossUserPostUpdate: 'DENIED',
      crossUserCommentDelete: 'DENIED',
      crossUserGroupPost: 'DENIED',
      cleanupWarnings: warnings,
    },
    null,
    2,
  ),
)
