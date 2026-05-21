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
    <section className="app-page">
      <div className="section-shell">
        <div>
          <p className="text-sm font-semibold text-amber-200">Construir la Red</p>
          <h1 className="mt-2 text-4xl font-black">Ayuda a que la luz se expanda</h1>
          <p className="mt-3 max-w-2xl text-white/62">Invita amigos, sugiere comunidades y comparte ideas para hacer crecer la Red con cuidado.</p>
        </div>
        {status ? <p className="app-alert mt-5">{status}</p> : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          <article className="app-card-accent">
            <Hammer className="h-8 w-8 text-amber-200" />
            <h2 className="mt-4 text-2xl font-black">Invitar amigo</h2>
            <p className="mt-3 text-sm leading-6 text-white/65">Comparte un texto sencillo para que mas jovenes conozcan Red de Jovenes.</p>
            <button type="button" onClick={() => void copyInvite()} className="app-button-primary mt-5">
              <Copy className="h-4 w-4" /> Copiar enlace
            </button>
          </article>

          <form onSubmit={(event) => void handleGroup(event)} className="app-card xl:col-span-2">
            <h2 className="text-2xl font-black">Sugerir comunidad</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <input value={groupForm.name} onChange={(event) => setGroupForm({ ...groupForm, name: event.target.value })} placeholder="Nombre de comunidad" className="app-input" />
              <input value={groupForm.country} onChange={(event) => setGroupForm({ ...groupForm, country: event.target.value })} placeholder="Pais" className="app-input" />
              <input value={groupForm.city} onChange={(event) => setGroupForm({ ...groupForm, city: event.target.value })} placeholder="Ciudad" className="app-input" />
              <input value={groupForm.churchName} onChange={(event) => setGroupForm({ ...groupForm, churchName: event.target.value })} placeholder="Iglesia o comunidad" className="app-input" />
            </div>
            <textarea value={groupForm.meetingInfo} onChange={(event) => setGroupForm({ ...groupForm, meetingInfo: event.target.value })} rows={2} placeholder="Informacion de reunion" className="app-input mt-3" />
            <textarea value={groupForm.description} onChange={(event) => setGroupForm({ ...groupForm, description: event.target.value })} rows={2} placeholder="Descripcion breve" className="app-input mt-3" />
            <button type="submit" className="app-button-primary mt-4 bg-emerald-200 hover:bg-emerald-100">
              <Send className="h-4 w-4" /> Enviar sugerencia
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form onSubmit={(event) => void handleFeedback(event)} className="app-card">
            <h2 className="text-2xl font-black">Sugerir mejora</h2>
            <select value={feedbackForm.category} onChange={(event) => setFeedbackForm({ ...feedbackForm, category: event.target.value })} className="app-select mt-5">
              <option value="mejora">Mejora</option>
              <option value="evento">Evento</option>
              <option value="contenido">Contenido</option>
              <option value="cuidado">Cuidado comunitario</option>
            </select>
            <input value={feedbackForm.title} onChange={(event) => setFeedbackForm({ ...feedbackForm, title: event.target.value })} placeholder="Titulo" className="app-input mt-3" />
            <textarea value={feedbackForm.detail} onChange={(event) => setFeedbackForm({ ...feedbackForm, detail: event.target.value })} rows={3} placeholder="Detalle" className="app-input mt-3" />
            <button type="submit" className="app-button-primary mt-4">Enviar</button>
          </form>
          <article className="app-card">
            <h2 className="text-2xl font-black">Mis sugerencias</h2>
            <div className="mt-5 space-y-3">
              {[...groups, ...feedback].length ? null : <p className="app-empty text-left">Aqui veras el estado de tus ideas y comunidades sugeridas.</p>}
              {groups.map((item) => (
                <div key={item.id} className="app-card-soft text-sm">
                  <p className="font-bold">{item.name}</p>
                  <p className="mt-1 text-amber-200">{item.status}</p>
                </div>
              ))}
              {feedback.map((item) => (
                <div key={item.id} className="app-card-soft text-sm">
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
