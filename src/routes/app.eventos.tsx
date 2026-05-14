import { createFileRoute } from "@tanstack/react-router";
import { Calendar, MapPin, Users, Plus, Video } from "lucide-react";

export const Route = createFileRoute("/app/eventos")({ component: Eventos });

const events = [
  { d: "12", m: "JUN", title: "Noche de Alabanza", place: "Iglesia Renacer · CABA", attendees: 142, type: "Alabanza", color: "from-teal to-sky-500" },
  { d: "15", m: "JUN", title: "Estudio Bíblico: Romanos", place: "Online · Zoom", attendees: 87, type: "Estudio", color: "from-accent to-orange-500", live: true },
  { d: "22", m: "JUN", title: "Salida de Servicio", place: "Comedor La Esperanza", attendees: 36, type: "Misión", color: "from-emerald-400 to-teal" },
  { d: "30", m: "JUN", title: "Campamento de Invierno", place: "Sierras de Córdoba", attendees: 215, type: "Campamento", color: "from-violet-400 to-purple-600" },
  { d: "05", m: "JUL", title: "Café & Testimonios", place: "Café Galileo", attendees: 24, type: "Comunidad", color: "from-pink-400 to-rose-500" },
];

function Eventos() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">Vive la fe en comunidad. Reuniones, retiros y misiones.</p>
        </div>
        <button className="rounded-full gradient-faith px-5 py-2.5 text-sm font-semibold text-primary-foreground inline-flex items-center gap-2 hover:scale-105 transition">
          <Plus className="size-4" /> Crear evento
        </button>
      </header>

      {/* Mini calendar */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Junio 2026</h2>
          <div className="flex gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-teal" /> Estudio</span>
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-accent" /> Servicio</span>
            <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-pink-400" /> Comunidad</span>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center text-xs">
          {["L","M","X","J","V","S","D"].map((d) => <div key={d} className="text-muted-foreground font-semibold">{d}</div>)}
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const has = [12, 15, 22, 30].includes(day);
            return (
              <div key={i} className={`aspect-square rounded-xl grid place-items-center text-sm ${has ? "gradient-faith text-primary-foreground font-bold" : "bg-secondary/40 text-muted-foreground"}`}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Próximos</h2>
        {events.map((e) => (
          <div key={e.title} className="glass rounded-3xl p-5 flex gap-5 items-center hover:-translate-y-0.5 transition">
            <div className={`shrink-0 size-20 rounded-2xl bg-gradient-to-br ${e.color} grid place-items-center text-primary-foreground`}>
              <div className="text-center">
                <div className="text-2xl font-black leading-none">{e.d}</div>
                <div className="text-xs uppercase tracking-wider">{e.m}</div>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-lg truncate">{e.title}</h3>
                {e.live && <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full"><Video className="size-3" /> En vivo</span>}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-3 flex-wrap mt-1">
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" /> {e.place}</span>
                <span className="inline-flex items-center gap-1"><Users className="size-3.5" /> {e.attendees}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="size-3.5" /> {e.type}</span>
              </div>
            </div>
            <button className="hidden sm:inline-block rounded-full glass px-5 py-2 text-sm font-semibold hover:bg-white/10">Asistiré</button>
          </div>
        ))}
      </div>
    </div>
  );
}
