import type { FormEvent } from 'react'
import { useEffect, useState } from 'react'
import { Bell, Loader2, Save, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { PilotFeedbackDialog } from '../components/pilot/PilotFeedbackDialog'
import { Textarea } from '../components/ui/textarea'
import { useAuth } from '../features/auth/useAuth'
import { hasRole } from '../features/auth/roleService'
import {
  getNotificationPreferences,
  upsertNotificationPreferences,
} from '../features/notifications/notificationPreferencesService'
import {
  getActiveGroups,
  type GroupWithMembership,
} from '../features/map/worldMapService'
import {
  ensureProfile,
  isValidUsername,
  updateProfile,
} from '../features/profile/profileService'
import {
  getMyFaithProgress,
  type FaithProgressSummary,
} from '../features/progress/progressService'
import type { NotificationPreference, Profile } from '../types/database'

interface ProfileForm {
  fullName: string
  username: string
  avatarUrl: string
  city: string
  country: string
  churchName: string
  ageRange: string
  bio: string
}

interface NotificationForm {
  dailyDevotional: boolean
  prayerUpdates: boolean
  communityUpdates: boolean
}

const emptyForm: ProfileForm = {
  fullName: '',
  username: '',
  avatarUrl: '',
  city: '',
  country: '',
  churchName: '',
  ageRange: '',
  bio: '',
}

const defaultNotifications: NotificationForm = {
  dailyDevotional: true,
  prayerUpdates: true,
  communityUpdates: false,
}

function profileToForm(profile: Profile): ProfileForm {
  return {
    fullName: profile.full_name,
    username: profile.username ?? '',
    avatarUrl: profile.avatar_url ?? '',
    city: profile.city ?? '',
    country: profile.country ?? '',
    churchName: profile.church_name ?? '',
    ageRange: profile.age_range ?? '',
    bio: profile.bio ?? '',
  }
}

function preferencesToForm(
  preferences: NotificationPreference | null,
): NotificationForm {
  if (!preferences) return defaultNotifications

  return {
    dailyDevotional: preferences.daily_devotional,
    prayerUpdates: preferences.prayer_updates,
    communityUpdates: preferences.community_updates,
  }
}

function validateProfile(form: ProfileForm) {
  if (!form.fullName.trim()) return 'Ingresa tu nombre completo.'
  if (!isValidUsername(form.username)) {
    return 'El usuario debe tener 3 a 30 caracteres y solo usar letras, números, punto, guion o guion bajo.'
  }
  if (form.avatarUrl.trim()) {
    try {
      const url = new URL(form.avatarUrl.trim())
      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'El avatar debe ser una URL http o https.'
      }
    } catch {
      return 'Ingresa una URL de avatar valida o deja el campo vacio.'
    }
  }
  return ''
}

