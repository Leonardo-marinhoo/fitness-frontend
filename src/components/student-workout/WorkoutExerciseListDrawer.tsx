import { CheckCircle2, Circle, CircleDashed, Flag } from 'lucide-react'

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { resolveMediaUrl } from '@/lib/media-url'
import { formatPrescription } from '@/lib/workout-prescription'
import { cn } from '@/lib/utils'
import type { WorkoutSessionExercise } from '@/types/fitness'

function isResolved(exercise: WorkoutSessionExercise) {
  return exercise.status !== 'pending'
}

function getStatusLabel(exercise: WorkoutSessionExercise) {
  switch (exercise.status) {
    case 'completed':
      return 'Feito'
    case 'failed':
      return 'Parcial'
    case 'skipped':
      return 'Pulou'
    case 'substituted':
      return 'Trocado'
    default:
      return 'Pendente'
  }
}

type WorkoutExerciseListDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  exercises: WorkoutSessionExercise[]
  currentExerciseId: number | null
  onJump: (exerciseId: number) => void
}

export function WorkoutExerciseListDrawer({
  open,
  onOpenChange,
  exercises,
  currentExerciseId,
  onJump,
}: WorkoutExerciseListDrawerProps) {
  const completedCount = exercises.filter(isResolved).length

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="workout-list-drawer">
        <DrawerHeader className="workout-list-drawer__header">
          <DrawerTitle className="workout-list-drawer__title">
            Seu treino de hoje
          </DrawerTitle>
          <DrawerDescription className="workout-list-drawer__description">
            {completedCount} de {exercises.length} exercícios já registrados.
          </DrawerDescription>
        </DrawerHeader>

        <div className="workout-list-drawer__summary">
          <div className="workout-list-drawer__summary-track" aria-hidden="true">
            <span
              className="workout-list-drawer__summary-fill"
              style={{
                width:
                  exercises.length > 0
                    ? `${(completedCount / exercises.length) * 100}%`
                    : '0%',
              }}
            />
          </div>
        </div>

        <div className="workout-list-drawer__items">
          {exercises.map((exercise, index) => {
            const exerciseDetails = exercise.training_exercise?.exercise ?? exercise.exercise
            const imageUrl = resolveMediaUrl(exerciseDetails?.image_url)
            const isCurrent = currentExerciseId === exercise.id
            const isDone = isResolved(exercise)

            return (
              <button
                key={exercise.id}
                type="button"
                onClick={() => onJump(exercise.id)}
                className={cn(
                  'workout-list-drawer__item',
                  isCurrent && 'workout-list-drawer__item--current',
                  isDone && 'workout-list-drawer__item--done',
                )}
              >
                <div className="workout-list-drawer__thumb">
                  {imageUrl ? (
                    <img src={imageUrl} alt={exerciseDetails?.name ?? `Exercício ${index + 1}`} loading="lazy" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="workout-list-drawer__item-meta">
                    <span className="workout-list-drawer__item-index">#{index + 1}</span>
                    <span className="workout-list-drawer__item-status">{getStatusLabel(exercise)}</span>
                  </div>
                  <h3 className="workout-list-drawer__item-title">
                    {exerciseDetails?.name ?? `Exercício ${index + 1}`}
                  </h3>
                  {exercise.training_exercise ? (
                    <p className="workout-list-drawer__item-caption">
                      {formatPrescription(exercise.training_exercise)}
                    </p>
                  ) : null}
                </div>

                <div className="workout-list-drawer__item-icon" aria-hidden="true">
                  {isCurrent ? (
                    <Flag size={18} />
                  ) : isDone ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <>
                      {exercise.status === 'pending' ? (
                        <CircleDashed size={18} />
                      ) : (
                        <Circle size={18} />
                      )}
                    </>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
