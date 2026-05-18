import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BookOpen,
  Heart,
  Loader2,
  LogOut,
  MessageCircle,
  Send,
  Sparkles,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { getRecentPosts, createPost } from '../features/community/communityService'
import { getTodayDevotional } from '../features/devotionals/devotionalService'
import {
  createPrayerRequest,
  getPublicPrayerRequests,
} from '../features/prayer/prayerService'
import { useAuth } from '../features/auth/useAuth'
import type { Devotional, Post, PrayerRequest } from '../types/database'

export function AppHome() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [prayerTitle, setPrayerTitle] = useState('')
  const [prayerBody, setPrayerBody] = useState('')
  const [postBody, setPostBody] = useState('')
  const [verseReference, setVerseReference] = useState('')
  const [isSubmittingPrayer, setIsSubmittingPrayer] = useState(false)
  const [isSubmittingPost, setIsSubmittingPost] = useState(false)

  const displayName = useMemo(() => {
    const metadataName = user?.user_metadata.full_name
    if (typeof metadataName === 'string' && metadataName.trim()) {
      return metadataName.trim().split(' ')[0]
    }
    return user?.email?.split('@')[0] ?? 'joven'
  }, [user])

  const loadData = useCallback(async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError('')
    try {
      const [devotionalData, prayerData, postData] = await Promise.all([
        getTodayDevotional(),
        getPublicPrayerRequests(),
        getRecentPosts(),
      ])
      setDevotional(devotionalData)
      setPrayers(prayerData)
      setPosts(postData)
    } catch {
      setError('No pudimos cargar la comunidad. Revisa la conexión o la migración de Supabase.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  async function handlePrayerSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !prayerTitle.trim() || !prayerBody.trim()) return

    setIsSubmittingPrayer(true)
    setError('')
    try {
      await createPrayerRequest({
        userId: user.id,
        title: prayerTitle.trim(),
        body: prayerBody.trim(),
      })
      setPrayerTitle('')
      setPrayerBody('')
      await loadData(false)
    } catch {
      setError('No pudimos publicar la petición de oración.')
    } finally {
      setIsSubmittingPrayer(false)
    }
  }

  async function handlePostSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !postBody.trim()) return

    setIsSubmittingPost(true)
    setError('')
    try {
      await createPost({
        userId: user.id,
        body: postBody.trim(),
        verseReference: verseReference.trim() || undefined,
      })
      setPostBody('')
      setVerseReference('')
      await loadData(false)
    } catch {
      setError('No pudimos publicar el post.')
    } finally {
      setIsSubmittingPost(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed left-1/2 top-32 h-96 w-96 -translate-x-1/2 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Mi red
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Hola, {displayName}.
            </h1>
            <p className="mt-4 max-w-2xl text-white/65">
              Este es tu primer espacio privado para oración, devocional y
              comunidad. La base ya está conectada a Supabase.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Cerrar sesión
          </Button>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-amber-300/20 bg-amber-300/10 p-5 text-sm text-amber-100">
            {error}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-12 flex items-center gap-3 text-white/70">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Cargando comunidad...
          </div>
        ) : (
          <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-amber-200" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Devocional del día</h2>
                </div>
                {devotional ? (
                  <div className="mt-5">
                    <h3 className="text-xl font-semibold text-white">{devotional.title}</h3>
                    <p className="mt-4 text-lg leading-8 text-white/80">
                      “{devotional.verse_text}”
                    </p>
                    <p className="mt-3 font-semibold text-amber-200">
                      {devotional.verse_reference}
                    </p>
                    <p className="mt-5 leading-7 text-white/65">{devotional.reflection}</p>
                  </div>
                ) : (
                  <p className="mt-5 text-white/60">
                    Aún no hay devocional cargado para hoy.
                  </p>
                )}
              </article>

              <form
                onSubmit={handlePrayerSubmit}
                className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-6 w-6 text-emerald-300" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Sala de oración</h2>
                </div>
                <div className="mt-5 space-y-4">
                  <Input
                    value={prayerTitle}
                    onChange={(event) => setPrayerTitle(event.target.value)}
                    placeholder="Título de tu petición"
                  />
                  <Textarea
                    value={prayerBody}
                    onChange={(event) => setPrayerBody(event.target.value)}
                    placeholder="Comparte cómo podemos orar contigo."
                  />
                  <Button
                    type="submit"
                    variant="accent"
                    disabled={isSubmittingPrayer || !prayerTitle.trim() || !prayerBody.trim()}
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {isSubmittingPrayer ? 'Publicando...' : 'Publicar petición'}
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              <form
                onSubmit={handlePostSubmit}
                className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-amber-200" aria-hidden="true" />
                  <h2 className="text-2xl font-bold">Comunidad</h2>
                </div>
                <div className="mt-5 space-y-4">
                  <Textarea
                    value={postBody}
                    onChange={(event) => setPostBody(event.target.value)}
                    placeholder="Comparte una reflexión, testimonio o palabra de ánimo."
                  />
                  <Input
                    value={verseReference}
                    onChange={(event) => setVerseReference(event.target.value)}
                    placeholder="Versículo opcional, ej. Mateo 5:14"
                  />
                  <Button type="submit" variant="accent" disabled={isSubmittingPost || !postBody.trim()}>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {isSubmittingPost ? 'Publicando...' : 'Publicar post'}
                  </Button>
                </div>
              </form>

              <div className="grid gap-6 lg:grid-cols-2">
                <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Heart className="h-5 w-5 text-emerald-300" aria-hidden="true" />
                    Últimas oraciones
                  </h2>
                  <div className="mt-5 space-y-4">
                    {prayers.length ? (
                      prayers.map((prayer) => (
                        <div key={prayer.id} className="rounded-2xl bg-slate-950/45 p-4">
                          <p className="font-semibold">{prayer.title}</p>
                          <p className="mt-2 text-sm leading-6 text-white/60">{prayer.body}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/60">
                        Todavía no hay peticiones públicas.
                      </p>
                    )}
                  </div>
                </article>

                <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Users className="h-5 w-5 text-amber-200" aria-hidden="true" />
                    Posts recientes
                  </h2>
                  <div className="mt-5 space-y-4">
                    {posts.length ? (
                      posts.map((post) => (
                        <div key={post.id} className="rounded-2xl bg-slate-950/45 p-4">
                          <p className="text-sm leading-6 text-white/75">{post.body}</p>
                          {post.verse_reference ? (
                            <p className="mt-2 text-xs font-semibold text-amber-200">
                              {post.verse_reference}
                            </p>
                          ) : null}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/60">
                        Todavía no hay posts en la comunidad.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
