/** Tokens visuais do builder premium (dark SaaS) */

export const builderPage = 'min-h-full bg-[var(--bg-base)] text-[var(--text-primary)]'

export const builderCard =
  'rounded-xl border border-[var(--s-border)] bg-[var(--s1)] shadow-[var(--shadow-premium)]'

export const builderCardInner =
  'rounded-xl border border-[var(--s-border)] bg-[var(--bg-subtle)]'

export const builderLabel = 'type-label'

/** CTA primário — único filled lima por viewport (Adicionar exercício) */
export const btnBuilderPrimary =
  'inline-flex h-10 items-center gap-2 rounded-md bg-[var(--builder-accent)] px-4 text-sm font-semibold text-[var(--on-accent)] transition-colors hover:bg-[var(--builder-accent-hover)] disabled:opacity-50'

/** CTA secundário — publicar / ativar (ciano, não compete com lima) */
export const btnBuilderSecondary =
  'inline-flex h-9 items-center gap-2 rounded-md border border-cyan-500/30 bg-cyan-500/10 px-4 text-sm font-medium text-cyan-200 transition-colors hover:border-cyan-500/45 hover:bg-cyan-500/15 disabled:opacity-50'

/** Ações neutras — Mais ações, Reordenar */
export const btnBuilderGhost =
  'inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--s-border)] bg-[var(--s1)] px-3.5 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--s-border-h)] hover:bg-[var(--s2)]'

/** Grid alinhado para header + rows de exercício (desktop) */
export const exerciseRowGrid =
  'grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-[20px_28px_52px_minmax(140px,1.4fr)_64px_80px_72px_64px_72px] lg:items-center lg:gap-x-4'

export const pillBlue =
  'inline-flex items-center rounded-md border border-sky-500/20 bg-sky-950/50 px-2 py-0.5 text-[11px] font-medium text-sky-300/90'

/** Abas de divisão — altura fixa compartilhada */
export const splitTabTrigger =
  'flex h-11 shrink-0 items-center gap-2 border-b-2 px-4 -mb-px transition-colors'

/** Placeholder tracejado — borda em todos os lados */
export const addExercisePlaceholder =
  'group flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-[var(--builder-accent-secondary)]/50 bg-[var(--bg-subtle)]/30 text-[var(--text-tertiary)] transition-colors hover:border-[var(--builder-accent-secondary)]/80 hover:bg-cyan-500/[0.05] hover:text-[var(--builder-accent-secondary)]'

export const addExercisePlaceholderEmpty = 'min-h-[13rem]'

export const addExercisePlaceholderWithList = 'min-h-[4rem]'

export const addExerciseRowIcon =
  'flex size-8 items-center justify-center rounded-md border border-[var(--builder-accent-secondary)]/40 bg-[var(--s1)] text-[var(--text-tertiary)] transition-colors group-hover:border-[var(--builder-accent-secondary)]/70 group-hover:text-[var(--builder-accent-secondary)]'
