import type { FormEvent } from 'react'
import { useState } from 'react'
import { Globe2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Button } from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'

interface ContactForm {
  name: string
  email: string
  interest: string
  message: string
}

const initialForm: ContactForm = {
  name: '',
  email: '',
  interest: '',
  message: '',
}

export function Contact() {
  const [form, setForm] = useState<ContactForm>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({})
  const [sent, setSent] = useState(false)

  function updateField(field: keyof ContactForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSent(false)
  }

  function validate() {
    const nextErrors: Partial<Record<keyof ContactForm, string>> = {}
    if (!form.name.trim()) nextErrors.name = 'Ingresa tu nombre.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Ingresa un correo válido.'
    if (!form.interest.trim()) nextErrors.interest = 'Cuéntanos tu interés principal.'
    if (form.message.trim().length < 12) {
      nextErrors.message = 'El mensaje debe tener al menos 12 caracteres.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return
    setForm(initialForm)
    setSent(true)
  }

  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos sobre tu participación en la Red"
        description="Formulario frontend con validación básica. Queda listo para conectarse a un servicio de mensajería o CRM en una fase posterior."
      />

      <section className="bg-slate-50 py-12">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="name">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Ej. Valeria Pérez"
                />
                {errors.name ? <p className="mt-2 text-sm text-coral-600">{errors.name}</p> : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="email">
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  placeholder="tu.correo@ejemplo.com"
                />
                {errors.email ? <p className="mt-2 text-sm text-coral-600">{errors.email}</p> : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="interest">
                  Interés principal
                </label>
                <Input
                  id="interest"
                  value={form.interest}
                  onChange={(event) => updateField('interest', event.target.value)}
                  placeholder="Programa, voluntariado, alianza u oportunidad"
                />
                {errors.interest ? (
                  <p className="mt-2 text-sm text-coral-600">{errors.interest}</p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="message">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  value={form.message}
                  onChange={(event) => updateField('message', event.target.value)}
                  placeholder="Cuéntanos cómo quieres participar o qué necesitas saber."
                />
                {errors.message ? (
                  <p className="mt-2 text-sm text-coral-600">{errors.message}</p>
                ) : null}
              </div>

              {sent ? (
                <div className="rounded-lg border border-youth-100 bg-youth-50 p-4 text-sm font-semibold text-youth-700">
                  Mensaje preparado correctamente. En la siguiente fase se conectará al backend.
                </div>
              ) : null}

              <Button type="submit" variant="primary" size="lg">
                <Send className="h-5 w-5" aria-hidden="true" />
                Enviar mensaje
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-brand-900">Datos institucionales</h2>
              <div className="mt-6 grid gap-4 text-sm text-slate-700">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-youth-600" aria-hidden="true" />
                  Santa Cruz de la Sierra, Bolivia
                </p>
                <p className="flex gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-youth-600" aria-hidden="true" />
                  hola@reddejovenes.org
                </p>
                <p className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-youth-600" aria-hidden="true" />
                  +591 700 00000
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold text-brand-900">Redes sociales</h2>
              <div className="mt-5 flex gap-3">
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-800 hover:bg-brand-100"
                  aria-label="Instagram simulado"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-800 hover:bg-brand-100"
                  aria-label="Facebook simulado"
                >
                  <Globe2 className="h-5 w-5" />
                </a>
                <a
                  href="mailto:hola@reddejovenes.org"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-800 hover:bg-brand-100"
                  aria-label="Correo institucional"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}
