import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type GlassChromeProps = {
  children: ReactNode
  className?: string
}

export function GlassChrome({ children, className }: GlassChromeProps) {
  return <div className={cn('surface-soft', className)}>{children}</div>
}
