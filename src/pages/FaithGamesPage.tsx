import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCircle2,
  Gamepad2,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from 'lucide-react'
import { faithGames, type FaithGameDefinition } from '../data/faithGamesData'
import { useAuth } from '../features/auth/useAuth'
import { getMyGameScores, saveGameScore } from '../features/games/gameService'
import { scrollElementIntoView } from '../lib/scroll'
import type { GameScore } from '../types/database'

interface MemoryCard {
  id: string
  pairId: string
  value: string
  explanation: string
}

function getFeedbackColor(isCorrect: boolean) {
  return isCorrect
    ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100'
    : 'border-rose-300/30 bg-rose-300/15 text-rose-100'
}

function getGameTotal(game: FaithGameDefinition) {
  return game.mode === 'memory' ? game.pairs?.length ?? 0 : game.questions.length
}

function createMemoryCards(game: FaithGameDefinition) {
  const pairs = game.pairs ?? []
  return pairs
    .flatMap<MemoryCard>((pair) => [
      {
        id: `${pair.id}-left`,
        pairId: pair.id,
        value: pair.left,
        explanation: pair.explanation,
      },
      {
        id: `${pair.id}-right`,
        pairId: pair.id,
        value: pair.right,
        explanation: pair.explanation,
      },
    ])
    .sort(() => Math.random() - 0.5)
}

