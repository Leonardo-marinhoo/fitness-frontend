import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts'

import { fetchActiveTrainingSheet, fetchMyAssessments } from '@/api/student'
import { useAuth } from '@/contexts/AuthContext'
import type { StudentProfile } from '@/types/auth/user'
import type { PhysicalAssessment, TrainingSheet } from '@/types/fitness'

type MetricId = 'weight' | 'bodyFat' | 'leanMass'

type TrendPoint = {
  isoDate: string
  date: string
  fullDate: string
  value: number
}

type TrendSeries = {
  points: TrendPoint[]
  isProjected: boolean
}

const TOOLTIP_STYLE: CSSProperties = {
  background: 'rgba(9, 11, 9, 0.96)',
  border: '1px solid rgba(232, 241, 224, 0.12)',
  borderRadius: 18,
  padding: '10px 12px',
  boxShadow: '0 24px 60px rgba(0, 0, 0, 0.3)',
  color: '#edf2e9',
}

const METRIC_CONFIG: Record<MetricId, { label: string; stroke: string; unit: string }> = {
  weight: { label: 'Peso', stroke: '#dfff6a', unit: 'kg' },
  bodyFat: { label: 'Gordura corporal', stroke: '#f08d57', unit: '%' },
  leanMass: { label: 'Massa magra', stroke: '#70d7ff', unit: 'kg' },
}

const RANK_CARD: Record<
  string,
  {
    label: string
    tier: string
    nextTier: string
    progress: number
    tone: string
    copy: string
  }
> = {
  beginner: {
    label: 'Bronze I',
    tier: 'Base inicial',
    nextTier: 'Prata',
    progress: 36,
    tone: '#f08d57',
    copy: 'Seu ritmo está construindo a base para subir de elo.',
  },
  intermediate: {
    label: 'Prata II',
    tier: 'Intermediário',
    nextTier: 'Ouro',
    progress: 68,
    tone: '#70d7ff',
    copy: 'Seu volume atual já mostra consistência para mirar um elo acima.',
  },
  advanced: {
    label: 'Ouro I',
    tier: 'Avançado',
    nextTier: 'Diamante',
    progress: 84,
    tone: '#dfff6a',
    copy: 'Você já está em um patamar alto e perto do próximo salto.',
  },
}

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value.replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : null
  }

  return null
}

function formatDateShort(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date))
}

