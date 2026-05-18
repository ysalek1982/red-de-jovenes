import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { HandHeart, Send, Sparkles, Heart, Users, Globe2, Eye, EyeOff, Wind, Flame, Plus } from "lucide-react";

export const Route = createFileRoute("/app/orar")({ component: Orar });

type Tag = "Petición" | "Alabanza" | "Apoyo";
type Msg = { id: number; user: string; text: string; time: string; tag: Tag; prayers: number; iPrayed?: boolean; anon?: boolean };

const initialMessages: Msg[] = [
  { id: 1, user: "Sara P.", text: "Por mi mamá, está enferma. Gracias 🙏", time: "12:01", tag: "Petición", prayers: 28 },
  { id: 2, user: "Anónimo", text: "Por sabiduría para una decisión grande esta semana.", time: "12:03", tag: "Petición", prayers: 41, anon: true },
  { id: 3, user: "Mateo A.", text: "¡Dios respondió! Conseguí trabajo. Gloria a Él 🎉", time: "12:05", tag: "Alabanza", prayers: 87 },
  { id: 4, user: "Lucía R.", text: "Por todos los jóvenes que luchan con ansiedad. Fil 4:6-7", time: "12:07", tag: "Petición", prayers: 154 },
  { id: 5, user: "Camila P.", text: "Estoy orando ahora mismo por todos ustedes 💙", time: "12:08", tag: "Apoyo", prayers: 32 },
];

const wall = [
  { name: "Diego M.", req: "Por la salud de mi abuelo." },
  { name: "Anónimo", req: "Para superar una crisis de fe." },
  { name: "Valentina", req: "Por mis estudios este semestre." },
  { name: "Joaquín", req: "Por mi familia, hay mucha tensión." },
];

const tagStyles: Record<Tag, string> = {
  "Petición": "bg-secondary text-muted-foreground",
  "Alabanza": "bg-accent/15 text-accent",
  "Apoyo": "bg-teal/15 text-teal",
};

