import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  Gamepad2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import {
  faithGames,
  upcomingFaithGames,
  type FaithGameDefinition,
} from '../data/faithGamesData'
import { useAuth } from '../features/auth/useAuth'
import { getMyGameScores, saveGameScore } from '../features/games/gameService'
import type { GameScore } from '../types/database'

function getFeedbackColor(isCorrect: boolean) {
  return isCorrect
    ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100'
    : 'border-rose-300/30 bg-rose-300/15 text-rose-100'
}

export function FaithGamesPage() {
  const { user } = useAuth()
  const [activeGameKey, setActiveGameKey] = useState(faithGames[0].key)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isScoreSaved, setIsScoreSaved] = useState(false)
  const [scoreMessage, setScoreMessage] = useState('')
  const [scoreHistory, setScoreHistory] = useState<GameScore[]>([])

  const activeGame = useMemo<FaithGameDefinition>(
    () =>
      faithGames.find((game) => game.key === activeGameKey) ?? faithGames[0],
    [activeGameKey],
  )

  const currentQuestion = activeGame.questions[questionIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer
  const progress = Math.round(
    ((questionIndex + (selectedAnswer || isFinished ? 1 : 0)) /
      activeGame.questions.length) *
      100,
  )

  function resetGame(nextGameKey = activeGameKey) {
    setActiveGameKey(nextGameKey)
    setQuestionIndex(0)
    setSelectedAnswer('')
    setScore(0)
    setIsFinished(false)
    setIsScoreSaved(false)
    setScoreMessage('')
  }

  function handleSelectAnswer(answer: string) {
    if (selectedAnswer || isFinished) return

    setSelectedAnswer(answer)
    if (answer === currentQuestion.correctAnswer) {
      setScore((currentScore) => currentScore + 1)
    }
  }

  function handleNextQuestion() {
    if (questionIndex === activeGame.questions.length - 1) {
      setIsFinished(true)
      return
    }

    setQuestionIndex((currentIndex) => currentIndex + 1)
    setSelectedAnswer('')
  }

  useEffect(() => {
    if (!user?.id) return

    getMyGameScores(user.id)
      .then(setScoreHistory)
      .catch(() => setScoreMessage('No pudimos cargar tu historial.'))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || !isFinished || isScoreSaved) return

    saveGameScore({
      userId: user.id,
      gameKey: activeGame.key,
      score,
      total: activeGame.questions.length,
    })
      .then((savedScore) => {
        setScoreHistory((current) => [savedScore, ...current].slice(0, 12))
        setIsScoreSaved(true)
        setScoreMessage('Puntaje guardado en tu progreso.')
      })
      .catch(() => setScoreMessage('No pudimos guardar tu puntaje.'))
  }, [activeGame.key, activeGame.questions.length, isFinished, isScoreSaved, score, user?.id])

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 px-4 pb-24 pt-32 text-white">
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
              Juegos rápidos para aprender la Palabra, memorizar versículos y
              compartir desafíos sanos con tu comunidad.
            </p>
          </div>

          <div className="rounded-[2rem] border border-amber-300/20 bg-amber-300/10 p-6 shadow-2xl shadow-black/25 backdrop-blur">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100">
                  Puntaje actual
                </p>
                <p className="mt-2 text-5xl font-black">
                  {score}/{activeGame.questions.length}
                </p>
              </div>
              <Trophy className="h-16 w-16 text-amber-200" aria-hidden="true" />
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-950/45">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-amber-300 transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.75fr_1.25fr]">
          <aside className="space-y-4">
            {faithGames.map((game) => {
              const isActive = game.key === activeGameKey
              return (
                <button
                  key={game.key}
                  type="button"
                  onClick={() => resetGame(game.key)}
                  className={`w-full rounded-[1.5rem] border p-5 text-left shadow-2xl shadow-black/20 backdrop-blur transition ${
                    isActive
                      ? 'border-amber-300/30 bg-amber-300/12'
                      : 'border-white/10 bg-white/[0.05] hover:bg-white/[0.08]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs font-bold text-amber-200">
                    <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                    {game.badge}
                  </span>
                  <h2 className="mt-4 text-2xl font-black">{game.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/62">
                    {game.description}
                  </p>
                </button>
              )
            })}

            {upcomingFaithGames.map((game) => (
              <article
                key={game.title}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 text-white/65 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-black text-white">{game.title}</h2>
                  <span className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1 text-xs font-bold text-white/50">
                    {game.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6">{game.description}</p>
              </article>
            ))}

            <article className="rounded-[1.5rem] border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="font-black text-white">Mi progreso</h2>
              <div className="mt-4 space-y-3">
                {scoreHistory.length ? (
                  scoreHistory.slice(0, 5).map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-slate-950/45 p-3"
                    >
                      <p className="text-sm font-bold text-white">
                        {item.game_key === 'versiculo-rapido'
                          ? 'Versiculo Rapido'
                          : 'Trivia Biblica'}
                      </p>
                      <p className="mt-1 text-xs text-white/55">
                        {item.score}/{item.total} puntos
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-6 text-white/60">
                    Completa un juego para guardar tu primer puntaje.
                  </p>
                )}
              </div>
            </article>
          </aside>

          <article className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl shadow-black/25 backdrop-blur md:p-8">
            {isFinished ? (
              <div className="flex min-h-[30rem] flex-col items-center justify-center text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-300 to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/20">
                  <Trophy className="h-10 w-10" aria-hidden="true" />
                </span>
                <p className="mt-6 text-sm font-black uppercase tracking-wide text-amber-200">
                  Resultado final
                </p>
                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  {score}/{activeGame.questions.length} respuestas correctas
                </h2>
                <p className="mt-4 max-w-xl text-white/65">
                  Cada respuesta es una oportunidad para conocer más la Palabra.
                  Repite el juego o prueba otra categoría.
                </p>
                {scoreMessage ? (
                  <p className="mt-4 text-sm font-semibold text-emerald-200">
                    {scoreMessage}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => resetGame()}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-200"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Jugar otra vez
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-amber-200">
                      {activeGame.title}
                    </p>
                    <h2 className="mt-2 text-3xl font-black md:text-4xl">
                      Pregunta {questionIndex + 1} de {activeGame.questions.length}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-bold text-white/55">
                    {currentQuestion.category}
                  </span>
                </div>

                <div className="mt-8 rounded-[1.75rem] border border-amber-300/20 bg-amber-300/10 p-6">
                  <p className="text-2xl font-semibold leading-tight md:text-3xl">
                    {currentQuestion.prompt}
                  </p>
                  {currentQuestion.reference ? (
                    <p className="mt-4 text-sm font-black text-amber-200">
                      {currentQuestion.reference}
                    </p>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => {
                    const wasSelected = selectedAnswer === option
                    const isRightAnswer = currentQuestion.correctAnswer === option
                    const resolvedClass = selectedAnswer
                      ? isRightAnswer
                        ? 'border-emerald-300/40 bg-emerald-300/15 text-emerald-100'
                        : wasSelected
                          ? 'border-rose-300/40 bg-rose-300/15 text-rose-100'
                          : 'border-white/10 bg-slate-950/45 text-white/45'
                      : 'border-white/10 bg-slate-950/45 text-white/75 hover:bg-white/10 hover:text-white'

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectAnswer(option)}
                        disabled={Boolean(selectedAnswer)}
                        className={`min-h-16 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${resolvedClass}`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>

                {selectedAnswer ? (
                  <div
                    className={`mt-6 rounded-[1.5rem] border p-5 ${getFeedbackColor(
                      isCorrect,
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-5 w-5" aria-hidden="true" />
                      )}
                      <p className="font-black">
                        {isCorrect ? 'Respuesta correcta' : 'Sigue practicando'}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      {currentQuestion.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-amber-100"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      {questionIndex === activeGame.questions.length - 1
                        ? 'Ver resultado'
                        : 'Siguiente pregunta'}
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}
