/**
 * Sistema central de cores semânticas por enum.
 * Cada valor de cada enum tem cor distinta para variação visual.
 *
 * Use sempre `getEnumStyle(group, value)` ou diretamente as
 * constantes exportadas. Não defina cores ad-hoc em páginas.
 */

export type EnumStyle = {
  label: string
  /** cor de texto / glow */
  text: string
  /** fundo translúcido para badge */
  bg: string
  /** borda translúcida (opcional) */
  border: string
  /** sólido para tinted glow / ícones */
  solid: string
}

const LIME = '#dfff6a'

function make(label: string, hex: string): EnumStyle {
  // hex em formato #RRGGBB
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return {
    label,
    text: hex,
    bg: `rgba(${r},${g},${b},0.14)`,
    border: `rgba(${r},${g},${b},0.28)`,
    solid: hex,
  }
}

// ─── Training level ─────────────────────────────────────────────────────────

export const TRAINING_LEVEL = {
  beginner: make('Iniciante', '#70d7ff'), // cyan — começando
  intermediate: make('Intermediário', '#70d7ff'), // cyan — consolidando
  advanced: make('Avançado', '#f3bb61'), // âmbar — sólido
  athlete: make('Atleta', '#a88cff'), // violeta — elite
} as const

// ─── Sheet status ───────────────────────────────────────────────────────────

export const SHEET_STATUS = {
  draft: make('Rascunho', '#9ca3af'),
  active: make('Ativa', LIME),
  paused: make('Pausada', '#f3bb61'),
  finished: make('Finalizada', '#a88cff'),
  replaced: make('Substituída', '#70d7ff'),
  archived: make('Arquivada', '#6b7280'),
} as const

// ─── Assessment input mode ──────────────────────────────────────────────────

export const ASSESSMENT_MODE = {
  manual: make('Manual', '#70d7ff'),
  automatic: make('Automático', '#a88cff'),
  approximation: make('Aproximado', '#f3bb61'),
} as const

// ─── Workout session status ─────────────────────────────────────────────────

export const SESSION_STATUS = {
  started: make('Em andamento', '#70d7ff'),
  completed: make('Concluído', LIME),
  skipped: make('Pulado', '#9ca3af'),
  cancelled: make('Cancelado', '#f87171'),
} as const

// ─── Gender ─────────────────────────────────────────────────────────────────

export const GENDER = {
  M: make('Masculino', '#70d7ff'),
  F: make('Feminino', '#f3a5cf'),
  other: make('Outro', '#a88cff'),
} as const

// ─── Anamnesis ──────────────────────────────────────────────────────────────

export const ANAMNESIS = {
  completed: make('Completa', LIME),
  pending: make('Pendente', '#f3bb61'),
} as const

// ─── Day of week ────────────────────────────────────────────────────────────

export const DAY_OF_WEEK = {
  monday: make('Segunda', '#70d7ff'),
  tuesday: make('Terça', '#a88cff'),
  wednesday: make('Quarta', '#f3bb61'),
  thursday: make('Quinta', '#f3bb61'),
  friday: make('Sexta', '#f3a5cf'),
  saturday: make('Sábado', '#7adfb1'),
  sunday: make('Domingo', '#f87171'),
} as const

// ─── Neutral fallback ───────────────────────────────────────────────────────

export const NEUTRAL: EnumStyle = {
  label: '—',
  text: 'rgba(255,255,255,0.55)',
  bg: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.12)',
  solid: 'rgba(255,255,255,0.4)',
}

// ─── Helpers ────────────────────────────────────────────────────────────────

export function getLevelStyle(value: string | null | undefined): EnumStyle {
  if (!value) return NEUTRAL
  return (TRAINING_LEVEL as Record<string, EnumStyle>)[value] ?? NEUTRAL
}

export function getSheetStatusStyle(value: string | null | undefined): EnumStyle {
  if (!value) return NEUTRAL
  return (SHEET_STATUS as Record<string, EnumStyle>)[value] ?? NEUTRAL
}

export function getAssessmentModeStyle(value: string | null | undefined): EnumStyle {
  if (!value) return NEUTRAL
  return (ASSESSMENT_MODE as Record<string, EnumStyle>)[value] ?? NEUTRAL
}

export function getSessionStatusStyle(value: string | null | undefined): EnumStyle {
  if (!value) return NEUTRAL
  return (SESSION_STATUS as Record<string, EnumStyle>)[value] ?? NEUTRAL
}

export function getGenderStyle(value: string | null | undefined): EnumStyle {
  if (!value) return NEUTRAL
  return (GENDER as Record<string, EnumStyle>)[value] ?? NEUTRAL
}

export function getDayOfWeekStyle(value: string | null | undefined): EnumStyle {
  if (!value) return NEUTRAL
  return (DAY_OF_WEEK as Record<string, EnumStyle>)[value] ?? NEUTRAL
}
