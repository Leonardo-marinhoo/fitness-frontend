import { useEffect, useState } from 'react'
import { ArrowRight, List } from 'lucide-react'

function formatElapsed(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type WorkoutActionToolbarProps = {
  startedAt: string | null
  currentIndex: number
  totalCount: number
  progressPercent: number
  disableAdvance?: boolean
  isSaving?: boolean
  onAdvance: () => void
  onOpenList: () => void
  onInterrupt: () => void
}

export function WorkoutActionToolbar({
  startedAt,
  currentIndex,
  totalCount,
  progressPercent,
  disableAdvance = false,
  isSaving = false,
  onAdvance,
  onOpenList,
  onInterrupt,
}: WorkoutActionToolbarProps) {
  const sessionStart = startedAt ? new Date(startedAt).getTime() : Date.now()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const tick = () => {
      setElapsed(Math.max(0, Math.floor((Date.now() - sessionStart) / 1000)))
    }

    tick()
    const intervalId = window.setInterval(tick, 1000)
    return () => window.clearInterval(intervalId)
  }, [sessionStart])

  return (
    <div className="workout-toolbar">
      <div className="workout-toolbar__header">
        <div className="workout-toolbar__timer">
          <span>Tempo ativo</span>
          <strong>{formatElapsed(elapsed)}</strong>
        </div>
        <div className="workout-toolbar__meta">
          <button
            type="button"
            onClick={onInterrupt}
            className="workout-toolbar__interrupt"
          >
            Interromper
          </button>
          <strong className="workout-toolbar__percent">{progressPercent}%</strong>
        </div>
      </div>

      <div className="workout-toolbar__progress-track" aria-hidden="true">
        <span
          className="workout-toolbar__progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="workout-toolbar__progress-foot">
        <span>
          {currentIndex + 1} de {totalCount}
        </span>
      </div>

      <div className="workout-toolbar__actions">
        <button
          type="button"
          onClick={onOpenList}
          className="workout-toolbar__action workout-toolbar__action--soft"
        >
          <List size={15} />
          Exercícios
        </button>

        <button
          type="button"
          onClick={onAdvance}
          disabled={disableAdvance || isSaving}
          className="workout-toolbar__action workout-toolbar__action--accent"
        >
          <ArrowRight size={15} />
          {isSaving ? 'Salvando...' : 'Próximo'}
        </button>
      </div>
    </div>
  )
}
