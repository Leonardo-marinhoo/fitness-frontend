import { useId } from 'react'

import { cn } from '@/lib/utils'

import { TrendIndicator } from './TrendIndicator'

type SessionSparklineProps = {
  data: number[]
  label: string
  unit?: string
  className?: string
}

export function SessionSparkline({ data, label, unit = '', className }: SessionSparklineProps) {
  const fillId = useId()
  const width = 160
  const height = 48
  const padding = 4
  const max = Math.max(1, ...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data
    .map((value, index) => {
      const x = padding + (index / Math.max(1, data.length - 1)) * (width - padding * 2)
      const y = height - padding - ((value - min) / range) * (height - padding * 2)
      return `${x},${y}`
    })
    .join(' ')

  const last = data[data.length - 1] ?? 0
  const prev = data[data.length - 2] ?? 0
  const trend = last - prev

  return (
    <article className={cn('flex flex-col gap-3', className)}>
      <header className="flex items-end justify-between gap-2">
        <div>
          <p className="trainer-eyebrow">{label}</p>
          <p className="trainer-metric mt-1">
            {last}
            {unit ? <span className="ml-1 text-sm font-normal text-trainer-muted">{unit}</span> : null}
          </p>
        </div>
        <TrendIndicator value={trend} />
      </header>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-[180px] overflow-visible"
        aria-hidden
      >
        <defs>
          <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--trainer-accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--trainer-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {data.length > 1 ? (
          <>
            <polygon
              points={`${padding},${height - padding} ${points} ${width - padding},${height - padding}`}
              fill={`url(#${fillId})`}
            />
            <polyline
              points={points}
              fill="none"
              stroke="var(--trainer-accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="motion-safe:animate-[spark-draw_1s_ease-out_forwards]"
              style={{
                strokeDasharray: 200,
                strokeDashoffset: 200,
                animation: 'spark-draw 1s ease-out forwards',
              }}
            />
          </>
        ) : null}
      </svg>
      <p className="trainer-eyebrow normal-case tracking-wider">Últimos 7 dias</p>
    </article>
  )
}
