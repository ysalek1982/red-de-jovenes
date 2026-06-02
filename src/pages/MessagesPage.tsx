import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { MessageCircle, Send, ShieldCheck } from 'lucide-react'
import {
  createDirectConversation,
  getMyConversations,
  reportMessage,
  sendMessage,
  type ConversationWithMembers,
} from '../features/messages/messageService'
import { getSuggestedProfiles, type SuggestedProfile } from '../features/social/socialService'
import { useAuth } from '../features/auth/useAuth'
import { scrollElementIntoView } from '../lib/scroll'

export function MessagesPage() {
  const { user } = useAuth()
  const userId = user?.id
  const chatPanelRef = useRef<HTMLElement>(null)
  const messageListRef = useRef<HTMLDivElement>(null)
  const [conversations, setConversations] = useState<ConversationWithMembers[]>([])
  const [profiles, setProfiles] = useState<SuggestedProfile[]>([])
  const [selectedId, setSelectedId] = useState('')
  const [body, setBody] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [busyRecipientId, setBusyRecipientId] = useState<string | null>(null)
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null)

  const loadData = useCallback(async (preferredConversationId?: string) => {
    if (!userId) return
    setIsLoading(true)
    setError('')
    try {
      const [conversationData, profileData] = await Promise.all([
        getMyConversations(userId),
        getSuggestedProfiles(userId),
      ])
      setConversations(conversationData)
      setProfiles(profileData)
      setSelectedId((current) => {
        const nextId = preferredConversationId || current
        return conversationData.some((conversation) => conversation.id === nextId)
          ? nextId
          : conversationData[0]?.id || ''
      })
    } catch {
      setError('No pudimos cargar tus conversaciones. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadData()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadData])

  const selected = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId),
    [conversations, selectedId],
  )
  const messages = [...(selected?.messages ?? [])]
    .filter((message) => !message.deleted_at)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )

  useEffect(() => {
    const list = messageListRef.current
    if (!list) return

    list.scrollTo({ top: list.scrollHeight, behavior: 'auto' })
  }, [messages.length, selectedId])

  function handleSelectConversation(conversationId: string) {
    setSelectedId(conversationId)
    window.requestAnimationFrame(() => {
      scrollElementIntoView(chatPanelRef.current)
    })
  }

  async function handleCreateDirect(recipientId: string) {
    if (!userId) return
    const existing = conversations.find(
      (conversation) =>
        conversation.conversation_type === 'direct' &&
        conversation.conversation_members?.some(
          (member) => member.user_id === recipientId,
        ),
    )

    if (existing) {
      setSelectedId(existing.id)
      setStatus('Conversación abierta.')
      window.requestAnimationFrame(() => {
        scrollElementIntoView(chatPanelRef.current)
      })
      return
    }

    setBusyRecipientId(recipientId)
    setError('')
    setStatus('')
    try {
      const created = await createDirectConversation({ userId, recipientId })
      setStatus('Conversación creada.')
      await loadData(created.id)
      window.requestAnimationFrame(() => {
        scrollElementIntoView(chatPanelRef.current)
      })
    } catch {
      setError('No pudimos crear la conversación. Intenta con otro perfil.')
    } finally {
      setBusyRecipientId(null)
    }
  }

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!userId || !selected) {
      setError('Selecciona una conversación antes de enviar.')
      return
    }
    const messageBody = body.trim()
    if (!messageBody) {
      setError('Escribe un mensaje antes de enviarlo.')
      return
    }

    setIsSending(true)
    setError('')
    setStatus('')
    try {
      await sendMessage({ conversationId: selected.id, userId, body: messageBody })
      setBody('')
      setStatus('Mensaje enviado.')
      await loadData(selected.id)
    } catch {
      setError('No pudimos enviar el mensaje. Intenta nuevamente.')
    } finally {
      setIsSending(false)
    }
  }

  async function handleReport(messageId: string) {
    if (!userId) return
    setReportingMessageId(messageId)
    setError('')
    setStatus('')
    try {
      await reportMessage({
        messageId,
        userId,
        reason: 'cuidado_comunidad',
        detail: 'Revisar tono del mensaje.',
      })
      setStatus('Avisamos a un líder para revisar este mensaje.')
    } catch {
      setError('No pudimos enviar el reporte del mensaje.')
    } finally {
      setReportingMessageId(null)
    }
  }

  return (
    <section className="app-page">
      <div className="section-shell">
        <div>
          <p className="text-sm font-semibold text-amber-200">Mensajes</p>
          <h1 data-page-title className="mt-2 text-4xl font-black">
            Conversaciones que edifican
          </h1>
          <p className="mt-3 max-w-2xl text-white/62">
            Mensajería segura y asíncrona. No es chat en tiempo real; se
            actualiza al volver a cargar.
          </p>
        </div>
        {status ? (
          <p className="app-alert mt-5" role="status" aria-live="polite">
            {status}
          </p>
        ) : null}
        {error ? (
          <p className="app-alert-warning mt-5" role="alert">
            {error}
          </p>
        ) : null}

        <div className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <aside className="space-y-5">
            <article className="app-card">
              <h2 className="font-black">Mis conversaciones</h2>
              <div className="mt-4 space-y-2">
                {isLoading ? (
                  <p className="text-sm text-white/60">Cargando...</p>
                ) : null}
                {!isLoading && !conversations.length ? (
                  <p className="app-empty text-left">
                    Empieza una conversación que edifique con jóvenes de tus
                    comunidades o perfiles sugeridos.
                  </p>
                ) : null}
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation.id)}
                    className={`w-full rounded-2xl border p-3 text-left text-sm font-bold ${
                      selectedId === conversation.id
                        ? 'border-amber-300/30 bg-amber-300/10'
                        : 'border-white/10 bg-slate-950/45'
                    }`}
                  >
                    {conversation.title ||
                      (conversation.conversation_type === 'direct'
                        ? 'Conversación directa'
                        : 'Conversación de comunidad')}
                  </button>
                ))}
              </div>
            </article>

            <article className="app-card">
              <h2 className="font-black">Iniciar con alguien</h2>
              <div className="mt-4 space-y-2">
                {!profiles.length && !isLoading ? (
                  <p className="app-empty text-left">
                    Aún no hay perfiles sugeridos. Participa en comunidades y
                    foros para encontrar jóvenes con quienes conversar.
                  </p>
                ) : null}
                {profiles.slice(0, 6).map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => void handleCreateDirect(profile.id)}
                    disabled={busyRecipientId === profile.id}
                    className="app-card-soft flex w-full items-center justify-between text-left disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span>
                      <span className="block text-sm font-bold">
                        {profile.full_name || profile.username}
                      </span>
                      <span className="text-xs text-white/45">
                        {profile.city || profile.country || 'Joven de la Red'}
                      </span>
                    </span>
                    <MessageCircle className="h-4 w-4 text-amber-200" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </article>
          </aside>

          <article ref={chatPanelRef} className="app-card">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Conversación protegida · sé luz en tus palabras
            </div>
            <div
              ref={messageListRef}
              data-scroll-root
              className="app-card-soft mt-5 max-h-[28rem] min-h-72 space-y-3 overflow-y-auto"
            >
              {!selected ? (
                <p className="text-sm text-white/60">
                  Selecciona o crea una conversación.
                </p>
              ) : null}
              {selected && !messages.length ? (
                <p className="text-sm text-white/60">
                  Aún no hay mensajes. Empieza con una palabra que edifique.
                </p>
              ) : null}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.sender_id === userId
                      ? 'ml-auto bg-emerald-300/15'
                      : 'bg-white/10'
                  }`}
                >
                  <p className="break-words text-sm leading-6 text-white/80 [overflow-wrap:anywhere]">
                    {message.body}
                  </p>
                  {message.sender_id !== userId ? (
                    <button
                      type="button"
                      onClick={() => void handleReport(message.id)}
                      disabled={reportingMessageId === message.id}
                      className="mt-2 text-xs font-semibold text-amber-200 disabled:opacity-60"
                      aria-label="Avisar a un líder sobre este mensaje"
                    >
                      {reportingMessageId === message.id
                        ? 'Avisando...'
                        : 'Avisar a un líder'}
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
            <form onSubmit={(event) => void handleSend(event)} className="mt-4 flex gap-2">
              <label htmlFor="messageBody" className="sr-only">
                Mensaje
              </label>
              <input
                id="messageBody"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Escribe con respeto y ánimo"
                disabled={!selected || isSending}
                className="app-input min-w-0 flex-1 rounded-full disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!selected || isSending}
                className="app-button-primary h-12 w-12 px-0"
                aria-label="Enviar mensaje"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </article>
        </div>
      </div>
    </section>
  )
}
