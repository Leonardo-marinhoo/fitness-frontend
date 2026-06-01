export const inputClass =
  'w-full rounded-lg border border-[var(--s-border-h)] bg-[var(--s2)] px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition'

export const labelClass =
  'mb-1 block text-[10px] font-semibold uppercase tracking-wide text-foreground/45'

export const DAY_OF_WEEK_OPTIONS = [
  { value: '', label: 'Sem dia fixo' },
  { value: 'monday', label: 'Segunda' },
  { value: 'tuesday', label: 'Terça' },
  { value: 'wednesday', label: 'Quarta' },
  { value: 'thursday', label: 'Quinta' },
  { value: 'friday', label: 'Sexta' },
  { value: 'saturday', label: 'Sábado' },
  { value: 'sunday', label: 'Domingo' },
] as const
