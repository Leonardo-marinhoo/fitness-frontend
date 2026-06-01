import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type TrainerMonthlyChartProps = {
  sessionsThisWeek: number
  loading?: boolean
}

const MONTH_DAYS = Array.from({ length: 30 }, (_, index) => String(index + 1).padStart(2, '0'))

const MONTH_STROKE = '#efff3a'
const MONTH_SHADOW = 'rgba(239, 255, 58, 0.16)'

function buildMonthlySeries(target: number) {
  return MONTH_DAYS.map((label, index, all) => {
    const progress = (index + 1) / all.length
    const ramp = 0.12 + Math.pow(progress, 1.25) * 0.82
    const wave =
      Math.sin((index + 1) / 1.45) * 0.09 +
      Math.cos((index + 1) / 3.25) * 0.05 +
      Math.sin((index + 1) / 6.8) * 0.025
    const normalized = Math.max(0.04, Math.min(1.08, ramp + wave))

    return {
      label,
      value: index === all.length - 1 ? target : Math.max(0, Math.round(target * normalized)),
    }
  })
}

export function TrainerMonthlyChart({
  sessionsThisWeek,
  loading = false,
}: TrainerMonthlyChartProps) {
  const chartData = useMemo(() => {
    return buildMonthlySeries(Math.max(sessionsThisWeek * 4, sessionsThisWeek))
  }, [sessionsThisWeek])

  const peak = chartData.reduce(
    (best, point) => (point.value > best.value ? point : best),
    chartData[0] ?? { label: '', value: 0 },
  )
  const currentPoint = chartData[chartData.length - 1] ?? { label: '', value: 0 }
  const orbitValue = peak.value > 0 ? Math.round((currentPoint.value / peak.value) * 100) : 0
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date())
  const detailCopy = `${sessionsThisWeek} sessões nesta semana`

  return (
    <section className="trainer-lux-panel trainer-lux-panel--month td-order-chart">
      <div className="trainer-lux-panel-header">
        <div>
          <p className="trainer-lux-panel-kicker">Leitura mensal</p>
          <h2 className="trainer-lux-panel-title">Visão do mês</h2>
          <p className="trainer-lux-panel-description">
            Comportamento ilustrativo construído a partir dos totais atuais.
          </p>
        </div>
        <div className="trainer-lux-month-chip">
          {monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)}
        </div>
      </div>

      {loading ? (
        <span className="block h-[348px] animate-pulse rounded-[2rem] bg-white/[0.035]" />
      ) : (
        <div className="trainer-lux-month-grid">
          <div className="trainer-lux-month-main">
            <div className="trainer-lux-month-summary">
              <div>
                <p>Sessões projetadas</p>
                <strong>{currentPoint.value}</strong>
              </div>
              <span>{detailCopy}</span>
            </div>

            <div className="trainer-lux-month-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 12, right: 18, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="trainerLuxMonthFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={MONTH_STROKE} stopOpacity={0.22} />
                      <stop offset="65%" stopColor={MONTH_STROKE} stopOpacity={0.08} />
                      <stop offset="100%" stopColor={MONTH_STROKE} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.045)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tickFormatter={(value) =>
                      ['01', '05', '10', '15', '20', '25', '30'].includes(value) ? value : ''
                    }
                    tick={{ fill: 'rgba(229, 229, 229, 0.5)', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(229, 229, 229, 0.34)', fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0e1011',
                      border: '1px solid rgba(239, 255, 58, 0.18)',
                      borderRadius: 18,
                      boxShadow: `0 18px 40px ${MONTH_SHADOW}`,
                      color: '#f5f1e8',
                    }}
                    labelStyle={{ color: 'rgba(245, 241, 232, 0.58)' }}
                    itemStyle={{ color: MONTH_STROKE }}
                    formatter={(value) => [`${value ?? 0}`, 'volume']}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={MONTH_STROKE}
                    strokeWidth={2.25}
                    fill="url(#trainerLuxMonthFill)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#101208', stroke: MONTH_STROKE, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="trainer-lux-month-orbit">
            <div
              className="trainer-lux-progress-ring"
              style={
                {
                  '--progress': `${orbitValue}%`,
                  '--ring-tone': MONTH_STROKE,
                } as React.CSSProperties
              }
            >
              <div>
                <p>Ritmo atual</p>
                <strong>{orbitValue}%</strong>
                <span>
                  {currentPoint.value} / {peak.value || currentPoint.value}
                </span>
              </div>
            </div>

            <div className="trainer-lux-month-foot">
              <p>Pico observado</p>
              <strong>
                dia {peak.label} · {peak.value}
              </strong>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
