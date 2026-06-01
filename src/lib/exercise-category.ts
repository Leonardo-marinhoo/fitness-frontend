/** Valores alinhados com App\Enums\ExerciseCategory no backend */
export const EXERCISE_CATEGORIES = [
  { value: 'compound', label: 'Composto' },
  { value: 'isolation', label: 'Isolado' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'mobility', label: 'Mobilidade' },
  { value: 'accessory', label: 'Acessório' },
] as const

export type ExerciseCategoryValue = (typeof EXERCISE_CATEGORIES)[number]['value']

const LABEL_BY_VALUE = Object.fromEntries(
  EXERCISE_CATEGORIES.map((c) => [c.value, c.label]),
) as Record<ExerciseCategoryValue, string>

export function getExerciseCategoryLabel(category: string | null | undefined): string | null {
  if (!category) {
    return null
  }

  return LABEL_BY_VALUE[category as ExerciseCategoryValue] ?? category
}

export const EXERCISE_CATEGORY_BADGE_CLASS: Record<ExerciseCategoryValue, string> = {
  compound: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  isolation: 'border-zinc-500/25 bg-zinc-500/10 text-zinc-400',
  cardio: 'border-red-500/25 bg-red-500/10 text-red-300',
  mobility: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
  accessory: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
}

export function getExerciseCategoryBadgeClass(
  category: string | null | undefined,
): string {
  if (!category || !(category in EXERCISE_CATEGORY_BADGE_CLASS)) {
    return 'border-zinc-500/25 bg-zinc-500/10 text-zinc-400'
  }

  return EXERCISE_CATEGORY_BADGE_CLASS[category as ExerciseCategoryValue]
}

/** Select estilizado para tema escuro (evita fundo branco nativo do browser) */
export const formSelectClass =
  'w-full appearance-none rounded-xl border border-[var(--s-border-h)] bg-[var(--s2)] px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/20 [color-scheme:dark]'
