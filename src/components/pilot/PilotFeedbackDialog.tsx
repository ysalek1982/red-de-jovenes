import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import { MessageCircle, Send, X } from 'lucide-react'
import { useAuth } from '../../features/auth/useAuth'
import {
  createPilotFeedback,
  pilotFeedbackCategories,
  type PilotFeedbackCategory,
} from '../../features/pilot/pilotFeedbackService'

const moduleOptions = [
  'Inicio',
  'Biblia',
  'Oracion',
  'Foros',
  'Juegos',
  'Mapa',
  'Eventos',
  'Discipulado',
  'Mensajes',
  'Perfil',
  'PWA',
  'IA',
  'Admin',
  'Otro',
]

function detectDevice() {
  if (typeof navigator === 'undefined') return 'No detectado'
  const userAgent = navigator.userAgent.toLowerCase()
  if (/android|iphone|ipad|mobile/.test(userAgent)) return 'Movil'
  return 'Desktop'
}

function detectBrowser() {
  if (typeof navigator === 'undefined') return 'No detectado'
  return navigator.userAgent.slice(0, 180)
}

export function PilotFeedbackDialog({
  triggerClassName,
  triggerLabel = 'Ayudanos a mejorar',
}: {
  triggerClassName?: string
  triggerLabel?: string
}) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [category, setCategory] = useState<PilotFeedbackCategory>('mejora')
  const [module, setModule] = useState('Inicio')
  const [rating, setRating] = useState('5')
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const canSubmit = useMemo(
    () => title.trim().length >= 4 && detail.trim().length >= 8,
    [title, detail],
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) {
      setMessage('Inicia sesion para enviar feedback del piloto.')
      return
    }
    if (!canSubmit) {
      setMessage('Cuéntanos con un poco mas de detalle que paso.')
      return
    }

    setIsSaving(true)
    setMessage('')
    try {
      await createPilotFeedback({
        userId: user.id,
        category,
        module,
        rating: Number(rating),
        title: title.trim(),
        detail: detail.trim(),
        device: detectDevice(),
        browser: detectBrowser(),
      })
      setTitle('')
      setDetail('')
      setRating('5')
      setMessage('Gracias. Tu comentario quedo registrado para el equipo.')
    } catch {
      setMessage('No pudimos guardar tu comentario. Intenta nuevamente.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={
          triggerClassName ??
          'inline-flex h-11 items-center justify-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 text-sm font-black text-emerald-100 transition hover:bg-emerald-300/15'
        }
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        {triggerLabel}
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/70 px-3 pb-3 pt-16 backdrop-blur sm:items-center sm:p-6">
          <form
            onSubmit={(event) => void handleSubmit(event)}
            className="max-h-[88vh] w-full max-w-xl overflow-auto rounded-[1.5rem] border border-white/10 bg-slate-950 p-5 text-white shadow-2xl shadow-black/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-200">
                  Piloto cerrado
                </p>
                <h2 className="mt-2 text-2xl font-black">
                  Ayudanos a mejorar
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Reporta algo confuso, una falla o una idea concreta. Esto va
                  directo al equipo del piloto.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white/70"
                aria-label="Cerrar feedback"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-bold">
                Categoria
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(event.target.value as PilotFeedbackCategory)
                  }
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none"
                >
                  {pilotFeedbackCategories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Modulo
                <select
                  value={module}
                  onChange={(event) => setModule(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none"
                >
                  {moduleOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold">
                Calificacion
                <select
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none"
                >
                  {[5, 4, 3, 2, 1].map((item) => (
                    <option key={item} value={item}>
                      {item} de 5
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Titulo
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ej. No encontre donde unirme a una comunidad"
                  className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
              <label className="text-sm font-bold sm:col-span-2">
                Detalle
                <textarea
                  value={detail}
                  onChange={(event) => setDetail(event.target.value)}
                  rows={4}
                  placeholder="Cuenta que intentaste hacer y que paso."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              </label>
            </div>

            {message ? (
              <p className="mt-4 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSaving}
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {isSaving ? 'Enviando...' : 'Enviar feedback'}
            </button>
          </form>
        </div>
      ) : null}
    </>
  )
}
