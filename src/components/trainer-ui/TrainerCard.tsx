import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TrainerCardVariant = 'default' | 'accent' | 'interactive'

type TrainerCardProps = {
  children: ReactNode
  className?: string
  variant?: TrainerCardVariant
  onClick?: () => void
}

const variantClass: Record<TrainerCardVariant, string> = {
  default:
    'border-trainer-border bg-trainer-surface',
  accent:
    'border-trainer-accent/20 bg-trainer-surface',
  interactive:
    'border-trainer-border bg-trainer-surface transition-colors duration-200 hover:border-trainer-border-strong hover:bg-trainer-surface-hover',
}

export function TrainerCard({
  children,
  className,
  variant = 'default',
  onClick,
}: TrainerCardProps) {
  const base = cn('rounded-xl border p-6', variantClass[variant], className)

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(base, 'w-full text-left')}>
        {children}
      </button>
    )
  }

  return <div className={base}>{children}</div>
}
