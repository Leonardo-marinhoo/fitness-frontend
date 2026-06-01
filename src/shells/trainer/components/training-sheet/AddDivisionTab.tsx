import { Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

import { splitTabTrigger } from './builder/styles'

type AddDivisionTabProps = {
  onClick: () => void
  isOnly?: boolean
  variant?: 'default' | 'builder'
}

export function AddDivisionTab({ onClick, isOnly, variant = 'default' }: AddDivisionTabProps) {
  const isBuilder = variant === 'builder'

  return (
    <button
      type="button"
      role="tab"
      aria-selected={false}
      onClick={onClick}
      className={cn(
        splitTabTrigger,
        'border-dashed text-sm',
        isBuilder
          ? 'border-[var(--builder-accent-secondary)]/40 text-zinc-500 hover:border-[var(--builder-accent-secondary)]/65 hover:text-zinc-300'
          : 'border-foreground/20 text-foreground/40 hover:border-foreground/35 hover:text-foreground/65',
        !isBuilder && 'focus-visible:border-primary/40 focus-visible:text-foreground/70',
        isOnly && 'min-w-[11rem]',
      )}
    >
      <Plus size={16} strokeWidth={1.75} className="opacity-75" />
      <span className="type-body-medium whitespace-nowrap font-normal">
        {isOnly ? 'Adicionar primeira divisão' : 'Nova divisão'}
      </span>
    </button>
  )
}
