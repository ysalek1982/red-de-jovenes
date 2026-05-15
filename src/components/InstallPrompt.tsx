import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "rdj-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(DISMISS_KEY)) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS: no beforeinstallprompt — show manual hint after a moment
    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
    if (isIOS && isSafari) {
      const t = setTimeout(() => { setIosHint(true); setOpen(true); }, 3500);
      return () => { window.removeEventListener("beforeinstallprompt", onBIP); clearTimeout(t); };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    dismiss();
  };

  if (!open) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-3 md:inset-x-auto md:right-6 z-[60] md:max-w-sm">
      <div className="glass rounded-2xl p-4 shadow-soft border border-border/60 flex gap-3 items-start">
        <div className="size-10 rounded-xl gradient-faith grid place-items-center text-primary-foreground shrink-0">
          <Download className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold">Instala Red de Jóvenes</div>
          {iosHint && !deferred ? (
            <p className="text-xs text-muted-foreground mt-1">
              Toca <Share className="inline size-3.5 mx-0.5" /> y elige “Añadir a pantalla de inicio”.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">
              Llévala en tu pantalla de inicio. Acceso rápido, sin distracciones.
            </p>
          )}
          {deferred && (
            <button
              onClick={install}
              className="mt-3 rounded-full gradient-faith px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:scale-105 transition"
            >
              Instalar app
            </button>
          )}
        </div>
        <button onClick={dismiss} className="text-muted-foreground hover:text-foreground p-1" aria-label="Cerrar">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
