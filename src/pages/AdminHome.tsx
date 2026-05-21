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
  Sparkles,
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
import {
  getPilotMetrics,
  type PilotMetrics,
} from '../features/admin/pilotMetricsService'
import { generatePilotReport } from '../features/admin/pilotReportService'
import {
  activateAiPromptTemplate,
  createAiPromptTemplate,
  disableAiProvider,
  generateAiContent,
  getAdminBibleStatus,
  getAiProviderStatus,
  getAiPromptTemplates,
  getAiUsageSummary,
  getPendingAiActions,
  saveAiProviderKey,
  saveAiUsageLimit,
  saveDailyBibleVerse,
  testAiProviderKey,
  testRandomBibleVerseFromAdmin,
  type AiProviderStatus,
} from '../features/ai/aiService'
import { validateAiPrompt, type AiActionType } from '../features/ai/aiGuardrails'
import {
  createPilotIncident,
  getAdminPilotIncidents,
  getAdminQaPilotIncidents,
  summarizePilotIncidents,
  updatePilotIncident,
  type PilotIncidentSeverity,
  type PilotIncidentStatus,
} from '../features/pilot/pilotIncidentService'
import {
  getAdminPilotFeedback,
  getAdminQaPilotFeedback,
  summarizePilotFeedback,
  updatePilotFeedbackStatus,
  type PilotFeedbackStatus,
} from '../features/pilot/pilotFeedbackService'
import type {
  AiActionQueue,
  AiCostEvent,
  AiPromptTemplate,
  AiUsageDaily,
  AiUsageLimit,
  BibleDailyVerse,
  BibleMissingChapterReport,
  BibleReadingPlan,
  BibleReadingPlanDay,
  BibleTranslation,
  BibleTranslationStats,
  PilotFeedback,
  PilotIncident,
} from '../types/database'

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

const initialPilotMetrics: PilotMetrics = {
  adoption: { users: 0, profileCompletionBase: 0 },
  community: {
    posts: 0,
    comments: 0,
    reactions: 0,
    prayers: 0,
    prayerSupports: 0,
    groupSuggestions: 0,
    approvedGroups: 0,
    groupMembers: 0,
  },
  bible: { savedVerses: 0, bibleReads: 0 },
  games: { gameScores: 0 },
  events: { events: 0, rsvps: 0 },
  messages: { conversations: 0, messages: 0, messageReports: 0 },
  ai: { aiActions: 0, aiCostEvents: 0 },
  moderation: { reportsPending: 0, reportsResolved: 0 },
  pilot: { feedbackNew: 0, feedbackTotal: 0, incidentsOpen: 0, incidentsCritical: 0 },
  daily: {
    activeUsersToday: 0,
    newRegistrations: 0,
    incompleteProfiles: 0,
    postsToday: 0,
    commentsToday: 0,
    prayersToday: 0,
    prayerSupportsToday: 0,
    gamesToday: 0,
    messagesToday: 0,
    eventsRsvpsToday: 0,
    groupMembersToday: 0,
    feedbackNew: 0,
    incidentsOpen: 0,
    reportsPending: 0,
    aiUsageToday: 0,
    aiErrorsToday: 0,
    aiLimitReachedToday: 0,
  },
}

