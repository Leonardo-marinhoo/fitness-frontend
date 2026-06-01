import type { PhysicalAssessment, TrainingExercise, TrainingSheet } from '@/types/fitness'

import { getMuscleGroupColor, MUSCLE_GROUP_COLOR_BY_NAME } from './muscle-group-colors'

export function formatReps(te: TrainingExercise): string {
  if (te.reps_text) return te.reps_text
  if (te.reps_min != null && te.reps_max != null) return `${te.reps_min} - ${te.reps_max}`
  if (te.reps_min != null) return String(te.reps_min)
  return '—'
}

export function formatLoad(te: TrainingExercise): string {
  if (te.target_weight != null) return `${te.target_weight} kg`
  return '—'
}

export function formatRest(te: TrainingExercise): string {
  if (te.rest_seconds != null) return `${te.rest_seconds}s`
  return '—'
}

export type SheetDayStats = {
  exerciseCount: number
  volumeKg: number
  durationLabel: string
  restLabel: string
}

export function computeDayStats(exercises: TrainingExercise[]): SheetDayStats {
  const exerciseCount = exercises.length
  let volumeKg = 0
  let totalRestSec = 0

  for (const te of exercises) {
    const sets = te.sets ?? 1
    const reps = te.reps_max ?? te.reps_min ?? 10
    const weight = te.target_weight ?? 0
    volumeKg += sets * reps * weight
    totalRestSec += sets * (te.rest_seconds ?? 60)
  }

  const workMin = exerciseCount * 6
  const restMin = Math.round(totalRestSec / 60)
  const durationLow = Math.max(workMin + Math.round(restMin * 0.4), exerciseCount > 0 ? 25 : 0)
  const durationHigh = durationLow + Math.max(10, Math.round(exerciseCount * 2))

  const restLow = Math.max(0, Math.round(restMin * 0.85))
  const restHigh = Math.max(restLow + 2, Math.round(restMin * 1.15))

  return {
    exerciseCount,
    volumeKg,
    durationLabel: exerciseCount > 0 ? `${durationLow} - ${durationHigh} min` : '—',
    restLabel: exerciseCount > 0 ? `${restLow} - ${restHigh} min` : '—',
  }
}

export type MuscleGroupSlice = { name: string; value: number; percent: number; color: string }

export function computeMuscleGroups(exercises: TrainingExercise[]): MuscleGroupSlice[] {
  const counts = new Map<string, number>()
  for (const te of exercises) {
    const name = te.exercise.muscle_group?.name ?? 'Outros'
    counts.set(name, (counts.get(name) ?? 0) + 1)
  }
  const total = exercises.length || 1
  let fallbackIndex = 0

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => {
      const color = getMuscleGroupColor(name, fallbackIndex)
      if (!(name in MUSCLE_GROUP_COLOR_BY_NAME)) {
        fallbackIndex += 1
      }
      return {
        name,
        value,
        percent: Math.round((value / total) * 100),
        color,
      }
    })
}

export function getSectionTitle(day: { name: string; description: string | null; muscle_group?: { name: string } | null }, exercises: TrainingExercise[]): string {
  if (day.description?.trim()) return day.description.trim()
  const groups = computeMuscleGroups(exercises)
  if (groups.length === 1) return groups[0].name
  if (groups.length > 1) return groups[0].name
  return day.name
}

export type ProgressMetricId = 'carga' | 'calorias' | 'massa_magra'

export type ProgressChartPoint = {
  label: string
  carga: number
  calorias: number
  massa_magra: number
}

const PROGRESS_WEEK_LABELS = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'] as const

function safeNum(value: unknown): number | null {
  if (value == null || value === '') {
    return null
  }
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/**
 * Série para o painel de progresso (mock enriquecido com avaliações quando existirem).
 */
export function buildStudentProgressChartData(
  assessments: PhysicalAssessment[],
  dayVolumeKg: number,
  studentWeight: number | null,
): ProgressChartPoint[] {
  const weight = safeNum(studentWeight)
  const sorted = [...assessments]
    .filter((a) => safeNum(a.lean_mass_kg) != null || safeNum(a.bmr_kcal) != null)
    .sort((a, b) => a.assessment_date.localeCompare(b.assessment_date))
    .slice(-8)

  const latest = sorted.at(-1)
  const baseVolume = Math.max(dayVolumeKg, 800)
  const baseLean =
    safeNum(latest?.lean_mass_kg) ?? (weight != null ? Number((weight * 0.72).toFixed(1)) : 48)
  const baseCalories = safeNum(latest?.bmr_kcal) ?? 2180

  return PROGRESS_WEEK_LABELS.map((label, i) => {
    const progress = i / Math.max(PROGRESS_WEEK_LABELS.length - 1, 1)
    const assessIndex =
      sorted.length > 0 ? Math.min(Math.floor((i / PROGRESS_WEEK_LABELS.length) * sorted.length), sorted.length - 1) : -1
    const assess = assessIndex >= 0 ? sorted[assessIndex] : null
    const leanFromAssess = assess ? safeNum(assess.lean_mass_kg) : null
    const kcalFromAssess = assess ? safeNum(assess.bmr_kcal) : null

    return {
      label,
      carga: Math.round(baseVolume * (0.78 + progress * 0.26) + (i % 3) * 60),
      calorias: Math.round((kcalFromAssess ?? baseCalories) * (0.92 + progress * 0.1) + i * 12),
      massa_magra: Number((leanFromAssess ?? baseLean * (0.97 + progress * 0.05)).toFixed(1)),
    }
  })
}

export function progressMetricDelta(
  points: ProgressChartPoint[],
  metric: ProgressMetricId,
): string | null {
  if (points.length < 2) {
    return null
  }

  const first = points[0][metric]
  const last = points[points.length - 1][metric]

  if (!Number.isFinite(first) || !Number.isFinite(last)) {
    return null
  }

  const delta = last - first
  const sign = delta > 0 ? '+' : ''
  const formatted = Math.abs(delta).toLocaleString('pt-BR', {
    maximumFractionDigits: metric === 'calorias' ? 0 : 1,
  })

  if (metric === 'calorias') {
    return `${sign}${formatted} kcal`
  }

  return `${sign}${formatted} kg`
}

export function countAllExercises(sheet: TrainingSheet): number {
  return (sheet.training_days ?? []).reduce(
    (acc, d) => acc + (d.training_exercises?.length ?? 0),
    0,
  )
}
