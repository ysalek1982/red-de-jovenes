import { createFileRoute } from "@tanstack/react-router";
import { HandHeart, Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/orar")({ component: Orar });

const messages = [
  { user: "Sara P.", text: "Por mi mamá, está enferma. Gracias 🙏", time: "12:01", tag: "Petición" },
  { user: "Anónimo", text: "Por sabiduría para una decisión grande esta semana.", time: "12:03", tag: "Petición" },
  { user: "Mateo A.", text: "¡Dios respondió! Conseguí trabajo. Gloria a Él 🎉", time: "12:05", tag: "Alabanza" },
  { user: "Lucía R.", text: "Por todos los jóvenes que están luchando con ansiedad. Fil 4:6-7", time: "12:07", tag: "Petición" },
  { user: "Camila P.", text: "Estoy orando ahora mismo por todos ustedes 💙", time: "12:08", tag: "Apoyo" },
];

function Orar() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Sala de oración</h1>
        <p className="text-muted-foreground">Un espacio sagrado para orar juntos. En vivo · 1,247 jóvenes presentes.</p>
      </header>

      <div className="grid lg:grid-cols-[1fr_300px] gap-5">
        <div className="glass rounded-3xl p-5 flex flex-col h-[60vh]">
          <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-semibold">En vivo</span>
            </div>
            <span className="text-xs text-muted-foreground">Solo peticiones y alabanzas</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-teal to-accent grid place-items-center text-primary-foreground font-bold text-sm shrink-0">
                  {m.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">{m.user}</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${m.tag === "Alabanza" ? "bg-accent/15 text-accent" : m.tag === "Apoyo" ? "bg-teal/15 text-teal" : "bg-secondary text-muted-foreground"}`}>
                      {m.tag}
                    </span>
                    <span className="text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-sm mt-1">{m.text}</p>
                  <button className="mt-1.5 inline-flex items-center gap-1 text-xs text-teal hover:underline">
                    <HandHeart className="size-3.5" /> Estoy orando
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-3 border-t border-border/50 flex gap-2">
            <input
              placeholder="Comparte tu petición o alabanza..."
              className="flex-1 rounded-full bg-secondary/50 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button className="rounded-full gradient-faith px-4 py-2.5 text-primary-foreground">
              <Send className="size-4" />
            </button>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="glass rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/30 blur-2xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-semibold">
                <Sparkles className="size-3.5" /> Oración del día
              </div>
              <p className="mt-3 text-sm leading-relaxed">
                Padre, hoy entrego mis cargas. Llena mi corazón de Tu paz, mis labios de Tu nombre y mis manos de Tu obra. En el nombre de Jesús, amén.
              </p>
              <button className="mt-4 w-full rounded-full gradient-faith py-2 text-sm font-semibold text-primary-foreground">
                Orar conmigo
              </button>
            </div>
          </div>

          <div className="glass rounded-3xl p-5">
            <h3 className="font-semibold mb-3 text-sm">Ora por mí</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <HandHeart className="size-4 text-teal mt-0.5 shrink-0" />
                <span>Por sanidad de mi familia.</span>
              </li>
              <li className="flex items-start gap-2">
                <HandHeart className="size-4 text-teal mt-0.5 shrink-0" />
                <span>Para superar una crisis de fe.</span>
              </li>
              <li className="flex items-start gap-2">
                <HandHeart className="size-4 text-teal mt-0.5 shrink-0" />
                <span>Por mis estudios este semestre.</span>
              </li>
            </ul>
            <button className="mt-3 text-xs text-accent font-semibold">+ Compartir mi petición</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
