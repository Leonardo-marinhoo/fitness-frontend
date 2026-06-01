import { ArrowUpDown, Plus } from 'lucide-react'

import type { TrainingDay, TrainingExercise } from '@/types/fitness'

import { getSectionTitle } from './compute-sheet-stats'
import { ExerciseListHeader, ExerciseRowPremium } from './ExerciseRowPremium'
import { cn } from '@/lib/utils'

import {
  addExercisePlaceholder,
  addExercisePlaceholderEmpty,
  addExercisePlaceholderWithList,
  addExerciseRowIcon,
  btnBuilderGhost,
  btnBuilderPrimary,
  builderCard,
} from './styles'

type ExerciseSectionProps = {
  day: TrainingDay
  exercises: TrainingExercise[]
  onAddExercise: () => void
  onEditExercise: (id: number) => void
  onDeleteExercise: (id: number) => void
}

export function ExerciseSection({
  day,
  exercises,
  onAddExercise,
  onEditExercise,
  onDeleteExercise,
}: ExerciseSectionProps) {
  const sectionTitle = getSectionTitle(day, exercises)
  const count = exercises.length

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-2.5">
          <span className="mt-2.5 size-2 shrink-0 rounded-full bg-[var(--builder-accent)]" />
          <div>
            <h3 className="type-section-title">{sectionTitle}</h3>
            <p className="type-caption mt-0.5">
              {count} exercício{count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            disabled
            title="Em breve"
            className={btnBuilderGhost}
          >
            <ArrowUpDown size={16} />
            Reordenar
          </button>
          <button type="button" onClick={onAddExercise} className={btnBuilderPrimary}>
            <Plus size={16} strokeWidth={2.25} />
            Adicionar exercício
          </button>
        </div>
      </div>

      <div className={builderCard}>
        {count > 0 && (
          <div className="overflow-hidden">
            <ExerciseListHeader />
            {exercises.map((te, i) => (
              <ExerciseRowPremium
                key={te.id}
                index={i + 1}
                item={te}
                onEdit={() => onEditExercise(te.id)}
                onDelete={() => onDeleteExercise(te.id)}
              />
            ))}
          </div>
        )}

        <div className="p-3">
          <button
            type="button"
            onClick={onAddExercise}
            className={cn(
              addExercisePlaceholder,
              count === 0 ? addExercisePlaceholderEmpty : addExercisePlaceholderWithList,
            )}
          >
            <span className={addExerciseRowIcon}>
              <Plus size={16} strokeWidth={2.25} />
            </span>
            <span className="type-body transition-colors group-hover:text-[var(--builder-accent-secondary)]">
              {count === 0 ? 'Adicionar primeiro exercício' : 'Adicionar novo exercício'}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
