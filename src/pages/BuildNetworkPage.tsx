import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Copy, Hammer, Send } from 'lucide-react'
import {
  createFeedbackSuggestion,
  getMyNetworkSuggestions,
} from '../features/buildNetwork/buildNetworkService'
import { suggestGroup } from '../features/map/worldMapService'
import { useAuth } from '../features/auth/useAuth'
import type { FeedbackSuggestion, GroupSuggestion } from '../types/database'

export function BuildNetworkPage() {
  const { user } = useAuth()
  const userId = user?.id
  const [groups, setGroups] = useState<GroupSuggestion[]>([])
  const [feedback, setFeedback] = useState<FeedbackSuggestion[]>([])
  const [status, setStatus] = useState('')
  const [feedbackForm, setFeedbackForm] = useState({
    category: 'mejora',
    title: '',
    detail: '',
  })
  const [groupForm, setGroupForm] = useState({
    name: '',
    country: '',
    city: '',
    churchName: '',
    meetingInfo: '',
    description: '',
  })

  const loadData = useCallback(async () => {
    if (!userId) return
    const data = await getMyNetworkSuggestions(userId)
    setGroups(data.groups)
    setFeedback(data.feedback)
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  async function copyInvite() {
    await navigator.clipboard.writeText(
      'Unete a Red de Jovenes: una comunidad cristiana para orar, crecer, jugar y conectar. https://red-de-jovenes.vercel.app/',
    )
    setStatus('Invitacion copiada.')
  }

  async function handleFeedback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId || !feedbackForm.title.trim()) return
    await createFeedbackSuggestion({
      userId,
      category: feedbackForm.category,
      title: feedbackForm.title,
      detail: feedbackForm.detail,
    })
    setFeedbackForm({ category: 'mejora', title: '', detail: '' })
    setStatus('Gracias. Tu sugerencia quedo registrada.')
    await loadData()
  }

  async function handleGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId || !groupForm.name.trim() || !groupForm.country.trim()) return
    await suggestGroup({
      userId,
      name: groupForm.name,
      country: groupForm.country,
      city: groupForm.city,
      churchName: groupForm.churchName,
      meetingInfo: groupForm.meetingInfo,
      description: groupForm.description,
    })
    setGroupForm({ name: '', country: '', city: '', churchName: '', meetingInfo: '', description: '' })
    setStatus('Comunidad sugerida para revision pastoral.')
    await loadData()
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-32 pt-32 text-white">
      <div className="section-shell">
        <div>
          <p className="text-sm font-semibold text-amber-200">Construir la Red</p>
          <h1 className="mt-2 text-4xl font-black">Ayuda a que la luz se expanda</h1>
          <p className="mt-3 max-w-2xl text-white/62">Invita amigos, sugiere comunidades y comparte ideas para hacer crecer la Red con cuidado.</p>
        </div>
        {status ? <p className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm font-semibold text-emerald-100">{status}</p> : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <article className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6">
            <Hammer className="h-8 w-8 text-amber-200" />
            <h2 className="mt-4 text-2xl font-black">Invitar amigo</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">Comparte un texto sencillo para que mas jovenes conozcan Red de Jovenes.</p>
            <button type="button" onClick={() => void copyInvite()} className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-slate-950">
              <Copy className="h-4 w-4" /> Copiar enlace
            </button>
          </article>

          <form onSubmit={(event) => void handleGroup(event)} className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 xl:col-span-2">
            <h2 className="text-2xl font-black">Sugerir comunidad</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input value={groupForm.name} onChange={(event) => setGroupForm({ ...groupForm, name: event.target.value })} placeholder="Nombre de comunidad" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
              <input value={groupForm.country} onChange={(event) => setGroupForm({ ...groupForm, country: event.target.value })} placeholder="Pais" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
              <input value={groupForm.city} onChange={(event) => setGroupForm({ ...groupForm, city: event.target.value })} placeholder="Ciudad" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
              <input value={groupForm.churchName} onChange={(event) => setGroupForm({ ...groupForm, churchName: event.target.value })} placeholder="Iglesia o comunidad" className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
            </div>
            <textarea value={groupForm.meetingInfo} onChange={(event) => setGroupForm({ ...groupForm, meetingInfo: event.target.value })} rows={2} placeholder="Informacion de reunion" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
            <textarea value={groupForm.description} onChange={(event) => setGroupForm({ ...groupForm, description: event.target.value })} rows={2} placeholder="Descripcion breve" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
            <button type="submit" className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-emerald-200 px-5 text-sm font-black text-slate-950">
              <Send className="h-4 w-4" /> Enviar sugerencia
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={(event) => void handleFeedback(event)} className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6">
            <h2 className="text-2xl font-black">Sugerir mejora</h2>
            <select value={feedbackForm.category} onChange={(event) => setFeedbackForm({ ...feedbackForm, category: event.target.value })} className="mt-5 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm">
              <option value="mejora">Mejora</option>
              <option value="evento">Evento</option>
              <option value="contenido">Contenido</option>
              <option value="cuidado">Cuidado comunitario</option>
            </select>
            <input value={feedbackForm.title} onChange={(event) => setFeedbackForm({ ...feedbackForm, title: event.target.value })} placeholder="Titulo" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
            <textarea value={feedbackForm.detail} onChange={(event) => setFeedbackForm({ ...feedbackForm, detail: event.target.value })} rows={3} placeholder="Detalle" className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm" />
            <button type="submit" className="mt-4 h-11 rounded-full bg-white px-5 text-sm font-black text-slate-950">Enviar</button>
          </form>
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6">
            <h2 className="text-2xl font-black">Mis sugerencias</h2>
            <div className="mt-5 space-y-3">
              {[...groups, ...feedback].length ? null : <p className="text-sm text-white/60">Aqui veras el estado de tus ideas y comunidades sugeridas.</p>}
              {groups.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-950/45 p-4 text-sm">
                  <p className="font-bold">{item.name}</p>
                  <p className="mt-1 text-amber-200">{item.status}</p>
                </div>
              ))}
              {feedback.map((item) => (
                <div key={item.id} className="rounded-2xl bg-slate-950/45 p-4 text-sm">
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-amber-200">{item.status}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
