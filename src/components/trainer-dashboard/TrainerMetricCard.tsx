import type { ElementType } from 'react'

import { cn } from '@/lib/utils'

import { TrainerStatMiniChart } from './TrainerStatMiniChart'
import type { TintKey } from './tints'
import { TINT } from './tints'

type StatChartVariant = 'line' | 'bar'

export function TrainerMetricCard({
  label,
  value,
  icon: Icon,
  tintKey,
  chartData,
  chartVariant = 'line',
  loading = false,
  hint,
  spotlight = false,
}: {
  label: string
  value: number | string
  icon: ElementType
  tintKey: TintKey
  chartData: number[]
  chartVariant?: StatChartVariant
  loading?: boolean
  hint?: string
  spotlight?: boolean
}) {
  const tint = TINT[tintKey]

  return (
    <article
      className={cn(
        'trainer-lux-panel trainer-lux-panel--metric h-full',
        spotlight && 'trainer-lux-panel--metric-spotlight',
      )}
      style={{ '--metric-tone': tint.color } as React.CSSProperties}
    >
      <div className="trainer-lux-metric-head">
        <span
          className="trainer-lux-metric-icon"
          style={
            {
              '--td-icon-bg-top': tint.iconTop,
              '--td-icon-bg-bottom': tint.iconBottom,
              '--td-icon-border': tint.iconBorder,
            } as React.CSSProperties
          }
        >
          <Icon size={18} strokeWidth={2.05} style={{ color: tint.color }} />
        </span>
      </div>

      <div className="trainer-lux-metric-copy">
        <p className="trainer-lux-metric-label">{label}</p>
        <div className="trainer-lux-metric-value">
          {loading ? (
            <span className="inline-block h-10 w-18 animate-pulse rounded-lg bg-white/8" />
          ) : (
            value
          )}
        </div>
        {hint ? (
          <p className="trainer-lux-metric-hint">
            <span aria-hidden />
            {hint}
          </p>
        ) : null}
      </div>

      <div className="trainer-lux-metric-chart">
        {loading ? (
          <span className="block h-14 rounded-2xl bg-white/[0.035]" />
        ) : (
          <TrainerStatMiniChart data={chartData} tintKey={tintKey} variant={chartVariant} />
        )}
      </div>
    </article>
  )
}
