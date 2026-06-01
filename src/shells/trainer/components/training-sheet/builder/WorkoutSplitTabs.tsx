import { Pencil } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TrainingDay } from '@/types/fitness'

import { AddDivisionTab } from '../AddDivisionTab'
import { splitTabTrigger } from './styles'

type WorkoutSplitTabsProps = {
  days: TrainingDay[]
  selectedDayId: number | null
  onSelect: (dayId: number) => void
  onAdd: () => void
  onEdit: (day: TrainingDay) => void
}

export function WorkoutSplitTabs({
  days,
  selectedDayId,
  onSelect,
  onAdd,
  onEdit,
}: WorkoutSplitTabsProps) {
  return (
    <div
      className="border-b border-white/[0.06]"
      role="tablist"
      aria-label="Divisões da ficha"
    >
      <div className="overflow-visible px-1 pt-1">
        <div className="flex min-w-0 items-stretch overflow-x-auto overflow-y-visible pb-px [-ms-overflow-style:none] [scrollbar-width:thin]">
          {days.map((day) => {
            const active = day.id === selectedDayId
            const count = day.training_exercises?.length ?? 0

            return (
              <div key={day.id} className="relative shrink-0 pr-1">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelect(day.id)}
                  className={cn(
                    splitTabTrigger,
                    active
                      ? 'border-[var(--builder-accent)] pr-9 text-zinc-100'
                      : 'border-transparent text-zinc-500 hover:text-zinc-300',
                  )}
                >
                  <span className="type-body-medium max-w-[10rem] truncate sm:max-w-none">
                    {day.name}
                  </span>
                  <span
                    className={cn(
                      'rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                      active
                        ? 'bg-[var(--builder-accent)]/12 text-[var(--builder-accent)]'
                        : 'bg-white/[0.04] text-zinc-500',
                    )}
                  >
                    {count}
                  </span>
                </button>

                {active && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(day)
                    }}
                    className={cn(
                      'absolute right-2 top-1/2 z-10 flex size-6 -translate-y-1/2',
                      'items-center justify-center rounded-md',
                      'border border-white/15 bg-[var(--s2)] text-zinc-400 shadow-md',
                      'transition-colors hover:border-cyan-500/40 hover:bg-[#171D28] hover:text-cyan-300',
                    )}
                    aria-label={`Editar divisão ${day.name}`}
                    title="Editar divisão"
                  >
                    <Pencil size={11} strokeWidth={2.25} />
                  </button>
                )}
              </div>
            )
          })}

          <AddDivisionTab onClick={onAdd} isOnly={days.length === 0} variant="builder" />
        </div>
      </div>
    </div>
  )
}
