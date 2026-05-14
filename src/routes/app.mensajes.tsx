import { createFileRoute } from "@tanstack/react-router";
import { Send, Search, Phone, Video, MoreVertical, Sparkles, Plus, Smile, BookOpen } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/mensajes")({ component: Mensajes });

const chats = [
  { id: 1, name: "Lucía Romero", last: "Ese versículo me llegó 🙏", time: "12:14", unread: 2, online: true, color: "from-pink-400 to-rose-500" },
  { id: 2, name: "Grupo Renacer Joven", last: "Mateo: nos vemos a las 19h", time: "11:50", unread: 5, group: true, color: "from-teal to-sky-500" },
  { id: 3, name: "Mateo Álvarez", last: "Estoy orando por vos hermano", time: "10:22", online: true, color: "from-amber-400 to-orange-500" },
  { id: 4, name: "Discipulado Romanos", last: "Sara compartió un audio", time: "ayer", group: true, color: "from-violet-500 to-purple-600" },
  { id: 5, name: "Pastor Daniel", last: "Bendiciones, hablamos mañana", time: "ayer", color: "from-emerald-400 to-teal" },
  { id: 6, name: "Camila P.", last: "¡Gracias por la oración!", time: "lun", color: "from-sky-400 to-indigo-500" },
];

const thread = [
  { from: "them", text: "Hey! ¿Cómo va todo? ✨", time: "12:08" },
  { from: "me", text: "Bien, justo terminando el devocional. ¿Vos?", time: "12:09" },
  { from: "them", text: "Leyendo Romanos 8. Mira esto:", time: "12:11" },
  { from: "them", verse: { ref: "Romanos 8:28", text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien..." }, time: "12:11" },
  { from: "me", text: "Ese versículo me llegó 🙏 justo lo necesitaba hoy", time: "12:14" },
];

function Mensajes() {
  const [active, setActive] = useState(1);
  const chat = chats.find((c) => c.id === active)!;

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Mensajes</h1>
          <p className="text-muted-foreground">Conversaciones que edifican.</p>
        </div>
        <button className="rounded-full gradient-faith px-5 py-2.5 text-sm font-semibold text-primary-foreground inline-flex items-center gap-2">
          <Plus className="size-4" /> Nuevo
        </button>
      </header>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[70vh]">
        {/* Lista */}
        <aside className="glass rounded-3xl p-3 flex flex-col overflow-hidden">
          <div className="relative px-1 pb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input placeholder="Buscar..." className="w-full rounded-full bg-secondary/50 border border-border pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <ul className="flex-1 overflow-y-auto space-y-1 pr-1">
            {chats.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setActive(c.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition ${active === c.id ? "gradient-faith text-primary-foreground" : "hover:bg-white/5"}`}
                >
                  <div className="relative shrink-0">
                    <div className={`size-11 rounded-full bg-gradient-to-br ${c.color} grid place-items-center text-primary-foreground font-bold`}>
                      {c.name[0]}
                    </div>
                    {c.online && <span className="absolute bottom-0 right-0 size-3 rounded-full bg-emerald-400 ring-2 ring-background" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate">{c.name}</span>
                      <span className={`text-[10px] ${active === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.time}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs truncate ${active === c.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{c.last}</span>
                      {c.unread && <span className="text-[10px] font-bold rounded-full bg-accent text-accent-foreground px-1.5 min-w-[18px] text-center">{c.unread}</span>}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Conversación */}
        <section className="glass rounded-3xl flex flex-col overflow-hidden">
          <header className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
            <div className={`size-10 rounded-full bg-gradient-to-br ${chat.color} grid place-items-center text-primary-foreground font-bold`}>
              {chat.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{chat.name}</div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1">
                {chat.online ? <><span className="size-1.5 rounded-full bg-emerald-400" /> En línea</> : "Visto hace 1h"}
              </div>
            </div>
            <button className="rounded-full glass p-2 hover:bg-white/10"><Phone className="size-4" /></button>
            <button className="rounded-full glass p-2 hover:bg-white/10"><Video className="size-4" /></button>
            <button className="rounded-full glass p-2 hover:bg-white/10"><MoreVertical className="size-4" /></button>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {thread.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "me" ? "gradient-faith text-primary-foreground rounded-br-sm" : "bg-secondary/70 rounded-bl-sm"}`}>
                  {m.text && <p>{m.text}</p>}
                  {m.verse && (
                    <div className="rounded-xl bg-ocean/40 border border-teal/30 p-3 max-w-xs">
                      <div className="inline-flex items-center gap-1 text-xs font-bold text-teal"><BookOpen className="size-3" /> {m.verse.ref}</div>
                      <p className="text-xs text-foreground/90 mt-1 italic">"{m.verse.text}"</p>
                    </div>
                  )}
                  <div className={`text-[10px] mt-1 ${m.from === "me" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{m.time}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-center">
              <span className="rounded-full glass px-3 py-1 text-[10px] text-accent font-semibold inline-flex items-center gap-1">
                <Sparkles className="size-3" /> Conversación protegida · sé luz en tus palabras
              </span>
            </div>
          </div>

          <footer className="px-3 py-3 border-t border-border/50 flex items-center gap-2">
            <button className="rounded-full glass p-2.5 hover:bg-white/10"><BookOpen className="size-4" /></button>
            <button className="rounded-full glass p-2.5 hover:bg-white/10"><Smile className="size-4" /></button>
            <input placeholder="Escribí un mensaje..." className="flex-1 rounded-full bg-secondary/50 border border-border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40" />
            <button className="rounded-full gradient-faith p-2.5 text-primary-foreground"><Send className="size-4" /></button>
          </footer>
        </section>
      </div>
    </div>
  );
}
