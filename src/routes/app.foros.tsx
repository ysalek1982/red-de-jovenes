import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare, BookOpen, Flame, Heart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/foros")({ component: Foros });

const cats = [
  { name: "Vida Diaria", count: 312, color: "from-teal to-sky-500" },
  { name: "Fe y Cultura", count: 187, color: "from-accent to-orange-500" },
  { name: "Preguntas Bíblicas", count: 421, color: "from-violet-500 to-purple-600" },
  { name: "Testimonios", count: 256, color: "from-pink-500 to-rose-500" },
  { name: "Misiones", count: 94, color: "from-emerald-400 to-teal" },
  { name: "Relaciones", count: 178, color: "from-rose-400 to-red-500" },
];

const threads = [
  {
    cat: "Preguntas Bíblicas",
    title: "¿Cómo entender el Antiguo Testamento desde la cruz?",
    verses: ["Lucas 24:27", "Hebreos 10:1"],
    author: "Mateo A.", replies: 47, hearts: 132, hot: true,
  },
  {
    cat: "Vida Diaria",
    title: "Estudiar la carrera vs. ir a misiones — ¿cómo discernir?",
    verses: ["Proverbios 3:5-6", "Romanos 12:2"],
    author: "Sara P.", replies: 28, hearts: 96,
  },
  {
    cat: "Relaciones",
    title: "Noviazgo con propósito: lo que aprendí en 2 años",
    verses: ["1 Corintios 13:4-7", "Eclesiastés 3:1"],
    author: "Lucía R.", replies: 89, hearts: 412, hot: true,
  },
  {
    cat: "Testimonios",
    title: "Dios me sacó de la ansiedad — esto fue lo que pasó",
    verses: ["Filipenses 4:6-7"],
    author: "Diego M.", replies: 64, hearts: 280,
  },
];

function Foros() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black tracking-tight">Foros</h1>
        <p className="text-muted-foreground">Debates anclados en la Palabra. Profundos, sanos y reales.</p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cats.map((c) => (
          <button key={c.name} className={`glass rounded-2xl p-4 text-left hover:-translate-y-0.5 transition group`}>
            <div className={`size-10 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-primary-foreground mb-3`}>
              <MessageSquare className="size-5" />
            </div>
            <div className="font-semibold text-sm">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.count} hilos</div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Tendencias</h2>
          <button className="text-sm text-accent font-semibold">+ Nuevo debate</button>
        </div>

        {threads.map((t, i) => (
          <article key={i} className="glass rounded-3xl p-5 hover:border-teal/40 transition">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-accent font-semibold uppercase tracking-wider">{t.cat}</span>
              {t.hot && <span className="inline-flex items-center gap-1 text-orange-400 font-semibold"><Flame className="size-3" /> Tendencia</span>}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug">{t.title}</h3>

            <div className="mt-3 rounded-2xl bg-ocean/30 border border-teal/20 p-3 flex items-start gap-2">
              <Sparkles className="size-4 text-teal shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="text-teal font-semibold mb-1">Anclado en la Palabra</div>
                <div className="flex flex-wrap gap-2">
                  {t.verses.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-2.5 py-0.5 text-teal font-medium">
                      <BookOpen className="size-3" /> {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <footer className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span>por <span className="text-foreground font-medium">{t.author}</span></span>
              <span className="inline-flex items-center gap-1"><MessageSquare className="size-4" /> {t.replies}</span>
              <span className="inline-flex items-center gap-1"><Heart className="size-4" /> {t.hearts}</span>
              <button className="ml-auto rounded-full glass px-4 py-1.5 text-xs font-semibold hover:bg-white/10">Abrir</button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
