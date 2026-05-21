import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, UserPlus } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../features/auth/useAuth'

interface SignUpForm {
  fullName: string
  username: string
  email: string
  password: string
  confirmPassword: string
  city: string
  country: string
  churchName: string
  ageRange: string
  acceptedGuidelines: boolean
}

const initialForm: SignUpForm = {
  fullName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  city: '',
  country: '',
  churchName: '',
  ageRange: '',
  acceptedGuidelines: false,
}

export function CreateAccountPage() {
  const navigate = useNavigate()
  const { signUpWithPassword } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateField(field: keyof SignUpForm, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
    setSuccess('')
  }

  function validate() {
    if (!form.fullName.trim()) return 'Ingresa tu nombre completo.'
    if (!/^[a-z0-9._-]{3,30}$/.test(form.username.trim().toLowerCase())) {
      return 'El usuario debe tener 3 a 30 caracteres y solo usar letras, números, punto, guion o guion bajo.'
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Ingresa un correo válido.'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    if (form.password !== form.confirmPassword) return 'Las contraseñas no coinciden.'
    if (!form.city.trim()) return 'Ingresa tu ciudad.'
    if (!form.country.trim()) return 'Ingresa tu país.'
    if (!form.ageRange) return 'Selecciona tu rango de edad.'
    if (!form.acceptedGuidelines) {
      return 'Debes aceptar las normas de comunidad para crear tu cuenta.'
    }
    return ''
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)
    try {
      const result = await signUpWithPassword(form.email.trim(), form.password, {
        full_name: form.fullName.trim(),
        username: form.username.trim().toLowerCase(),
        city: form.city.trim(),
        country: form.country.trim(),
        church_name: form.churchName.trim() || undefined,
        age_range: form.ageRange,
        accepted_community_guidelines: form.acceptedGuidelines,
      })
      setForm(initialForm)
      if (result.hasSession) {
        setSuccess('Cuenta creada. Bienvenido a tu Red.')
        setTimeout(() => navigate('/app'), 900)
      } else {
        setSuccess(
          'Cuenta creada. Revisa tu correo y confirma tu cuenta antes de entrar.',
        )
      }
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : 'Error desconocido'
      setError(
        message.toLowerCase().includes('already')
          ? 'Este correo ya está registrado. Intenta entrar.'
          : 'No pudimos crear la cuenta. Revisa los datos e inténtalo nuevamente.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white md:pt-36">
      <div className="mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="app-kicker">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Crear cuenta
          </p>
          <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Tu generación. Tu Red.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Crea tu perfil para participar en oración, comunidad, devocionales y
            conversaciones con propósito.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="app-card p-6 md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white" htmlFor="fullName">
                Nombre completo
              </label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(event) => updateField('fullName', event.target.value)}
                placeholder="Lucía Rojas"
                autoComplete="name"
                className="mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white" htmlFor="signupUsername">
                Usuario
              </label>
              <Input
                id="signupUsername"
                value={form.username}
                onChange={(event) => updateField('username', event.target.value)}
                placeholder="lucia.red"
                autoComplete="username"
                className="mt-2"
              />
              <p className="mt-2 text-xs text-white/45">
                Sin espacios. Usa letras, números, punto, guion o guion bajo.
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white" htmlFor="signupEmail">
                Correo electrónico
              </label>
              <Input
                id="signupEmail"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="tu.correo@ejemplo.com"
                autoComplete="email"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white" htmlFor="signupPassword">
                Contraseña
              </label>
              <Input
                id="signupPassword"
                type="password"
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={(event) =>
                  updateField('confirmPassword', event.target.value)
                }
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white" htmlFor="city">
                Ciudad
              </label>
              <Input
                id="city"
                value={form.city}
                onChange={(event) => updateField('city', event.target.value)}
                placeholder="Buenos Aires"
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white" htmlFor="country">
                País
              </label>
              <Input
                id="country"
                value={form.country}
                onChange={(event) => updateField('country', event.target.value)}
                placeholder="Argentina"
                className="mt-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white" htmlFor="ageRange">
                Rango de edad
              </label>
              <select
                id="ageRange"
                value={form.ageRange}
                onChange={(event) => updateField('ageRange', event.target.value)}
                className="app-select mt-2"
              >
                <option value="">Selecciona un rango</option>
                <option value="13-17">13 a 17 años</option>
                <option value="18-24">18 a 24 años</option>
                <option value="25-30">25 a 30 años</option>
                <option value="31+">31 años o más</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-white" htmlFor="churchName">
                Iglesia o comunidad, opcional
              </label>
              <Input
                id="churchName"
                value={form.churchName}
                onChange={(event) => updateField('churchName', event.target.value)}
                placeholder="Nombre de tu iglesia o grupo juvenil"
                className="mt-2"
              />
            </div>
            <label className="app-card-soft flex gap-3 text-sm leading-6 text-white/70 md:col-span-2">
              <input
                type="checkbox"
                checked={form.acceptedGuidelines}
                onChange={(event) =>
                  updateField('acceptedGuidelines', event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-white/20 bg-slate-950 text-amber-300"
              />
              <span>
                Acepto vivir las normas de comunidad: respeto, lenguaje sano,
                cuidado de otros jóvenes y conversaciones centradas en Cristo.
              </span>
            </label>
          </div>

          {error ? (
            <div className="app-alert-warning mt-5">{error}</div>
          ) : null}
          {success ? (
            <div className="app-alert mt-5">{success}</div>
          ) : null}

          <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="mt-6 w-full">
            <UserPlus className="h-5 w-5" aria-hidden="true" />
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </Button>

          <p className="mt-5 text-center text-sm text-white/60">
            ¿Ya tienes cuenta?{' '}
            <Link className="font-semibold text-amber-200 hover:text-amber-100" to="/entrar">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </section>
  )
}
