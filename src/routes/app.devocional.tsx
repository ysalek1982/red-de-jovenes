import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Flame, CheckCircle2, Circle, Sparkles, PenLine, Sun, Heart, BookOpen, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/app/devocional")({
  head: () => ({
    meta: [
      { title: "Devocional diario — Red de Jóvenes" },
      { name: "description", content: "Tu encuentro diario con Cristo: versículo, reflexión, oración y diario espiritual." },
    ],
  }),
  component: Devocional,
});

type Entry = { id: number; date: string; text: string };

const week = [
  { d: "L", date: 12, done: true },
  { d: "M", date: 13, done: true },
  { d: "M", date: 14, done: true },
  { d: "J", date: 15, done: true },
  { d: "V", date: 16, done: true, today: true },
  { d: "S", date: 17, done: false },
  { d: "D", date: 18, done: false },
];

const moodOptions = [
  { id: "gozo", label: "Gozo", emoji: "✨" },
  { id: "paz", label: "Paz", emoji: "🕊️" },
  { id: "ansiedad", label: "Ansiedad", emoji: "🌧️" },
  { id: "gratitud", label: "Gratitud", emoji: "🙏" },
  { id: "duda", label: "Duda", emoji: "🤔" },
  { id: "esperanza", label: "Esperanza", emoji: "🌅" },
];

const reflexion = [
  "¿Qué me dice este pasaje sobre quién es Dios?",
  "¿Qué me dice sobre quién soy yo en Cristo?",
  "¿Qué paso concreto puedo dar hoy en obediencia?",
];

