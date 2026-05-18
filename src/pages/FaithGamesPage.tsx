import { Gamepad2, Sparkles, Trophy, UsersRound, Zap } from 'lucide-react'
import { gameCards, leaderboard } from '../data/appDemoData'

export function FaithGamesPage() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-20 pt-32 text-white">
      <div className="pointer-events-none fixed left-0 top-24 h-96 w-96 rounded-full bg-amber-300/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-20 right-0 h-96 w-96 rounded-full bg-emerald-300/10 blur-3xl" />

      <div className="section-shell relative">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-amber-200 backdrop-blur">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              Juegos de fe
            </p>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Aprende, compite y crece en la fe.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              Demo visual inspirado en el prototipo: Versículo Rápido, Batallas
              de Fe y trivia bíblica preparados para convertirse en juegos reales.
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100">Tus puntos</p>
                <p className="mt-2 text-5xl font-black">7,320</p>
              </div>
              <Trophy className="h-16 w-16 text-amber-200" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {gameCards.map((game, index) => (
            <article
              key={game.title}
              className="group rounded-[1.75rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur transition hover:-translate-y-1 hover:bg-white/[0.1]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-300/20 to-amber-300/20 text-amber-200 ring-1 ring-white/10">
                  {index === 0 ? (
                    <Zap className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Gamepad2 className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
                <span className="rounded-full border border-white/10 bg-slate-950/50 px-3 py-1 text-xs font-semibold text-white/55">
                  {game.status}
                </span>
              </div>
              <h2 className="mt-6 text-2xl font-black">{game.title}</h2>
              <p className="mt-3 leading-7 text-white/62">{game.description}</p>
              <p className="mt-5 text-sm font-semibold text-amber-200">{game.meta}</p>
              <button
                type="button"
                className="mt-6 h-11 w-full rounded-full bg-white text-sm font-black text-slate-950 transition hover:bg-amber-100"
              >
                Jugar
              </button>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <article className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-amber-200" aria-hidden="true" />
              <h2 className="text-2xl font-black">Versículo Rápido · demo</h2>
            </div>
            <div className="mt-6 rounded-[1.5rem] border border-amber-300/20 bg-amber-300/10 p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-amber-200">
                Completa la cita
              </p>
              <p className="mt-4 text-2xl font-semibold leading-tight">
                “Todo lo puedo en Cristo que me ______.”
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {['fortalece', 'guarda', 'escucha', 'llama'].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-left text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex items-center gap-3">
              <UsersRound className="h-6 w-6 text-emerald-300" aria-hidden="true" />
              <h2 className="text-2xl font-black">Leaderboard global</h2>
            </div>
            <div className="mt-6 space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-white/10 bg-slate-950/45 p-3"
                >
                  <span className="text-sm font-black text-white/45">{entry.rank}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-300 to-amber-300 font-black text-slate-950">
                    {entry.initial}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-bold">{entry.name}</span>
                    <span className="block truncate text-xs text-white/45">{entry.group}</span>
                  </span>
                  <span className="font-black text-amber-200">{entry.points}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
