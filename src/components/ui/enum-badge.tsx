import { cn } from '@/lib/utils'
import { NEUTRAL, type EnumStyle } from '@/lib/enum-colors'

type Size = 'sm' | 'md' | 'lg'

const sizeClass: Record<Size, string> = {
  sm: 'text-[10px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
  lg: 'text-sm px-3 py-1.5',
}

export type EnumBadgeProps = {
  style?: EnumStyle
  label?: string
  size?: Size
  variant?: 'soft' | 'outline' | 'solid'
  className?: string
}

/**
 * Badge para representar enums com cor semântica.
 *
 * Use sempre passando o `EnumStyle` vindo de `getLevelStyle`,
 * `getSheetStatusStyle`, etc — assim cada valor de enum mantém
 * sua cor distinta em todas as telas.
 */
export function EnumBadge({
  style,
  label,
  size = 'md',
  variant = 'soft',
  className,
}: EnumBadgeProps) {
  const s = style ?? NEUTRAL
  const text = label ?? s.label

  if (variant === 'solid') {
    return (
      <span
        className={cn('inline-flex items-center rounded-full font-semibold', sizeClass[size], className)}
        style={{ background: s.solid, color: '#0c0c0c' }}
      >
        {text}
      </span>
    )
  }

  if (variant === 'outline') {
    return (
      <span
        className={cn('inline-flex items-center rounded-full font-semibold', sizeClass[size], className)}
        style={{ background: 'transparent', border: `1px solid ${s.border}`, color: s.text }}
      >
        {text}
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center rounded-full font-semibold', sizeClass[size], className)}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {text}
    </span>
  )
}
