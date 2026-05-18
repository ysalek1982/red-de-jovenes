import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Zap, Brain, Swords, Layers, Trophy, Crown, X, Check, Timer, Sparkles, ChevronRight, Flame } from "lucide-react";

export const Route = createFileRoute("/app/juegos")({ component: Juegos });

const games = [
  { id: "quiz", name: "Versículo Rápido", desc: "Quiz multiplayer en tiempo real", icon: Zap, color: "from-accent to-orange-500", players: "2-8", time: "5 min" },
  { id: "story", name: "Adivina la Historia", desc: "¿Qué pasaje bíblico es?", icon: Brain, color: "from-teal to-sky-500", players: "1+", time: "10 min" },
  { id: "memory", name: "Memory Match", desc: "Versículos e imágenes", icon: Layers, color: "from-emerald-400 to-teal", players: "1-4", time: "3 min" },
  { id: "duel", name: "Batallas de Fe", desc: "Duelos 1 vs 1", icon: Swords, color: "from-pink-500 to-rose-500", players: "2", time: "7 min" },
] as const;

type Question = { q: string; options: string[]; correct: number; ref: string };
const QUESTIONS: Question[] = [
  { q: "“Porque de tal manera amó Dios al mundo...”", options: ["Juan 3:16", "Romanos 8:28", "Salmos 23:1", "Mateo 6:33"], correct: 0, ref: "Juan 3:16" },
  { q: "¿Quién dijo: 'Todo lo puedo en Cristo que me fortalece'?", options: ["Pedro", "Pablo", "Juan", "David"], correct: 1, ref: "Filipenses 4:13" },
  { q: "“El Señor es mi pastor; nada me…”", options: ["temeré", "faltará", "alegrará", "salvará"], correct: 1, ref: "Salmos 23:1" },
  { q: "¿Cuántos discípulos eligió Jesús?", options: ["7", "10", "12", "70"], correct: 2, ref: "Mateo 10" },
  { q: "El fruto del Espíritu es: amor, gozo, paz, paciencia…", options: ["valentía", "benignidad", "justicia", "sabiduría"], correct: 1, ref: "Gálatas 5:22" },
];

const leaderboardBase = [
  { name: "Lucía R.", church: "Renacer", pts: 12480 },
  { name: "Mateo A.", church: "Esperanza", pts: 11200 },
  { name: "Camila P.", church: "Vida Nueva", pts: 9870 },
  { name: "Diego M.", church: "Renacer", pts: 8650 },
];

function Juegos() {
  const [active, setActive] = useState<null | typeof games[number]["id"]>(null);
  const [score, setScore] = useState(7320);

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
          <span className="font-bold text-gradient-faith tabular-nums">{score.toLocaleString()}</span>
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className="text-left glass rounded-3xl p-6 group hover:-translate-y-1 hover:glow transition relative overflow-hidden"
          >
            <div className={`absolute -top-16 -right-16 size-44 rounded-full bg-gradient-to-br ${g.color} opacity-20 blur-2xl group-hover:opacity-40 transition`} />
            <div className={`relative size-14 rounded-2xl bg-gradient-to-br ${g.color} grid place-items-center text-primary-foreground mb-4`}>
              <g.icon className="size-7" />
            </div>
            <h3 className="relative text-xl font-bold flex items-center gap-2">{g.name} <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition" /></h3>
            <p className="relative text-sm text-muted-foreground mt-1">{g.desc}</p>
            <div className="relative mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{g.players} jugadores · {g.time}</div>
              <span className="rounded-full gradient-faith px-4 py-1.5 text-xs font-semibold text-primary-foreground">Jugar</span>
            </div>
          </button>
        ))}
      </div>

      <Leaderboard userScore={score} />

      {active === "quiz" && <QuizModal onClose={() => setActive(null)} onScore={(p) => setScore((s) => s + p)} />}
      {active && active !== "quiz" && <ComingSoon name={games.find((g) => g.id === active)!.name} onClose={() => setActive(null)} />}
    </div>
  );
}

