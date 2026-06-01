import type { TrainingExercise } from '@/types/fitness'

export function formatPrescription(te: TrainingExercise | undefined | null): string {
  if (!te) {
    return ''
  }

  const parts: string[] = []
  if (te.sets) {
    parts.push(`${te.sets} séries`)
  }
  if (te.reps_text) {
    parts.push(te.reps_text)
  } else if (te.reps_min && te.reps_max) {
    parts.push(`${te.reps_min}–${te.reps_max} reps`)
  } else if (te.reps_min) {
    parts.push(`${te.reps_min} reps`)
  }
  if (te.target_weight) {
    parts.push(`${te.target_weight} kg`)
  }
  if (te.duration_seconds) {
    parts.push(`${te.duration_seconds}s`)
  }

  return parts.join(' × ')
}

export type TargetPerformance = {
  performed_sets: number | null
  performed_reps: number | null
  performed_weight: number | null
}

/** Valores que o personal prescreveu — usados no "Concluído" rápido e pré-preenchimento. */
export function getTargetPerformance(te: TrainingExercise | undefined | null): TargetPerformance {
  if (!te) {
    return { performed_sets: null, performed_reps: null, performed_weight: null }
  }

  const firstSet = te.sets_detail?.[0]
  const sets =
    te.sets ??
    (te.sets_detail && te.sets_detail.length > 0 ? te.sets_detail.length : null)
  const reps =
    te.reps_max ??
    te.reps_min ??
    firstSet?.target_reps ??
    firstSet?.target_reps_max ??
    null
  const weight = te.target_weight ?? firstSet?.target_weight ?? null

  return {
    performed_sets: sets,
    performed_reps: reps,
    performed_weight: weight,
  }
}

export function getYoutubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) {
    return null
  }

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  )

  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}
