import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Flag,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { forumCategories, forumTopics } from '../data/appDemoData'
import { useAuth } from '../features/auth/useAuth'
import {
  createPost,
  createPostComment,
  deleteOwnPost,
  deleteOwnPostComment,
  getRecentPosts,
  toggleAmenReaction,
  updateOwnPost,
  updateOwnPostComment,
  type PostWithAuthor,
} from '../features/community/communityService'
import { getActiveGroups, type GroupWithMembership } from '../features/map/worldMapService'
import { createContentReport } from '../features/safety/safetyService'
import { scrollElementIntoView } from '../lib/scroll'

type PostFilter = 'recent' | 'verse' | 'commented' | 'myCommunity'

function formatDate(value: string | null) {
  if (!value) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getAuthor(post: PostWithAuthor) {
  return post.profiles?.full_name || 'Joven de la Red'
}

export function CommunityFeedPage() {
  const { user } = useAuth()
  const userId = user?.id
  const pageTopRef = useRef<HTMLFormElement>(null)
  const feedTopRef = useRef<HTMLDivElement>(null)
  const postRefs = useRef<Record<string, HTMLElement | null>>({})
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [body, setBody] = useState('')
  const [verseReference, setVerseReference] = useState('')
  const [verseText, setVerseText] = useState('')
  const [groupId, setGroupId] = useState('')
  const [groups, setGroups] = useState<GroupWithMembership[]>([])
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [commentEdits, setCommentEdits] = useState<Record<string, string>>({})
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [postFilter, setPostFilter] = useState<PostFilter>('recent')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyPostId, setBusyPostId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  const loadPosts = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError('')
    try {
      const [postData, groupData] = await Promise.all([
        getRecentPosts(userId),
        userId ? getActiveGroups(userId) : Promise.resolve([]),
      ])
      setPosts(postData)
      setGroups(groupData.filter((group) => group.isMember))
    } catch {
      setError('No pudimos cargar la comunidad.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPosts()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadPosts])

  function revealNode(target: HTMLElement | null, behavior: ScrollBehavior = 'auto') {
    window.requestAnimationFrame(() => {
      scrollElementIntoView(target, behavior)
    })
  }

  function handlePostFilterChange(value: PostFilter) {
    setPostFilter(value)
    revealNode(feedTopRef.current)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !body.trim()) return

    setIsSubmitting(true)
    setError('')
    setActionMessage('')
    try {
      await createPost({
        userId: user.id,
        body: body.trim(),
        verseReference: verseReference.trim() || undefined,
        verseText: verseText.trim() || undefined,
        groupId: groupId || null,
      })
      setBody('')
      setVerseReference('')
      setVerseText('')
      setGroupId('')
      await loadPosts(false)
      revealNode(feedTopRef.current)
      setActionMessage('Tu aporte quedó en la Red. Gracias por edificar.')
    } catch {
      setError('No pudimos publicar tu post.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(postId: string) {
    if (!user) return
    setBusyPostId(postId)
    setError('')
    setActionMessage('')
    try {
      await deleteOwnPost({ postId, userId: user.id })
      await loadPosts(false)
      revealNode(feedTopRef.current)
      setActionMessage('Post eliminado.')
    } catch {
      setError('Solo puedes eliminar tus propios posts.')
    } finally {
      setBusyPostId(null)
    }
  }

  function startEditingPost(post: PostWithAuthor) {
    setEditingPostId(post.id)
    setBody(post.body)
    setVerseReference(post.verse_reference ?? '')
    setVerseText(post.verse_text ?? '')
    setGroupId(
      post.group_id && groups.some((group) => group.id === post.group_id)
        ? post.group_id
        : '',
    )
    revealNode(pageTopRef.current, 'smooth')
  }

  async function handleSaveEditedPost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !editingPostId || !body.trim()) return

    setIsSubmitting(true)
    setError('')
    setActionMessage('')
    try {
      await updateOwnPost({
        postId: editingPostId,
        userId: user.id,
        body: body.trim(),
        verseReference: verseReference.trim() || undefined,
        verseText: verseText.trim() || undefined,
        groupId: groupId || null,
      })
      setEditingPostId(null)
      setBody('')
      setVerseReference('')
      setVerseText('')
      setGroupId('')
      await loadPosts(false)
      revealNode(feedTopRef.current)
      setActionMessage('Post actualizado.')
    } catch {
      setError('No pudimos editar tu publicacion.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleToggleAmen(post: PostWithAuthor) {
    if (!user) return
    setBusyPostId(post.id)
    setError('')
    setActionMessage('')
    try {
      await toggleAmenReaction({
        postId: post.id,
        userId: user.id,
        hasReacted: post.reactedByMe,
      })
      await loadPosts(false)
      setActionMessage(
        post.reactedByMe
          ? 'Quitaste tu Amén de esta publicación.'
          : 'Tu Amén quedó registrado.',
      )
    } catch {
      setError('No pudimos actualizar tu amén.')
    } finally {
      setBusyPostId(null)
    }
  }

  async function handleComment(postId: string) {
    if (!user) return
    const comment = commentDrafts[postId]?.trim()
    if (!comment) return

    setBusyPostId(postId)
    setError('')
    setActionMessage('')
    try {
      await createPostComment({
        postId,
        userId: user.id,
        body: comment,
      })
      setCommentDrafts((current) => ({ ...current, [postId]: '' }))
      await loadPosts(false)
      revealNode(postRefs.current[postId], 'smooth')
      setActionMessage('Comentario publicado con gracia.')
    } catch {
      setError('No pudimos publicar tu comentario.')
    } finally {
      setBusyPostId(null)
    }
  }

  async function handleUpdateComment(commentId: string) {
    if (!user) return
    const bodyValue = commentEdits[commentId]?.trim()
    if (!bodyValue) return

    setBusyPostId(commentId)
    setError('')
    setActionMessage('')
    try {
      await updateOwnPostComment({
        commentId,
        userId: user.id,
        body: bodyValue,
      })
      setEditingCommentId(null)
      setCommentEdits((current) => ({ ...current, [commentId]: '' }))
      await loadPosts(false)
      revealNode(feedTopRef.current)
      setActionMessage('Comentario actualizado.')
    } catch {
      setError('No pudimos editar tu comentario.')
    } finally {
      setBusyPostId(null)
    }
  }

  async function handleDeleteComment(commentId: string) {
    if (!user) return

    setBusyPostId(commentId)
    setError('')
    setActionMessage('')
    try {
      await deleteOwnPostComment({ commentId, userId: user.id })
      await loadPosts(false)
      revealNode(feedTopRef.current)
      setActionMessage('Comentario eliminado.')
    } catch {
      setError('Solo puedes eliminar tus propios comentarios.')
    } finally {
      setBusyPostId(null)
    }
  }

  async function handleReportPost(postId: string) {
    if (!user) return

    setBusyPostId(postId)
    setError('')
    setActionMessage('')
    try {
      await createContentReport({
        reporterId: user.id,
        targetType: 'post',
        targetId: postId,
        reason: 'Revisión comunitaria solicitada',
      })
      setActionMessage('Reporte enviado para revision. Gracias por cuidar la Red.')
    } catch {
      setError('No pudimos enviar el reporte.')
    } finally {
      setBusyPostId(null)
    }
  }

  async function handleReportComment(commentId: string) {
    if (!user) return

    setBusyPostId(commentId)
    setError('')
    setActionMessage('')
    try {
      await createContentReport({
        reporterId: user.id,
        targetType: 'comment',
        targetId: commentId,
        reason: 'Revisión comunitaria solicitada',
      })
      setActionMessage('Comentario enviado a revision. Gracias por cuidar la Red.')
    } catch {
      setError('No pudimos enviar el reporte del comentario.')
    } finally {
      setBusyPostId(null)
    }
  }

  const visiblePosts = [...posts]
    .filter((post) => {
      if (postFilter === 'verse') return Boolean(post.verse_reference || post.verse_text)
      if (postFilter === 'myCommunity') {
        return Boolean(
          post.group_id && groups.some((group) => group.id === post.group_id),
        )
      }
      return true
    })
    .sort((firstPost, secondPost) => {
      if (postFilter === 'commented') {
        return secondPost.commentsCount - firstPost.commentsCount
      }
      return 0
    })

  return (
    <section className="app-page">
      <div className="section-shell relative">
        <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <form
            ref={pageTopRef}
            onSubmit={editingPostId ? handleSaveEditedPost : handleSubmit}
            className="app-card h-fit md:p-8"
          >
            <p className="app-kicker">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              {editingPostId ? 'Editando post' : 'Foros con la Palabra'}
            </p>
            <h1
              data-page-title
              className="mt-5 text-4xl font-black tracking-tight md:text-5xl"
            >
              Debates anclados en la Palabra.
            </h1>
            <p className="mt-4 text-white/65">
              Cada conversación empieza con versículos, respeto y una búsqueda
              real de Cristo.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-2">
              {forumCategories.slice(0, 4).map((category) => (
                <div
                  key={category.title}
                  className="app-card-soft"
                >
                  <p className="text-sm font-bold">{category.title}</p>
                  <p className="mt-1 text-xs text-white/45">{category.threads}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <label className="text-sm font-semibold" htmlFor="postBody">
                  Mensaje
                </label>
                <Textarea
                  id="postBody"
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Abre un debate sano o comparte lo que Dios puso en tu corazón."
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="verseReference">
                  Referencia bíblica, opcional
                </label>
                <Input
                  id="verseReference"
                  value={verseReference}
                  onChange={(event) => setVerseReference(event.target.value)}
                  placeholder="Mateo 5:14"
                  className="mt-2"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="verseText">
                  Texto del versículo, opcional
                </label>
                <Textarea
                  id="verseText"
                  value={verseText}
                  onChange={(event) => setVerseText(event.target.value)}
                  placeholder="Vosotros sois la luz del mundo..."
                  className="mt-2 min-h-24"
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="postGroup">
                  Comunidad, opcional
                </label>
                <select
                  id="postGroup"
                  value={groupId}
                  onChange={(event) => setGroupId(event.target.value)}
                  className="app-select mt-2"
                >
                  <option value="">Foro general de la Red</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {!groups.length ? (
                  <p className="mt-2 text-xs leading-5 text-white/45">
                    Únete a una comunidad en el mapa para publicar dentro de ella.
                  </p>
                ) : null}
              </div>
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !body.trim()}
              >
                <Send className="h-5 w-5" aria-hidden="true" />
                {isSubmitting
                  ? 'Guardando...'
                  : editingPostId
                    ? 'Guardar cambios'
                    : 'Publicar post'}
              </Button>
              {editingPostId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(null)
                    setBody('')
                    setVerseReference('')
                    setVerseText('')
                    setGroupId('')
                  }}
                  className="app-button-secondary w-full"
                >
                  Cancelar edicion
                </button>
              ) : null}
            </div>
          </form>

          <div ref={feedTopRef} className="app-card md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-200">
                  Discusiones sanas y reales
                </p>
                <h2 className="mt-2 text-3xl font-black">Foros con la Palabra</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950/50 px-4 py-2 text-sm text-white/60">
                {posts.length} posts
              </span>
            </div>

            <div className="app-scroll-x mt-5">
              {[
                ['recent', 'Recientes'],
                ['verse', 'Con versiculo'],
                ['commented', 'Mas comentadas'],
                ['myCommunity', 'Mi comunidad'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handlePostFilterChange(value as PostFilter)}
                  className={`app-chip flex-none ${
                    postFilter === value
                      ? 'app-chip-active'
                      : ''
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <p className="text-sm font-semibold text-white/55">
                Ideas sugeridas para abrir conversaciones
              </p>
              {forumTopics.slice(0, 2).map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-200">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    {topic.category}
                    {topic.isTrending ? <span>Tendencia</span> : null}
                  </div>
                  <h3 className="mt-3 text-lg font-black">{topic.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topic.verses.map((verse) => (
                      <span
                        key={verse}
                        className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs font-semibold text-white/65"
                      >
                        {verse}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-white/50">
                    Guia de conversacion para el piloto. No representa actividad
                    real de usuarios.
                  </p>
                </article>
              ))}
            </div>

            {error ? (
              <div className="app-alert-warning mt-5">
                {error}
              </div>
            ) : null}
            {actionMessage ? (
              <div className="app-alert mt-5">
                {actionMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-8 flex items-center gap-3 text-white/65">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Cargando comunidad...
              </div>
            ) : visiblePosts.length ? (
              <div className="mt-6 grid gap-4">
                {visiblePosts.map((post) => {
                  const isOwner = post.user_id === user?.id
                  return (
                    <article
                      key={post.id}
                      ref={(node) => {
                        postRefs.current[post.id] = node
                      }}
                      className="app-card-soft"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-3">
                            {post.profiles?.avatar_url ? (
                              <img
                                src={post.profiles.avatar_url}
                                alt=""
                                className="h-11 w-11 rounded-2xl border border-white/10 object-cover"
                              />
                            ) : (
                              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300 to-amber-300 text-sm font-black text-slate-950">
                                {getAuthor(post).slice(0, 1).toUpperCase()}
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-white">
                                {getAuthor(post)}
                              </p>
                              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/45">
                                {formatDate(post.created_at)}
                                {post.profiles?.city || post.profiles?.country
                                  ? ` · ${post.profiles.city ?? 'Sin ciudad'}, ${
                                      post.profiles.country ?? 'Sin pais'
                                    }`
                                  : ''}
                              </p>
                              {post.groups ? (
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-bold text-emerald-100">
                                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                                  {post.groups.name}
                                </span>
                              ) : post.profiles?.church_name ? (
                                <span className="mt-2 inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/55">
                                  {post.profiles.church_name}
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <p className="mt-4 leading-7 text-white/75">{post.body}</p>
                        </div>
                        {isOwner ? (
                          <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => startEditingPost(post)}
                            disabled={busyPostId === post.id}
                          >
                            Editar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => void handleDelete(post.id)}
                            disabled={busyPostId === post.id}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                            Eliminar
                          </Button>
                          </div>
                        ) : null}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => void handleReportPost(post.id)}
                          disabled={busyPostId === post.id}
                        >
                          <Flag className="h-4 w-4" aria-hidden="true" />
                          Reportar
                        </Button>
                      </div>

                      {post.verse_reference || post.verse_text ? (
                        <div className="app-card-accent mt-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                            <BookOpen className="h-4 w-4" aria-hidden="true" />
                            {post.verse_reference || 'Versículo compartido'}
                          </div>
                          {post.verse_text ? (
                            <p className="mt-3 text-sm leading-6 text-white/75">
                              “{post.verse_text}”
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={post.reactedByMe ? 'secondary' : 'accent'}
                          size="sm"
                          onClick={() => void handleToggleAmen(post)}
                          disabled={busyPostId === post.id}
                        >
                          Amén · {post.amenCount}
                        </Button>
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white/55">
                          {post.commentsCount} comentarios
                        </span>
                      </div>

                      <div className="mt-5 space-y-3">
                        {(post.post_comments ?? []).slice(0, 3).map((comment) => (
                          <div
                            key={comment.id}
                            className="app-card-soft bg-white/[0.04]"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                                {comment.profiles?.full_name ?? 'Joven de la Red'}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {comment.user_id === user?.id ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingCommentId(comment.id)
                                        setCommentEdits((current) => ({
                                          ...current,
                                          [comment.id]: comment.body,
                                        }))
                                        revealNode(postRefs.current[post.id], 'smooth')
                                      }}
                                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/45 transition hover:bg-white/10 hover:text-white"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => void handleDeleteComment(comment.id)}
                                      disabled={busyPostId === comment.id}
                                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/45 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                    >
                                      Eliminar
                                    </button>
                                  </>
                                ) : null}
                                <button
                                  type="button"
                                  onClick={() => void handleReportComment(comment.id)}
                                  disabled={busyPostId === comment.id}
                                  className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/45 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                                >
                                  Reportar
                                </button>
                              </div>
                            </div>
                            {editingCommentId === comment.id ? (
                              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <Input
                                  value={commentEdits[comment.id] ?? ''}
                                  onChange={(event) =>
                                    setCommentEdits((current) => ({
                                      ...current,
                                      [comment.id]: event.target.value,
                                    }))
                                  }
                                  disabled={busyPostId === comment.id}
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="sm"
                                  onClick={() => void handleUpdateComment(comment.id)}
                                  disabled={
                                    busyPostId === comment.id ||
                                    !commentEdits[comment.id]?.trim()
                                  }
                                >
                                  Guardar
                                </Button>
                              </div>
                            ) : (
                              <p className="mt-2 text-sm leading-6 text-white/70">
                                {comment.body}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                        <Input
                          value={commentDrafts[post.id] ?? ''}
                          onChange={(event) =>
                            setCommentDrafts((current) => ({
                              ...current,
                              [post.id]: event.target.value,
                            }))
                          }
                          placeholder="Responder con gracia..."
                          disabled={busyPostId === post.id}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => void handleComment(post.id)}
                          disabled={
                            busyPostId === post.id ||
                            !commentDrafts[post.id]?.trim()
                          }
                        >
                          Comentar
                        </Button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <div className="app-empty mt-8">
                Todavia no hay posts. Comparte una reflexion, una pregunta o
                una palabra de animo para iniciar la conversacion.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