function Leaderboard({ userScore }: { userScore: number }) {
  const board = useMemo(() => {
    const arr = [...leaderboardBase, { name: "Tú", church: "Renacer", pts: userScore, you: true as const }]
      .sort((a, b) => b.pts - a.pts)
      .map((u, i) => ({ ...u, rank: i + 1 }));
    return arr;
  }, [userScore]);

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <Crown className="size-5 text-accent" />
        <h2 className="text-xl font-bold">Leaderboard global</h2>
      </div>
      <ul className="space-y-2">
        {board.map((u) => (
          <li key={u.rank} className={`flex items-center gap-4 p-3 rounded-2xl transition ${"you" in u ? "gradient-faith text-primary-foreground" : "hover:bg-white/5"}`}>
            <div className={`size-9 rounded-full grid place-items-center font-black ${u.rank <= 3 ? "bg-accent text-accent-foreground" : "bg-secondary"}`}>
              {u.rank}
            </div>
            <div className="size-10 rounded-full bg-gradient-to-br from-teal to-accent grid place-items-center text-primary-foreground font-bold">
              {u.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{u.name}</div>
              <div className={`text-xs ${"you" in u ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{u.church}</div>
            </div>
            <div className="font-bold tabular-nums">{u.pts.toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuizModal({ onClose, onScore }: { onClose: () => void; onScore: (pts: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [time, setTime] = useState(10);
  const [points, setPoints] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUESTIONS[idx];

  useEffect(() => {
    if (done || picked !== null) return;
    if (time === 0) { setPicked(-1); return; }
    const t = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [time, picked, done]);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setPoints((p) => p + Math.max(50, time * 20));
  };

  const next = () => {
    if (idx + 1 >= QUESTIONS.length) {
      setDone(true);
      onScore(points);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    setTime(10);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-md grid place-items-center p-4 animate-rise" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg glass rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-accent/30 blur-3xl" />
        <button onClick={onClose} className="absolute top-3 right-3 rounded-full glass p-2"><X className="size-4" /></button>

        {!done ? (
          <div className="relative space-y-5">
            <div className="flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-accent"><Zap className="size-3.5" /> Versículo Rápido</span>
              <span className="text-muted-foreground">Pregunta {idx + 1} de {QUESTIONS.length}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full gradient-faith transition-all" style={{ width: `${(time / 10) * 100}%` }} />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums w-12 justify-end">
                <Timer className="size-3.5 text-accent" /> {time}s
              </span>
            </div>

            <h2 className="text-xl font-bold leading-snug">{q.q}</h2>

            <div className="grid gap-2">
              {q.options.map((opt, i) => {
                const isCorrect = picked !== null && i === q.correct;
                const isWrong = picked === i && i !== q.correct;
                return (
                  <button
                    key={i}
                    onClick={() => choose(i)}
                    disabled={picked !== null}
                    className={`text-left rounded-2xl px-4 py-3 text-sm font-medium border transition flex items-center justify-between ${
                      isCorrect ? "bg-emerald-500/15 border-emerald-400 text-emerald-300"
                      : isWrong ? "bg-red-500/15 border-red-400 text-red-300"
                      : picked !== null ? "bg-secondary/40 border-border text-muted-foreground"
                      : "bg-secondary/40 border-border hover:border-accent/60 hover:bg-secondary/70"
                    }`}
                  >
                    <span>{opt}</span>
                    {isCorrect && <Check className="size-4" />}
                    {isWrong && <X className="size-4" />}
                  </button>
                );
              })}
            </div>

            {picked !== null && (
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="text-xs text-muted-foreground">
                  Referencia: <span className="font-semibold text-foreground">{q.ref}</span>
                </div>
                <button onClick={next} className="rounded-full gradient-faith px-5 py-2 text-sm font-semibold text-primary-foreground inline-flex items-center gap-1.5">
                  {idx + 1 >= QUESTIONS.length ? "Ver resultado" : "Siguiente"} <ChevronRight className="size-4" />
                </button>
              </div>
            )}

            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-accent" /> Puntos en esta partida: <span className="font-bold text-foreground tabular-nums">{points}</span>
            </div>
          </div>
        ) : (
          <div className="relative text-center space-y-4 py-4">
            <div className="mx-auto size-20 rounded-full gradient-faith grid place-items-center text-primary-foreground">
              <Trophy className="size-9" />
            </div>
            <h2 className="text-2xl font-black">¡Buen trabajo!</h2>
            <div className="text-muted-foreground text-sm">Sumaste a tu marcador</div>
            <div className="text-5xl font-black text-gradient-faith tabular-nums">+{points}</div>
            <div className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold">
              <Flame className="size-3.5" /> ¡Sigue así, racha activa!
            </div>
            <button onClick={onClose} className="w-full rounded-full gradient-faith py-3 text-sm font-semibold text-primary-foreground">
              Volver al lobby
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ComingSoon({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-md grid place-items-center p-4 animate-rise" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm glass rounded-3xl p-6 text-center relative">
        <button onClick={onClose} className="absolute top-3 right-3 rounded-full glass p-2"><X className="size-4" /></button>
        <div className="mx-auto size-14 rounded-2xl gradient-faith grid place-items-center text-primary-foreground mb-3">
          <Sparkles className="size-6" />
        </div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-sm text-muted-foreground mt-1">Pronto disponible. Te avisaremos cuando esté listo para jugar.</p>
        <button onClick={onClose} className="mt-4 w-full rounded-full glass py-2.5 text-sm font-semibold">Cerrar</button>
      </div>
    </div>
  );
}
