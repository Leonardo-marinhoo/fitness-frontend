import { TrendingDown, TrendingUp } from 'lucide-react'

import { cn } from '@/lib/utils'

type TrendIndicatorProps = {
  value: number
  className?: string
}

export function TrendIndicator({ value, className }: TrendIndicatorProps) {
  const positive = value >= 0
  const Icon = positive ? TrendingUp : TrendingDown

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums',
        positive
          ? 'bg-trainer-accent/10 text-trainer-accent'
          : 'bg-trainer-destructive/10 text-trainer-destructive',
        className,
      )}
    >
      <Icon size={12} />
      {positive ? '+' : ''}
      {value}
    </span>
  )
}
