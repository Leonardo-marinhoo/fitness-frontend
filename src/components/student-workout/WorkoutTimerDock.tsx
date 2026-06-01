import { useEffect, useState } from 'react'
import { Pause, Play } from 'lucide-react'

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type WorkoutTimerDockProps = {
  startedAt: string | null
}

export function WorkoutTimerDock({ startedAt }: WorkoutTimerDockProps) {
  const sessionStart = startedAt ? new Date(startedAt).getTime() : Date.now()
  const [isRunning, setIsRunning] = useState(true)
  const [pausedTotalMs, setPausedTotalMs] = useState(0)
  const [pauseStartedAt, setPauseStartedAt] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const extraPause = pauseStartedAt != null ? now - pauseStartedAt : 0
      setElapsed(
        Math.max(0, Math.floor((now - sessionStart - pausedTotalMs - extraPause) / 1000)),
      )
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [sessionStart, pausedTotalMs, pauseStartedAt])

  function toggleRunning() {
    if (isRunning) {
      setPauseStartedAt(Date.now())
      setIsRunning(false)
      return
    }
    if (pauseStartedAt != null) {
      setPausedTotalMs((prev) => prev + (Date.now() - pauseStartedAt))
      setPauseStartedAt(null)
    }
    setIsRunning(true)
  }

  return (
    <div className="workout-timer-dock" role="timer" aria-live="polite">
      <div className="min-w-0">
        <p className="text-eyebrow m-0 mb-0.5 text-[10px]">Tempo de treino</p>
        <p className="font-display m-0 text-2xl font-bold tabular-nums tracking-tight text-[var(--text-primary)]">
          {formatElapsed(elapsed)}
        </p>
      </div>
      <button
        type="button"
        onClick={toggleRunning}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-[var(--s-border-h)] bg-white/[0.06] text-[var(--text-primary)]"
        aria-label={isRunning ? 'Pausar cronômetro' : 'Retomar cronômetro'}
      >
        {isRunning ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
      </button>
    </div>
  )
}
