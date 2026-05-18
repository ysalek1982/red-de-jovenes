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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-36 text-white">
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-300/[0.12] blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
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
          className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8"
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
            <div className="mt-5 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
              {success}
            </div>
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
