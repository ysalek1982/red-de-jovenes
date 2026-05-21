import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { sendPasswordResetEmail } from '../features/auth/authService'

export function RecoverPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Ingresa un correo válido para recuperar tu cuenta.')
      return
    }

    setIsSubmitting(true)
    try {
      await sendPasswordResetEmail(email.trim())
      setSuccess(
        'Si el correo existe en la Red, recibirás instrucciones para recuperar tu acceso.',
      )
    } catch {
      setError('No pudimos enviar el correo de recuperación. Intenta más tarde.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="app-kicker">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Recuperar acceso
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Volvamos a abrir tu Red.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Te enviaremos un enlace seguro para recuperar tu contraseña y volver
            a tu comunidad cristiana.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="app-card p-6 md:p-8"
        >
          <label className="text-sm font-semibold text-white" htmlFor="recoverEmail">
            Correo electrónico
          </label>
          <Input
            id="recoverEmail"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
              setSuccess('')
            }}
            placeholder="tu.correo@ejemplo.com"
            autoComplete="email"
            className="mt-2"
          />

          {error ? (
            <div className="app-alert-warning mt-5">{error}</div>
          ) : null}
          {success ? (
            <div className="app-alert mt-5">{success}</div>
          ) : null}

          <Button
            type="submit"
            variant="accent"
            size="lg"
            disabled={isSubmitting}
            className="mt-6 w-full"
          >
            <MailCheck className="h-5 w-5" aria-hidden="true" />
            {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
          </Button>

          <p className="mt-5 text-center text-sm text-white/60">
            ¿Recordaste tu contraseña?{' '}
            <Link className="font-semibold text-amber-200 hover:text-amber-100" to="/entrar">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
