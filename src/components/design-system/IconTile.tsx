import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type IconTileProps = {
  icon?: LucideIcon
  children?: ReactNode
  active?: boolean
  className?: string
  size?: 'sm' | 'md'
}

export function IconTile({ icon: Icon, children, active = false, className, size = 'md' }: IconTileProps) {
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  const iconSize = size === 'sm' ? 16 : 18

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-xl border',
        dim,
        active
          ? 'border-primary/40 bg-primary/20 text-primary'
          : 'border-[var(--s-border)] bg-[var(--s2)] text-foreground/70',
        className,
      )}
    >
      {children ?? (Icon ? <Icon size={iconSize} strokeWidth={2} /> : null)}
    </span>
  )
}
