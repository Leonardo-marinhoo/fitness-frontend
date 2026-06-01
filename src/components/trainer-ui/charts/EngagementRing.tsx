import { useId } from 'react'

import { cn } from '@/lib/utils'

type EngagementRingProps = {
  value: number
  max?: number
  label: string
  sublabel?: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function EngagementRing({
  value,
  max = 100,
  label,
  sublabel,
  size = 120,
  strokeWidth = 8,
  className,
}: EngagementRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const offset = circumference - (pct / 100) * circumference
  const center = size / 2
  const gradientId = useId()

  return (
    <article className={cn('flex flex-col items-center gap-3', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            className="stroke-trainer-border"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8bcf17" />
              <stop offset="100%" stopColor="#5a8f10" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="trainer-metric trainer-metric--accent">{Math.round(pct)}%</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-medium text-trainer-text">{label}</p>
        {sublabel ? <p className="trainer-body mt-0.5 text-[11px]">{sublabel}</p> : null}
      </div>
    </article>
  )
}