function formatDate(value: string | null) {
  if (!value) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function getDefaultReportRange() {
  return {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    to: new Date().toISOString().slice(0, 10),
  }
}

export function AdminHome() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [overview, setOverview] = useState<AdminOverview>(initialOverview)
  const [latest, setLatest] = useState<AdminLatestItems>(initialLatest)
  const [pilotMetrics, setPilotMetrics] =
    useState<PilotMetrics>(initialPilotMetrics)
  const [pilotFeedback, setPilotFeedback] = useState<PilotFeedback[]>([])
  const [pilotIncidents, setPilotIncidents] = useState<PilotIncident[]>([])
  const [qaPilotFeedback, setQaPilotFeedback] = useState<PilotFeedback[]>([])
  const [qaPilotIncidents, setQaPilotIncidents] = useState<PilotIncident[]>([])
  const [incidentForm, setIncidentForm] = useState({
    severity: 'medium' as PilotIncidentSeverity,
    module: 'General',
    title: '',
    description: '',
  })
  const [incidentResolutions, setIncidentResolutions] = useState<
    Record<string, string>
  >({})
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({})
  const [reportRange, setReportRange] = useState(getDefaultReportRange)
  const [pilotReport, setPilotReport] = useState('')
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
  const [aiStatus, setAiStatus] = useState<AiProviderStatus | null>(null)
  const [aiQueue, setAiQueue] = useState<AiActionQueue[]>([])
  const [aiKey, setAiKey] = useState('')
  const [aiModel, setAiModel] = useState('gemini-2.0-flash')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiActionType, setAiActionType] =
    useState<AiActionType>('explain_bible_verse')
  const [aiOutput, setAiOutput] = useState('')
  const [aiUsage, setAiUsage] = useState<AiUsageDaily[]>([])
  const [aiLimits, setAiLimits] = useState<AiUsageLimit[]>([])
  const [aiCosts, setAiCosts] = useState<AiCostEvent[]>([])
  const [aiTemplates, setAiTemplates] = useState<AiPromptTemplate[]>([])
  const [templateDraft, setTemplateDraft] = useState({
    title: '',
    systemPrompt: '',
    userPromptTemplate: '',
    safetyNotes: '',
  })
  const [bibleAdmin, setBibleAdmin] = useState<{
    translations: BibleTranslation[]
    booksCount: number
    versesCount: number
    recentDailyVerses: BibleDailyVerse[]
    translationStats: BibleTranslationStats[]
    missingChapters: BibleMissingChapterReport[]
    readingPlans: (BibleReadingPlan & {
      bible_reading_plan_days?: BibleReadingPlanDay[]
    })[]
  }>({
    translations: [],
    booksCount: 0,
    versesCount: 0,
    recentDailyVerses: [],
    translationStats: [],
    missingChapters: [],
    readingPlans: [],
  })
  const [dailyVerseForm, setDailyVerseForm] = useState({
    translationCode: 'RVR1909',
    bookCode: 'JHN',
    chapter: '3',
    verse: '16',
    activeDate: new Date().toISOString().slice(0, 10),
    devotionalHint: '',
  })

  const loadAdminData = useCallback(async () => {
    const [
      overviewData,
      latestData,
      aiStatusData,
      aiQueueData,
      aiUsageData,
      aiTemplatesData,
      bibleStatusData,
      pilotMetricsData,
      pilotFeedbackData,
      pilotIncidentsData,
      qaPilotFeedbackData,
      qaPilotIncidentsData,
    ] = await Promise.all([
      getAdminOverview(),
      getAdminLatestItems(),
      getAiProviderStatus().catch(() => ({ provider: null })),
      getPendingAiActions().catch(() => []),
      getAiUsageSummary().catch(() => ({
        usage: [],
        limits: [],
        costs: [],
      })),
      getAiPromptTemplates().catch(() => ({ templates: [] })),
      getAdminBibleStatus().catch(() => ({
        translations: [],
        booksCount: 0,
        versesCount: 0,
        recentDailyVerses: [],
        translationStats: [],
        missingChapters: [],
        readingPlans: [],
      })),
      getPilotMetrics().catch(() => initialPilotMetrics),
      getAdminPilotFeedback().catch(() => []),
      getAdminPilotIncidents().catch(() => []),
      getAdminQaPilotFeedback().catch(() => []),
      getAdminQaPilotIncidents().catch(() => []),
    ])
    setOverview(overviewData)
    setLatest(latestData)
    setAiStatus(aiStatusData?.provider ?? null)
    setAiQueue(aiQueueData)
    setAiUsage(aiUsageData?.usage ?? [])
    setAiLimits(aiUsageData?.limits ?? [])
    setAiCosts(aiUsageData?.costs ?? [])
    setAiTemplates(aiTemplatesData?.templates ?? [])
    setBibleAdmin({
      translations: bibleStatusData?.translations ?? [],
      booksCount: bibleStatusData?.booksCount ?? 0,
      versesCount: bibleStatusData?.versesCount ?? 0,
      recentDailyVerses: bibleStatusData?.recentDailyVerses ?? [],
      translationStats: bibleStatusData?.translationStats ?? [],
      missingChapters: bibleStatusData?.missingChapters ?? [],
      readingPlans: bibleStatusData?.readingPlans ?? [],
    })
    setPilotMetrics(pilotMetricsData)
    setPilotFeedback(pilotFeedbackData)
    setPilotIncidents(pilotIncidentsData)
    setQaPilotFeedback(qaPilotFeedbackData)
    setQaPilotIncidents(qaPilotIncidentsData)
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

  async function handleSaveAiSettings() {
    if (!aiKey.trim()) {
      setMessage('Pega una API key valida para guardar Gemini.')
      return
    }
    const result = await saveAiProviderKey({ apiKey: aiKey.trim(), model: aiModel })
    setAiKey('')
    setMessage(`Gemini configurado. Key terminada en ****${result?.key_last4 ?? '****'}`)
    await loadAdminData()
  }

  async function handleTestAiSettings() {
    const result = await testAiProviderKey()
    setMessage(result?.status === 'GEMINI_TEST_OK' ? 'Gemini respondio correctamente.' : 'Gemini no esta configurado.')
    await loadAdminData()
  }

  async function handleDisableAi() {
    await disableAiProvider()
    setMessage('Gemini fue desactivado.')
    await loadAdminData()
  }

  async function handleGenerateAi() {
    const validation = validateAiPrompt(aiPrompt)
    if (validation) {
      setMessage(validation)
      return
    }
    const result = await generateAiContent({
      actionType: aiActionType,
      prompt: aiPrompt,
    })
    if (result?.text) setAiOutput(result.text)
    setMessage(
      result?.status === 'AI_PROVIDER_NOT_CONFIGURED'
        ? 'Gemini no esta configurado. La solicitud quedo en cola para revision.'
        : 'Respuesta IA generada para revision humana.',
    )
    await loadAdminData()
  }

  async function handleSaveDefaultAiLimit() {
    await saveAiUsageLimit({
      actionType: aiActionType,
      dailyRequestLimit: 20,
      dailyTokenLimit: 20000,
      isEnabled: true,
    })
    setMessage('Limite IA global guardado para esta accion.')
    await loadAdminData()
  }

  async function handleCreatePromptTemplate() {
    if (
      !templateDraft.title.trim() ||
      !templateDraft.systemPrompt.trim() ||
      !templateDraft.userPromptTemplate.trim()
    ) {
      setMessage('Completa titulo, prompt de sistema y plantilla de usuario.')
      return
    }
    await createAiPromptTemplate({
      actionType: aiActionType,
      title: templateDraft.title,
      systemPrompt: templateDraft.systemPrompt,
      userPromptTemplate: templateDraft.userPromptTemplate,
      safetyNotes: templateDraft.safetyNotes,
    })
    setTemplateDraft({
      title: '',
      systemPrompt: '',
      userPromptTemplate: '',
      safetyNotes: '',
    })
    setMessage('Nueva version de prompt pastoral activada.')
    await loadAdminData()
  }

  async function handleActivatePromptTemplate(templateId: string) {
    await activateAiPromptTemplate(templateId)
    setMessage('Version de prompt activada.')
    await loadAdminData()
  }

  async function handleSaveDailyBibleVerse() {
    await saveDailyBibleVerse({
      translationCode: dailyVerseForm.translationCode,
      bookCode: dailyVerseForm.bookCode,
      chapter: Number(dailyVerseForm.chapter),
      verse: Number(dailyVerseForm.verse),
      activeDate: dailyVerseForm.activeDate,
      devotionalHint: dailyVerseForm.devotionalHint,
    })
    setMessage('Versiculo diario guardado.')
    await loadAdminData()
  }

  async function handleTestBibleRandom() {
    const result = await testRandomBibleVerseFromAdmin()
    setMessage(
      result?.status === 'BIBLE_RANDOM_OK'
        ? 'Versiculo aleatorio disponible.'
        : 'No hay versiculos disponibles para la prueba.',
    )
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

  async function handlePilotFeedbackStatus(
    feedbackId: string,
    status: PilotFeedbackStatus,
  ) {
    setMessage('')
    try {
      await updatePilotFeedbackStatus({
        feedbackId,
        status,
        adminNote: feedbackNotes[feedbackId],
      })
      await loadAdminData()
      setMessage('Feedback actualizado.')
    } catch {
      setMessage('No pudimos actualizar el feedback.')
    }
  }

  async function handleCreateIncident(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user?.id) return
    if (!incidentForm.title.trim()) {
      setMessage('Escribe un titulo para el incidente.')
      return
    }
    setMessage('')
    try {
      await createPilotIncident({
        reportedBy: user.id,
        severity: incidentForm.severity,
        module: incidentForm.module,
        title: incidentForm.title.trim(),
        description: incidentForm.description.trim(),
      })
      setIncidentForm({
        severity: 'medium',
        module: 'General',
        title: '',
        description: '',
      })
      await loadAdminData()
      setMessage('Incidente registrado.')
    } catch {
      setMessage('No pudimos registrar el incidente.')
    }
  }

  async function handleIncidentStatus(
    incidentId: string,
    status: PilotIncidentStatus,
  ) {
    setMessage('')
    try {
      await updatePilotIncident({
        incidentId,
        status,
        resolution: incidentResolutions[incidentId],
        resolvedBy: user?.id,
      })
      await loadAdminData()
      setMessage('Incidente actualizado.')
    } catch {
      setMessage('No pudimos actualizar el incidente.')
    }
  }

  async function handleGeneratePilotReport() {
    setMessage('')
    try {
      const report = await generatePilotReport(reportRange)
      setPilotReport(report)
      setMessage('Reporte del piloto generado.')
    } catch {
      setMessage('No pudimos generar el reporte del piloto.')
    }
  }

  if (isLoading) {
    return (
      <section className="app-page">
        <div className="section-shell flex items-center gap-3 text-white/70">
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          Verificando permisos...
        </div>
      </section>
    )
  }

  if (!isAdmin) {
    return (
      <section className="app-page">
        <div className="section-shell">
          <div className="app-card-accent p-8">
            <ShieldCheck className="h-10 w-10 text-amber-200" aria-hidden="true" />
            <h1 className="mt-5 text-4xl font-black">No autorizado</h1>
            <p className="mt-4 max-w-xl text-white/70">
              Este módulo está reservado para administradores de Red de Jóvenes.
            </p>
            <Link
              to="/app"
              className="app-button-primary mt-7"
            >
              Volver a mi red
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const feedbackSummary = summarizePilotFeedback(pilotFeedback)
  const incidentSummary = summarizePilotIncidents(pilotIncidents)
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
  const rvr1909Stats = bibleAdmin.translationStats.find(
    (item) => item.code === 'RVR1909',
  )
  const rvr1909Complete =
    (rvr1909Stats?.books_with_verses ?? 0) === 66 &&
    (rvr1909Stats?.chapters_with_verses ?? 0) === 1189 &&
    (rvr1909Stats?.verses_count ?? 0) > 30000

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
    <section className="app-page">
      <div className="section-shell relative">
        <div className="max-w-3xl">
          <p className="app-kicker">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Administración
          </p>
          <h1 data-page-title className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
            Panel de administración
          </h1>
          <p className="mt-4 text-lg leading-8 text-white/70">
            Gestión inicial de Red de Jóvenes: cuidado, contenido y comunidad.
          </p>
        </div>

        {message ? (
          <div className="app-alert-warning mt-8">
            {message}
          </div>
        ) : null}

        <div className="mt-10 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-6">
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
                  className="app-chip min-h-10 bg-white/[0.08] text-xs text-white"
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
                className="app-card-soft"
              >
                <h3 className="font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {item.detail}
                </p>
              </article>
            ))}
          </div>
          <div className="app-card-soft mt-6 p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xl font-black">Estado del piloto</h3>
                <p className="mt-1 text-sm text-white/55">
                  Metricas reales acumuladas para revisar adopcion, comunidad y cuidado.
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/60">
                Sin datos ficticios
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <PilotMetricCard
                title="Adopcion"
                value={pilotMetrics.adoption.users}
                detail="usuarios registrados"
              />
              <PilotMetricCard
                title="Comunidad"
                value={pilotMetrics.community.posts + pilotMetrics.community.comments}
                detail={`${pilotMetrics.community.posts} posts · ${pilotMetrics.community.comments} comentarios`}
              />
              <PilotMetricCard
                title="Oracion"
                value={pilotMetrics.community.prayers}
                detail={`${pilotMetrics.community.prayerSupports} apoyos de oracion`}
              />
              <PilotMetricCard
                title="Biblia"
                value={pilotMetrics.bible.savedVerses}
                detail={`${pilotMetrics.bible.bibleReads} lecturas registradas`}
              />
              <PilotMetricCard
                title="Juegos"
                value={pilotMetrics.games.gameScores}
                detail="puntajes guardados"
              />
              <PilotMetricCard
                title="Eventos"
                value={pilotMetrics.events.events}
                detail={`${pilotMetrics.events.rsvps} confirmaciones`}
              />
              <PilotMetricCard
                title="Mensajes"
                value={pilotMetrics.messages.messages}
                detail={`${pilotMetrics.messages.conversations} conversaciones`}
              />
              <PilotMetricCard
                title="IA y cuidado"
                value={pilotMetrics.ai.aiActions}
                detail={`${pilotMetrics.moderation.reportsPending} reportes pendientes`}
              />
            </div>
            <div className="app-card-soft mt-6 p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-black">Monitoreo diario</h3>
                  <p className="mt-1 text-sm text-white/55">
                    Actividad real desde el inicio del dia. Si no hay datos, se muestra cero.
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/60">
                  Hoy
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PilotMetricCard
                  title="Usuarios activos"
                  value={pilotMetrics.daily.activeUsersToday}
                  detail={`${pilotMetrics.daily.newRegistrations} registros nuevos`}
                />
                <PilotMetricCard
                  title="Perfiles incompletos"
                  value={pilotMetrics.daily.incompleteProfiles}
                  detail="revisar onboarding y guia"
                />
                <PilotMetricCard
                  title="Conversacion"
                  value={pilotMetrics.daily.postsToday + pilotMetrics.daily.commentsToday}
                  detail={`${pilotMetrics.daily.postsToday} posts · ${pilotMetrics.daily.commentsToday} comentarios`}
                />
                <PilotMetricCard
                  title="Oracion hoy"
                  value={pilotMetrics.daily.prayersToday}
                  detail={`${pilotMetrics.daily.prayerSupportsToday} apoyos`}
                />
                <PilotMetricCard
                  title="Juegos hoy"
                  value={pilotMetrics.daily.gamesToday}
                  detail="puntajes nuevos"
                />
                <PilotMetricCard
                  title="Mensajes hoy"
                  value={pilotMetrics.daily.messagesToday}
                  detail="mensajes enviados"
                />
                <PilotMetricCard
                  title="Feedback nuevo"
                  value={pilotMetrics.daily.feedbackNew}
                  detail={`${feedbackSummary.averageRating} promedio de rating`}
                />
                <PilotMetricCard
                  title="Incidentes abiertos"
                  value={pilotMetrics.daily.incidentsOpen}
                  detail={`${pilotMetrics.daily.aiErrorsToday} errores IA hoy`}
                />
              </div>
            </div>
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

          <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-emerald-200" aria-hidden="true" />
              <h2 className="text-2xl font-black">Inteligencia Artificial</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/65">
              La IA asiste, no reemplaza el criterio pastoral. Las acciones sensibles requieren aprobacion humana.
            </p>
            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-sm">
              <p className="font-black text-white">
                Gemini: {aiStatus?.is_enabled ? 'Activo' : 'No configurado'}
              </p>
              <p className="mt-1 text-white/55">
                Modelo: {aiStatus?.model ?? aiModel} · Key: {aiStatus?.key_last4 ? `****${aiStatus.key_last4}` : 'sin key'}
              </p>
              <p className="mt-1 text-white/55">
                Ultimo test: {aiStatus?.last_test_status ?? 'pendiente'}
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              <input
                value={aiKey}
                onChange={(event) => setAiKey(event.target.value)}
                type="password"
                autoComplete="off"
                placeholder="Nueva Gemini API key"
                className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-emerald-200/60"
              />
              <input
                value={aiModel}
                onChange={(event) => setAiModel(event.target.value)}
                placeholder="Modelo Gemini"
                className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-emerald-200/60"
              />
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => void handleSaveAiSettings()} className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950">
                  Guardar / rotar
                </button>
                <button type="button" onClick={() => void handleTestAiSettings()} className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/70">
                  Probar
                </button>
                <button type="button" onClick={() => void handleDisableAi()} className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/70">
                  Desactivar
                </button>
              </div>
            </div>
            <div className="mt-5 grid gap-3 rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-black">Uso y limites</h3>
                  <p className="mt-1 text-xs text-white/50">
                    {aiUsage.reduce((sum, item) => sum + item.requests_count, 0)} solicitudes hoy · {aiCosts.reduce((sum, item) => sum + item.tokens_estimated, 0)} tokens estimados
                  </p>
                </div>
                <button type="button" onClick={() => void handleSaveDefaultAiLimit()} className="rounded-full border border-white/10 px-3 py-2 text-xs font-black text-white/70">
                  Guardar limite
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {aiLimits.slice(0, 4).map((limit) => (
                  <div key={limit.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <p className="truncate font-bold">{limit.action_type}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {limit.daily_request_limit} req/dia · {limit.daily_token_limit} tokens · {limit.is_enabled ? 'activo' : 'pausado'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
              <h3 className="font-black">Prompts IA</h3>
              <p className="mt-1 text-xs text-white/50">
                {aiTemplates.filter((template) => template.is_active).length} plantillas activas versionadas.
              </p>
              <div className="mt-3 grid gap-2">
                <input
                  value={templateDraft.title}
                  onChange={(event) => setTemplateDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Titulo de nueva version"
                  className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none placeholder:text-white/35"
                />
                <textarea
                  value={templateDraft.systemPrompt}
                  onChange={(event) => setTemplateDraft((current) => ({ ...current, systemPrompt: event.target.value }))}
                  rows={2}
                  placeholder="Prompt de sistema pastoral"
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35"
                />
                <textarea
                  value={templateDraft.userPromptTemplate}
                  onChange={(event) => setTemplateDraft((current) => ({ ...current, userPromptTemplate: event.target.value }))}
                  rows={2}
                  placeholder="Plantilla de usuario con {{prompt}}"
                  className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35"
                />
                <button type="button" onClick={() => void handleCreatePromptTemplate()} className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-xs font-black text-emerald-100">
                  Crear nueva version activa
                </button>
              </div>
              <div className="mt-3 max-h-40 space-y-2 overflow-auto pr-1">
                {aiTemplates.slice(0, 6).map((template) => (
                  <div key={template.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-bold">{template.action_type} v{template.version}</p>
                      {template.is_active ? (
                        <span className="rounded-full bg-emerald-300/15 px-2 py-1 text-[0.65rem] font-black text-emerald-100">Activa</span>
                      ) : (
                        <button type="button" onClick={() => void handleActivatePromptTemplate(template.id)} className="rounded-full border border-white/10 px-2 py-1 font-black text-white/60">
                          Activar
                        </button>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-1 text-white/45">{template.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/45 p-4">
              <h3 className="font-black">Acciones asistidas</h3>
              <select value={aiActionType} onChange={(event) => setAiActionType(event.target.value as AiActionType)} className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white">
                <option value="generate_devotional_draft">Generar borrador devocional</option>
                <option value="suggest_forum_reply">Sugerir respuesta en foros</option>
                <option value="summarize_report">Resumir reporte</option>
                <option value="classify_content_report">Clasificar reporte</option>
                <option value="suggest_prayer_response">Sugerir respuesta pastoral</option>
                <option value="explain_bible_verse">Explicar versiculo</option>
                <option value="generate_event_description">Generar descripcion de evento</option>
                <option value="create_discipleship_reflection">Crear reflexion de discipulado</option>
                <option value="summarize_community_activity">Resumir actividad comunitaria</option>
              </select>
              <textarea value={aiPrompt} onChange={(event) => setAiPrompt(event.target.value)} rows={4} placeholder="Solicitud para la IA" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35" />
              <button type="button" onClick={() => void handleGenerateAi()} className="mt-3 rounded-full bg-emerald-200 px-4 py-2 text-xs font-black text-slate-950">
                Generar para revisar
              </button>
              {aiOutput ? (
                <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.05] p-3 text-sm leading-6 text-white/75">
                  {aiOutput}
                </div>
              ) : null}
            </div>
            <div className="mt-5">
              <h3 className="font-black">Cola de aprobacion</h3>
              <div className="mt-3 space-y-2">
                {aiQueue.length ? null : <p className="text-sm text-white/55">No hay acciones IA pendientes.</p>}
                {aiQueue.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-950/45 p-3 text-sm">
                    <p className="font-bold">{item.action_type}</p>
                    <p className="mt-1 line-clamp-2 text-white/55">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-sky-300/20 bg-sky-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur xl:col-span-2">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-sky-200" aria-hidden="true" />
              <h2 className="text-2xl font-black">Biblia</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/65">
              Solo cargar traducciones autorizadas o de dominio publico verificado.
            </p>
            <div className="mt-4 rounded-3xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-sm font-black text-emerald-100">
                {rvr1909Complete
                  ? 'Corpus importado - RVR1909 completa'
                  : 'Corpus pendiente o incompleto'}
              </p>
              <p className="mt-1 text-xs leading-5 text-white/60">
                Fuente: eBible RVR1909 / spaRV1909 - licencia public domain.
                {rvr1909Stats
                  ? ` ${rvr1909Stats.verses_count ?? 0} versiculos, ${rvr1909Stats.chapters_with_verses ?? 0} capitulos y ${rvr1909Stats.books_with_verses ?? 0} libros.`
                  : ' Aun no hay estadisticas RVR1909 disponibles.'}
              </p>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-3xl font-black">{bibleAdmin.translations.length}</p>
                <p className="mt-1 text-xs font-bold text-white/55">Traducciones</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-3xl font-black">{bibleAdmin.booksCount}</p>
                <p className="mt-1 text-xs font-bold text-white/55">Libros</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <p className="text-3xl font-black">{bibleAdmin.versesCount}</p>
                <p className="mt-1 text-xs font-bold text-white/55">Versiculos cargados</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Traducciones</h3>
                <div className="mt-3 space-y-2">
                  {bibleAdmin.translations.map((translation) => (
                    <div key={translation.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-sm">
                      <p className="font-bold">{translation.code} - {translation.name}</p>
                      <p className="mt-1 text-xs text-white/50">
                        {translation.is_public_domain ? 'Dominio publico' : 'Licencia requerida'} - {translation.license ?? 'sin nota de licencia'}
                      </p>
                    </div>
                  ))}
                  {bibleAdmin.translations.length ? null : (
                    <p className="text-sm text-white/55">No hay traducciones registradas.</p>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Versiculo diario</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <input value={dailyVerseForm.translationCode} onChange={(event) => setDailyVerseForm((current) => ({ ...current, translationCode: event.target.value }))} className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none" />
                  <input value={dailyVerseForm.bookCode} onChange={(event) => setDailyVerseForm((current) => ({ ...current, bookCode: event.target.value.toUpperCase() }))} className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none" />
                  <input value={dailyVerseForm.chapter} onChange={(event) => setDailyVerseForm((current) => ({ ...current, chapter: event.target.value }))} className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none" />
                  <input value={dailyVerseForm.verse} onChange={(event) => setDailyVerseForm((current) => ({ ...current, verse: event.target.value }))} className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none" />
                  <input type="date" value={dailyVerseForm.activeDate} onChange={(event) => setDailyVerseForm((current) => ({ ...current, activeDate: event.target.value }))} className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none" />
                  <input value={dailyVerseForm.devotionalHint} onChange={(event) => setDailyVerseForm((current) => ({ ...current, devotionalHint: event.target.value }))} placeholder="Hint devocional" className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none placeholder:text-white/35" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => void handleSaveDailyBibleVerse()} className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950">
                    Guardar versiculo diario
                  </button>
                  <button type="button" onClick={() => void handleTestBibleRandom()} className="rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/70">
                    Probar aleatorio
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {bibleAdmin.recentDailyVerses.slice(0, 3).map((daily) => (
                    <p key={daily.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
                      {daily.active_date} - {daily.book_code} {daily.chapter}:{daily.verse}
                    </p>
                  ))}
                  {bibleAdmin.recentDailyVerses.length ? null : (
                    <p className="text-sm text-white/55">No hay versiculos diarios programados.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-5 grid gap-3 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Completitud por traduccion</h3>
                <div className="mt-3 space-y-2">
                  {bibleAdmin.translationStats.slice(0, 4).map((item) => (
                    <div key={item.code ?? item.name} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-xs text-white/60">
                      <p className="font-bold text-white">{item.code} - {item.name}</p>
                      <p className="mt-1">
                        {item.verses_count ?? 0} versiculos - {item.books_with_verses ?? 0} libros - {item.estimated_completion_percent ?? 0}% estimado
                      </p>
                      {item.code === 'RVR1909' && rvr1909Complete ? (
                        <p className="mt-2 inline-flex rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-black text-emerald-100">
                          COMPLETA
                        </p>
                      ) : null}
                    </div>
                  ))}
                  {bibleAdmin.translationStats.length ? null : (
                    <p className="text-sm text-white/55">Sin estadisticas todavia.</p>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Planes de lectura</h3>
                <div className="mt-3 space-y-2">
                  {bibleAdmin.readingPlans.slice(0, 5).map((plan) => (
                    <p key={plan.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
                      <span className="font-bold text-white">{plan.title}</span> - {plan.duration_days} dias - {plan.is_active ? 'activo' : 'inactivo'}
                    </p>
                  ))}
                  {bibleAdmin.readingPlans.length ? null : (
                    <p className="text-sm text-white/55">No hay planes de lectura activos.</p>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Diagnostico</h3>
                <div className="mt-3 space-y-2">
                  {bibleAdmin.missingChapters.slice(0, 5).map((item) => (
                    <p key={`${item.translation_code}-${item.book_code}-${item.chapter}`} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60">
                      {item.translation_code} - {item.book_name} {item.chapter}
                    </p>
                  ))}
                  {bibleAdmin.missingChapters.length ? null : (
                    <p className="text-sm text-white/55">No se detectaron capitulos vacios en el muestreo.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <div className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Feedback del piloto</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Comentarios reales enviados desde el menu Mas y Perfil.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PilotMetricCard
                  title="Nuevo"
                  value={feedbackSummary.newCount}
                  detail="por revisar"
                />
                <PilotMetricCard
                  title="Total"
                  value={feedbackSummary.total}
                  detail="comentarios"
                />
                <PilotMetricCard
                  title="Rating"
                  value={feedbackSummary.averageRating}
                  detail="promedio 1 a 5"
                />
              </div>
              <div className="mt-5 space-y-3">
                {pilotFeedback.length ? null : (
                  <p className="text-sm text-white/55">Aun no hay feedback de usuarios piloto.</p>
                )}
                {pilotFeedback.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-white/10 bg-slate-950/45 p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate font-black">{item.title}</p>
                        <p className="mt-1 text-xs text-white/50">
                          {item.category} · {item.module ?? 'sin modulo'} · {item.rating ?? 0}/5
                        </p>
                        {item.detail ? (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/60">
                            {item.detail}
                          </p>
                        ) : null}
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/60">
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-col gap-2">
                      <input
                        value={feedbackNotes[item.id] ?? ''}
                        onChange={(event) =>
                          setFeedbackNotes((current) => ({
                            ...current,
                            [item.id]: event.target.value,
                          }))
                        }
                        placeholder="Nota interna"
                        className="h-9 rounded-full border border-white/10 bg-slate-950/60 px-3 text-xs text-white outline-none placeholder:text-white/35"
                      />
                      <div className="flex flex-wrap gap-2">
                        {(['reviewing', 'planned', 'resolved', 'dismissed'] as PilotFeedbackStatus[]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => void handlePilotFeedbackStatus(item.id, status)}
                            className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/70"
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-amber-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Incidentes del piloto</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Bitacora operativa para fallas, riesgos pastorales o eventos de cuidado.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <PilotMetricCard title="Abiertos" value={incidentSummary.open} detail="open/triage" />
                <PilotMetricCard title="Criticos" value={incidentSummary.critical} detail="requieren accion" />
                <PilotMetricCard title="Resueltos" value={incidentSummary.resolved} detail="cerrados" />
              </div>
              <form
                onSubmit={(event) => void handleCreateIncident(event)}
                className="mt-5 rounded-3xl border border-white/10 bg-slate-950/45 p-4"
              >
                <h3 className="font-black">Registrar incidente</h3>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <select
                    value={incidentForm.severity}
                    onChange={(event) =>
                      setIncidentForm((current) => ({
                        ...current,
                        severity: event.target.value as PilotIncidentSeverity,
                      }))
                    }
                    className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                    <option value="critical">critical</option>
                  </select>
                  <input
                    value={incidentForm.module}
                    onChange={(event) =>
                      setIncidentForm((current) => ({
                        ...current,
                        module: event.target.value,
                      }))
                    }
                    placeholder="Modulo"
                    className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none placeholder:text-white/35"
                  />
                  <input
                    value={incidentForm.title}
                    onChange={(event) =>
                      setIncidentForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Titulo"
                    className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none placeholder:text-white/35 sm:col-span-2"
                  />
                  <textarea
                    value={incidentForm.description}
                    onChange={(event) =>
                      setIncidentForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Descripcion breve"
                    className="rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-xs text-white outline-none placeholder:text-white/35 sm:col-span-2"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950"
                >
                  Registrar
                </button>
              </form>
              <div className="mt-5 space-y-3">
                {pilotIncidents.length ? null : (
                  <p className="text-sm text-white/55">No hay incidentes registrados.</p>
                )}
                {pilotIncidents.slice(0, 5).map((item) => (
                  <div key={item.id} className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-black">{item.title}</p>
                        <p className="mt-1 text-xs text-white/50">
                          {item.severity} · {item.module ?? 'General'} · {item.status}
                        </p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/60">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <input
                      value={incidentResolutions[item.id] ?? ''}
                      onChange={(event) =>
                        setIncidentResolutions((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }))
                      }
                      placeholder="Resolucion o nota"
                      className="mt-3 h-9 w-full rounded-full border border-white/10 bg-slate-950/60 px-3 text-xs text-white outline-none placeholder:text-white/35"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(['triage', 'resolved', 'closed'] as PilotIncidentStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => void handleIncidentStatus(item.id, status)}
                          className="rounded-full border border-white/10 px-3 py-1 text-xs font-black text-white/70"
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-white/70" aria-hidden="true" />
              <h2 className="text-2xl font-black">Evidencia QA</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Estos registros se conservan para trazabilidad tecnica y no cuentan como feedback o incidentes reales del piloto.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <PilotMetricCard title="Feedback QA" value={qaPilotFeedback.length} detail="excluido de metricas reales" />
              <PilotMetricCard title="Incidentes QA" value={qaPilotIncidents.length} detail="excluido de metricas reales" />
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Feedback QA reciente</h3>
                <div className="mt-3 space-y-2">
                  {qaPilotFeedback.slice(0, 3).map((item) => (
                    <p key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
                      {item.title} - {item.status}
                    </p>
                  ))}
                  {qaPilotFeedback.length ? null : (
                    <p className="text-sm text-white/55">No hay evidencia QA de feedback.</p>
                  )}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/45 p-4">
                <h3 className="font-black">Incidentes QA recientes</h3>
                <div className="mt-3 space-y-2">
                  {qaPilotIncidents.slice(0, 3).map((item) => (
                    <p key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/55">
                      {item.title} - {item.status}
                    </p>
                  ))}
                  {qaPilotIncidents.length ? null : (
                    <p className="text-sm text-white/55">No hay evidencia QA de incidentes.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black">Reporte de cierre del piloto</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                  Genera un resumen Markdown con datos reales para la reunion de cierre.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  type="date"
                  value={reportRange.from}
                  onChange={(event) =>
                    setReportRange((current) => ({ ...current, from: event.target.value }))
                  }
                  className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none"
                />
                <input
                  type="date"
                  value={reportRange.to}
                  onChange={(event) =>
                    setReportRange((current) => ({ ...current, to: event.target.value }))
                  }
                  className="h-10 rounded-2xl border border-white/10 bg-slate-950/70 px-3 text-xs text-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => void handleGeneratePilotReport()}
                  className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-950"
                >
                  Generar reporte
                </button>
              </div>
            </div>
            {pilotReport ? (
              <textarea
                readOnly
                value={pilotReport}
                rows={12}
                className="mt-5 w-full rounded-3xl border border-white/10 bg-slate-950/70 px-4 py-3 font-mono text-xs leading-5 text-white/75 outline-none"
              />
            ) : null}
          </div>

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
      className="app-card scroll-mt-28"
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
    <div className="app-card-soft flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate font-bold">{title}</p>
        <p className="mt-1 truncate text-xs text-white/45">{detail}</p>
      </div>
      {action}
    </div>
  )
}

function PilotMetricCard({
  title,
  value,
  detail,
}: {
  title: string
  value: number
  detail: string
}) {
  return (
    <article className="app-card-soft">
      <p className="text-2xl font-black">{value}</p>
      <h4 className="mt-1 text-sm font-black text-white">{title}</h4>
      <p className="mt-1 text-xs leading-5 text-white/50">{detail}</p>
    </article>
  )
}
