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
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-36 text-white">
      <div className="pointer-events-none absolute left-1/2 top-24 h-80 w-80 -translate-x-1/2 rounded-full bg-amber-300/[0.12] blur-3xl" />
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
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
          className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/30 backdrop-blur md:p-8"
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
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                {success}
              </div>
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
