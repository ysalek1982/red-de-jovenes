import type { FormEvent, ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  BookOpen,
  FileText,
  Heart,
  Loader2,
  MessageCircle,
  Send,
  ShieldCheck,
  Users,
  CalendarDays,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { hasRole } from '../features/auth/roleService'
import { useAuth } from '../features/auth/useAuth'
import {
  createDevotional,
  getAdminLatestItems,
  getAdminOverview,
  updateDevotional,
  updateGroupSuggestionStatus,
  updateReportStatus,
  type AdminDevotionalPreview,
  type AdminPostPreview,
  type AdminPrayerPreview,
  type AdminProfilePreview,
  type AdminReportPreview,
  type AdminSuggestionPreview,
} from '../features/admin/adminService'

interface AdminOverview {
  profiles: number
  prayers: number
  posts: number
  comments: number
  devotionals: number
  reports: number
  groupSuggestions: number
  testimonies: number
  events: number
  discipleshipTracks: number
  feedbackSuggestions: number
  messageReports: number
  notifications: number
}

interface AdminLatestItems {
  profiles: AdminProfilePreview[]
  reports: AdminReportPreview[]
  suggestions: AdminSuggestionPreview[]
  posts: AdminPostPreview[]
  prayers: AdminPrayerPreview[]
  devotionals: AdminDevotionalPreview[]
}

const initialOverview: AdminOverview = {
  profiles: 0,
  prayers: 0,
  posts: 0,
  comments: 0,
  devotionals: 0,
  reports: 0,
  groupSuggestions: 0,
  testimonies: 0,
  events: 0,
  discipleshipTracks: 0,
  feedbackSuggestions: 0,
  messageReports: 0,
  notifications: 0,
}

const initialLatest: AdminLatestItems = {
  profiles: [],
  reports: [],
  suggestions: [],
  posts: [],
  prayers: [],
  devotionals: [],
}

function formatDate(value: string | null) {
  if (!value) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function AdminHome() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [overview, setOverview] = useState<AdminOverview>(initialOverview)
  const [latest, setLatest] = useState<AdminLatestItems>(initialLatest)
  const [message, setMessage] = useState('')
  const [isSavingDevotional, setIsSavingDevotional] = useState(false)
  const [editingDevotionalId, setEditingDevotionalId] = useState<string | null>(
    null,
  )
  const [devotionalForm, setDevotionalForm] = useState({
    title: '',
    verseReference: '',
    verseText: '',
    reflection: '',
    prayer: '',
    devotionalDate: new Date().toISOString().slice(0, 10),
    isActive: true,
  })
  const [reportNotes, setReportNotes] = useState<Record<string, string>>({})
  const [suggestionNotes, setSuggestionNotes] = useState<Record<string, string>>({})

  const loadAdminData = useCallback(async () => {
    const [overviewData, latestData] = await Promise.all([
      getAdminOverview(),
      getAdminLatestItems(),
    ])
    setOverview(overviewData)
    setLatest(latestData)
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasRole('admin')
        .then(async (allowed) => {
          setIsAdmin(allowed)
          if (allowed) {
            await loadAdminData()
          }
        })
        .catch(() => setIsAdmin(false))
        .finally(() => setIsLoading(false))
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadAdminData])

  async function handleDevotionalSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const hasRequiredFields =
      devotionalForm.title.trim() &&
      devotionalForm.verseReference.trim() &&
      devotionalForm.verseText.trim() &&
      devotionalForm.reflection.trim() &&
      devotionalForm.devotionalDate.trim()

    if (!hasRequiredFields) {
      setMessage('Completa todos los campos del devocional.')
      return
    }

    setIsSavingDevotional(true)
    setMessage('')
    try {
      if (!user?.id) {
        setMessage('No pudimos confirmar tu sesion de administrador.')
        return
      }

      if (editingDevotionalId) {
        await updateDevotional({
          devotionalId: editingDevotionalId,
          ...devotionalForm,
        })
        setMessage('Devocional actualizado.')
      } else {
        await createDevotional({
          userId: user.id,
          ...devotionalForm,
        })
        setMessage('Devocional creado.')
      }
      setEditingDevotionalId(null)
      setDevotionalForm({
        title: '',
        verseReference: '',
        verseText: '',
        reflection: '',
        prayer: '',
        devotionalDate: new Date().toISOString().slice(0, 10),
        isActive: true,
      })
      await loadAdminData()
    } catch {
      setMessage('No pudimos guardar el devocional. Revisa permisos o fecha única.')
    } finally {
      setIsSavingDevotional(false)
    }
  }

  function handleEditDevotional(devotional: AdminDevotionalPreview) {
    setEditingDevotionalId(devotional.id)
    setDevotionalForm({
      title: devotional.title,
      verseReference: devotional.verse_reference,
      verseText: devotional.verse_text,
      reflection: devotional.reflection,
      prayer: devotional.prayer ?? '',
      devotionalDate: devotional.devotional_date,
      isActive: devotional.is_active,
    })
    setMessage('Carga el texto bíblico y la reflexión para actualizar.')
  }

  async function handleReportStatus(
    reportId: string,
    status: 'pending' | 'reviewed' | 'dismissed' | 'action_taken',
  ) {
    setMessage('')
    try {
      await updateReportStatus(reportId, status, reportNotes[reportId])
      await loadAdminData()
      setMessage('Reporte actualizado.')
    } catch {
      setMessage('No pudimos actualizar el reporte.')
    }
  }

  async function handleSuggestionStatus(
    suggestionId: string,
    status: 'pending' | 'approved' | 'rejected',
  ) {
    setMessage('')
    try {
      await updateGroupSuggestionStatus(
        suggestionId,
        status,
        suggestionNotes[suggestionId],
      )
      await loadAdminData()
      setMessage('Sugerencia actualizada.')
    } catch {
      setMessage('No pudimos actualizar la sugerencia.')
    }
  }

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
        <div className="section-shell flex items-center gap-3 text-white/70">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Verificando permisos...
        </div>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
        <div className="section-shell">
          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-8 shadow-2xl shadow-black/25 backdrop-blur">
            <ShieldCheck className="h-10 w-10 text-amber-200" aria-hidden="true" />
            <h1 className="mt-5 text-4xl font-black">No autorizado</h1>
            <p className="mt-4 max-w-xl text-white/70">
              Este módulo está reservado para administradores de Red de Jóvenes.
            </p>
            <Link
              to="/app"
              className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold text-slate-950 transition hover:bg-amber-100"
            >
              Volver a mi red
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const kpis = [
    { title: 'Usuarios', value: overview.profiles, icon: Users },
    { title: 'Oraciones', value: overview.prayers, icon: Heart },
    { title: 'Publicaciones', value: overview.posts, icon: MessageCircle },
    { title: 'Comentarios', value: overview.comments, icon: FileText },
    { title: 'Devocionales', value: overview.devotionals, icon: BookOpen },
    { title: 'Eventos', value: overview.events, icon: CalendarDays },
    { title: 'Discipulado', value: overview.discipleshipTracks, icon: BookOpen },
    { title: 'Reportes pendientes', value: overview.reports, icon: ShieldCheck },
    {
      title: 'Feedback pendiente',
      value: overview.feedbackSuggestions,
      icon: FileText,
    },
    {
      title: 'Reportes mensajes',
      value: overview.messageReports,
      icon: MessageCircle,
    },
    {
      title: 'Sugerencias pendientes',
      value: overview.groupSuggestions,
      icon: FileText,
    },
  ]

  const pilotChecks = [
    {
      title: 'Base funcional',
      detail: 'Auth, RLS, rutas y PWA validados para piloto cerrado.',
    },
    {
      title: 'Cuidado activo',
      detail: `${overview.reports} reportes pendientes para seguimiento pastoral.`,
    },
    {
      title: 'Comunidad viva',
      detail: `${overview.profiles} usuarios, ${overview.posts} posts y ${overview.prayers} oraciones.`,
    },
  ]

  const quickActions = [
    { label: 'Revisar reportes', href: '#reportes' },
    { label: 'Crear devocional', href: '#crear-devocional' },
    { label: 'Revisar publicaciones', href: '#publicaciones' },
    { label: 'Sugerencias de grupos', href: '#sugerencias' },
  ]

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-24 pt-32 text-white">
      <div className="pointer-events-none fixed right-0 top-24 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Administración
          </p>
          <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Panel de administración
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/70">
            Gestión inicial de Red de Jóvenes: cuidado, contenido y comunidad.
          </p>
        </div>

        {message ? (
          <div className="mt-8 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm font-semibold text-amber-100">
            {message}
          </div>
        ) : null}

        <div className="mt-10 rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-emerald-200">
                Estado piloto
              </p>
              <h2 className="mt-3 text-3xl font-black">
                Piloto cerrado listo para operar
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Usa este bloque como punto de control durante las primeras
                sesiones con jovenes, moderadores y administracion.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <a
                  key={action.href}
                  href={action.href}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] px-4 text-xs font-black text-white transition hover:bg-white/15"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {pilotChecks.map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-slate-950/35 p-4"
              >
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-7">
          {kpis.map((card) => {
            const Icon = card.icon
            return (
              <article
                key={card.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <Icon className="h-6 w-6 text-amber-200" aria-hidden="true" />
                <p className="mt-4 text-3xl font-black">{card.value}</p>
                <h2 className="mt-1 text-sm font-bold text-white/55">
                  {card.title}
                </h2>
              </article>
            )
          })}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <form
            id="crear-devocional"
            onSubmit={(event) => void handleDevotionalSubmit(event)}
            className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-amber-200" aria-hidden="true" />
              <h2 className="text-2xl font-black">
                {editingDevotionalId ? 'Editar devocional' : 'Crear devocional'}
              </h2>
            </div>
            <div className="mt-5 grid gap-3">
              <input
                value={devotionalForm.title}
                onChange={(event) =>
                  setDevotionalForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Título"
                className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
              />
              <input
                type="date"
                value={devotionalForm.devotionalDate}
                onChange={(event) =>
                  setDevotionalForm((current) => ({
                    ...current,
                    devotionalDate: event.target.value,
                  }))
                }
                className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none focus:border-amber-200/60"
              />
              <input
                value={devotionalForm.verseReference}
                onChange={(event) =>
                  setDevotionalForm((current) => ({
                    ...current,
                    verseReference: event.target.value,
                  }))
                }
                placeholder="Referencia bíblica"
                className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
              />
              <textarea
                value={devotionalForm.verseText}
                onChange={(event) =>
                  setDevotionalForm((current) => ({
                    ...current,
                    verseText: event.target.value,
                  }))
                }
                placeholder="Texto del versículo"
                className="min-h-24 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
              />
              <textarea
                value={devotionalForm.reflection}
                onChange={(event) =>
                  setDevotionalForm((current) => ({
                    ...current,
                    reflection: event.target.value,
                  }))
                }
                placeholder="Reflexión"
                className="min-h-32 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
              />
              <textarea
                value={devotionalForm.prayer}
                onChange={(event) =>
                  setDevotionalForm((current) => ({
                    ...current,
                    prayer: event.target.value,
                  }))
                }
                placeholder="Oracion final, opcional"
                className="min-h-24 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
              />
              <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm font-bold text-white/75">
                Devocional activo
                <input
                  type="checkbox"
                  checked={devotionalForm.isActive}
                  onChange={(event) =>
                    setDevotionalForm((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                  className="h-5 w-5 accent-amber-300"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={isSavingDevotional}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSavingDevotional ? 'Guardando...' : 'Guardar devocional'}
            </button>
          </form>

          <div className="grid gap-6 lg:grid-cols-2">
            <AdminList title="Últimos usuarios">
              {latest.profiles.map((profile) => (
                <AdminListItem
                  key={profile.id}
                  title={profile.full_name}
                  detail={`${profile.username ?? 'sin usuario'} · ${
                    profile.city ?? 'sin ciudad'
                  }`}
                />
              ))}
            </AdminList>

            <AdminList id="reportes" title="Reportes pendientes">
              {latest.reports.map((report) => (
                <AdminListItem
                  key={report.id}
                  title={report.reason}
                  detail={`${report.target_type} · ${formatDate(report.created_at)}`}
                  action={
                    <div className="flex min-w-48 flex-col gap-2">
                      <input
                        value={reportNotes[report.id] ?? ''}
                        onChange={(event) =>
                          setReportNotes((current) => ({
                            ...current,
                            [report.id]: event.target.value,
                          }))
                        }
                        placeholder="Nota interna"
                        className="h-8 rounded-full border border-white/10 bg-slate-950/60 px-3 text-xs text-white outline-none placeholder:text-white/35"
                      />
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => void handleReportStatus(report.id, 'reviewed')}
                          className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950"
                        >
                          Revisado
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleReportStatus(report.id, 'dismissed')}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/70"
                        >
                          Descartar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void handleReportStatus(report.id, 'action_taken')
                          }
                          className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-black text-emerald-100"
                        >
                          Accion
                        </button>
                      </div>
                    </div>
                  }
                />
              ))}
            </AdminList>

            <AdminList id="sugerencias" title="Sugerencias de grupos">
              {latest.suggestions.map((suggestion) => (
                <AdminListItem
                  key={suggestion.id}
                  title={suggestion.name}
                  detail={`${suggestion.city ?? 'sin ciudad'} · ${suggestion.country}`}
                  action={
                    <div className="flex min-w-44 flex-col gap-2">
                      <input
                        value={suggestionNotes[suggestion.id] ?? ''}
                        onChange={(event) =>
                          setSuggestionNotes((current) => ({
                            ...current,
                            [suggestion.id]: event.target.value,
                          }))
                        }
                        placeholder="Nota interna"
                        className="h-8 rounded-full border border-white/10 bg-slate-950/60 px-3 text-xs text-white outline-none placeholder:text-white/35"
                      />
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            void handleSuggestionStatus(suggestion.id, 'approved')
                          }
                          className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-950"
                        >
                          Aprobar
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            void handleSuggestionStatus(suggestion.id, 'rejected')
                          }
                          className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/70"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  }
                />
              ))}
            </AdminList>

            <AdminList title="Devocionales">
              {latest.devotionals.map((devotional) => (
                <AdminListItem
                  key={devotional.id}
                  title={devotional.title}
                  detail={`${devotional.verse_reference} · ${formatDate(
                    devotional.devotional_date,
                  )}`}
                  action={
                    <button
                      type="button"
                      onClick={() => handleEditDevotional(devotional)}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/70"
                    >
                      Editar
                    </button>
                  }
                />
              ))}
            </AdminList>

            <AdminList id="publicaciones" title="Posts recientes">
              {latest.posts.map((post) => (
                <AdminListItem
                  key={post.id}
                  title={post.body.slice(0, 64)}
                  detail={`${post.profiles?.full_name ?? 'Joven'} · ${formatDate(
                    post.created_at,
                  )}`}
                />
              ))}
            </AdminList>

            <AdminList title="Peticiones recientes">
              {latest.prayers.map((prayer) => (
                <AdminListItem
                  key={prayer.id}
                  title={prayer.title}
                  detail={`${prayer.is_answered ? 'Respondida' : 'En oración'} · ${
                    prayer.profiles?.full_name ?? 'Joven'
                  }`}
                />
              ))}
            </AdminList>
          </div>
        </div>
      </div>
    </section>
  )
}

function AdminList({
  id,
  title,
  children,
}: {
  id?: string
  title: string
  children: ReactNode
}) {
  const hasItems = Array.isArray(children) ? children.length > 0 : Boolean(children)

  return (
    <article
      id={id}
      className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur"
    >
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-4 space-y-3">
        {hasItems ? (
          children
        ) : (
          <p className="text-sm text-white/50">Sin registros todavía.</p>
        )}
      </div>
    </article>
  )
}

function AdminListItem({
  title,
  detail,
  action,
}: {
  title: string
  detail: string
  action?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
      <div className="min-w-0">
        <p className="truncate font-bold">{title}</p>
        <p className="mt-1 truncate text-xs text-white/45">{detail}</p>
      </div>
      {action}
    </div>
  )
}
