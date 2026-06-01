import type { CSSProperties } from 'react'

import type { StudentEvolutionActivityCell } from '@/types/fitness'

const HEATMAP_LEVELS: Record<number, CSSProperties> = {
  0: {
    background: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.04)',
  },
  1: {
    background: 'color-mix(in oklab, var(--accent-lime) 28%, rgba(22, 26, 20, 0.92))',
    borderColor: 'color-mix(in oklab, var(--accent-lime) 42%, transparent)',
  },
  2: {
    background: 'color-mix(in oklab, var(--accent-lime) 46%, rgba(22, 26, 20, 0.96))',
    borderColor: 'color-mix(in oklab, var(--accent-lime) 54%, transparent)',
  },
  3: {
    background: 'color-mix(in oklab, var(--accent-lime) 65%, rgba(26, 32, 20, 0.98))',
    borderColor: 'color-mix(in oklab, var(--accent-lime) 60%, transparent)',
  },
  4: {
    background: 'linear-gradient(180deg, var(--accent-lime), color-mix(in oklab, var(--accent-lime) 78%, #efffaa))',
    borderColor: 'color-mix(in oklab, var(--accent-lime) 68%, #e6f9a0)',
  },
}

function formatDateLong(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function chunkActivity(cells: StudentEvolutionActivityCell[]): StudentEvolutionActivityCell[][] {
  const weeks: StudentEvolutionActivityCell[][] = []
  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }
  return weeks
}

export function StudentCommitHeatmap({
  cells,
  title = 'Painel de presença no treino',
  subtitle = 'Cada bloco representa um dia. Quanto mais aceso, mais vezes você apareceu para treinar.',
}: {
  cells: StudentEvolutionActivityCell[]
  title?: string
  subtitle?: string
}) {
  const weeks = chunkActivity(cells)

  return (
    <div>
      <div className="student-evolution__section-head">
        <div>
          <p className="student-evolution__section-kicker">Sua ofensiva</p>
          <h2 className="student-evolution__section-title">{title}</h2>
          <p className="student-evolution__section-copy">{subtitle}</p>
        </div>
      </div>

      <div className="student-evolution__heatmap-shell">
        <div className="student-evolution__heatmap-axis">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="student-evolution__heatmap-grid">
          {weeks.map((week, weekIndex) => (
            <div key={`week-${weekIndex}`} className="student-evolution__heatmap-week">
              {week.map((cell) => (
                <div
                  key={cell.date}
                  className="student-evolution__heatmap-cell"
                  style={HEATMAP_LEVELS[cell.level]}
                  title={`${formatDateLong(cell.date)} · ${cell.count} treino${cell.count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="student-evolution__legend">
        <span>Menos</span>
        <div className="student-evolution__legend-scale">
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} style={HEATMAP_LEVELS[level]} />
          ))}
        </div>
        <span>Mais</span>
      </div>
    </div>
  )
}
