import { Trash2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { TrainingDay } from '@/types/fitness'

import { AddDivisionTab } from './AddDivisionTab'

type DivisionTabsBarProps = {
  days: TrainingDay[]
  selectedDayId: number | null
  onSelect: (dayId: number) => void
  onAdd: () => void
  onDelete: (dayId: number) => void
}

export function DivisionTabsBar({
  days,
  selectedDayId,
  onSelect,
  onAdd,
  onDelete,
}: DivisionTabsBarProps) {
  return (
    <div
      className="border-b border-[var(--s-border)] px-4 lg:px-6"
      role="tablist"
      aria-label="Divisões da ficha"
    >
      <div className="flex min-w-0 items-stretch gap-0 overflow-x-auto">
        {days.map((day) => {
          const active = day.id === selectedDayId
          const count = day.training_exercises?.length ?? 0

          return (
            <button
              key={day.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(day.id)}
              className={cn(
                'flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors -mb-px',
                active
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-foreground/50 hover:text-foreground/80',
              )}
            >
              <span className="max-w-[10rem] truncate sm:max-w-none">{day.name}</span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                  active ? 'bg-primary/15 text-primary' : 'bg-[var(--s2)] text-foreground/40',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}

        <AddDivisionTab onClick={onAdd} isOnly={days.length === 0} />

        {selectedDayId != null && days.length > 0 && (
          <button
            type="button"
            onClick={() => onDelete(selectedDayId)}
            className="mb-px ml-1 flex shrink-0 items-center self-center rounded-md p-2 text-foreground/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
            aria-label="Remover divisão selecionada"
            title="Remover divisão"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  )
}
