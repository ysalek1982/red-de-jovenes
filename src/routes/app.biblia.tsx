import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Bookmark, Highlighter, Share2, Search, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/biblia")({ component: Biblia });

const plans = [
  { title: "21 días en los Salmos", days: 21, progress: 12, color: "from-teal to-sky-500" },
  { title: "Jesús en los Evangelios", days: 40, progress: 8, color: "from-accent to-orange-500" },
  { title: "Fe en acción · Santiago", days: 14, progress: 14, color: "from-emerald-400 to-teal", done: true },
  { title: "Identidad en Cristo", days: 30, progress: 3, color: "from-violet-500 to-purple-600" },
];

const verses = [
  { ref: "Juan 3:16", text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito..." },
  { ref: "Jeremías 29:11", text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz..." },
  { ref: "Romanos 8:28", text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien..." },
];

const books = ["Génesis","Éxodo","Levítico","Números","Salmos","Proverbios","Mateo","Marcos","Lucas","Juan","Hechos","Romanos","1 Cor","Apocalipsis"];

function Biblia() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Biblia</h1>
          <p className="text-muted-foreground">Tu Palabra es lámpara a mis pies. — Salmo 119:105</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input placeholder="Buscar versículo o palabra..." className="w-full rounded-full bg-secondary/50 border border-border pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </header>

      {/* Lectura del día */}
      <article className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 shadow-soft">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <Sparkles className="size-3.5" /> Lectura de hoy
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold">Salmo 23 — El Señor es mi pastor</h2>
          <p className="mt-4 max-w-2xl text-foreground/90 leading-relaxed">
            “Jehová es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar; junto a aguas de reposo me pastoreará. Confortará mi alma; me guiará por sendas de justicia por amor de su nombre...”
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <button className="rounded-full gradient-faith px-5 py-2 text-sm font-semibold text-primary-foreground inline-flex items-center gap-2"><CheckCircle2 className="size-4" /> Marcar como leído</button>
            <button className="rounded-full glass px-4 py-2 text-sm inline-flex items-center gap-2"><Highlighter className="size-4" /> Subrayar</button>
            <button className="rounded-full glass px-4 py-2 text-sm inline-flex items-center gap-2"><Bookmark className="size-4" /> Guardar</button>
            <button className="rounded-full glass px-4 py-2 text-sm inline-flex items-center gap-2"><Share2 className="size-4" /> Compartir</button>
          </div>
        </div>
      </article>

      {/* Planes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Tus planes</h2>
          <button className="text-sm text-accent font-semibold">+ Nuevo plan</button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {plans.map((p) => {
            const pct = Math.round((p.progress / p.days) * 100);
            return (
              <div key={p.title} className="glass rounded-3xl p-5 group hover:-translate-y-0.5 transition">
                <div className="flex items-start gap-4">
                  <div className={`size-12 rounded-2xl bg-gradient-to-br ${p.color} grid place-items-center text-primary-foreground shrink-0`}>
                    <BookOpen className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{p.title}</h3>
                      {p.done && <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">Completado</span>}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.progress} / {p.days} días</div>
                    <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${p.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Versículos guardados */}
      <section>
        <h2 className="text-xl font-bold mb-4">Versículos guardados</h2>
        <div className="space-y-3">
          {verses.map((v) => (
            <div key={v.ref} className="glass rounded-2xl p-4 flex gap-3 items-start">
              <Bookmark className="size-5 text-accent shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-bold text-teal">{v.ref}</div>
                <p className="text-sm text-muted-foreground mt-0.5">{v.text}</p>
              </div>
              <button className="text-xs text-muted-foreground hover:text-foreground"><Share2 className="size-4" /></button>
            </div>
          ))}
        </div>
      </section>

      {/* Libros rápidos */}
      <section>
        <h2 className="text-xl font-bold mb-4">Explorar libros</h2>
        <div className="flex flex-wrap gap-2">
          {books.map((b) => (
            <button key={b} className="rounded-full glass px-4 py-2 text-sm hover:bg-white/10 inline-flex items-center gap-1.5">
              {b} <ChevronRight className="size-3.5 text-muted-foreground" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
