import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, HandHeart, UserPlus, Calendar, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/notificaciones")({ component: Notificaciones });

const groups = [
  {
    label: "Hoy",
    items: [
      { icon: HandHeart, color: "text-teal", text: "Sara P. está orando por tu petición.", time: "ahora" },
      { icon: Heart, color: "text-accent", text: "Lucía y 12 más amaron tu publicación.", time: "hace 1h" },
      { icon: MessageCircle, color: "text-primary", text: "Mateo respondió en el foro de Romanos 8.", time: "hace 2h" },
    ],
  },
  {
    label: "Esta semana",
    items: [
      { icon: UserPlus, color: "text-teal", text: "Camila P. te empezó a seguir.", time: "ayer" },
      { icon: Calendar, color: "text-accent", text: "Mañana: Estudio bíblico — Renacer Joven.", time: "ayer" },
      { icon: Sparkles, color: "text-accent", text: "¡Lograste 23 días de racha! 🔥", time: "lun" },
    ],
  },
];

function Notificaciones() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Notificaciones</h1>
        <p className="text-muted-foreground">La Red orando, amando y conectando contigo.</p>
      </header>

      {groups.map((g) => (
        <section key={g.label}>
          <h2 className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">{g.label}</h2>
          <ul className="glass rounded-3xl divide-y divide-border/50 overflow-hidden">
            {g.items.map((n, i) => (
              <li key={i} className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition">
                <div className={`size-10 rounded-2xl bg-secondary grid place-items-center ${n.color}`}>
                  <n.icon className="size-5" />
                </div>
                <p className="flex-1 text-sm">{n.text}</p>
                <span className="text-xs text-muted-foreground shrink-0">{n.time}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