function Devocional() {
  const [mood, setMood] = useState<string | null>(null);
  const [journal, setJournal] = useState("");
  const [entries, setEntries] = useState<Entry[]>([
    { id: 1, date: "14 may", text: "Hoy entendí que descansar en Dios no es debilidad, es confianza. Necesito soltar el control." },
    { id: 2, date: "13 may", text: "Oré por mi familia. Sentí paz al leer Filipenses 4:6-7." },
  ]);
  const [stepDone, setStepDone] = useState<Record<number, boolean>>({ 0: true });

  const streak = useMemo(() => week.filter((d) => d.done).length, []);

  const saveEntry = () => {
    if (!journal.trim()) return;
    const newE: Entry = { id: Date.now(), date: "hoy", text: journal.trim() };
    setEntries((e) => [newE, ...e]);
    setJournal("");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">Viernes 16 de mayo</p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mt-1">Devocional <span className="text-gradient-faith">de hoy</span></h1>
          <p className="text-muted-foreground mt-2 italic font-serif">“Acercaos a Dios, y él se acercará a vosotros.” — Santiago 4:8</p>
        </div>
        <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
          <div className="size-11 rounded-xl bg-accent/15 grid place-items-center text-accent"><Flame className="size-5" /></div>
          <div>
            <div className="text-2xl font-black leading-none">{streak} <span className="text-sm font-medium text-muted-foreground">días</span></div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">racha activa</div>
          </div>
        </div>
      </header>

      {/* Semana */}
      <section className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Esta semana</h2>
          <span className="text-xs text-muted-foreground">Mayo · 2026</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {week.map((d) => (
            <button
              key={d.date}
              className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 transition ${
                d.today ? "gradient-faith text-primary-foreground shadow-soft" : d.done ? "bg-teal/10 text-teal" : "bg-secondary/40 text-muted-foreground"
              }`}
            >
              <span className="text-[10px] uppercase tracking-widest opacity-80">{d.d}</span>
              <span className="text-lg font-bold">{d.date}</span>
              {d.done ? <CheckCircle2 className="size-3.5" /> : <Circle className="size-3.5" />}
            </button>
          ))}
        </div>
      </section>

      {/* Pasaje + reflexión */}
      <section className="grid lg:grid-cols-[1.6fr_1fr] gap-6">
        <article className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 shadow-soft">
          <div className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              <Sparkles className="size-3.5" /> Pasaje de hoy
            </div>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Filipenses 4:6-7</h2>
            <blockquote className="mt-5 font-serif italic text-lg md:text-xl leading-relaxed text-foreground/95 border-l-2 border-accent/60 pl-5">
              “Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias. Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.”
            </blockquote>
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-3">Reflexión guiada</h3>
              <ol className="space-y-2">
                {reflexion.map((q, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setStepDone((s) => ({ ...s, [i]: !s[i] }))}
                      className={`w-full flex items-start gap-3 text-left rounded-2xl p-3 border transition ${
                        stepDone[i] ? "bg-teal/10 border-teal/30" : "bg-background/30 border-border/50 hover:border-teal/40"
                      }`}
                    >
                      {stepDone[i] ? <CheckCircle2 className="size-5 text-teal shrink-0 mt-0.5" /> : <Circle className="size-5 text-muted-foreground shrink-0 mt-0.5" />}
                      <span className="text-sm">{q}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="rounded-full gradient-faith px-5 py-2 text-sm font-semibold text-primary-foreground inline-flex items-center gap-2">
                <CheckCircle2 className="size-4" /> Completar devocional
              </button>
              <button className="rounded-full glass px-4 py-2 text-sm inline-flex items-center gap-2">
                <BookOpen className="size-4" /> Leer contexto
              </button>
            </div>
          </div>
        </article>

        <div className="space-y-6">
          {/* Mood check */}
          <div className="glass rounded-3xl p-6">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="size-4 text-accent" />
              <h3 className="font-semibold">¿Cómo está tu corazón hoy?</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Dios conoce tu estado y te encuentra ahí.</p>
            <div className="grid grid-cols-3 gap-2">
              {moodOptions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMood(m.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 text-xs border transition ${
                    mood === m.id ? "gradient-faith text-primary-foreground border-transparent" : "bg-secondary/40 border-border/50 hover:border-teal/40"
                  }`}
                >
                  <span className="text-xl leading-none">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
            {mood && (
              <p className="mt-4 text-xs text-muted-foreground italic">
                Estaremos orando contigo. Recuerda: <span className="text-foreground font-medium">Él está cerca de los quebrantados de corazón.</span>
              </p>
            )}
          </div>

          {/* Oración del día */}
          <div className="rounded-3xl p-6 bg-gradient-to-br from-accent/15 via-transparent to-teal/15 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="size-4 text-accent" />
              <h3 className="font-semibold">Oración del día</h3>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 font-serif italic">
              Señor, hoy te entrego mis preocupaciones. Cambia mi ansiedad por tu paz. Enséñame a confiar incluso cuando no entiendo. En el nombre de Jesús, amén.
            </p>
            <button className="mt-4 rounded-full bg-accent/20 text-accent px-4 py-1.5 text-xs font-semibold">
              🤝 Oré esta oración (1,284)
            </button>
          </div>
        </div>
      </section>

      {/* Diario */}
      <section className="glass rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-1">
          <PenLine className="size-4 text-teal" />
          <h2 className="font-bold text-lg">Mi diario espiritual</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Escribe lo que Dios te está hablando. Solo tú lo ves.</p>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="Hoy siento que Dios me está mostrando..."
          rows={4}
          className="w-full rounded-2xl bg-background/40 border border-border p-4 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none font-serif"
        />
        <div className="mt-3 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">{journal.length} caracteres · privado 🔒</span>
          <button
            onClick={saveEntry}
            disabled={!journal.trim()}
            className="rounded-full gradient-faith px-5 py-2 text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="size-4" /> Guardar entrada
          </button>
        </div>

        {entries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Entradas anteriores</h3>
            <ul className="space-y-3">
              {entries.map((e) => (
                <li key={e.id} className="rounded-2xl bg-background/30 border border-border/50 p-4 flex gap-3 group">
                  <div className="shrink-0 text-[10px] uppercase tracking-widest text-accent font-bold w-14">{e.date}</div>
                  <p className="text-sm flex-1 font-serif italic text-foreground/90">{e.text}</p>
                  <button
                    onClick={() => setEntries((all) => all.filter((x) => x.id !== e.id))}
                    className="opacity-0 group-hover:opacity-100 transition text-muted-foreground hover:text-destructive"
                    aria-label="Eliminar entrada"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
