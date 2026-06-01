import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { cn } from '@/lib/utils'

import type { ProgressChartPoint, ProgressMetricId } from './compute-sheet-stats'

const METRICS: {
  id: ProgressMetricId
  label: string
  stroke: string
  fillId: string
  unit: string
}[] = [
  { id: 'carga', label: 'Carga', stroke: '#70D7FF', fillId: 'progressCarga', unit: 'kg' },
  { id: 'calorias', label: 'Calorias', stroke: '#F3BB61', fillId: 'progressCalorias', unit: 'kcal' },
  { id: 'massa_magra', label: 'Massa magra', stroke: '#34D399', fillId: 'progressMassa', unit: 'kg' },
]

type StudentProgressChartProps = {
  data: ProgressChartPoint[]
  deltas: Record<ProgressMetricId, string | null>
}

function ChartTooltip({
  active,
  payload,
  unit,
}: {
  active?: boolean
  payload?: { value: number }[]
  unit: string
}) {
  if (!active || !payload?.length) {
    return null
  }

  const value = payload[0]?.value
  if (!Number.isFinite(value)) {
    return null
  }

  return (
    <div className="rounded-lg border border-white/10 bg-[var(--s2)] px-2.5 py-1.5 text-xs shadow-lg">
      <span className="font-semibold tabular-nums text-zinc-100">
        {value.toLocaleString('pt-BR', { maximumFractionDigits: unit === 'kcal' ? 0 : 1 })}{' '}
        {unit}
      </span>
    </div>
  )
}

export function StudentProgressChart({ data, deltas }: StudentProgressChartProps) {
  const [metric, setMetric] = useState<ProgressMetricId>('carga')
  const active = METRICS.find((m) => m.id === metric) ?? METRICS[0]
  const delta = deltas[metric]

  return (
    <div className="space-y-3">
      <div className="flex gap-1 rounded-lg border border-white/[0.06] bg-[var(--bg-subtle)] p-1">
        {METRICS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMetric(m.id)}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-[11px] font-medium transition-colors',
              metric === m.id
                ? 'bg-white/[0.08] text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300',
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="relative">
        {delta && (
          <span
            className="absolute right-0 top-0 z-10 rounded-md px-2 py-0.5 text-xs font-semibold tabular-nums"
            style={{
              color: active.stroke,
              backgroundColor: `${active.stroke}22`,
            }}
          >
            {delta}
          </span>
        )}

        <div className="h-[112px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                {METRICS.map((m) => (
                  <linearGradient key={m.fillId} id={m.fillId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={m.stroke} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={m.stroke} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#71717a', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={36}
                tickFormatter={(v: number) =>
                  v >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v))
                }
              />
              <Tooltip
                content={<ChartTooltip unit={active.unit} />}
                cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke={active.stroke}
                strokeWidth={2}
                fill={`url(#${active.fillId})`}
                dot={false}
                activeDot={{ r: 3, fill: active.stroke, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <p className="type-caption mt-2">
          Últimas 8 semanas · dados ilustrativos até integração com histórico completo
        </p>
      </div>
    </div>
  )
}
