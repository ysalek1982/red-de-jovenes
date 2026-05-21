import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react'
import { useAuth } from '../features/auth/useAuth'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

function getFriendlyAuthError(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('email not confirmed')) {
    return 'Tu cuenta fue creada, pero falta confirmar tu correo antes de entrar.'
  }
  if (normalized.includes('rate limit')) {
    return 'Hay demasiados intentos seguidos. Espera unos minutos y vuelve a intentar.'
  }
  if (normalized.includes('invalid login credentials')) {
    return 'El correo o la contraseña no coinciden. Revisa los datos e inténtalo de nuevo.'
  }
  if (normalized.includes('invalid')) {
    return 'Revisa tu correo y contraseña e inténtalo nuevamente.'
  }
  return 'No pudimos iniciar sesión. Inténtalo otra vez en unos segundos.'
}

export function SignInPage() {
  const navigate = useNavigate()
  const { signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña para entrar.')
      return
    }

    setIsSubmitting(true)
    try {
      await signInWithPassword(email.trim(), password)
      navigate('/app')
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Error desconocido'
      setError(getFriendlyAuthError(message))
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
            Entrar
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Vuelve a tu comunidad.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Accede a tu espacio de oración, devocionales y conversaciones con la
            Palabra al centro.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="app-card p-6 md:p-8"
        >
          <div className="space-y-5">
            <div>
              <label className="text-sm font-semibold text-white" htmlFor="email">
                Correo electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="tu.correo@ejemplo.com"
                autoComplete="email"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white" htmlFor="password">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Tu contraseña"
                autoComplete="current-password"
                className="mt-2"
              />
            </div>

            {error ? (
              <div className="app-alert-warning">{error}</div>
            ) : null}

            <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full">
              <Mail className="h-5 w-5" aria-hidden="true" />
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-white/60">
              ¿Aún no tienes cuenta?{' '}
              <Link className="font-semibold text-amber-200 hover:text-amber-100" to="/crear-cuenta">
                Crear cuenta
              </Link>
            </p>
            <p className="text-center text-sm text-white/50">
              ¿Olvidaste tu contraseña?{' '}
              <Link
                className="font-semibold text-emerald-200 hover:text-emerald-100"
                to="/recuperar"
              >
                Recuperarla
              </Link>
            </p>
          </div>
        </form>
      </div>

      <Link
        to="/landing"
        className="mx-auto mt-10 flex w-fit items-center gap-2 text-sm font-semibold text-white/60 hover:text-white"
      >
        Ver landing pública
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  )
}
