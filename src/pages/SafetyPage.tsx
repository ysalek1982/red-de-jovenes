import type { FormEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  HeartHandshake,
  Loader2,
  Send,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'
import {
  createContentReport,
  getMyReports,
  type ReportTargetType,
} from '../features/safety/safetyService'
import type { ContentReport } from '../types/database'

const communityRules = [
  {
    title: 'Edificamos antes de debatir',
    text: 'Puedes compartir preguntas, dudas y opiniones, pero cada conversacion debe cuidar a la persona antes que ganar una discusion.',
  },
  {
    title: 'La Palabra guia el tono',
    text: 'Los foros pueden tener desacuerdos. No se permiten ataques personales, burlas, manipulación espiritual ni presión sobre otros jóvenes.',
  },
  {
    title: 'Protegemos a los jóvenes',
    text: 'No publiques datos privados, ubicaciones sensibles, conversaciones personales ni informacion de menores sin permiso claro.',
  },
  {
    title: 'Reportar tambien es cuidar',
    text: 'Si ves acoso, spam, contenido ofensivo, informacion sensible o algo que pueda danar, reportalo para que el equipo lo revise.',
  },
  {
    title: 'Acompanamiento, no verguenza',
    text: 'La moderacion busca restaurar, orientar y proteger. No uses reportes para atacar o silenciar a alguien por pensar distinto.',
  },
  {
    title: 'Menores con cuidado extra',
    text: 'Si eres menor de edad, no compartas datos de contacto directo y habla con un adulto responsable ante cualquier situacion incomoda.',
  },
]

const reportReasons = [
  'Contenido ofensivo',
  'Acoso',
  'Spam',
  'Informacion sensible',
  'Falso o danino',
  'Otro',
]

function formatDate(value: string | null) {
  if (!value) return 'Fecha pendiente'
  return new Intl.DateTimeFormat('es', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export function SafetyPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [reports, setReports] = useState<ContentReport[]>([])
  const [targetType, setTargetType] = useState<ReportTargetType>('post')
  const [targetId, setTargetId] = useState('')
  const [reason, setReason] = useState('')
  const [details, setDetails] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const loadReports = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    try {
      const data = await getMyReports(userId)
      setReports(data)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadReports()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadReports])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId || !targetId.trim() || !reason.trim()) {
      setMessage('Completa el tipo, identificador y motivo del reporte.')
      return
    }

    setIsSubmitting(true)
    setMessage('')
    try {
      await createContentReport({
        reporterId: userId,
        targetType,
        targetId: targetId.trim(),
        reason: reason.trim(),
        details: details.trim(),
      })
      setTargetId('')
      setReason('')
      setDetails('')
      setMessage('Reporte enviado. El equipo lo revisara con cuidado.')
      await loadReports()
    } catch {
      setMessage('No pudimos enviar el reporte. Intentalo nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-24 pt-32 text-white">
      <div className="pointer-events-none fixed left-0 top-20 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-0 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="section-shell relative">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Espacio seguro
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Una red donde cada joven es cuidado.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              Moderacion con sabiduria, comunidad con respeto y reportes
              visibles para proteger el ambiente espiritual de la Red.
            </p>

            <div className="mt-8 grid gap-4">
              {communityRules.map((rule) => (
                <article
                  key={rule.title}
                  className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <HeartHandshake
                      className="h-5 w-5 text-emerald-300"
                      aria-hidden="true"
                    />
                    <h2 className="text-xl font-black">{rule.title}</h2>
                  </div>
                  <p className="mt-3 leading-7 text-white/62">{rule.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-200" aria-hidden="true" />
                <h2 className="text-2xl font-black">Reportar contenido</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Usa este formulario cuando necesites reportar algo que requiere
                revision pastoral o moderacion. Incluye el ID solo si vienes
                desde una publicacion, comentario, peticion o perfil concreto.
              </p>

              <div className="mt-5 grid gap-3">
                <select
                  value={targetType}
                  onChange={(event) =>
                    setTargetType(event.target.value as ReportTargetType)
                  }
                  className="h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold text-white outline-none focus:border-amber-200/60"
                  aria-label="Tipo de contenido"
                >
                  <option value="post">Publicacion</option>
                  <option value="comment">Comentario</option>
                  <option value="prayer_request">Peticion de oracion</option>
                  <option value="profile">Perfil</option>
                </select>
                <input
                  value={targetId}
                  onChange={(event) => setTargetId(event.target.value)}
                  placeholder="ID del contenido"
                  className="h-11 rounded-2xl border border-white/10 bg-slate-950/55 px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                />
                <select
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  className="h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-4 text-sm font-bold text-white outline-none focus:border-amber-200/60"
                  aria-label="Motivo del reporte"
                >
                  <option value="">Selecciona motivo</option>
                  {reportReasons.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <textarea
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                  placeholder="Detalles opcionales"
                  className="min-h-28 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-amber-200/60"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {isSubmitting ? 'Enviando...' : 'Enviar reporte'}
              </button>

              {message ? (
                <p className="mt-3 text-sm font-semibold text-amber-100">
                  {message}
                </p>
              ) : null}
            </form>

            <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/25 backdrop-blur">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-6 w-6 text-emerald-300" aria-hidden="true" />
                <h2 className="text-2xl font-black">Tus reportes</h2>
              </div>
              {isLoading ? (
                <div className="mt-6 flex items-center gap-3 text-white/60">
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Cargando reportes...
                </div>
              ) : reports.length ? (
                <div className="mt-6 space-y-3">
                  {reports.slice(0, 5).map((report) => (
                    <article
                      key={report.id}
                      className="rounded-3xl border border-white/10 bg-slate-950/45 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-white">
                          {report.reason}
                        </p>
                        <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-bold text-white/55">
                          {report.status}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-white/45">
                        {report.target_type} - {formatDate(report.created_at)}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="mt-6 text-sm leading-6 text-white/60">
                  No has enviado reportes. Esta herramienta esta aqui para
                  cuidar la comunidad cuando sea necesario.
                </p>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
