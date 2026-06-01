import { CheckCircle2, Info, ThumbsDown } from 'lucide-react'

import { resolveMediaUrl } from '@/lib/media-url'
import { formatPrescription } from '@/lib/workout-prescription'
import { cn } from '@/lib/utils'
import type { WorkoutSessionExercise } from '@/types/fitness'

type WorkoutExerciseCardProps = {
  index: number
  exercise: WorkoutSessionExercise
  isDone: boolean
  needsAdjust: boolean
  isSaving: boolean
  onComplete: () => void
  onPartial: () => void
  onDetails: () => void
}

export function WorkoutExerciseCard({
  index,
  exercise,
  isDone,
  needsAdjust,
  isSaving,
  onComplete,
  onPartial,
  onDetails,
}: WorkoutExerciseCardProps) {
  const trainingExercise = exercise.training_exercise
  const exerciseDetails = trainingExercise?.exercise ?? exercise.exercise
  const exerciseName = exerciseDetails?.name ?? `Exercício #${index + 1}`
  const prescription = formatPrescription(trainingExercise)
  const muscle = exerciseDetails?.muscle_group?.name
  const imageUrl = resolveMediaUrl(exerciseDetails?.image_url)

  return (
    <article
      className={cn(
        'workout-exercise-card',
        isDone && 'workout-exercise-card--done',
        needsAdjust && 'workout-exercise-card--pending-adjust',
      )}
    >
      <div className="workout-exercise-card__main">
        <div className="workout-exercise-card__thumb">
          {imageUrl ? (
            <img src={imageUrl} alt={exerciseName} loading="lazy" />
          ) : (
            <span className="workout-exercise-card__thumb-fallback">{index + 1}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[color-mix(in_oklab,var(--accent-lime)_14%,transparent)] px-2 py-0.5 text-[11px] font-bold text-accent-lime">
              {index + 1}
            </span>
            {muscle ? (
              <span className="rounded-md bg-[color-mix(in_oklab,var(--color-violet)_14%,transparent)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-violet)]">
                {muscle}
              </span>
            ) : null}
            {isDone ? <CheckCircle2 size={18} className="ml-auto shrink-0 text-accent-lime" aria-hidden /> : null}
          </div>
          <h3 className="text-heading m-0 text-base leading-snug">{exerciseName}</h3>
          {prescription ? <p className="text-caption mt-1">{prescription}</p> : null}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={isSaving || isDone}
          onClick={onComplete}
          className="workout-quick-btn workout-quick-btn--done"
        >
          {isSaving ? '...' : 'Concluído'}
        </button>
        <button
          type="button"
          disabled={isSaving}
          onClick={onPartial}
          className="workout-quick-btn workout-quick-btn--partial"
        >
          <ThumbsDown size={14} />
          Não consegui
        </button>
        <button
          type="button"
          onClick={onDetails}
          className="workout-quick-btn workout-quick-btn--ghost"
          aria-label="Ver detalhes do exercício"
        >
          <Info size={16} />
        </button>
      </div>
    </article>
  )
}
