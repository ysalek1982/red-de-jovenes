import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Home, Calendar, MessageSquare, Gamepad2, Globe2, HandHeart, User,
  Lightbulb, BookOpen, Send, Users, Flame, Bell, Search, ArrowRight,
  Command as CommandIcon, Sparkles,
} from "lucide-react";

export type PaletteItem = {
  to: string;
  label: string;
  hint: string;
  icon: typeof Home;
  group: "Navegar" | "Acciones" | "Versículos";
  keywords?: string[];
};

export const paletteItems: PaletteItem[] = [
  { to: "/app", label: "Inicio", hint: "Tu feed espiritual", icon: Home, group: "Navegar", keywords: ["feed","home"] },
  { to: "/app/biblia", label: "Biblia", hint: "Lee y subraya", icon: BookOpen, group: "Navegar" },
  { to: "/app/devocional", label: "Devocional diario", hint: "Tu racha y reflexión", icon: Flame, group: "Navegar", keywords: ["racha","journal"] },
  { to: "/app/orar", label: "Orar", hint: "Sala global de oración", icon: HandHeart, group: "Navegar", keywords: ["oracion","prayer"] },
  { to: "/app/discipulado", label: "Discipulado", hint: "Mentores 1 a 1", icon: Users, group: "Navegar" },
  { to: "/app/foros", label: "Foros", hint: "Debates con la Palabra", icon: MessageSquare, group: "Navegar" },
  { to: "/app/eventos", label: "Eventos", hint: "Calendario y retiros", icon: Calendar, group: "Navegar" },
  { to: "/app/juegos", label: "Juegos", hint: "Aprende compitiendo", icon: Gamepad2, group: "Navegar" },
  { to: "/app/comunidad", label: "Comunidad global", hint: "Iglesias en el mapa", icon: Globe2, group: "Navegar" },
  { to: "/app/mensajes", label: "Mensajes", hint: "Chats privados", icon: Send, group: "Navegar" },
  { to: "/app/notificaciones", label: "Notificaciones", hint: "Tu actividad", icon: Bell, group: "Navegar" },
  { to: "/app/perfil", label: "Perfil", hint: "Tu identidad en Cristo", icon: User, group: "Navegar" },
  { to: "/app/construir", label: "Construir la Red", hint: "Propón ideas", icon: Lightbulb, group: "Navegar" },

  { to: "/app/orar", label: "Compartir petición de oración", hint: "Publica en la sala", icon: HandHeart, group: "Acciones", keywords: ["nueva","crear","peticion"] },
  { to: "/app/foros", label: "Iniciar un nuevo debate", hint: "Anclado en un versículo", icon: MessageSquare, group: "Acciones" },
  { to: "/app/eventos", label: "Crear un evento", hint: "Invita a tu iglesia", icon: Calendar, group: "Acciones" },
  { to: "/app/biblia", label: "Comenzar plan de lectura", hint: "21 días en los Salmos", icon: BookOpen, group: "Acciones" },

  { to: "/app/biblia", label: "Juan 3:16", hint: "Porque de tal manera amó Dios al mundo…", icon: Sparkles, group: "Versículos" },
  { to: "/app/biblia", label: "Filipenses 4:13", hint: "Todo lo puedo en Cristo que me fortalece.", icon: Sparkles, group: "Versículos" },
  { to: "/app/biblia", label: "Salmo 23", hint: "Jehová es mi pastor, nada me faltará.", icon: Sparkles, group: "Versículos" },
  { to: "/app/biblia", label: "Romanos 8:28", hint: "Todas las cosas ayudan a bien…", icon: Sparkles, group: "Versículos" },
];

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return paletteItems;
    return paletteItems.filter((i) =>
      [i.label, i.hint, i.group, ...(i.keywords ?? [])].join(" ").toLowerCase().includes(t)
    );
  }, [q]);

  useEffect(() => { setIdx(0); }, [q, open]);
  useEffect(() => { if (!open) setQ(""); }, [open]);

  if (!open) return null;

  const groups = results.reduce<Record<string, PaletteItem[]>>((acc, it) => {
    (acc[it.group] ||= []).push(it); return acc;
  }, {});

  const flat = results;
  const go = (to: string) => { navigate({ to: to as any }); onClose(); };

  return (
    <div className="fixed inset-0 z-[80] bg-background/70 backdrop-blur-md flex items-start justify-center p-4 pt-[10vh] animate-rise" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-xl glass rounded-3xl border-border/60 overflow-hidden shadow-soft">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border/60">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, flat.length - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
              else if (e.key === "Enter" && flat[idx]) { e.preventDefault(); go(flat[idx].to); }
            }}
            placeholder="Buscar sección, versículo o acción..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto py-2">
          {flat.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">
              No encontramos nada. Prueba con “orar”, “Salmo”, “evento”…
            </div>
          )}
          {Object.entries(groups).map(([group, items]) => (
            <div key={group} className="px-2 pt-2">
              <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{group}</div>
              {items.map((it) => {
                const flatIndex = flat.indexOf(it);
                const active = flatIndex === idx;
                return (
                  <button
                    key={it.label}
                    onMouseEnter={() => setIdx(flatIndex)}
                    onClick={() => go(it.to)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-left transition ${active ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <div className={`size-9 rounded-xl grid place-items-center shrink-0 ${active ? "gradient-faith text-primary-foreground" : "bg-secondary/60 text-muted-foreground"}`}>
                      <it.icon className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{it.label}</div>
                      <div className="text-xs text-muted-foreground truncate">{it.hint}</div>
                    </div>
                    <ArrowRight className={`size-4 ${active ? "text-foreground" : "text-muted-foreground/50"}`} />
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="px-5 py-2.5 border-t border-border/60 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><CommandIcon className="size-3" /> ⌘K para abrir</span>
          <span>↑ ↓ navegar · ↵ abrir</span>
        </div>
      </div>
    </div>
  );
}

export function PaletteTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full flex items-center gap-2 rounded-full bg-secondary/50 border border-border pl-4 pr-2 py-2.5 text-sm text-muted-foreground hover:bg-secondary/70 transition text-left"
    >
      <Search className="size-4 shrink-0" />
      <span className="flex-1 truncate">Buscar amigos, versículos, secciones…</span>
      <kbd className="hidden md:inline-flex items-center gap-1 text-[10px] border border-border rounded px-1.5 py-0.5">⌘K</kbd>
    </button>
  );
}

export function QuickJump() {
  // Compact 4x2 grid for mobile home / empty states
  const items = paletteItems.filter((i) => i.group === "Navegar").slice(0, 8);
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((it) => (
        <Link
          key={it.to + it.label}
          to={it.to as any}
          className="glass rounded-2xl p-3 flex flex-col items-center gap-1.5 text-[11px] text-center hover:-translate-y-0.5 transition"
        >
          <div className="size-9 rounded-xl gradient-faith grid place-items-center text-primary-foreground">
            <it.icon className="size-4" />
          </div>
          <span className="font-semibold truncate w-full">{it.label}</span>
        </Link>
      ))}
    </div>
  );
}
