import type { TintKey } from './tints'
import { buildSmoothPath } from './helpers'
import { TINT } from './tints'

type StatChartVariant = 'line' | 'bar'

export function TrainerStatMiniChart({
  data,
  tintKey,
  variant = 'line',
}: {
  data: number[]
  tintKey: TintKey
  variant?: StatChartVariant
}) {
  const tint = TINT[tintKey]
  const width = 200
  const height = 56
  const paddingX = 4
  const paddingY = 6
  const max = Math.max(1, ...data)
  const min = Math.min(...data)
  const range = Math.max(1, max - min)

  const points = data.map((value, index) => {
    const x = paddingX + (index / Math.max(1, data.length - 1)) * (width - paddingX * 2)
    const y = height - paddingY - ((value - min) / range) * (height - paddingY * 2)
    return { x, y, value }
  })

  const pointList = points.map((point) => `${point.x},${point.y}`).join(' ')
  const curvePath = buildSmoothPath(points)
  const barGap = 7
  const barWidth = (width - paddingX * 2 - barGap * (data.length - 1)) / data.length

  return (
    <svg className="td-stat-chart" viewBox={`0 0 ${width} ${height}`} aria-hidden>
      <defs>
        <linearGradient id={`mini-fill-${tintKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint.color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={tint.color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1={paddingX}
        x2={width - paddingX}
        y1={height - paddingY}
        y2={height - paddingY}
        className="td-stat-chart__axis"
      />
      {variant === 'bar' ? (
        points.map((point, index) => {
          const barHeight = Math.max(3, height - paddingY - point.y)
          return (
            <rect
              key={`${point.value}-${index}`}
              x={paddingX + index * (barWidth + barGap)}
              y={height - paddingY - barHeight}
              width={barWidth}
              height={barHeight}
              rx="3"
              fill={tint.color}
              opacity={0.16 + (point.value / max) * 0.5}
            />
          )
        })
      ) : (
        <>
          <polygon
            points={`${paddingX},${height - paddingY} ${pointList} ${width - paddingX},${height - paddingY}`}
            fill={`url(#mini-fill-${tintKey})`}
          />
          <path
            d={curvePath}
            fill="none"
            stroke={tint.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.length > 0 ? (
            <circle
              cx={points[points.length - 1].x}
              cy={points[points.length - 1].y}
              r="3.25"
              fill={tint.color}
              stroke="rgba(17,18,20,0.88)"
              strokeWidth="1.8"
            />
          ) : null}
        </>
      )}
    </svg>
  )
}
