import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Sparkles, Mail, Lock, User2, Check } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Red de Jóvenes" },
      { name: "description", content: "Inicia sesión o crea tu cuenta en Red de Jóvenes." },
    ],
  }),
  component: LoginPage,
});

const interests = [
  "Adoración", "Misiones", "Estudio bíblico", "Liderazgo", "Música",
  "Arte cristiano", "Discipulado", "Apologética", "Servicio social", "Deportes",
];

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);

  const togglePick = (i: string) =>
    setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <aside className="relative hidden lg:flex flex-col justify-between p-10 gradient-hero overflow-hidden noise">
        <div className="absolute -top-32 -right-32 size-[28rem] rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 size-[28rem] rounded-full bg-teal/30 blur-3xl" />
        <Link to="/" className="relative flex items-center gap-2">
          <div className="size-9 rounded-full gradient-faith grid place-items-center font-black text-primary-foreground">+</div>
          <span className="font-bold text-white">Red de Jóvenes</span>
        </Link>
        <div className="relative">
          <p className="font-serif-display text-4xl xl:text-5xl text-white leading-tight">
            “Vosotros sois la luz del mundo.”
          </p>
          <p className="mt-3 text-white/70 text-sm">— Mateo 5:14</p>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-3">
              {["L","M","S","J"].map((n,i)=>(
                <div key={i} className="size-9 rounded-full border-2 border-white/40 bg-gradient-to-br from-teal to-accent grid place-items-center text-xs font-bold text-primary-foreground">{n}</div>
              ))}
            </div>
            <p className="text-white/80 text-sm">+12,400 jóvenes ya entraron esta semana</p>
          </div>
        </div>
        <p className="relative text-xs text-white/50">© Red de Jóvenes — hecho con fe y código</p>
      </aside>

      {/* Right: form */}
      <main className="flex flex-col justify-center px-5 py-10 md:px-16">
        <div className="max-w-md w-full mx-auto">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="size-9 rounded-full gradient-faith grid place-items-center font-black text-primary-foreground">+</div>
            <span className="font-bold">Red de Jóvenes</span>
          </div>

          {step === 0 && (
            <div className="animate-rise">
              <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground mb-4">
                <Sparkles className="size-3.5 text-accent" /> Bienvenido
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                {mode === "signup" ? "Crea tu cuenta" : "Bienvenido de vuelta"}
              </h1>
              <p className="mt-2 text-muted-foreground text-sm">
                {mode === "signup" ? "Únete a la red de jóvenes en Cristo." : "Entra a tu Red."}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="rounded-2xl glass py-3 text-sm font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2">
                  <GoogleIcon /> Google
                </button>
                <button className="rounded-2xl glass py-3 text-sm font-semibold hover:bg-white/5 transition flex items-center justify-center gap-2">
                  <AppleIcon /> Apple
                </button>
              </div>

              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
                <div className="h-px flex-1 bg-border" /> o con email <div className="h-px flex-1 bg-border" />
              </div>

              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (mode === "signup") setStep(1);
                  else nav({ to: "/app" });
                }}
              >
                {mode === "signup" && (
                  <Field icon={User2} placeholder="Tu nombre" />
                )}
                <Field icon={Mail} placeholder="tu@email.com" type="email" />
                <Field icon={Lock} placeholder="••••••••" type="password" />
                <button className="w-full rounded-full gradient-faith py-3 font-semibold text-primary-foreground glow hover:scale-[1.02] transition inline-flex items-center justify-center gap-2">
                  {mode === "signup" ? "Continuar" : "Entrar"}
                  <ArrowRight className="size-4" />
                </button>
              </form>

              <p className="mt-5 text-sm text-muted-foreground text-center">
                {mode === "signup" ? "¿Ya tienes cuenta?" : "¿Nuevo aquí?"}{" "}
                <button
                  className="text-accent font-semibold"
                  onClick={() => setMode(mode === "signup" ? "login" : "signup")}
                >
                  {mode === "signup" ? "Inicia sesión" : "Crea una cuenta"}
                </button>
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="animate-rise">
              <p className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">Paso 2 de 3</p>
              <h2 className="mt-2 text-3xl md:text-4xl font-black tracking-tight">¿Qué te enciende en Cristo?</h2>
              <p className="mt-2 text-muted-foreground text-sm">Elige al menos 3. Personalizamos tu Red.</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {interests.map((i) => {
                  const on = picked.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => togglePick(i)}
                      className={`rounded-full px-4 py-2 text-sm border transition ${on ? "gradient-faith text-primary-foreground border-transparent" : "glass hover:bg-white/5"}`}
                    >
                      {on && <Check className="inline size-3.5 mr-1 -mt-0.5" />}{i}
                    </button>
                  );
                })}
              </div>
              <button
                disabled={picked.length < 3}
                onClick={() => setStep(2)}
                className="mt-8 w-full rounded-full gradient-faith py-3 font-semibold text-primary-foreground disabled:opacity-40 inline-flex items-center justify-center gap-2"
              >
                Continuar <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-rise text-center">
              <div className="mx-auto size-20 rounded-full gradient-faith grid place-items-center glow animate-pulse-glow">
                <Sparkles className="size-9 text-primary-foreground" />
              </div>
              <h2 className="mt-6 text-3xl md:text-4xl font-black tracking-tight">Bienvenido a la Red</h2>
              <p className="mt-2 text-muted-foreground">Tu viaje de fe digital empieza ahora.</p>
              <button
                onClick={() => nav({ to: "/app" })}
                className="mt-8 w-full rounded-full gradient-faith py-3 font-semibold text-primary-foreground glow inline-flex items-center justify-center gap-2"
              >
                Entrar a mi feed <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Field({ icon: Icon, ...rest }: { icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center gap-3 rounded-2xl glass px-4 py-3 focus-within:ring-2 focus-within:ring-primary/40">
      <Icon className="size-4 text-muted-foreground shrink-0" />
      <input {...rest} className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2s2.7-6.2 6-6.2c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.2 14.6 2.2 12 2.2 6.5 2.2 2.1 6.6 2.1 12s4.4 9.8 9.9 9.8c5.7 0 9.5-4 9.5-9.7 0-.7-.1-1.2-.2-1.9H12z"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current"><path d="M16.4 12.3c0-2.5 2-3.6 2.1-3.7-1.2-1.7-3-1.9-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.3 2.6 1.3-.1 1.8-.9 3.4-.9s2 .9 3.4.8c1.4 0 2.3-1.2 3.1-2.5.6-.9 1.1-1.9 1.4-2.9-1.5-.6-3-2-3-4.1zM13.6 5.6c.7-.9 1.2-2.1 1.1-3.3-1 0-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.2 1.2.1 2.3-.6 3-1.5z"/></svg>
  );
}
