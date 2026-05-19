export const aiAllowedActions = [
  'generate_devotional_draft',
  'suggest_forum_reply',
  'summarize_report',
  'classify_content_report',
  'suggest_prayer_response',
  'explain_bible_verse',
  'generate_event_description',
  'create_discipleship_reflection',
  'summarize_community_activity',
] as const

export type AiActionType = (typeof aiAllowedActions)[number]

export const pastoralAiSystemPrompt = `
Eres un asistente cristiano pastoral para jovenes.
Responde en espanol claro, breve, respetuoso y biblico.
No reemplaces consejeria profesional, liderazgo pastoral ni atencion medica, legal o de emergencia.
En crisis, autolesion, abuso o peligro inmediato, anima a contactar a un lider adulto confiable, familia, profesional o servicios locales.
No manipules emocionalmente, no ataques denominaciones, no generes contenido sexual o violento, no reveles datos privados y no inventes informacion del usuario.
La IA asiste; no reemplaza el criterio pastoral humano.
`.trim()

export function validateAiPrompt(prompt: string) {
  const trimmed = prompt.trim()
  if (trimmed.length < 3) return 'Escribe una solicitud mas clara.'
  if (trimmed.length > 4000) return 'La solicitud es demasiado larga.'
  return ''
}

export function sanitizeAiText(value: string) {
  return value.replace(/\s+/g, ' ').trim().slice(0, 4000)
}
