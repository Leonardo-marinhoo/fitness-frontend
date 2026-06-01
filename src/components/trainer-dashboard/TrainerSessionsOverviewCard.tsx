import { CalendarRange, Waves } from 'lucide-react'

type TrainerSessionsOverviewCardProps = {
  sessionsToday: number
  sessionsThisWeek: number
  loading?: boolean
}

export function TrainerSessionsOverviewCard({
  sessionsToday,
  sessionsThisWeek,
  loading = false,
}: TrainerSessionsOverviewCardProps) {
  const monthProjection = Math.max(0, sessionsThisWeek * 4)

  return (
    <article className="trainer-lux-panel trainer-lux-panel--sessions">
      <div className="trainer-lux-session-grid">
        <div className="trainer-lux-session-block">
          <span className="trainer-lux-session-icon" data-tone="gold">
            <CalendarRange size={18} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className="trainer-lux-metric-label">Sessões hoje</p>
            <p className="trainer-lux-session-value">{loading ? '—' : sessionsToday}</p>
            <p className="trainer-lux-session-note">
              {loading
                ? 'Aguarde a leitura do dia'
                : sessionsToday > 0
                  ? 'rotina em andamento'
                  : 'sem registros lançados hoje'}
            </p>
          </div>
        </div>

        <div className="trainer-lux-session-divider" aria-hidden />

        <div className="trainer-lux-session-block">
          <span className="trainer-lux-session-icon" data-tone="emerald">
            <Waves size={18} strokeWidth={1.9} />
          </span>
          <div className="min-w-0">
            <p className="trainer-lux-metric-label">Sessões na semana</p>
            <p className="trainer-lux-session-value">{loading ? '—' : sessionsThisWeek}</p>
            <p className="trainer-lux-session-note">
              {loading
                ? 'Sincronizando o ritmo semanal'
                : monthProjection > 0
                  ? `projeção mensal ${monthProjection}`
                  : 'defina o ritmo desta semana'}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