function Orar() {
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [tag, setTag] = useState<Tag>("Petición");
  const [anon, setAnon] = useState(false);
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"in" | "hold" | "out">("in");
  const [breathCount, setBreathCount] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Breathing cycle: 4s in, 4s hold, 6s out
  useEffect(() => {
    if (!breathing) return;
    const seq: Array<{ p: "in" | "hold" | "out"; ms: number }> = [
      { p: "in", ms: 4000 }, { p: "hold", ms: 4000 }, { p: "out", ms: 6000 },
    ];
    let i = 0;
    setBreathPhase("in");
    const tick = () => {
      const { p, ms } = seq[i % seq.length];
      setBreathPhase(p);
      if (p === "out") setBreathCount((c) => c + 1);
      i++;
      timer = setTimeout(tick, ms);
    };
    let timer = setTimeout(tick, seq[0].ms);
    return () => clearTimeout(timer);
  }, [breathing]);

  const send = () => {
    if (!draft.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), user: anon ? "Anónimo" : "Tú", text: draft.trim(), time, tag, prayers: 0, anon },
    ]);
    setDraft("");
  };

  const pray = (id: number) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, iPrayed: !m.iPrayed, prayers: m.prayers + (m.iPrayed ? -1 : 1) } : m))
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Sala de oración</h1>
          <p className="text-muted-foreground">Un espacio sagrado para orar juntos.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="glass rounded-full px-3 py-1.5 inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" /> En vivo · 1,247 jóvenes
          </span>
          <span className="glass rounded-full px-3 py-1.5 inline-flex items-center gap-1.5">
            <Globe2 className="size-3.5 text-teal" /> 47 países
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Live room */}
        <div className="glass rounded-3xl flex flex-col h-[68vh] overflow-hidden">
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-teal" />
              <span className="text-sm font-semibold">Sala global</span>
              <span className="text-xs text-muted-foreground">· solo peticiones y alabanzas</span>
            </div>
            <div className="glass rounded-full p-0.5 flex text-[11px] font-semibold">
              {(["Petición", "Alabanza", "Apoyo"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-3 py-1.5 rounded-full transition ${tag === t ? "gradient-faith text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto space-y-3 p-4">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-3 animate-rise">
                <div className={`size-9 rounded-full grid place-items-center text-primary-foreground font-bold text-sm shrink-0 ${m.anon ? "bg-secondary text-muted-foreground" : "bg-gradient-to-br from-teal to-accent"}`}>
                  {m.anon ? <EyeOff className="size-4" /> : m.user[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="font-semibold">{m.user}</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${tagStyles[m.tag]}`}>{m.tag}</span>
                    <span className="text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-sm mt-1 leading-relaxed">{m.text}</p>
                  <div className="mt-1.5 flex items-center gap-3">
                    <button
                      onClick={() => pray(m.id)}
                      className={`inline-flex items-center gap-1 text-xs font-semibold transition ${m.iPrayed ? "text-accent" : "text-teal hover:text-accent"}`}
                    >
                      <HandHeart className={`size-3.5 ${m.iPrayed ? "fill-current" : ""}`} />
                      {m.iPrayed ? "Estás orando" : "Estoy orando"}
                      <span className={`ml-1 tabular-nums ${m.iPrayed ? "text-accent" : "text-muted-foreground"}`}>· {m.prayers}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <div className="border-t border-border/50 p-3 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Publicar como:</span>
              <button
                onClick={() => setAnon(false)}
                className={`rounded-full px-3 py-1 inline-flex items-center gap-1 font-semibold transition ${!anon ? "gradient-faith text-primary-foreground" : "glass text-muted-foreground"}`}
              >
                <Eye className="size-3" /> Tú
              </button>
              <button
                onClick={() => setAnon(true)}
                className={`rounded-full px-3 py-1 inline-flex items-center gap-1 font-semibold transition ${anon ? "gradient-faith text-primary-foreground" : "glass text-muted-foreground"}`}
              >
                <EyeOff className="size-3" /> Anónimo
              </button>
              <span className="ml-auto text-muted-foreground">Etiqueta: <span className="text-foreground font-semibold">{tag}</span></span>
            </div>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder={`Comparte tu ${tag.toLowerCase()}...`}
                className="flex-1 rounded-full bg-secondary/50 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={send}
                disabled={!draft.trim()}
                className="rounded-full gradient-faith px-4 py-2.5 text-primary-foreground disabled:opacity-40 transition"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Aside */}
        <aside className="space-y-5">
          {/* Breathing prayer */}
          <div className="glass rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-teal/30 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-teal font-semibold">
                <Wind className="size-3.5" /> Oración respirada
              </div>
              <div className="mt-4 grid place-items-center h-40">
                <div className="relative size-32">
                  <div
                    className="absolute inset-0 rounded-full gradient-faith opacity-60 transition-all ease-in-out"
                    style={{
                      transform: !breathing ? "scale(0.6)" : breathPhase === "in" ? "scale(1)" : breathPhase === "hold" ? "scale(1)" : "scale(0.55)",
                      transitionDuration: !breathing ? "600ms" : breathPhase === "in" ? "4000ms" : breathPhase === "hold" ? "4000ms" : "6000ms",
                      filter: "blur(2px)",
                    }}
                  />
                  <div className="absolute inset-0 grid place-items-center text-center">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-foreground/80 font-semibold">
                        {!breathing ? "Listo" : breathPhase === "in" ? "Inhala" : breathPhase === "hold" ? "Sostén" : "Exhala"}
                      </div>
                      {breathing && <div className="text-[10px] text-muted-foreground mt-0.5">Ciclo {breathCount + 1}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => { setBreathing((b) => !b); if (breathing) setBreathCount(0); }}
                className="mt-2 w-full rounded-full gradient-faith py-2 text-sm font-semibold text-primary-foreground"
              >
                {breathing ? "Terminar" : "Comenzar 3 min"}
              </button>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">
                Inhala Su paz · sostén Su nombre · exhala tu carga
              </p>
            </div>
          </div>

          {/* Oración del día */}
          <div className="glass rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-accent/30 blur-2xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-semibold">
                <Sparkles className="size-3.5" /> Oración del día
              </div>
              <p className="mt-3 text-sm leading-relaxed font-serif-display text-base">
                Padre, hoy entrego mis cargas. Llena mi corazón de Tu paz, mis labios de Tu nombre y mis manos de Tu obra. En el nombre de Jesús, amén.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Flame className="size-3.5 text-accent" /> 8,124 jóvenes oraron hoy
              </div>
            </div>
          </div>

          {/* Muro "Ora por mí" */}
          <div className="glass rounded-3xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm inline-flex items-center gap-2"><Heart className="size-4 text-pink-400" /> Ora por mí</h3>
              <button className="text-xs text-accent font-semibold inline-flex items-center gap-1"><Plus className="size-3" /> Compartir</button>
            </div>
            <ul className="space-y-3 text-sm">
              {wall.map((w, i) => (
                <li key={i} className="rounded-2xl bg-secondary/40 p-3">
                  <div className="text-xs text-muted-foreground mb-1">{w.name}</div>
                  <div className="text-sm">{w.req}</div>
                  <button className="mt-2 text-[11px] inline-flex items-center gap-1 text-teal font-semibold hover:text-accent">
                    <HandHeart className="size-3" /> Orar por esto
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
