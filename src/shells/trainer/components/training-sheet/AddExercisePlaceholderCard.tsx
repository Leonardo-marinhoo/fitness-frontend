import { Plus } from 'lucide-react'

type AddExercisePlaceholderCardProps = {
  onClick: () => void
}

export function AddExercisePlaceholderCard({ onClick }: AddExercisePlaceholderCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="sheet-builder-add-exercise-card group mx-4 mb-4 flex w-[calc(100%-2rem)] flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[var(--s-border-h)] bg-[var(--s2)]/30 px-4 py-8 text-center transition-colors hover:border-foreground/25 hover:bg-[var(--s2)]/60 lg:mx-6 lg:w-[calc(100%-3rem)]"
    >
      <span className="flex size-9 items-center justify-center rounded-full border border-[var(--s-border)] bg-[var(--s1)] text-foreground/45 transition-colors group-hover:border-foreground/20 group-hover:text-foreground/65">
        <Plus size={18} strokeWidth={1.75} />
      </span>
      <span className="text-sm font-medium text-foreground/55 group-hover:text-foreground/75">
        Adicionar exercício
      </span>
      <span className="max-w-xs text-xs text-foreground/38">
        Escolha da biblioteca e defina séries, repetições e carga
      </span>
    </button>
  )
}
