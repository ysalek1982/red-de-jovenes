import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Heart, Users, Calendar, MessageCircle, CheckCircle2, Star, MapPin, Filter } from "lucide-react";

export const Route = createFileRoute("/app/discipulado")({
  head: () => ({
    meta: [
      { title: "Discipulado — Red de Jóvenes" },
      { name: "description", content: "Encuentra un mentor o discípulo para crecer en la fe juntos." },
    ],
  }),
  component: Discipulado,
});

type Mentor = {
  name: string;
  initials: string;
  role: string;
  city: string;
  topics: string[];
  rating: number;
  sessions: number;
  bio: string;
  available: boolean;
};

const mentors: Mentor[] = [
  {
    name: "Pastor Daniel Ortiz", initials: "DO", role: "Pastor de jóvenes", city: "Buenos Aires, AR",
    topics: ["Identidad en Cristo", "Vocación", "Liderazgo"], rating: 4.9, sessions: 142,
    bio: "12 años acompañando jóvenes a descubrir su llamado. Caminemos juntos.",
    available: true,
  },
  {
    name: "Camila Pérez", initials: "CP", role: "Líder de célula", city: "Bogotá, CO",
    topics: ["Pureza", "Relaciones", "Ansiedad"], rating: 5.0, sessions: 87,
    bio: "Acompaño chicas a encontrar paz en medio del caos. Sin juicios, con Biblia.",
    available: true,
  },
  {
    name: "Mateo Álvarez", initials: "MA", role: "Discípulo avanzado", city: "Lima, PE",
    topics: ["Estudio bíblico", "Apologética"], rating: 4.8, sessions: 53,
    bio: "Amo estudiar la Palabra y compartirla con quien quiera profundizar.",
    available: false,
  },
  {
    name: "Sara Núñez", initials: "SN", role: "Misionera", city: "CDMX, MX",
    topics: ["Misión", "Servicio", "Oración"], rating: 4.9, sessions: 98,
    bio: "Te ayudo a descubrir cómo Dios usa tu historia para alcanzar a otros.",
    available: true,
  },
];

const topicsAll = ["Todos", "Identidad en Cristo", "Vocación", "Pureza", "Ansiedad", "Estudio bíblico", "Misión", "Liderazgo"];

function Discipulado() {
  const [filter, setFilter] = useState("Todos");
  const [requested, setRequested] = useState<Set<string>>(new Set());

  const filtered = filter === "Todos" ? mentors : mentors.filter((m) => m.topics.includes(filter));

  const toggleRequest = (name: string) => {
    setRequested((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 shadow-soft">
        <div className="absolute -top-24 -right-20 size-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent font-semibold">
            <Sparkles className="size-3.5" /> Discipulado 1 a 1
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-black leading-tight">
            Crece <span className="text-gradient-faith">caminando con alguien</span> que ya pasó por ahí.
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/80">
            Encuentra un mentor cristiano que te acompañe en tu temporada. Sin costo, con propósito.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-white text-ocean px-5 py-2.5 text-sm font-semibold hover:scale-105 transition">
              Quiero ser discipulado
            </button>
            <button className="rounded-full glass px-5 py-2.5 text-sm font-semibold">
              Ofrecerme como mentor
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "Mentores activos", value: "342" },
          { icon: Heart, label: "Discípulos hoy", value: "1.2K" },
          { icon: Calendar, label: "Sesiones / mes", value: "5.8K" },
          { icon: CheckCircle2, label: "Match exitoso", value: "94%" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-4">
            <s.icon className="size-5 text-accent mb-2" />
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="glass rounded-2xl p-3 flex gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5 px-2 text-xs text-muted-foreground shrink-0">
          <Filter className="size-3.5" /> Tema:
        </div>
        {topicsAll.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
              filter === t ? "gradient-faith text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Mentor cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((m) => {
          const isRequested = requested.has(m.name);
          return (
            <article key={m.name} className="glass rounded-3xl p-5 hover:border-teal/30 transition">
              <header className="flex items-start gap-3">
                <div className="size-14 rounded-2xl gradient-faith grid place-items-center text-primary-foreground font-black text-lg shrink-0">
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold">{m.name}</h3>
                    {m.available ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold">Disponible</span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted/30 text-muted-foreground font-semibold">Lista de espera</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="size-3" /> {m.city}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <Star className="size-3.5 fill-current" /> {m.rating}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{m.sessions} sesiones</div>
                </div>
              </header>

              <p className="mt-3 text-sm text-muted-foreground italic">"{m.bio}"</p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.topics.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-accent/10 text-accent font-semibold">
                    {t}
                  </span>
                ))}
              </div>

              <footer className="mt-4 flex gap-2">
                <button
                  onClick={() => toggleRequest(m.name)}
                  disabled={!m.available && !isRequested}
                  className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isRequested
                      ? "bg-emerald-500/20 text-emerald-300"
                      : m.available
                      ? "gradient-faith text-primary-foreground hover:scale-[1.02]"
                      : "bg-secondary/40 text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {isRequested ? "✓ Solicitud enviada" : m.available ? "Solicitar mentoría" : "Avisarme"}
                </button>
                <button className="rounded-full glass p-2.5 hover:bg-white/10 transition" aria-label="Mensaje">
                  <MessageCircle className="size-4" />
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      {/* Cómo funciona */}
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl font-bold mb-4">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: "1", t: "Elegí tu tema", d: "Identidad, vocación, ansiedad, lo que estés atravesando." },
            { n: "2", t: "Match con un mentor", d: "Te conectamos con alguien validado por su iglesia." },
            { n: "3", t: "1 sesión por semana", d: "30 min por video o chat. Tu ritmo, tu Palabra." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl bg-secondary/30 p-4">
              <div className="size-8 rounded-full gradient-faith grid place-items-center text-primary-foreground font-black text-sm mb-3">
                {s.n}
              </div>
              <h3 className="font-semibold text-sm">{s.t}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
