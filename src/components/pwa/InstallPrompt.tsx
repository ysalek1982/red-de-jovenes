import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isStandaloneMode() {
  const navigatorWithStandalone = navigator as Navigator & {
    standalone?: boolean
  }

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    navigatorWithStandalone.standalone === true
  )
}

function wasInstallDismissed() {
  try {
    return window.localStorage.getItem('red-jovenes-install-dismissed') === 'true'
  } catch {
    return false
  }
}

export function InstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(() => isStandaloneMode())
  const [isDismissed, setIsDismissed] = useState(() => wasInstallDismissed())

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault()
      setInstallEvent(event as BeforeInstallPromptEvent)
    }

    function handleInstalled() {
      setIsInstalled(true)
      setInstallEvent(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function handleInstall() {
    if (!installEvent) return

    await installEvent.prompt()
    const choice = await installEvent.userChoice.catch(() => undefined)
    if (choice?.outcome === 'dismissed') {
      try {
        window.localStorage.setItem('red-jovenes-install-dismissed', 'true')
      } catch {
        // Si el navegador bloquea localStorage, solo ocultamos el prompt en memoria.
      }
      setIsDismissed(true)
    }
    setInstallEvent(null)
  }

  if (isInstalled || isDismissed || !installEvent) return null

  return (
    <button
      type="button"
      onClick={() => void handleInstall()}
      className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-100 transition hover:bg-emerald-300/15"
      aria-label="Instalar app"
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span className="hidden sm:inline">Instalar app</span>
    </button>
  )
}
