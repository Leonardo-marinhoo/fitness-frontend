import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SurfaceVariant = 'solid' | 'elevated' | 'glass'

type SurfaceCardProps = {
  children: ReactNode
  variant?: SurfaceVariant
  className?: string
}

const variantClass: Record<SurfaceVariant, string> = {
  solid: 'surface-premium',
  elevated: 'glass-elevated',
  glass: 'glass-premium',
}

export function SurfaceCard({ children, variant = 'solid', className }: SurfaceCardProps) {
  return <div className={cn(variantClass[variant], className)}>{children}</div>
}
