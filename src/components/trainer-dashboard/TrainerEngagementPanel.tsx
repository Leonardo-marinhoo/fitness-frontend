import { Activity, GaugeCircle, Orbit } from 'lucide-react'

import { TrainerStatMiniChart } from './TrainerStatMiniChart'
import { STAT_SERIES, metricSeries } from './tints'

type TrainerEngagementPanelProps = {
  sessionsToday: number
  sessionsThisWeek: number
  totalStudents: number
  activeSheets: number
  loading?: boolean
}

export function TrainerEngagementPanel({
  sessionsToday,
  sessionsThisWeek,
  totalStudents,
  activeSheets,
  loading = false,
}: TrainerEngagementPanelProps) {
  const activeCoverage = totalStudents > 0 ? Math.round((activeSheets / totalStudents) * 100) : 0
  const weeklyAverage = activeSheets > 0 ? (sessionsThisWeek / activeSheets).toFixed(1) : '0.0'
  const dailyPulse =
    sessionsThisWeek > 0
      ? Math.min(100, Math.round((sessionsToday / Math.max(1, Math.ceil(sessionsThisWeek / 5))) * 100))
      : 0

  return (
    <section className="trainer-lux-panel trainer-lux-panel--insight h-full">
      <div className="trainer-lux-panel-header">
        <div>
          <p className="trainer-lux-panel-kicker">Semana</p>
          <h2 className="trainer-lux-panel-title">Inteligência da semana</h2>
        </div>
      </div>

      {loading ? (
        <span className="block h-[240px] animate-pulse rounded-[1.75rem] bg-white/[0.035]" />
      ) : (
        <>
          <div className="trainer-lux-insight-grid">
            <article className="trainer-lux-insight-card">
              <div className="trainer-lux-insight-head">
                <span className="trainer-lux-insight-icon" data-tone="emerald">
                  <Activity size={17} strokeWidth={1.95} />
                </span>
                <div>
                  <p className="trainer-lux-metric-label">Volume de sessões</p>
                  <strong>{sessionsThisWeek}</strong>
                </div>
              </div>

              <div className="trainer-lux-insight-chart">
                <TrainerStatMiniChart
                  data={metricSeries(sessionsThisWeek, STAT_SERIES.week)}
                  tintKey="lime"
                />
              </div>

              <div className="trainer-lux-insight-footer">
                <span>últimos 7 dias</span>
                <span>{sessionsToday} hoje</span>
              </div>
            </article>

            <article className="trainer-lux-insight-card">
              <div className="trainer-lux-insight-head">
                <span className="trainer-lux-insight-icon" data-tone="gold">
                  <Orbit size={17} strokeWidth={1.95} />
                </span>
                <div>
                  <p className="trainer-lux-metric-label">Cobertura ativa</p>
                  <strong>{activeCoverage}%</strong>
                </div>
              </div>

              <div
                className="trainer-lux-mini-ring"
                style={
                  {
                    '--progress': `${activeCoverage}%`,
                    '--ring-tone': '#efff3a',
                  } as React.CSSProperties
                }
              >
                <div>
                  <span>{activeSheets}</span>
                  <small>fichas</small>
                </div>
              </div>

              <div className="trainer-lux-insight-footer">
                <span>{activeSheets} fichas ativas</span>
                <span>{totalStudents} alunos na base</span>
              </div>
            </article>

            <article className="trainer-lux-insight-card">
              <div className="trainer-lux-insight-head">
                <span className="trainer-lux-insight-icon" data-tone="bronze">
                  <GaugeCircle size={17} strokeWidth={1.95} />
                </span>
                <div>
                  <p className="trainer-lux-metric-label">Ritmo por ficha</p>
                  <strong>{weeklyAverage}</strong>
                </div>
              </div>

              <div className="trainer-lux-load-meter">
                <i>
                  <b style={{ width: `${Math.max(10, dailyPulse)}%` }} />
                </i>
              </div>

              <div className="trainer-lux-insight-footer">
                <span>sessões por ficha ativa</span>
                <span>pulso diário {dailyPulse}%</span>
              </div>
            </article>
          </div>

          <div className="trainer-lux-insight-note">
            Insights derivados das sessões da semana e da cobertura atual da base.
          </div>
        </>
      )}
    </section>
  )
}