function formatDateLong(date: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

function formatValue(value: number, digits = 1): string {
  return Number(value).toLocaleString('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })
}

function round(value: number | null | undefined, digits = 1): number | null {
  const numericValue = toFiniteNumber(value)
  if (numericValue == null) {
    return null
  }

  const factor = 10 ** digits
  return Math.round(numericValue * factor) / factor
}

function addOneMonth(date: string): string {
  const next = new Date(date)
  next.setMonth(next.getMonth() + 1)
  return next.toISOString()
}

function ensureTrendLine(points: TrendPoint[]): TrendSeries {
  if (points.length === 1) {
    const base = points[0]
    const projectedDate = addOneMonth(base.isoDate)
    return {
      points: [
        base,
        {
          isoDate: projectedDate,
          date: formatDateShort(projectedDate),
          fullDate: formatDateLong(projectedDate),
          value: base.value,
        },
      ],
      isProjected: true,
    }
  }

  return {
    points,
    isProjected: false,
  }
}

function buildAssessmentSeries(
  assessments: PhysicalAssessment[],
  accessor: (assessment: PhysicalAssessment) => number | null,
): TrendSeries {
  const points = assessments
    .slice()
    .sort((left, right) => left.assessment_date.localeCompare(right.assessment_date))
    .flatMap((assessment) => {
      const value = toFiniteNumber(accessor(assessment))
      if (value == null) {
        return []
      }

      return [
        {
          isoDate: assessment.assessment_date,
          date: formatDateShort(assessment.assessment_date),
          fullDate: formatDateLong(assessment.assessment_date),
          value,
        },
      ]
    })

  return ensureTrendLine(points)
}

function buildWeightSeries(
  assessments: PhysicalAssessment[],
  student: StudentProfile | null,
): TrendSeries {
  const fromAssessments = assessments
    .slice()
    .sort((left, right) => left.assessment_date.localeCompare(right.assessment_date))
    .flatMap((assessment) => {
      const value = toFiniteNumber(assessment.weight_kg)
      if (value == null) {
        return []
      }

      return [
        {
          isoDate: assessment.assessment_date,
          date: formatDateShort(assessment.assessment_date),
          fullDate: formatDateLong(assessment.assessment_date),
          value,
        },
      ]
    })

  if (fromAssessments.length > 0) {
    return ensureTrendLine(fromAssessments)
  }

  const studentWeight = toFiniteNumber(student?.weight)
  if (studentWeight != null) {
    const referenceDate = student?.anamnesis_completed_at ?? new Date().toISOString()
    return ensureTrendLine([
      {
        isoDate: referenceDate,
        date: formatDateShort(referenceDate),
        fullDate: formatDateLong(referenceDate),
        value: studentWeight,
      },
    ])
  }

  return { points: [], isProjected: false }
}

function buildTrainingProgress(sheet: TrainingSheet | null): {
  percent: number
  display: string
  title: string
  copy: string
} {
  if (!sheet) {
    return {
      percent: 0,
      display: '0%',
      title: 'Sem ficha ativa',
      copy: 'Seu personal ainda não liberou uma ficha com prazo definido.',
    }
  }

  if (!sheet.end_date) {
    return {
      percent: 20,
      display: '--',
      title: sheet.name,
      copy: 'Sua ficha está ativa, mas ainda sem vencimento definido.',
    }
  }

  const start = new Date(sheet.start_date)
  const end = new Date(sheet.end_date)
  const today = new Date()
  const totalDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1)
  const elapsedDays = Math.max(0, Math.min(totalDays, Math.ceil((today.getTime() - start.getTime()) / 86400000) + 1))
  const remainingDays = Math.max(0, Math.ceil((end.getTime() - today.getTime()) / 86400000))
  const percent = Math.max(0, Math.min(100, Math.round((elapsedDays / totalDays) * 100)))

  return {
    percent,
    display: `${percent}%`,
    title: `${remainingDays} dia${remainingDays === 1 ? '' : 's'} restantes`,
    copy: `${sheet.name} · vence em ${formatDateShort(sheet.end_date)}`,
  }
}

function resolveRankCard(level: string | null | undefined) {
  return RANK_CARD[level ?? ''] ?? RANK_CARD.intermediate
}

function TrendTooltip({
  active,
  label,
  title,
  value,
  unit,
  color,
}: {
  active?: boolean
  label?: string
  title: string
  value?: number | null
  unit: string
  color: string
}) {
  if (!active || value == null) {
    return null
  }

  return (
    <div style={TOOLTIP_STYLE}>
      {label ? (
        <div style={{ marginBottom: 8, color: 'rgba(237,242,233,0.56)', fontSize: 12 }}>{label}</div>
      ) : null}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: color }} />
          <span style={{ fontSize: 12, color: '#edf2e9' }}>{title}</span>
        </div>
        <strong style={{ fontSize: 12, color: '#edf2e9' }}>
          {formatValue(value, 1)} {unit}
        </strong>
      </div>
    </div>
  )
}

