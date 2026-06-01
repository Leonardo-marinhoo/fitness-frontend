import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import type { MuscleGroupSlice } from './compute-sheet-stats'

type MuscleGroupsChartProps = {
  slices: MuscleGroupSlice[]
}

export function MuscleGroupsChart({ slices }: MuscleGroupsChartProps) {
  if (slices.length === 0) {
    return <p className="py-6 text-center text-xs text-zinc-600">Sem dados de grupos musculares.</p>
  }

  return (
    <div className="flex items-center gap-4">
      <div className="h-[120px] w-[120px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              innerRadius={36}
              outerRadius={52}
              paddingAngle={2}
              stroke="transparent"
            >
              {slices.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {slices.map((s) => (
          <li key={s.name} className="flex items-center justify-between gap-2 text-xs">
            <span className="flex min-w-0 items-center gap-2.5 text-zinc-400">
              <span
                className="size-2.5 shrink-0 rounded-full ring-1 ring-white/10"
                style={{ backgroundColor: s.color }}
                aria-hidden
              />
              <span className="truncate">{s.name}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums" style={{ color: s.color }}>
              {s.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
