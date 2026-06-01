import { cn } from '@/lib/utils'

export type HeatmapCell = {
  label: string
  value: number
  intensity: number
}

type ActivityHeatmapProps = {
  cells: HeatmapCell[]
  title?: string
  className?: string
}

export function ActivityHeatmap({
  cells,
  title = 'Atividade da semana',
  className,
}: ActivityHeatmapProps) {
  return (
    <article className={cn('flex flex-col gap-4', className)}>
      <p className="trainer-eyebrow">{title}</p>
      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell) => (
          <HeatmapDay key={cell.label} cell={cell} />
        ))}
      </div>
    </article>
  )
}

function HeatmapDay({ cell }: { cell: HeatmapCell }) {
  const { intensity, value, label } = cell
  const alpha = 0.06 + intensity * 0.42
  const borderAlpha = 0.12 + intensity * 0.35

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'flex size-9 items-center justify-center rounded-lg border text-[11px] font-medium tabular-nums transition-all duration-300 hover:ring-1 hover:ring-trainer-accent/40',
          intensity > 0.6 && 'ring-1 ring-trainer-accent/30',
        )}
        style={{
          background: `color-mix(in oklab, var(--trainer-accent) ${Math.round(alpha * 100)}%, transparent)`,
          borderColor: `color-mix(in oklab, var(--trainer-accent) ${Math.round(borderAlpha * 100)}%, var(--trainer-border))`,
          color: intensity > 0.4 ? 'var(--trainer-text)' : 'var(--trainer-text-subtle)',
        }}
        title={`${value} sessão${value !== 1 ? 'ões' : ''}`}
      >
        {value > 0 ? value : '·'}
      </div>
      <span className="text-[10px] text-trainer-subtle">{label}</span>
    </div>
  )
}
