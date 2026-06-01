import { GripVertical, MoreVertical, Pencil, Trash2 } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  getExerciseCategoryBadgeClass,
  getExerciseCategoryLabel,
} from '@/lib/exercise-category'
import { cn } from '@/lib/utils'
import type { TrainingExercise } from '@/types/fitness'

import { formatLoad, formatReps, formatRest } from './compute-sheet-stats'
import { exerciseRowGrid } from './styles'

type ExerciseRowPremiumProps = {
  index: number
  item: TrainingExercise
  onEdit: () => void
  onDelete: () => void
}

function MobileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="type-label text-[10px]">{label}</p>
      <p className="type-body-medium tabular-nums">{value}</p>
    </div>
  )
}

export function ExerciseRowPremium({ index, item, onEdit, onDelete }: ExerciseRowPremiumProps) {
  const categoryLabel = getExerciseCategoryLabel(item.exercise.category)
  const categoryClass = getExerciseCategoryBadgeClass(item.exercise.category)

  const thumb = item.exercise.image_url ? (
    <img
      src={item.exercise.image_url}
      alt=""
      className="h-[52px] w-[52px] shrink-0 rounded-lg object-cover"
    />
  ) : (
    <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-lg bg-[#171D28] text-xs font-bold text-zinc-500">
      {item.exercise.name.slice(0, 2).toUpperCase()}
    </span>
  )

  const sets = item.sets != null ? String(item.sets) : '—'
  const reps = formatReps(item)
  const load = formatLoad(item)
  const rest = formatRest(item)

  return (
    <div className="border-b border-white/[0.04] last:border-b-0">
      <div
        className={cn(
          exerciseRowGrid,
          'group px-4 py-3.5 transition-colors hover:bg-[#151D28]/80 lg:px-5',
        )}
      >
        <GripVertical
          size={18}
          className="hidden cursor-grab text-zinc-600 opacity-40 group-hover:opacity-100 lg:block"
          aria-hidden
        />
        <span className="type-caption hidden tabular-nums lg:block">{index}</span>
        <div className="hidden lg:block">{thumb}</div>

        <div className="flex min-w-0 items-center gap-3 lg:contents">
          <div className="lg:hidden">{thumb}</div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium tabular-nums text-zinc-600 lg:hidden">{index}.</span>
              <p className="type-body-medium truncate">{item.exercise.name}</p>
              {categoryLabel && (
                <span
                  className={cn(
                    'shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold',
                    categoryClass,
                  )}
                  title="Categoria do exercício na biblioteca"
                >
                  {categoryLabel}
                </span>
              )}
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2 lg:hidden">
              <MobileMetric label="Séries" value={sets} />
              <MobileMetric label="Reps" value={reps} />
              <MobileMetric label="Carga" value={load} />
              <MobileMetric label="Descanso" value={rest} />
            </div>
          </div>
        </div>

        <p className="type-body-medium hidden tabular-nums lg:block">{sets}</p>
        <p className="type-body-medium hidden tabular-nums lg:block">{reps}</p>
        <p className="type-body-medium hidden tabular-nums lg:block">{load}</p>
        <p className="type-body-medium hidden tabular-nums lg:block">{rest}</p>

        <div className="flex items-center justify-end gap-0.5 lg:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200">
              <MoreVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-white/10 bg-[var(--s2)]">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil size={14} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400 focus:text-red-400">
                <Trash2 size={14} className="mr-2" />
                Remover
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {item.notes?.trim() && (
        <footer className="border-t border-white/[0.04] bg-[var(--bg-subtle)]/60 px-4 py-2.5 lg:px-5">
          <p className="type-caption leading-relaxed">
            <span className="type-label normal-case tracking-normal">Observações: </span>
            {item.notes.trim()}
          </p>
        </footer>
      )}
    </div>
  )
}

export function ExerciseListHeader() {
  return (
    <div
      className={cn(
        exerciseRowGrid,
        'type-label border-b border-white/[0.06] px-4 py-2.5 lg:px-5',
      )}
    >
      <span className="hidden lg:block" />
      <span className="hidden lg:block">#</span>
      <span className="hidden lg:block" />
      <span>Exercício</span>
      <span className="hidden lg:block">Séries</span>
      <span className="hidden lg:block">Repetições</span>
      <span className="hidden lg:block">Carga</span>
      <span className="hidden lg:block">Descanso</span>
      <span className="hidden text-right lg:block">Ações</span>
    </div>
  )
}
