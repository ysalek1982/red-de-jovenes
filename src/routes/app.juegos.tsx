import { createFileRoute } from "@tanstack/react-router";
import { Zap, Brain, Swords, Layers, Trophy, Crown } from "lucide-react";

export const Route = createFileRoute("/app/juegos")({ component: Juegos });

const games = [
  { name: "Versículo Rápido", desc: "Quiz multiplayer en tiempo real", icon: Zap, color: "from-accent to-orange-500", players: "2-8", time: "5 min" },
  { name: "Adivina la Historia", desc: "¿Qué pasaje bíblico es?", icon: Brain, color: "from-teal to-sky-500", players: "1+", time: "10 min" },
  { name: "Memory Match", desc: "Versículos e imágenes", icon: Layers, color: "from-emerald-400 to-teal", players: "1-4", time: "3 min" },
  { name: "Batallas de Fe", desc: "Duelos 1 vs 1", icon: Swords, color: "from-pink-500 to-rose-500", players: "2", time: "7 min" },
];

const leaderboard = [
  { name: "Lucía R.", church: "Renacer", pts: 12480, rank: 1 },
  { name: "Mateo A.", church: "Esperanza", pts: 11200, rank: 2 },
  { name: "Camila P.", church: "Vida Nueva", pts: 9870, rank: 3 },
  { name: "Diego M.", church: "Renacer", pts: 8650, rank: 4 },
  { name: "Tú", church: "Renacer", pts: 7320, rank: 5, you: true },
];

function Juegos() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Juegos</h1>
          <p className="text-muted-foreground">Aprende, compite y crece en la fe.</p>
        </div>
        <div className="glass rounded-2xl px-4 py-2 inline-flex items-center gap-2 text-sm">
          <Trophy className="size-4 text-accent" />
          <span className="text-muted-foreground">Tus puntos:</span>
          <span className="font-bold text-gradient-faith">7,320</span>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <div key={g.name} className="glass rounded-3xl p-6 group hover:-translate-y-1 hover:glow transition relative overflow-hidden">
            <div className={`absolute -top-16 -right-16 size-44 rounded-full bg-gradient-to-br ${g.color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
            <div className={`relative size-14 rounded-2xl bg-gradient-to-br ${g.color} grid place-items-center text-primary-foreground mb-4`}>
              <g.icon className="size-7" />
            </div>
            <h3 className="relative text-xl font-bold">{g.name}</h3>
            <p className="relative text-sm text-muted-foreground mt-1">{g.desc}</p>
            <div className="relative mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {g.players} jugadores · {g.time}
              </div>
              <button className="rounded-full gradient-faith px-5 py-2 text-sm font-semibold text-primary-foreground hover:scale-105 transition">
                Jugar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Crown className="size-5 text-accent" />
          <h2 className="text-xl font-bold">Leaderboard global</h2>
        </div>
        <ul className="space-y-2">
          {leaderboard.map((u) => (
            <li key={u.rank} className={`flex items-center gap-4 p-3 rounded-2xl transition ${u.you ? "gradient-faith text-primary-foreground" : "hover:bg-white/5"}`}>
              <div className={`size-9 rounded-full grid place-items-center font-black ${u.rank <= 3 ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
                {u.rank}
              </div>
              <div className="size-10 rounded-full bg-gradient-to-br from-teal to-accent grid place-items-center text-primary-foreground font-bold">
                {u.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{u.name}</div>
                <div className={`text-xs ${u.you ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{u.church}</div>
              </div>
              <div className="font-bold tabular-nums">{u.pts.toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
