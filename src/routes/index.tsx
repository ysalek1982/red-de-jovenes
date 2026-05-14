import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Shield, BookOpen, Globe2, Heart, Flame, ArrowRight } from "lucide-react";
import heroYouth from "@/assets/hero-youth.jpg";
import crossGlow from "@/assets/cross-glow.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Red de Jóvenes — Conectando jóvenes en Cristo" },
      { name: "description", content: "La red social cristiana para jóvenes. Conecta, crece en la fe, ora y vive comunidad. Únete gratis." },
      { property: "og:title", content: "Red de Jóvenes" },
      { property: "og:description", content: "Donde la fe se vive juntos" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="glass rounded-full flex items-center justify-between px-5 py-2.5">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-8 rounded-full gradient-faith grid place-items-center font-black text-primary-foreground">+</div>
              <span className="font-bold tracking-tight">Red de Jóvenes</span>
            </Link>
            <nav className="hidden md:flex gap-7 text-sm text-muted-foreground">
              <a href="#mision" className="hover:text-foreground transition">Misión</a>
              <a href="#features" className="hover:text-foreground transition">Funciones</a>
              <a href="#comunidad" className="hover:text-foreground transition">Comunidad</a>
            </nav>
            <Link to="/app" className="rounded-full gradient-faith px-4 py-2 text-sm font-semibold text-primary-foreground hover:scale-105 transition">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-36">
        <div className="absolute inset-0 -z-10">
          <img src={heroYouth} alt="Jóvenes adorando" className="size-full object-cover opacity-30" width={1536} height={1024} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>

        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <Sparkles className="size-3.5 text-accent" />
            La red social cristiana de la nueva generación
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
            Conectando jóvenes <br />
            <span className="text-gradient-faith">en Cristo.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Donde la fe se vive juntos. Comunidad, oración, eventos, foros anclados en la Palabra y juegos para crecer en grupo.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/app" className="group rounded-full gradient-faith px-7 py-3.5 font-semibold text-primary-foreground glow hover:scale-105 transition inline-flex items-center gap-2">
              Unirme ahora
              <ArrowRight className="size-4 group-hover:translate-x-1 transition" />
            </Link>
            <Link to="/app" className="rounded-full glass px-7 py-3.5 font-semibold hover:bg-white/10 transition">
              Iniciar sesión
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Shield className="size-4 text-teal" /> Espacio seguro</span>
            <span className="inline-flex items-center gap-2"><BookOpen className="size-4 text-teal" /> Basado en la Palabra</span>
            <span className="inline-flex items-center gap-2"><Heart className="size-4 text-teal" /> Respaldado por iglesias</span>
          </div>
        </div>

        {/* floating cross */}
        <div className="hidden lg:block absolute right-10 top-40 animate-float">
          <img src={crossGlow} alt="Cruz luminosa" className="size-44 rounded-3xl shadow-soft opacity-80" width={1024} height={1024} loading="lazy" />
        </div>
      </section>

      {/* Mission */}
      <section id="mision" className="py-20">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-accent font-semibold mb-4">Nuestra misión</p>
          <p className="text-2xl md:text-4xl font-semibold leading-snug">
            “Vosotros sois la luz del mundo.” <span className="text-muted-foreground">— Mateo 5:14</span>
          </p>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Una generación conectada por algo más grande que un feed. Una red mundial de jóvenes encendidos por Cristo.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="glass rounded-3xl p-6 hover:-translate-y-1 hover:glow transition">
                <div className="size-12 rounded-2xl gradient-faith grid place-items-center text-primary-foreground mb-4">
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="comunidad" className="py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="glass rounded-[2.5rem] p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -top-32 -left-32 size-96 rounded-full bg-teal/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 size-96 rounded-full bg-accent/20 blur-3xl" />
            <h2 className="relative text-4xl md:text-6xl font-black tracking-tight">
              Tu generación. <span className="text-gradient-faith">Tu Red.</span>
            </h2>
            <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">
              Más de 12,400 jóvenes, 320 iglesias y 47 países ya están conectados. Sé parte.
            </p>
            <Link to="/app" className="relative mt-8 inline-flex items-center gap-2 rounded-full gradient-faith px-8 py-4 font-semibold text-primary-foreground glow hover:scale-105 transition">
              Crear mi cuenta gratis
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/50 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Red de Jóvenes • Hecho con fe y código
      </footer>
    </div>
  );
}

const features = [
  { icon: Heart, title: "Sala de oración global", desc: "Ora con otros jóvenes 24/7. Comparte peticiones, celebra respuestas." },
  { icon: BookOpen, title: "Foros con la Palabra", desc: "Cada debate empieza con versículos. Discusiones sanas, profundas y reales." },
  { icon: Flame, title: "Juegos de fe", desc: "Versículo Rápido, Batallas de Fe y más. Aprende jugando con tus amigos." },
  { icon: Globe2, title: "Mapa mundial", desc: "Conecta con iglesias y grupos juveniles en 47 países. La luz se expande." },
  { icon: Sparkles, title: "Devocional diario", desc: "Un versículo, una reflexión, un paso. Construye tu hábito espiritual." },
  { icon: Shield, title: "Espacio seguro", desc: "Moderación con sabiduría. Aquí cada joven es valorado y protegido." },
];
