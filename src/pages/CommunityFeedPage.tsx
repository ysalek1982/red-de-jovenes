import type { FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  BookOpen,
  Loader2,
  MessageCircle,
  Send,
  Sparkles,
  Trash2,
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
  getRecentPosts,
  toggleAmenReaction,
  type PostWithAuthor,
} from '../features/community/communityService'

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
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [body, setBody] = useState('')
  const [verseReference, setVerseReference] = useState('')
  const [verseText, setVerseText] = useState('')
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [busyPostId, setBusyPostId] = useState<string | null>(null)
  const [error, setError] = useState('')

  const loadPosts = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError('')
    try {
      const postData = await getRecentPosts(userId)
      setPosts(postData)
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !body.trim()) return

    setIsSubmitting(true)
    setError('')
    try {
      await createPost({
        userId: user.id,
        body: body.trim(),
        verseReference: verseReference.trim() || undefined,
        verseText: verseText.trim() || undefined,
      })
      setBody('')
      setVerseReference('')
      setVerseText('')
      await loadPosts(false)
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
    try {
      await deleteOwnPost({ postId, userId: user.id })
      await loadPosts(false)
    } catch {
      setError('Solo puedes eliminar tus propios posts.')
    } finally {
      setBusyPostId(null)
    }
  }

  async function handleToggleAmen(post: PostWithAuthor) {
    if (!user) return
    setBusyPostId(post.id)
    setError('')
    try {
      await toggleAmenReaction({
        postId: post.id,
        userId: user.id,
        hasReacted: post.reactedByMe,
      })
      await loadPosts(false)
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
    try {
      await createPostComment({
        postId,
        userId: user.id,
        body: comment,
      })
      setCommentDrafts((current) => ({ ...current, [postId]: '' }))
      await loadPosts(false)
    } catch {
      setError('No pudimos publicar tu comentario.')
    } finally {
      setBusyPostId(null)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed right-0 top-24 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
          <form
            onSubmit={handleSubmit}
            className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur md:p-8"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200">
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Foros con la Palabra
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
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
                  className="rounded-2xl border border-white/10 bg-slate-950/45 p-3"
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
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full"
                disabled={isSubmitting || !body.trim()}
              >
                <Send className="h-5 w-5" aria-hidden="true" />
                {isSubmitting ? 'Publicando...' : 'Publicar post'}
              </Button>
            </div>
          </form>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-4 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
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

            <div className="mt-6 grid gap-3">
              {forumTopics.slice(0, 2).map((topic) => (
                <article
                  key={topic.title}
                  className="rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-4"
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
                    por {topic.author} · {topic.replies} respuestas · {topic.prayers}{' '}
                    oraciones
                  </p>
                </article>
              ))}
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {error}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-8 flex items-center gap-3 text-white/65">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Cargando comunidad...
              </div>
            ) : posts.length ? (
              <div className="mt-6 grid gap-4">
                {posts.map((post) => {
                  const isOwner = post.user_id === user?.id
                  return (
                    <article
                      key={post.id}
                      className="rounded-[1.5rem] border border-white/10 bg-slate-950/45 p-5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-white/45">
                            {getAuthor(post)} · {formatDate(post.created_at)}
                          </p>
                          <p className="mt-3 leading-7 text-white/75">{post.body}</p>
                        </div>
                        {isOwner ? (
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
                        ) : null}
                      </div>

                      {post.verse_reference || post.verse_text ? (
                        <div className="mt-5 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5">
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
                            className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
                              {comment.profiles?.full_name ?? 'Joven de la Red'}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-white/70">
                              {comment.body}
                            </p>
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
              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-slate-950/35 p-8 text-center text-white/60">
                Todavía no hay posts. Comparte la primera palabra de ánimo para
                la comunidad.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
