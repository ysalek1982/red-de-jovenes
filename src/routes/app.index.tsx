import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, Flame, Plus } from "lucide-react";
import bibleStudy from "@/assets/bible-study.jpg";

export const Route = createFileRoute("/app/")({
  component: Inicio,
});

const stories = [
  { name: "Tu historia", you: true },
  { name: "Lucía", color: "from-pink-400 to-rose-500" },
  { name: "Mateo", color: "from-teal to-blue-500" },
  { name: "Sara", color: "from-amber-400 to-orange-500" },
  { name: "Juan", color: "from-violet-400 to-purple-600" },
  { name: "Ana", color: "from-emerald-400 to-teal-500" },
  { name: "Iglesia C.", color: "from-sky-400 to-indigo-500" },
];

const posts = [
  {
    user: "Lucía Romero", handle: "@lucia.fe", time: "hace 2h",
    text: "Hoy Dios me recordó que su tiempo es perfecto. Llevaba meses orando por algo y hoy entendí el porqué de la espera 🙌",
    tag: "Testimonio", likes: 124, comments: 18,
  },
  {
    user: "Grupo Joven Renacer", handle: "@renacer", time: "hace 5h",
    text: "¡Esta noche estudio bíblico sobre Romanos 8! Vení, traé un amig@ y unas ganas grandes de aprender. 📖✨",
    tag: "Evento", image: bibleStudy, likes: 312, comments: 47,
  },
  {
    user: "Mateo Álvarez", handle: "@mati", time: "hace 1d",
    text: "Petición de oración: mi abuela está internada. Confío en Cristo. Gracias por orar conmigo 🙏",
    tag: "Oración", likes: 489, comments: 92,
  },
];

function Inicio() {
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  const [draft, setDraft] = useState("");
  const toggleLike = (i: number) => setLiked((p) => ({ ...p, [i]: !p[i] }));
  const toggleSave = (i: number) => setSaved((p) => ({ ...p, [i]: !p[i] }));

  return (
    <div className="grid lg:grid-cols-[1fr_320px] gap-8">
      <div className="space-y-6 min-w-0">
        {/* Devocional */}
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 shadow-soft">
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-teal/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
              <Sparkles className="size-3.5" /> Devocional del día
            </div>
            <p className="mt-4 text-2xl md:text-3xl font-bold leading-snug">
              “Confía en el Señor de todo corazón, y no en tu propia inteligencia.”
            </p>
            <p className="mt-2 text-sm text-white/70">Proverbios 3:5</p>
            <p className="mt-4 text-sm text-white/80 max-w-xl">
              Cuando soltamos el control y descansamos en Su sabiduría, el camino se abre. Hoy: pausa 5 minutos, respira y entrega lo que pesa.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="rounded-full bg-white text-ocean px-5 py-2.5 text-sm font-semibold hover:scale-105 transition">Meditar</button>
              <button className="rounded-full glass px-5 py-2.5 text-sm font-semibold">Compartir</button>
            </div>
          </div>
        </div>

        {/* Stories */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {stories.map((s) => (
            <button key={s.name} className="shrink-0 flex flex-col items-center gap-2">
              <div className={`size-16 rounded-full p-[2px] ${s.you ? "bg-border" : "bg-gradient-to-br " + s.color}`}>
                <div className="size-full rounded-full bg-background grid place-items-center">
                  {s.you ? <Plus className="size-5 text-muted-foreground" /> : <span className="font-bold text-sm">{s.name[0]}</span>}
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground max-w-[64px] truncate">{s.name}</span>
            </button>
          ))}
        </div>

        {/* Composer */}
        <div className="glass rounded-3xl p-4 flex gap-3">
          <div className="size-10 rounded-full gradient-faith grid place-items-center text-primary-foreground font-bold">JD</div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="¿Qué te enseñó Dios hoy?"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <button
            onClick={() => setDraft("")}
            disabled={!draft.trim()}
            className="rounded-full gradient-faith px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            Publicar
          </button>
        </div>

        {/* Feed */}
        {posts.map((p, i) => {
          const isLiked = liked[i];
          const isSaved = saved[i];
          return (
          <article key={i} className="glass rounded-3xl p-5 hover:border-teal/30 transition">
            <header className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-gradient-to-br from-teal to-accent grid place-items-center font-bold text-primary-foreground">
                {p.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">{p.user}</span>
                  <span className="text-xs text-muted-foreground">{p.handle} · {p.time}</span>
                </div>
                <span className="inline-block mt-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/15 text-accent font-semibold">
                  {p.tag}
                </span>
              </div>
            </header>
            <p className="mt-3 text-sm leading-relaxed">{p.text}</p>
            {p.image && (
              <img src={p.image} alt="" className="mt-3 w-full aspect-[4/3] object-cover rounded-2xl" loading="lazy" width={1024} height={768} />
            )}
            <footer className="mt-4 flex items-center gap-5 text-sm text-muted-foreground">
              <button
                onClick={() => toggleLike(i)}
                className={`inline-flex items-center gap-1.5 transition ${isLiked ? "text-accent" : "hover:text-accent"}`}
              >
                <Heart className={`size-4 ${isLiked ? "fill-current" : ""}`} /> {p.likes + (isLiked ? 1 : 0)}
              </button>
              <button className="inline-flex items-center gap-1.5 hover:text-teal transition">
                <MessageCircle className="size-4" /> {p.comments}
              </button>
              <button className="inline-flex items-center gap-1.5 hover:text-foreground transition">
                <Share2 className="size-4" />
              </button>
              <button
                onClick={() => toggleSave(i)}
                className={`ml-auto inline-flex items-center gap-1.5 transition ${isSaved ? "text-amber-400" : "hover:text-foreground"}`}
              >
                <Bookmark className={`size-4 ${isSaved ? "fill-current" : ""}`} />
              </button>
            </footer>
          </article>
          );
        })}
      </div>

      {/* Right rail */}
      <aside className="hidden lg:flex flex-col gap-5 sticky top-20 self-start">
        <div className="glass rounded-3xl p-5">
          <div className="flex items-center gap-2 text-accent font-semibold text-sm">
            <Flame className="size-4" /> Tu racha
          </div>
          <div className="mt-3 text-4xl font-black text-gradient-faith">23 días</div>
          <p className="text-xs text-muted-foreground mt-1">leyendo la Biblia. ¡Sigue!</p>
          <div className="mt-4 grid grid-cols-7 gap-1.5">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-md bg-teal/30" style={{ opacity: 0.4 + (i / 30) }} />
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold mb-3">Versículos guardados</h3>
          <ul className="space-y-3 text-sm">
            <li className="text-muted-foreground italic">“Jehová es mi pastor...” <span className="not-italic text-accent">Sal 23:1</span></li>
            <li className="text-muted-foreground italic">“Sed fuertes y valientes...” <span className="not-italic text-accent">Jos 1:9</span></li>
            <li className="text-muted-foreground italic">“No temas, yo estoy contigo.” <span className="not-italic text-accent">Is 41:10</span></li>
          </ul>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="font-semibold mb-3">Sugerencias</h3>
          <ul className="space-y-3 text-sm">
            {["Camila P.", "Joven CCB", "Pastor Diego"].map((n) => (
              <li key={n} className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-secondary grid place-items-center font-bold text-xs">{n[0]}</div>
                <span className="flex-1">{n}</span>
                <button className="text-xs rounded-full gradient-faith px-3 py-1 text-primary-foreground font-semibold">Seguir</button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