function TrendCard({
  eyebrow,
  title,
  copy,
  data,
  metric,
  emptyCopy,
}: {
  eyebrow: string
  title: string
  copy: string
  data: TrendSeries
  metric: MetricId
  emptyCopy: string
}) {
  const config = METRIC_CONFIG[metric]
  const chartFrameRef = useRef<HTMLDivElement | null>(null)
  const [chartWidth, setChartWidth] = useState(0)

  useEffect(() => {
    const node = chartFrameRef.current
    if (!node) {
      return
    }

    const updateWidth = () => {
      const nextWidth = Math.floor(node.clientWidth)
      setChartWidth((currentWidth) => (currentWidth === nextWidth ? currentWidth : nextWidth))
    }

    updateWidth()

    if (typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver(() => updateWidth())
    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const chartHeight = chartWidth > 0 ? Math.max(216, Math.round(chartWidth / 1.55)) : 220

  return (
    <section className="surface-premium student-evolution__surface student-evolution__chart-card">
      <div className="student-evolution__section-head">
        <div>
          <p className="student-evolution__section-kicker">{eyebrow}</p>
          <h2 className="student-evolution__section-title">{title}</h2>
          <p className="student-evolution__section-copy">{copy}</p>
        </div>
      </div>

      {data.points.length > 0 ? (
        <div ref={chartFrameRef} className="student-evolution__chart-shell student-evolution__chart-shell--wide">
          {chartWidth > 0 ? (
            <AreaChart data={data.points} width={chartWidth} height={chartHeight} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
              <defs>
                <linearGradient id={`student-${metric}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.stroke} stopOpacity={0.34} />
                  <stop offset="70%" stopColor={config.stroke} stopOpacity={0.12} />
                  <stop offset="100%" stopColor={config.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(237,242,233,0.42)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(237,242,233,0.34)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={42}
              />
              <Tooltip
                cursor={{ stroke: 'rgba(255,255,255,0.08)' }}
                content={({ active, payload }) => (
                  <TrendTooltip
                    active={active}
                    label={payload?.[0]?.payload?.fullDate}
                    title={config.label}
                    value={typeof payload?.[0]?.value === 'number' ? payload[0].value : null}
                    unit={config.unit}
                    color={config.stroke}
                  />
                )}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={config.stroke}
                strokeWidth={2.5}
                fill={`url(#student-${metric}-fill)`}
                dot={false}
                activeDot={{ r: 4, fill: '#0b0d0b', stroke: config.stroke, strokeWidth: 2 }}
              />
            </AreaChart>
          ) : null}
        </div>
      ) : (
        <div className="student-evolution__empty-block">{emptyCopy}</div>
      )}
    </section>
  )
}

export function EvolucaoPage() {
  const { user } = useAuth()
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([])
  const [activeSheet, setActiveSheet] = useState<TrainingSheet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const [assessmentData, sheetData] = await Promise.all([
          fetchMyAssessments().catch(() => [] as PhysicalAssessment[]),
          fetchActiveTrainingSheet().catch(() => null),
        ])

        if (!active) {
          return
        }

        setAssessments(
          assessmentData.slice().sort((left, right) => right.assessment_date.localeCompare(left.assessment_date)),
        )
        setActiveSheet(sheetData)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  const student = user?.student ?? null
  const trainingProgress = buildTrainingProgress(activeSheet)
  const rankCard = resolveRankCard(student?.training_level)

  const weightSeries = useMemo(() => buildWeightSeries(assessments, student), [assessments, student])
  const bodyFatSeries = useMemo(
    () => buildAssessmentSeries(assessments, (assessment) => assessment.body_fat_percentage),
    [assessments],
  )
  const leanMassSeries = useMemo(
    () => buildAssessmentSeries(assessments, (assessment) => assessment.lean_mass_kg),
    [assessments],
  )

  const latestWeight =
    toFiniteNumber(assessments.find((assessment) => assessment.weight_kg != null)?.weight_kg) ??
    toFiniteNumber(student?.weight)
  const latestBodyFat = toFiniteNumber(
    assessments.find((assessment) => assessment.body_fat_percentage != null)?.body_fat_percentage,
  )
  const latestLeanMass = toFiniteNumber(
    assessments.find((assessment) => assessment.lean_mass_kg != null)?.lean_mass_kg,
  )
  const studentHeight = toFiniteNumber(student?.height)
  const studentWeight = toFiniteNumber(student?.weight)
  const baselineBmi =
    studentWeight != null && studentHeight != null && studentHeight > 0
      ? round(studentWeight / ((studentHeight / 100) ** 2), 1)
      : null
  const weightTitle = latestWeight != null ? `${formatValue(latestWeight, 1)} kg` : 'Peso'
  const weightCopy = weightSeries.isProjected
    ? 'Esse é o seu ponto de partida.'
    : 'Veja como o peso muda ao longo da sua rotina.'
  const bodyFatCopy = bodyFatSeries.isProjected
    ? 'Primeira leitura de BF registrada.'
    : 'Aqui entra a qualidade da sua composição corporal.'
  const leanMassCopy = leanMassSeries.isProjected
    ? 'Primeiro registro de massa magra salvo.'
    : 'Aqui aparece o que seu corpo está construindo no ciclo.'

  return (
    <div className="student-evolution">
      {isLoading ? (
        <section className="surface-premium student-evolution__surface student-evolution__empty">
          Carregando sua evolução...
        </section>
      ) : (
        <>
          <section className="student-evolution__story-card">
            <div className="student-evolution__story-copy">
              <h2>Seu corpo em movimento, com clareza.</h2>
            </div>

            <div className="student-evolution__story-figure" aria-hidden="true">
              <img
                className="student-evolution__story-image"
                src="/evolution-athlete-cutout-clean.png"
                alt="Atleta segurando halteres"
              />
            </div>
          </section>

          <div className="student-evolution__duo-grid">
            <section
              className="surface-premium student-evolution__surface student-evolution__mini-card student-evolution__mini-card--rank"
              style={
                {
                  '--rank-tone': rankCard.tone,
                } as CSSProperties
              }
            >
              <div className="student-evolution__mini-card-head">
                <p className="student-evolution__section-kicker">Treino atual</p>
              </div>

              <div
                className="student-evolution__radial"
                style={
                  {
                    '--progress': `${trainingProgress.percent}%`,
                  } as CSSProperties
                }
              >
                <div className="student-evolution__radial-core">
                  <strong>{trainingProgress.display}</strong>
                  <span>da ficha</span>
                </div>
              </div>

              <div className="student-evolution__mini-copy">
                <strong>{trainingProgress.title}</strong>
                <p>{trainingProgress.copy}</p>
              </div>
            </section>

            <section className="surface-premium student-evolution__surface student-evolution__mini-card">
              <div className="student-evolution__mini-card-head">
                <p className="student-evolution__section-kicker">Nível atual</p>
              </div>

              <div className="student-evolution__rank-card-top">
                <div className="student-evolution__xp-headline">
                  <span>{rankCard.tier}</span>
                  <strong>{rankCard.label}</strong>
                </div>

                <img
                  className="student-evolution__rank-image"
                  src="/student-rank-trophy.svg"
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <div className="student-evolution__xp-track">
                <span
                  className="student-evolution__xp-fill"
                  style={{ width: `${rankCard.progress}%`, background: rankCard.tone }}
                />
              </div>
            </section>
          </div>

          <TrendCard
            eyebrow="Peso"
            title={weightTitle}
            copy={weightCopy}
            data={weightSeries}
            metric="weight"
            emptyCopy="Seu peso aparece aqui assim que o primeiro registro entrar."
          />

          <TrendCard
            eyebrow="BF"
            title={latestBodyFat != null ? `${formatValue(latestBodyFat, 1)}% de gordura corporal` : 'Gordura corporal'}
            copy={bodyFatCopy}
            data={bodyFatSeries}
            metric="bodyFat"
            emptyCopy="Seu BF aparece aqui assim que entrar a primeira avaliação."
          />

          <TrendCard
            eyebrow="Massa magra"
            title={latestLeanMass != null ? `${formatValue(latestLeanMass, 1)} kg de massa magra` : 'Massa magra'}
            copy={leanMassCopy}
            data={leanMassSeries}
            metric="leanMass"
            emptyCopy={
              baselineBmi != null
                ? `Seu IMC base hoje é ${formatValue(baselineBmi, 1)}. A massa magra entra quando a avaliação estiver completa.`
                : 'A massa magra aparece aqui assim que entrar a primeira avaliação completa.'
            }
          />
        </>
      )}
    </div>
  )
}
