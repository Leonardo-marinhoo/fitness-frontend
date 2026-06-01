import type { TrainingExercise } from '@/types/fitness'

export function formatPrescription(te: Pick<
  TrainingExercise,
  'sets' | 'reps_min' | 'reps_max' | 'reps_text' | 'target_weight' | 'duration_seconds' | 'rest_seconds'
>): string {
  const parts: string[] = []
  if (te.sets) parts.push(`${te.sets} séries`)
  if (te.reps_text) {
    parts.push(te.reps_text)
  } else if (te.reps_min && te.reps_max) {
    parts.push(`${te.reps_min}–${te.reps_max} reps`)
  } else if (te.reps_min) {
    parts.push(`${te.reps_min} reps`)
  }
  if (te.target_weight) parts.push(`${te.target_weight} kg`)
  if (te.duration_seconds) parts.push(`${te.duration_seconds}s`)
  if (te.rest_seconds) parts.push(`descanso ${te.rest_seconds}s`)
  return parts.join(' · ') || 'Sem prescrição'
}
