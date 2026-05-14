import { createFileRoute } from "@tanstack/react-router";
import { Globe2, MapPin, Users, Plus, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/comunidad")({ component: Comunidad });

const churches = [
  { name: "Iglesia Renacer", city: "Buenos Aires, AR", members: 312, online: true },
  { name: "Vida Nueva", city: "Madrid, ES", members: 487 },
  { name: "Esperanza Joven", city: "Ciudad de México", members: 621, online: true },
  { name: "Light House", city: "Miami, USA", members: 244 },
  { name: "Igreja Restauração", city: "São Paulo, BR", members: 532 },
  { name: "Hope Youth", city: "London, UK", members: 189 },
];

const lights = [
  { x: "20%", y: "45%" }, { x: "30%", y: "55%" }, { x: "48%", y: "35%" },
  { x: "55%", y: "60%" }, { x: "70%", y: "40%" }, { x: "78%", y: "55%" },
  { x: "85%", y: "30%" }, { x: "15%", y: "70%" },
];

function Comunidad() {
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Comunidad global</h1>
          <p className="text-muted-foreground">320 iglesias · 47 países · una sola Red.</p>
        </div>
        <button className="rounded-full gradient-faith px-5 py-2.5 text-sm font-semibold text-primary-foreground inline-flex items-center gap-2">
          <Plus className="size-4" /> Expande la Red
        </button>
      </header>

      {/* Map */}
      <div className="relative glass rounded-3xl p-6 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-40" />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-accent font-semibold mb-3">
            <Globe2 className="size-4" /> Puntos de luz en el mundo
          </div>
          <div className="relative aspect-[2/1] w-full rounded-2xl bg-ocean/40 border border-teal/20 overflow-hidden">
            {/* stylized world dots */}
            <svg viewBox="0 0 200 100" className="absolute inset-0 size-full opacity-20" preserveAspectRatio="none">
              {Array.from({ length: 400 }).map((_, i) => {
                const x = (i % 40) * 5;
                const y = Math.floor(i / 40) * 10;
                return <circle key={i} cx={x} cy={y} r="0.6" fill="currentColor" className="text-teal" />;
              })}
            </svg>
            {lights.map((l, i) => (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: l.x, top: l.y }}>
                <div className="size-3 rounded-full bg-accent animate-pulse-glow" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Iglesias y grupos conectados</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {churches.map((c) => (
            <div key={c.name} className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="size-12 rounded-2xl gradient-faith grid place-items-center text-primary-foreground font-black">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold flex items-center gap-2">
                  {c.name}
                  {c.online && <span className="size-2 rounded-full bg-emerald-400" />}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {c.city}</span>
                  <span className="inline-flex items-center gap-1"><Users className="size-3" /> {c.members}</span>
                </div>
              </div>
              <button className="text-xs rounded-full glass px-3 py-1.5 font-semibold">Conectar</button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass rounded-3xl p-6 flex items-start gap-4">
        <Sparkles className="size-6 text-accent shrink-0 mt-1" />
        <div>
          <h3 className="font-bold">¿No ves tu ciudad?</h3>
          <p className="text-sm text-muted-foreground mt-1">Propón un nuevo punto de luz. La luz se expande con cada joven que se anima.</p>
          <button className="mt-3 rounded-full gradient-faith px-4 py-2 text-sm font-semibold text-primary-foreground">Proponer ciudad</button>
        </div>
      </div>
    </div>
  );
}
