/** Cores fixas por grupo (alinhado ao seed do backend) — máximo contraste no fundo escuro */
export const MUSCLE_GROUP_COLOR_BY_NAME: Record<string, string> = {
  Peito: '#C1FF33',
  Costas: '#70D7FF',
  Ombros: '#A88CFF',
  'Bíceps': '#F3BB61',
  'Tríceps': '#F97316',
  'Quadríceps': '#38BDF8',
  'Posterior de coxa': '#34D399',
  'Glúteos': '#FB923C',
  Panturrilha: '#2DD4BF',
  'Abdômen': '#FACC15',
  Cardio: '#F87171',
  Mobilidade: '#94A3B8',
  Outros: '#71717A',
}

/** Fallback para grupos customizados — sem rosa/fúcsia */
export const MUSCLE_GROUP_FALLBACK_PALETTE = [
  '#C1FF33',
  '#70D7FF',
  '#F97316',
  '#F3BB61',
  '#A88CFF',
  '#FB923C',
  '#34D399',
  '#2DD4BF',
  '#FACC15',
  '#F87171',
  '#38BDF8',
  '#94A3B8',
] as const

export function getMuscleGroupColor(name: string, indexAmongUnmapped: number): string {
  const fixed = MUSCLE_GROUP_COLOR_BY_NAME[name]
  if (fixed) {
    return fixed
  }

  return MUSCLE_GROUP_FALLBACK_PALETTE[indexAmongUnmapped % MUSCLE_GROUP_FALLBACK_PALETTE.length]
}
