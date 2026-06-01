import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

type ListRowPremiumProps = {
  leading?: ReactNode
  title: ReactNode
  caption?: ReactNode
  trailing?: ReactNode
  onClick?: () => void
  className?: string
  style?: CSSProperties
  as?: 'div' | 'button'
}

export function ListRowPremium({
  leading,
  title,
  caption,
  trailing,
  onClick,
  className,
  style,
  as,
}: ListRowPremiumProps) {
  const Comp = as ?? (onClick ? 'button' : 'div')
  const shared = cn(
    'surface-interactive border-premium flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left',
    onClick && 'cursor-pointer',
    className,
  )

  const content = (
    <>
      {leading && <div className="shrink-0">{leading}</div>}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{title}</p>
        {caption && <div className="text-caption mt-0.5">{caption}</div>}
      </div>
      {trailing && <div className="flex shrink-0 items-center gap-2">{trailing}</div>}
    </>
  )

  if (Comp === 'button') {
    return (
      <button type="button" onClick={onClick} className={shared} style={style}>
        {content}
      </button>
    )
  }

  return (
    <div className={shared} style={style}>
      {content}
    </div>
  )
}
