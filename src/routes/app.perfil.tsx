import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Flame, Heart, Award, Sparkles, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/perfil")({ component: Perfil });

const badges = [
  { name: "Guerrero de Oración", icon: HandIcon, color: "from-teal to-sky-500" },
  { name: "Maestro de la Biblia", icon: BookOpen, color: "from-accent to-orange-500" },
  { name: "Misionero Digital", icon: Sparkles, color: "from-violet-500 to-purple-600" },
  { name: "Corazón Servicial", icon: Heart, color: "from-pink-500 to-rose-500" },
];

function HandIcon(props: any) { return <Award {...props} />; }

const timeline = [
  { date: "May 2026", title: "Bautismo en el Espíritu", desc: "Una noche que cambió todo." },
  { date: "Mar 2026", title: "Lideré mi primer grupo", desc: "Discipulado con 5 amigos." },
  { date: "Ene 2026", title: "100 días de Biblia", desc: "Completé el reto de lectura." },
  { date: "Nov 2025", title: "Misión en barrio", desc: "Servicio a comedor La Esperanza." },
];

function Perfil() {
  return (
    <div className="space-y-6">
      {/* Banner + avatar */}
      <div className="relative">
        <div className="h-44 md:h-56 rounded-3xl gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 grid place-items-center text-white/80 text-xl md:text-2xl italic font-light px-6 text-center">
            “Todo lo puedo en Cristo que me fortalece.” — Fil 4:13
          </div>
          <div className="absolute -top-20 -right-20 size-80 rounded-full bg-accent/30 blur-3xl" />
        </div>
        <div className="absolute -bottom-12 left-6 size-24 md:size-28 rounded-3xl gradient-faith grid place-items-center text-3xl font-black text-primary-foreground border-4 border-background shadow-soft">
          JD
        </div>
      </div>

      <div className="pt-14 px-2 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-black">Juan David</h1>
          <p className="text-sm text-muted-foreground">@juandavid · Iglesia Renacer · Buenos Aires</p>
          <p className="mt-2 text-sm max-w-md">Joven en proceso, soñador, amante de la guitarra y los versículos subrayados ✝️</p>
        </div>
        <button className="rounded-full glass px-5 py-2 text-sm font-semibold">Editar perfil</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Flame, label: "Días seguidos", value: "23", c: "text-accent" },
          { icon: Users, label: "Amigos en Cristo", value: "312", c: "text-teal" },
          { icon: BookOpen, label: "Versículos guardados", value: "87", c: "text-accent" },
          { icon: Calendar, label: "Eventos asistidos", value: "14", c: "text-teal" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <s.icon className={`size-5 ${s.c}`} />
            <div className="mt-3 text-2xl font-black tabular-nums">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-4">Insignias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div key={b.name} className="text-center">
              <div className={`mx-auto size-16 rounded-2xl bg-gradient-to-br ${b.color} grid place-items-center text-primary-foreground shadow-soft`}>
                <b.icon className="size-7" />
              </div>
              <div className="mt-2 text-xs font-semibold">{b.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-5">Mi viaje de fe</h2>
        <ol className="relative border-l-2 border-teal/30 space-y-5 pl-5">
          {timeline.map((t) => (
            <li key={t.title} className="relative">
              <div className="absolute -left-[27px] top-1 size-3 rounded-full gradient-faith ring-4 ring-background" />
              <div className="text-xs text-accent font-semibold uppercase tracking-wider">{t.date}</div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-muted-foreground">{t.desc}</div>
            </li>
          ))}
        </ol>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-3">Mis comunidades</h2>
        <div className="flex flex-wrap gap-2">
          {["Renacer Joven", "Estudios Romanos", "Misiones LATAM", "Guitarristas en Cristo"].map((c) => (
            <span key={c} className="rounded-full glass px-4 py-2 text-sm">{c}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
