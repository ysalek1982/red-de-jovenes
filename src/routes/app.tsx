import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Calendar, MessageSquare, Gamepad2, Globe2, HandHeart, User, Sparkles, Lightbulb, Bell, BookOpen, Send, Menu, X, LogOut, Settings, Moon, Sun, Users, Flame, Plus } from "lucide-react";
import { CommandPalette, PaletteTrigger, useCommandPalette } from "@/components/CommandPalette";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Red de Jóvenes — App" },
      { name: "description", content: "Tu comunidad cristiana en un solo lugar." },
    ],
  }),
  component: AppLayout,
});

type NavItem = { to: string; label: string; icon: typeof Home; exact?: boolean };
const nav: NavItem[] = [
  { to: "/app", label: "Inicio", icon: Home, exact: true },
  { to: "/app/biblia", label: "Biblia", icon: BookOpen },
  { to: "/app/devocional", label: "Devocional", icon: Flame },
  { to: "/app/orar", label: "Orar", icon: HandHeart },
  { to: "/app/discipulado", label: "Discipulado", icon: Users },
  { to: "/app/foros", label: "Foros", icon: MessageSquare },
  { to: "/app/eventos", label: "Eventos", icon: Calendar },
  { to: "/app/juegos", label: "Juegos", icon: Gamepad2 },
  { to: "/app/comunidad", label: "Comunidad", icon: Globe2 },
  { to: "/app/mensajes", label: "Mensajes", icon: Send },
  { to: "/app/perfil", label: "Perfil", icon: User },
  { to: "/app/construir", label: "Construir", icon: Lightbulb },
];

const mobilePrimary = nav.slice(0, 4); // Inicio, Biblia, Orar, Foros
const mobileMore = nav.slice(4); // resto

function AppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.classList.toggle("light", next === "light");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-border/50 px-4 py-6 sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-2 mb-8">
          <div className="size-9 rounded-full gradient-faith grid place-items-center font-black text-primary-foreground">+</div>
          <div>
            <div className="font-bold leading-tight">Red de Jóvenes</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">en Cristo</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to as any}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  active ? "gradient-faith text-primary-foreground shadow-soft" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <n.icon className="size-5" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto glass rounded-2xl p-4 text-xs">
          <div className="flex items-center gap-2 text-accent font-semibold mb-1"><Sparkles className="size-3.5" /> Versículo del momento</div>
          <p className="text-muted-foreground italic">“Todo lo puedo en Cristo que me fortalece.” — Fil 4:13</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
          <div className="flex items-center gap-3 px-4 md:px-8 h-16">
            <div className="md:hidden flex items-center gap-2">
              <div className="size-8 rounded-full gradient-faith grid place-items-center font-black text-primary-foreground text-sm">+</div>
              <span className="font-bold">Red</span>
            </div>
            <div className="flex-1 max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                placeholder="Buscar amigos, versículos, eventos..."
                className="w-full rounded-full bg-secondary/50 border border-border pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema"
              className="hidden md:grid place-items-center rounded-full glass p-2.5 hover:bg-white/10 transition"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
            <Link to="/app/notificaciones" className="relative rounded-full glass p-2.5 hover:bg-white/10 transition">
              <Bell className="size-4" />
              <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-accent ring-2 ring-background" />
            </Link>
            <Link to="/app/perfil" className="size-9 rounded-full gradient-faith grid place-items-center text-primary-foreground font-bold text-sm">JD</Link>
          </div>
        </header>

        <main className="flex-1 px-4 md:px-8 py-6 pb-28 md:pb-10 max-w-6xl w-full mx-auto animate-rise">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 inset-x-3 z-50 glass rounded-full px-2 py-2 flex justify-between">
        {mobilePrimary.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to as any} className={`flex-1 grid place-items-center rounded-full py-2 transition ${active ? "gradient-faith text-primary-foreground" : "text-muted-foreground"}`}>
              <n.icon className="size-5" />
            </Link>
          );
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 grid place-items-center rounded-full py-2 text-muted-foreground"
          aria-label="Más opciones"
        >
          <Menu className="size-5" />
        </button>
      </nav>

      {/* Mobile "Más" sheet */}
      {moreOpen && (
        <div
          className="md:hidden fixed inset-0 z-[55] bg-background/70 backdrop-blur-md flex items-end animate-rise"
          onClick={() => setMoreOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full glass rounded-t-3xl border-t border-border/60 p-5 pb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Explora la Red</h3>
              <button onClick={() => setMoreOpen(false)} className="rounded-full glass p-2"><X className="size-4" /></button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {mobileMore.map((n) => (
                <Link
                  key={n.to}
                  to={n.to as any}
                  onClick={() => setMoreOpen(false)}
                  className="glass rounded-2xl p-4 flex flex-col items-center gap-2 text-xs hover:border-teal/40"
                >
                  <div className="size-10 rounded-xl gradient-faith grid place-items-center text-primary-foreground"><n.icon className="size-5" /></div>
                  {n.label}
                </Link>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <button onClick={() => { toggleTheme(); }} className="glass rounded-2xl p-3 text-xs flex flex-col items-center gap-1.5">
                {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
                Tema
              </button>
              <Link to="/app/perfil" onClick={() => setMoreOpen(false)} className="glass rounded-2xl p-3 text-xs flex flex-col items-center gap-1.5">
                <Settings className="size-4" /> Ajustes
              </Link>
              <Link to="/" onClick={() => setMoreOpen(false)} className="glass rounded-2xl p-3 text-xs flex flex-col items-center gap-1.5 text-destructive">
                <LogOut className="size-4" /> Salir
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
