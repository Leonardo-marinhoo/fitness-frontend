import { Plus, Trash2 } from 'lucide-react'

import { EnumBadge } from '@/components/ui/enum-badge'
import { cn } from '@/lib/utils'
import { getDayOfWeekStyle } from '@/lib/enum-colors'
import type { TrainingDay } from '@/types/fitness'

type DivisionNavProps = {
  days: TrainingDay[]
  selectedDayId: number | null
  onSelect: (dayId: number) => void
  onDelete: (dayId: number) => void
}

function DivisionNavItem({
  day,
  active,
  onSelect,
  onDelete,
  compact = false,
}: {
  day: TrainingDay
  active: boolean
  onSelect: () => void
  onDelete: () => void
  compact?: boolean
}) {
  const count = day.training_exercises?.length ?? 0
  const dayStyle = day.day_of_week ? getDayOfWeekStyle(day.day_of_week) : null

  if (compact) {
    return (
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          'flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left transition-colors',
          active
            ? 'border-primary/35 bg-primary/10 text-foreground'
            : 'border-[var(--s-border)] bg-[var(--s1)] text-foreground/80 hover:bg-[var(--s2)]',
        )}
      >
        <span className="max-w-[8rem] truncate text-sm font-semibold">{day.name}</span>
        <span className="text-[10px] text-foreground/40">{count}</span>
      </button>
    )
  }

  return (
    <div
      className={cn(
        'group flex items-center gap-0.5 rounded-lg transition-colors',
        active
          ? 'border-l-2 border-primary bg-primary/8'
          : 'border-l-2 border-transparent hover:bg-[var(--s2)]',
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 flex-col items-start gap-1 px-3 py-2.5 text-left"
      >
        <span
          className={cn(
            'truncate text-sm font-semibold',
            active ? 'text-foreground' : 'text-foreground/80',
          )}
        >
          {day.name}
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {dayStyle && <EnumBadge size="sm" style={dayStyle} />}
          <span className="text-[10px] text-foreground/40">{count} ex.</span>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="mr-1 rounded-md p-1.5 text-foreground/25 opacity-0 transition-all hover:bg-red-500/10 hover:text-red-400 group-hover:opacity-100"
        aria-label="Remover divisão"
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

export function DivisionTabs({ days, selectedDayId, onSelect }: Omit<DivisionNavProps, 'onDelete'>) {
  if (days.length === 0) {
    return null
  }

  return (
    <div className="sheet-builder-tabs" role="tablist" aria-label="Divisões">
      {days.map((day) => (
        <DivisionNavItem
          key={day.id}
          day={day}
          active={day.id === selectedDayId}
          onSelect={() => onSelect(day.id)}
          onDelete={() => {}}
          compact
        />
      ))}
    </div>
  )
}

type DivisionSidebarProps = DivisionNavProps & {
  onAdd: () => void
}

export function DivisionSidebar({
  days,
  selectedDayId,
  onSelect,
  onAdd,
  onDelete,
}: DivisionSidebarProps) {
  return (
    <aside className="sheet-builder-rail">
      <div className="border-b border-[var(--s-border)] px-4 py-3">
        <p className="text-eyebrow">Divisões</p>
      </div>

      <div className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
        {days.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-foreground/40">Nenhuma divisão ainda</p>
        ) : (
          days.map((day) => (
            <DivisionNavItem
              key={day.id}
              day={day}
              active={day.id === selectedDayId}
              onSelect={() => onSelect(day.id)}
              onDelete={() => onDelete(day.id)}
            />
          ))
        )}
      </div>

      <div className="border-t border-[var(--s-border)] p-2">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--s-border-h)] py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/8"
        >
          <Plus size={16} />
          Divisão
        </button>
      </div>
    </aside>
  )
}
