import { resolveMediaUrl } from '@/lib/media-url'
import type { TrainingDay, TrainingSheet } from '@/types/fitness'

export const DOW_LABELS: Record<string, string> = {
  monday: 'Segunda',
  tuesday: 'Terça',
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

export const DOW_SORT_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const

export const DOW_KEY_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

export const DEFAULT_TRAINING_COVER =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80'

export function countDayExercises(day: TrainingDay): number {
  return day.training_exercises?.length ?? 0
}

export function dayHasExercises(day: TrainingDay): boolean {
  return countDayExercises(day) > 0
}

export function getDayCoverImage(day: TrainingDay, fallback = DEFAULT_TRAINING_COVER): string {
  const raw = day.training_exercises?.find((item) => item.exercise?.image_url)?.exercise?.image_url

  return resolveMediaUrl(raw) ?? fallback
}

export function getSheetCoverImage(sheet: TrainingSheet | null, fallback = DEFAULT_TRAINING_COVER): string {
  if (!sheet?.training_days?.length) {
    return fallback
  }

  for (const day of sheet.training_days) {
    const cover = getDayCoverImage(day, '')
    if (cover) {
      return cover
    }
  }

  return fallback
}

export function sortTrainingDays(days: TrainingDay[]): TrainingDay[] {
  return days.slice().sort((left, right) => {
    const leftDow = left.day_of_week ? DOW_SORT_ORDER.indexOf(left.day_of_week as (typeof DOW_SORT_ORDER)[number]) : -1
    const rightDow = right.day_of_week
      ? DOW_SORT_ORDER.indexOf(right.day_of_week as (typeof DOW_SORT_ORDER)[number])
      : -1

    if (leftDow !== -1 || rightDow !== -1) {
      if (leftDow === -1) {
        return 1
      }
      if (rightDow === -1) {
        return -1
      }
      if (leftDow !== rightDow) {
        return leftDow - rightDow
      }
    }

    return (left.order ?? 0) - (right.order ?? 0)
  })
}

export function formatSheetPeriod(sheet: TrainingSheet): string {
  const start = sheet.start_date
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${sheet.start_date}T12:00:00`))
    : null
  const end = sheet.end_date
    ? new Intl.DateTimeFormat('pt-BR').format(new Date(`${sheet.end_date}T12:00:00`))
    : null

  if (start && end) {
    return `${start} – ${end}`
  }

  if (start) {
    return `desde ${start}`
  }

  return 'Ficha ativa'
}
