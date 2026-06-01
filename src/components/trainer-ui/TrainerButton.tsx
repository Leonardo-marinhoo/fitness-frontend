import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type TrainerButtonProps = {
  children: ReactNode
  to?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
}

export function TrainerButton({
  children,
  to,
  onClick,
  variant = 'primary',
  className,
}: TrainerButtonProps) {
  const styles = cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300',
    variant === 'primary' &&
      'bg-trainer-accent text-trainer-on-accent hover:brightness-110 focus-visible:ring-2 focus-visible:ring-trainer-accent/40',
    variant === 'secondary' &&
      'border border-trainer-border bg-trainer-surface text-trainer-text hover:border-trainer-border-strong hover:bg-trainer-surface-hover',
    className,
  )

  if (to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} className={styles}>
      {children}
    </button>
  )
}
