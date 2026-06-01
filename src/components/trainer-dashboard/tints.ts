export type TintKey = 'lime' | 'cyan' | 'violet' | 'amber' | 'red'

export const TINT = {
  lime: {
    bevel: 'td-bevel--lime',
    iconTop: 'rgba(239, 255, 58, 0.24)',
    iconBottom: 'rgba(239, 255, 58, 0.07)',
    iconBorder: 'rgba(239, 255, 58, 0.28)',
    color: '#efff3a',
  },
  cyan: {
    bevel: 'td-bevel--cyan',
    iconTop: 'rgba(175, 191, 177, 0.18)',
    iconBottom: 'rgba(175, 191, 177, 0.04)',
    iconBorder: 'rgba(175, 191, 177, 0.22)',
    color: '#afbfb1',
  },
  violet: {
    bevel: 'td-bevel--violet',
    iconTop: 'rgba(227, 232, 223, 0.14)',
    iconBottom: 'rgba(227, 232, 223, 0.03)',
    iconBorder: 'rgba(227, 232, 223, 0.18)',
    color: '#e3e8df',
  },
  amber: {
    bevel: 'td-bevel--amber',
    iconTop: 'rgba(216, 192, 140, 0.18)',
    iconBottom: 'rgba(216, 192, 140, 0.04)',
    iconBorder: 'rgba(216, 192, 140, 0.24)',
    color: '#d8c08c',
  },
  red: {
    bevel: 'td-bevel--amber',
    iconTop: 'rgba(183, 122, 98, 0.18)',
    iconBottom: 'rgba(183, 122, 98, 0.04)',
    iconBorder: 'rgba(183, 122, 98, 0.22)',
    color: '#b77a62',
  },
} as const

export const STAT_SERIES = {
  students: [0.42, 0.38, 0.56, 0.52, 0.68, 0.84, 1],
  sheets: [0.24, 0.32, 0.3, 0.48, 0.61, 0.73, 1],
  today: [0.18, 0.34, 0.22, 0.48, 0.4, 0.64, 1],
  week: [0.22, 0.46, 0.39, 0.66, 0.58, 0.76, 1],
} as const

export function metricSeries(value: number | undefined, shape: readonly number[]) {
  const current = Math.max(0, value ?? 0)
  if (current === 0) {
    return shape.map(() => 0)
  }

  return shape.map((point) => Math.max(0, Math.round(current * point)))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
