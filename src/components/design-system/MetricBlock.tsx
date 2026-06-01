import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type MetricBlockProps = {
  value: ReactNode
  label: string
  glow?: boolean
  className?: string
  valueClassName?: string
}

export function MetricBlock({ value, label, glow = false, className, valueClassName }: MetricBlockProps) {
  return (
    <div className={cn(glow ? 'glass-spotlight p-5' : 's2 p-5', className)}>
      <p className={cn('text-metric text-primary', valueClassName)}>{value}</p>
      <p className="text-caption mt-2">{label}</p>
    </div>
  )
}
