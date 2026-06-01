import { Dumbbell } from 'lucide-react'

import type { TrainingDay } from '@/types/fitness'

import { AddExercisePlaceholderCard } from './AddExercisePlaceholderCard'
import { ExerciseRow } from './ExerciseRow'

type DivisionExercisePanelProps = {
  day: TrainingDay | null
  hasAnyDays: boolean
  onAddDivision: () => void
  onAddExercise: () => void
  onEditExercise: (exerciseId: number) => void
  onDeleteExercise: (exerciseId: number) => void
}

export function DivisionExercisePanel({
  day,
  hasAnyDays,
  onAddDivision,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}: DivisionExercisePanelProps) {
  if (!hasAnyDays) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-16 text-center lg:px-6">
        <div className="flex size-12 items-center justify-center rounded-md bg-[var(--s2)] text-foreground/50">
          <Dumbbell size={22} />
        </div>
        <div>
          <p className="text-heading">Monte sua ficha</p>
          <p className="mt-1 max-w-md text-sm text-foreground/50">
            Adicione divisões (Treino A, B, C…) e depois os exercícios de cada uma.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddDivision}
          className="rounded-lg border border-[var(--s-border)] px-6 py-2.5 text-sm text-foreground/65 transition-colors hover:bg-[var(--s2)]"
        >
          Adicionar primeira divisão
        </button>
      </div>
    )
  }

  if (!day) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center px-4 py-16 text-caption lg:px-6">
        Selecione uma divisão nas abas acima.
      </div>
    )
  }

  const exercises = [...(day.training_exercises ?? [])].sort((a, b) => a.order - b.order)

  return (
    <div className="flex min-h-[min(60vh,640px)] flex-col">
      {day.description && (
        <p className="shrink-0 px-4 py-3 text-sm text-foreground/55 lg:px-6">{day.description}</p>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto pb-2">
        {exercises.length > 0 && (
          <div className="sheet-builder-exercise-list-header px-4 lg:px-6">
            <span>Exercício</span>
            <span className="hidden sm:block">Prescrição</span>
            <span className="text-right">Ações</span>
          </div>
        )}

        {exercises.map((te) => (
          <ExerciseRow
            key={te.id}
            item={te}
            onEdit={() => onEditExercise(te.id)}
            onDelete={() => onDeleteExercise(te.id)}
          />
        ))}

        <AddExercisePlaceholderCard onClick={onAddExercise} />
      </div>
    </div>
  )
}
