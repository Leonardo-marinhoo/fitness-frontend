import { Pencil, Trash2 } from 'lucide-react'

import { formatPrescription } from './format-prescription'
import type { TrainingExercise } from '@/types/fitness'

type ExerciseRowProps = {
  item: TrainingExercise
  onEdit: () => void
  onDelete: () => void
}

export function ExerciseRow({ item, onEdit, onDelete }: ExerciseRowProps) {
  const thumb = item.exercise.image_url ? (
    <img
      src={item.exercise.image_url}
      alt=""
      className="h-10 w-10 shrink-0 rounded-md object-cover"
    />
  ) : (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--s2)] text-xs font-bold text-[var(--text-tertiary)]">
      {item.exercise.name.slice(0, 2).toUpperCase()}
    </span>
  )

  return (
    <div className="sheet-builder-exercise-row">
      <div className="flex min-w-0 items-center gap-3">
        {thumb}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
            {item.exercise.name}
          </p>
          {item.exercise.muscle_group && (
            <p className="mt-0.5 truncate text-xs text-foreground/40">
              {item.exercise.muscle_group.name}
            </p>
          )}
          <p className="text-caption mt-0.5 sm:hidden">{formatPrescription(item)}</p>
        </div>
      </div>

      <p className="text-caption hidden truncate sm:block">{formatPrescription(item)}</p>

      <div className="flex shrink-0 items-center gap-1 justify-self-end">
        <button
          type="button"
          onClick={onEdit}
          className="rounded-md p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--s2)] hover:text-[var(--text-primary)]"
          aria-label="Editar exercício"
        >
          <Pencil size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-red-500/10 hover:text-red-400"
          aria-label="Remover exercício"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}
