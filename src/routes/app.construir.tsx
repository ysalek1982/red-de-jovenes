import { createFileRoute } from "@tanstack/react-router";
import { Lightbulb, ArrowUp, Bug, Sparkles, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/app/construir")({ component: Construir });

const ideas = [
  { title: "Modo retiro espiritual", desc: "Un fin de semana sin notificaciones, solo Palabra y oración guiada.", votes: 487, tag: "Función" },
  { title: "Versículo en widget", desc: "Para la pantalla de inicio del celular.", votes: 342, tag: "Función" },
  { title: "Grupos de discipulado privados", desc: "5 personas, mentor asignado, plan de 12 semanas.", votes: 298, tag: "Función" },
  { title: "Bug: stories no cargan en iOS 17", desc: "Pantalla negra al abrir historias.", votes: 56, tag: "Bug" },
];

function Construir() {
  return (
    <div className="space-y-8">
      <header className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-semibold text-accent mb-4">
          <Sparkles className="size-3.5" /> Construyamos juntos
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          Esta Red es <span className="text-gradient-faith">tuya.</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Propone, vota, reporta. Cada idea de un joven encendido moldea el futuro de la Red.
        </p>
      </header>

      <div className="grid sm:grid-cols-3 gap-3">
        {[
          { icon: Lightbulb, label: "Proponer idea", color: "from-accent to-orange-500" },
          { icon: ArrowUp, label: "Votar funciones", color: "from-teal to-sky-500" },
          { icon: Bug, label: "Reportar bug", color: "from-pink-500 to-rose-500" },
        ].map((a) => (
          <button key={a.label} className="glass rounded-3xl p-6 flex items-center gap-4 hover:-translate-y-1 transition">
            <div className={`size-12 rounded-2xl bg-gradient-to-br ${a.color} grid place-items-center text-primary-foreground`}>
              <a.icon className="size-6" />
            </div>
            <span className="font-semibold">{a.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Ideas de la comunidad</h2>
          <select className="rounded-full glass px-4 py-1.5 text-sm bg-transparent">
            <option>Más votadas</option>
            <option>Recientes</option>
          </select>
        </div>

        {ideas.map((idea) => (
          <div key={idea.title} className="glass rounded-3xl p-5 flex gap-4 items-center">
            <button className="shrink-0 flex flex-col items-center gap-1 rounded-2xl border border-border/60 px-3 py-2 hover:gradient-faith hover:text-primary-foreground hover:border-transparent transition">
              <ArrowUp className="size-4" />
              <span className="text-sm font-bold">{idea.votes}</span>
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{idea.title}</h3>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${idea.tag === "Bug" ? "bg-red-500/15 text-red-400" : "bg-teal/15 text-teal"}`}>
                  {idea.tag}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{idea.desc}</p>
            </div>
            <button className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <MessageSquare className="size-4" /> 12
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