export function FaithGamesPage() {
  const { user } = useAuth()
  const gameAreaRef = useRef<HTMLElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const [activeGameKey, setActiveGameKey] = useState(faithGames[0].key)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [isScoreSaved, setIsScoreSaved] = useState(false)
  const [scoreMessage, setScoreMessage] = useState('')
  const [scoreHistory, setScoreHistory] = useState<GameScore[]>([])
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>(() =>
    createMemoryCards(faithGames[0]),
  )
  const [flippedCardIds, setFlippedCardIds] = useState<string[]>([])
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([])
  const [memoryAttempts, setMemoryAttempts] = useState(0)

  const activeGame = useMemo<FaithGameDefinition>(
    () =>
      faithGames.find((game) => game.key === activeGameKey) ?? faithGames[0],
    [activeGameKey],
  )

  const activeTotal = getGameTotal(activeGame)
  const currentQuestion =
    activeGame.mode === 'quiz' ? activeGame.questions[questionIndex] : null
  const isCorrect = Boolean(
    selectedAnswer && currentQuestion?.correctAnswer === selectedAnswer,
  )
  const progress =
    activeGame.mode === 'memory'
      ? Math.round((matchedPairIds.length / Math.max(activeTotal, 1)) * 100)
      : Math.round(
          ((questionIndex + (selectedAnswer || isFinished ? 1 : 0)) /
            Math.max(activeTotal, 1)) *
            100,
        )

  const scoreByGame = useMemo(() => {
    return faithGames.map((game) => {
      const scores = scoreHistory.filter((item) => item.game_key === game.key)
      const best = scores.reduce<GameScore | null>((currentBest, item) => {
        if (!currentBest) return item
        return item.score / item.total > currentBest.score / currentBest.total
          ? item
          : currentBest
      }, null)

      return {
        game,
        plays: scores.length,
        best,
      }
    })
  }, [scoreHistory])

  const totalPoints = useMemo(
    () => scoreHistory.reduce((total, item) => total + item.score, 0),
    [scoreHistory],
  )

  function resetGame(nextGameKey = activeGameKey) {
    const nextGame =
      faithGames.find((game) => game.key === nextGameKey) ?? faithGames[0]
    setActiveGameKey(nextGame.key)
    setQuestionIndex(0)
    setSelectedAnswer('')
    setScore(0)
    setIsFinished(false)
    setIsScoreSaved(false)
    setScoreMessage('')
    setFlippedCardIds([])
    setMatchedPairIds([])
    setMemoryAttempts(0)
    setMemoryCards(nextGame.mode === 'memory' ? createMemoryCards(nextGame) : [])
    window.requestAnimationFrame(() => {
      scrollElementIntoView(gameAreaRef.current)
    })
  }

  function handleSelectAnswer(answer: string) {
    if (!currentQuestion || selectedAnswer || isFinished) return

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
    window.requestAnimationFrame(() => {
      scrollElementIntoView(gameAreaRef.current)
    })
  }

  function handleMemoryCardClick(card: MemoryCard) {
    if (
      isFinished ||
      matchedPairIds.includes(card.pairId) ||
      flippedCardIds.includes(card.id) ||
      flippedCardIds.length >= 2
    ) {
      return
    }

    const nextFlipped = [...flippedCardIds, card.id]
    setFlippedCardIds(nextFlipped)

    if (nextFlipped.length !== 2) return

    setMemoryAttempts((current) => current + 1)
    const [firstCard, secondCard] = nextFlipped
      .map((cardId) => memoryCards.find((item) => item.id === cardId))
      .filter((item): item is MemoryCard => Boolean(item))

    if (firstCard?.pairId && firstCard.pairId === secondCard?.pairId) {
      const nextMatchedCount = matchedPairIds.includes(firstCard.pairId)
        ? matchedPairIds.length
        : matchedPairIds.length + 1

      setMatchedPairIds((current) =>
        current.includes(firstCard.pairId)
          ? current
          : [...current, firstCard.pairId],
      )

      if (nextMatchedCount === activeTotal) {
        setScore(activeTotal)
        window.setTimeout(() => setIsFinished(true), 700)
      }
    }

    window.setTimeout(() => setFlippedCardIds([]), 700)
  }

  useEffect(() => {
    if (!user?.id) return

    getMyGameScores(user.id)
      .then(setScoreHistory)
      .catch(() => setScoreMessage('No pudimos cargar tu historial.'))
  }, [user?.id])

  useEffect(() => {
    if (!user?.id || !isFinished || isScoreSaved || !activeTotal) return

    saveGameScore({
      userId: user.id,
      gameKey: activeGame.key,
      score,
      total: activeTotal,
    })
      .then((savedScore) => {
        setScoreHistory((current) => [savedScore, ...current].slice(0, 30))
        setIsScoreSaved(true)
        setScoreMessage('Puntaje guardado en tu progreso.')
      })
      .catch(() => setScoreMessage('No pudimos guardar tu puntaje.'))
  }, [activeGame.key, activeTotal, isFinished, isScoreSaved, score, user?.id])

  useEffect(() => {
    if (!isFinished) return

    window.requestAnimationFrame(() => {
      scrollElementIntoView(resultRef.current ?? gameAreaRef.current)
    })
  }, [isFinished])

  return (
    <section className="app-page overflow-hidden">
      <div className="section-shell relative">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="app-kicker">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              Juegos de fe
            </p>
            <h1 data-page-title className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
              Aprende, compite y crece en la fe.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-white/65">
              Juegos rapidos para aprender la Palabra, memorizar versiculos y
              practicar decisiones sanas con tu comunidad.
            </p>
          </div>

          <div className="app-card-accent">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-100">
                  {isFinished ? 'Resultado' : 'Puntaje actual'}
                </p>
                <p className="mt-2 text-5xl font-black">
                  {score}/{activeTotal}
                </p>
                {activeGame.mode === 'memory' ? (
                  <p className="mt-2 text-sm text-white/60">
                    {memoryAttempts} intentos en Memory Match
                  </p>
                ) : null}
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

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-4">
            {faithGames.map((game) => {
              const isActive = game.key === activeGameKey
              return (
                <button
                  key={game.key}
                  type="button"
                  onClick={() => resetGame(game.key)}
                  className={`w-full rounded-2xl border p-5 text-left shadow-2xl shadow-black/20 backdrop-blur transition ${
                    isActive
                      ? 'border-amber-300/30 bg-amber-300/10'
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
                  <p className="mt-3 text-xs font-bold uppercase tracking-wide text-emerald-200">
                    Jugable ahora
                  </p>
                </button>
              )
            })}

            <article className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-5 shadow-2xl shadow-black/20 backdrop-blur">
              <h2 className="font-black text-white">Tu progreso</h2>
              <p className="mt-2 text-sm text-white/60">
                {totalPoints} puntos guardados en {scoreHistory.length} partidas.
              </p>
              <div className="mt-4 space-y-3">
                {scoreByGame.map(({ game, plays, best }) => (
                  <div
                    key={game.key}
                    className="app-card-soft p-3"
                  >
                    <p className="text-sm font-bold text-white">{game.title}</p>
                    <p className="mt-1 text-xs text-white/55">
                      {best
                        ? `Mejor: ${best.score}/${best.total} - ${plays} partida${
                            plays === 1 ? '' : 's'
                          }`
                        : 'Sin partidas todavia'}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </aside>

          <article ref={gameAreaRef} className="app-card md:p-8">
            {isFinished ? (
              <div ref={resultRef} className="flex min-h-[30rem] flex-col items-center justify-center text-center">
                <span className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-300 to-amber-300 text-slate-950 shadow-2xl shadow-amber-500/20">
                  <Trophy className="h-10 w-10" aria-hidden="true" />
                </span>
                <p className="mt-6 text-sm font-black uppercase tracking-wide text-amber-200">
                  Resultado final
                </p>
                <h2 className="mt-3 text-4xl font-black md:text-5xl">
                  {score}/{activeTotal} puntos
                </h2>
                <p className="mt-4 max-w-xl text-white/65">
                  Cada respuesta es una oportunidad para conocer mas la Palabra.
                  Repite el juego o prueba otro desafio.
                </p>
                {scoreMessage ? (
                  <p className="mt-4 text-sm font-semibold text-emerald-200">
                    {scoreMessage}
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => resetGame()}
                  className="app-button-primary mt-8 bg-amber-300 hover:bg-amber-200"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Jugar otra vez
                </button>
              </div>
            ) : activeGame.mode === 'memory' ? (
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-amber-200">
                      {activeGame.title}
                    </p>
                    <h2 className="mt-2 text-3xl font-black md:text-4xl">
                      Encuentra todos los pares
                    </h2>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-bold text-white/55">
                    {matchedPairIds.length}/{activeTotal} pares
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {memoryCards.map((card) => {
                    const isVisible =
                      flippedCardIds.includes(card.id) ||
                      matchedPairIds.includes(card.pairId)
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleMemoryCardClick(card)}
                        disabled={isVisible && matchedPairIds.includes(card.pairId)}
                         className={`min-h-28 rounded-2xl border p-3 text-center text-sm font-black transition ${
                          isVisible
                            ? 'border-emerald-300/30 bg-emerald-300/15 text-emerald-100'
                            : 'border-white/10 bg-slate-950/55 text-white/55 hover:bg-white/10'
                        }`}
                      >
                        {isVisible ? card.value : 'Red de Jovenes'}
                      </button>
                    )
                  })}
                </div>

                <div className="app-card-accent mt-6">
                  <p className="font-black text-amber-100">
                    Intentos: {memoryAttempts}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Toca dos cartas. Si forman un par, quedaran visibles. Al
                    completar todos los pares se guardara tu puntaje.
                  </p>
                </div>
              </div>
            ) : currentQuestion ? (
              <>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-amber-200">
                      {activeGame.title}
                    </p>
                    <h2 className="mt-2 text-3xl font-black md:text-4xl">
                      Pregunta {questionIndex + 1} de {activeTotal}
                    </h2>
                  </div>
                  <span className="w-fit rounded-full border border-white/10 bg-slate-950/45 px-4 py-2 text-sm font-bold text-white/55">
                    {currentQuestion.category}
                  </span>
                </div>

                <div className="app-card-accent mt-8">
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
                    className={`min-h-16 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 ${resolvedClass}`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>

                {selectedAnswer ? (
                  <div
                    className={`mt-6 rounded-2xl border p-5 ${getFeedbackColor(
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
                      className="app-button-primary mt-5"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      {questionIndex === activeTotal - 1
                        ? 'Ver resultado'
                        : 'Siguiente pregunta'}
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="app-alert-warning">
                Este juego necesita preguntas antes de iniciar.
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  )
}
