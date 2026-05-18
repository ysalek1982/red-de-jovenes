import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Loader2, Save, UserRound } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { useAuth } from '../features/auth/useAuth'
import {
  ensureProfile,
  updateProfile,
} from '../features/profile/profileService'
import type { Profile } from '../types/database'

interface ProfileForm {
  fullName: string
  username: string
  city: string
  country: string
  churchName: string
  bio: string
}

const emptyForm: ProfileForm = {
  fullName: '',
  username: '',
  city: '',
  country: '',
  churchName: '',
  bio: '',
}

function profileToForm(profile: Profile): ProfileForm {
  return {
    fullName: profile.full_name,
    username: profile.username ?? '',
    city: profile.city ?? '',
    country: profile.country ?? '',
    churchName: profile.church_name ?? '',
    bio: profile.bio ?? '',
  }
}

function validateProfile(form: ProfileForm) {
  if (!form.fullName.trim()) return 'Ingresa tu nombre completo.'
  if (form.username.trim() && /\s/.test(form.username.trim())) {
    return 'El nombre de usuario no puede contener espacios.'
  }
  return ''
}

export function AppProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const memberSince = profile?.created_at
    ? new Intl.DateTimeFormat('es', {
        month: 'long',
        year: 'numeric',
      }).format(new Date(profile.created_at))
    : 'Miembro de la Red'

  useEffect(() => {
    let isMounted = true

    async function loadProfile() {
      if (!user) return
      setIsLoading(true)
      setError('')
      try {
        const profileData = await ensureProfile(user)
        if (!isMounted) return
        setProfile(profileData)
        setForm(profileToForm(profileData))
      } catch {
        if (isMounted) {
          setError('No pudimos cargar tu perfil. Inténtalo nuevamente.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [user])

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
    setError('')
    setSuccess('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    const validationError = validateProfile(form)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSaving(true)
    setError('')
    setSuccess('')
    try {
      const updatedProfile = await updateProfile({
        userId: user.id,
        fullName: form.fullName,
        username: form.username.trim().toLowerCase() || null,
        city: form.city,
        country: form.country,
        churchName: form.churchName,
        bio: form.bio,
      })
      setProfile(updatedProfile)
      setForm(profileToForm(updatedProfile))
      setSuccess('Perfil actualizado correctamente.')
    } catch {
      setError('No pudimos guardar tu perfil. Revisa el usuario o intenta más tarde.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-16 pt-32 text-white">
      <div className="pointer-events-none fixed right-0 top-24 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="section-shell relative">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/20">
              <UserRound className="h-10 w-10" aria-hidden="true" />
            </div>
            <p className="mt-6 text-sm font-semibold text-amber-200">
              Perfil de la Red
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {form.fullName || 'Tu perfil'}
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Comparte quien eres, desde donde te conectas y a que comunidad
              perteneces. Este perfil prepara la experiencia social de Red de
              Jóvenes.
            </p>
            <div className="mt-6 rounded-3xl border border-white/10 bg-slate-950/45 p-4 text-sm text-white/65">
              {memberSince}
            </div>
          </aside>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur md:p-8"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-200">Mi cuenta</p>
                <h2 className="mt-2 text-3xl font-black">Editar perfil</h2>
              </div>
              {isLoading ? (
                <span className="inline-flex items-center gap-2 text-sm text-white/60">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Cargando...
                </span>
              ) : null}
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">
                {success}
              </div>
            ) : null}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold" htmlFor="profileFullName">
                  Nombre completo
                </label>
                <Input
                  id="profileFullName"
                  value={form.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="profileUsername">
                  Usuario
                </label>
                <Input
                  id="profileUsername"
                  value={form.username}
                  onChange={(event) => updateField('username', event.target.value)}
                  placeholder="lucia.red"
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="profileChurch">
                  Iglesia o comunidad
                </label>
                <Input
                  id="profileChurch"
                  value={form.churchName}
                  onChange={(event) => updateField('churchName', event.target.value)}
                  placeholder="Comunidad Centro"
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="profileCity">
                  Ciudad
                </label>
                <Input
                  id="profileCity"
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" htmlFor="profileCountry">
                  País
                </label>
                <Input
                  id="profileCountry"
                  value={form.country}
                  onChange={(event) => updateField('country', event.target.value)}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold" htmlFor="profileBio">
                  Bio
                </label>
                <Textarea
                  id="profileBio"
                  value={form.bio}
                  onChange={(event) => updateField('bio', event.target.value)}
                  placeholder="Cuenta en pocas palabras como quieres vivir tu fe en comunidad."
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="mt-7 w-full sm:w-auto"
              disabled={isLoading || isSaving}
            >
              <Save className="h-5 w-5" aria-hidden="true" />
              {isSaving ? 'Guardando...' : 'Guardar perfil'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
