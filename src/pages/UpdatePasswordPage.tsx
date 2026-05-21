import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { updatePassword } from '../features/auth/authService'

export function UpdatePasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (password.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setIsSubmitting(true)
    try {
      await updatePassword(password)
      setSuccess('Contraseña actualizada. Ya puedes entrar a tu Red.')
      window.setTimeout(() => navigate('/app'), 900)
    } catch {
      setError(
        'No pudimos actualizar la contraseña. Abre nuevamente el enlace de recuperación o solicita otro.',
      )
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
            Nueva contraseña
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Recupera tu acceso.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Define una nueva contraseña para volver a tu comunidad, oración y
            devocional diario.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="app-card p-6 md:p-8"
        >
          <div className="space-y-5">
            <div>
              <label
                className="text-sm font-semibold text-white"
                htmlFor="newPassword"
              >
                Nueva contraseña
              </label>
              <Input
                id="newPassword"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                className="mt-2"
              />
            </div>
            <div>
              <label
                className="text-sm font-semibold text-white"
                htmlFor="confirmNewPassword"
              >
                Confirmar nueva contraseña
              </label>
              <Input
                id="confirmNewPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repite tu nueva contraseña"
                autoComplete="new-password"
                className="mt-2"
              />
            </div>

            {error ? (
              <div className="app-alert-warning">{error}</div>
            ) : null}
            {success ? (
              <div className="app-alert">{success}</div>
            ) : null}

            <Button
              type="submit"
              variant="accent"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              <KeyRound className="h-5 w-5" aria-hidden="true" />
              {isSubmitting ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>

            <p className="text-center text-sm text-white/60">
              <Link
                className="font-semibold text-amber-200 hover:text-amber-100"
                to="/entrar"
              >
                Volver a entrar
              </Link>
            </p>
          </div>
        </form>
      </div>
    </section>
  )
}