export function AppProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [notifications, setNotifications] =
    useState<NotificationForm>(defaultNotifications)
  const [communities, setCommunities] = useState<GroupWithMembership[]>([])
  const [progress, setProgress] = useState<FaithProgressSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
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
        const [profileData, preferenceData, groupData, progressData] =
          await Promise.all([
            ensureProfile(user),
            getNotificationPreferences(user.id),
            getActiveGroups(user.id),
            getMyFaithProgress(user.id),
          ])
        const adminRole = await hasRole('admin')
        if (!isMounted) return
        setProfile(profileData)
        setForm(profileToForm(profileData))
        setNotifications(preferencesToForm(preferenceData))
        setCommunities(groupData.filter((group) => group.isMember))
        setProgress(progressData)
        setIsAdmin(adminRole)
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

  function updateNotification(field: keyof NotificationForm, value: boolean) {
    setNotifications((current) => ({ ...current, [field]: value }))
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
        avatarUrl: form.avatarUrl,
        city: form.city,
        country: form.country,
        churchName: form.churchName,
        ageRange: form.ageRange,
        bio: form.bio,
      })
      setProfile(updatedProfile)
      setForm(profileToForm(updatedProfile))
      setSuccess('Perfil actualizado correctamente.')
    } catch (saveError) {
      const message =
        saveError instanceof Error ? saveError.message : 'Error desconocido'
      setError(
        message === 'USERNAME_TAKEN'
          ? 'Ese usuario ya está en uso. Elige otro.'
          : 'No pudimos guardar tu perfil. Revisa el usuario o intenta más tarde.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleNotificationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    setIsSavingNotifications(true)
    setError('')
    setSuccess('')
    try {
      await upsertNotificationPreferences({
        userId: user.id,
        ...notifications,
      })
      setSuccess('Preferencias de notificación guardadas.')
    } catch {
      setError('No pudimos guardar las preferencias de notificación.')
    } finally {
      setIsSavingNotifications(false)
    }
  }

  return (
    <section className="app-page">
      <div className="section-shell relative">
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <aside className="app-card h-fit">
            {form.avatarUrl ? (
              <img
                src={form.avatarUrl}
                alt=""
                className="h-20 w-20 rounded-3xl border border-white/10 object-cover shadow-2xl shadow-amber-500/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 via-lime-200 to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/20">
                <UserRound className="h-10 w-10" aria-hidden="true" />
              </div>
            )}
            <p className="mt-6 text-sm font-semibold text-amber-200">
              Perfil de la Red
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {form.fullName || 'Tu perfil'}
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/60">
              Comparte quién eres, desde dónde te conectas y a qué comunidad
              perteneces. Este perfil prepara tu experiencia social en Red de
              Jóvenes.
            </p>
            <div className="app-card-soft mt-6 text-sm text-white/65">
              {memberSince}
            </div>
            {profile?.community_guidelines_accepted_at ? (
              <div className="app-alert mt-3">
                Normas de comunidad aceptadas.
              </div>
            ) : null}
            <div className="app-card-soft mt-3 text-sm text-white/65">
              Rol visible: {isAdmin ? 'Administrador' : 'Miembro'}
            </div>
            <div className="mt-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-sm font-black text-emerald-100">
                Piloto cerrado
              </p>
              <p className="mt-2 text-sm leading-6 text-white/60">
                Tu experiencia nos ayuda a cuidar mejor esta red.
              </p>
              <div className="mt-4">
                <PilotFeedbackDialog triggerLabel="Ayudanos a mejorar" />
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4">
              <p className="text-sm font-black text-emerald-100">
                Mis comunidades
              </p>
              <div className="mt-3 space-y-2">
                {communities.length ? (
                  communities.slice(0, 3).map((community) => (
                    <div
                      key={community.id}
                      className="app-card-soft p-3"
                    >
                      <p className="truncate text-sm font-bold">
                        {community.name}
                      </p>
                      <p className="mt-1 text-xs text-white/50">
                        {community.city ?? 'Sin ciudad'}, {community.country ?? 'Sin pais'}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-white/60">
                    Aun no perteneces a una comunidad.
                  </p>
                )}
              </div>
              <Link
                to="/app/mapa"
                className="app-button-primary mt-4 min-h-9 px-4 text-xs"
              >
                Encontrar comunidad
              </Link>
            </div>
            <div className="app-card-soft mt-4">
              <p className="text-sm font-black text-white">Mi actividad</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <span className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <strong className="block text-xl text-white">
                    {progress?.devotionalReads ?? 0}
                  </strong>
                  <span className="text-white/50">devocionales</span>
                </span>
                <span className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <strong className="block text-xl text-white">
                    {progress?.prayerSupports ?? 0}
                  </strong>
                  <span className="text-white/50">oraciones</span>
                </span>
                <span className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <strong className="block text-xl text-white">
                    {progress?.gamesPlayed ?? 0}
                  </strong>
                  <span className="text-white/50">juegos</span>
                </span>
                <span className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <strong className="block text-xl text-white">
                    {progress?.totalGamePoints ?? 0}
                  </strong>
                  <span className="text-white/50">puntos</span>
                </span>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <form
              onSubmit={handleSubmit}
              className="app-card md:p-8"
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
                <div className="app-alert-warning mt-6">
                  {error}
                </div>
              ) : null}
              {success ? (
                <div className="app-alert mt-6">
                  {success}
                </div>
              ) : null}

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="profileFullName"
                  >
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
                  <label className="text-sm font-semibold" htmlFor="profileAgeRange">
                    Rango de edad
                  </label>
                  <select
                    id="profileAgeRange"
                    value={form.ageRange}
                    onChange={(event) => updateField('ageRange', event.target.value)}
                    className="app-select mt-2"
                    disabled={isLoading}
                  >
                    <option value="">Sin especificar</option>
                    <option value="13-17">13 a 17 años</option>
                    <option value="18-24">18 a 24 años</option>
                    <option value="25-30">25 a 30 años</option>
                    <option value="31+">31 años o más</option>
                  </select>
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
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold" htmlFor="profileAvatarUrl">
                    Avatar URL, opcional
                  </label>
                  <Input
                    id="profileAvatarUrl"
                    value={form.avatarUrl}
                    onChange={(event) => updateField('avatarUrl', event.target.value)}
                    placeholder="https://..."
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
                    placeholder="Cuenta en pocas palabras cómo quieres vivir tu fe en comunidad."
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

            <form
              onSubmit={(event) => void handleNotificationSubmit(event)}
              className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-black/25 backdrop-blur md:p-8"
            >
              <div className="flex items-center gap-3">
                <Bell className="h-6 w-6 text-emerald-200" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-emerald-100">
                    Recordatorios
                  </p>
                  <h2 className="mt-1 text-3xl font-black">
                    Preferencias de notificación
                  </h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/65">
                Push real queda preparado para una fase futura con VAPID o Edge
                Functions. Por ahora guardamos tus preferencias de forma segura.
              </p>

              <div className="mt-6 grid gap-3">
                <ToggleRow
                  title="Devocional diario"
                  text="Recordatorio para empezar el día con la Palabra."
                  checked={notifications.dailyDevotional}
                  onChange={(checked) =>
                    updateNotification('dailyDevotional', checked)
                  }
                />
                <ToggleRow
                  title="Oración"
                  text="Avisos sobre actividad en la Sala de oración global."
                  checked={notifications.prayerUpdates}
                  onChange={(checked) => updateNotification('prayerUpdates', checked)}
                />
                <ToggleRow
                  title="Comunidad"
                  text="Actualizaciones de foros y conversaciones importantes."
                  checked={notifications.communityUpdates}
                  onChange={(checked) =>
                    updateNotification('communityUpdates', checked)
                  }
                />
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="mt-7 w-full sm:w-auto"
                disabled={isLoading || isSavingNotifications}
              >
                <Save className="h-5 w-5" aria-hidden="true" />
                {isSavingNotifications
                  ? 'Guardando...'
                  : 'Guardar preferencias'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function ToggleRow({
  title,
  text,
  checked,
  onChange,
}: {
  title: string
  text: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="app-card-soft flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block font-bold">{title}</span>
        <span className="mt-1 block text-sm leading-6 text-white/55">{text}</span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-emerald-300"
      />
    </label>
  )
}
