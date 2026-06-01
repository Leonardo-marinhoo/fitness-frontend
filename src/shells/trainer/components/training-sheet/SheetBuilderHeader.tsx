import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { EnumBadge } from '@/components/ui/enum-badge'
import { cn } from '@/lib/utils'
import { getSheetStatusStyle } from '@/lib/enum-colors'
import type { TrainingSheet } from '@/types/fitness'

type SheetBuilderHeaderProps = {
  sheet: TrainingSheet
  name: string
  onNameChange: (name: string) => void
  onActivate?: () => void
  activating?: boolean
  variant?: 'card' | 'toolbar'
}

export function SheetBuilderHeader({
  sheet,
  name,
  onNameChange,
  onActivate,
  activating = false,
  variant = 'toolbar',
}: SheetBuilderHeaderProps) {
  const statusStyle = getSheetStatusStyle(sheet.status)
  const canActivate = sheet.status !== 'active' && onActivate != null

  if (variant === 'card') {
    return (
      <div className="surface-soft flex flex-col gap-4 p-5">
        <HeaderFields
          sheet={sheet}
          name={name}
          onNameChange={onNameChange}
          statusStyle={statusStyle}
          titleClassName="text-display min-w-0 flex-1 bg-transparent outline-none placeholder:text-[var(--text-tertiary)] focus:ring-0"
          canActivate={canActivate}
          onActivate={onActivate}
          activating={activating}
        />
      </div>
    )
  }

  return (
    <header className="sheet-builder-toolbar border-b border-[var(--s-border)] px-4 lg:px-6">
      <HeaderFields
        sheet={sheet}
        name={name}
        onNameChange={onNameChange}
        statusStyle={statusStyle}
        titleClassName="text-heading min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-[var(--text-tertiary)] focus:ring-0"
        canActivate={canActivate}
        onActivate={onActivate}
        activating={activating}
        compactBack
      />
    </header>
  )
}

function HeaderFields({
  sheet,
  name,
  onNameChange,
  statusStyle,
  titleClassName,
  canActivate,
  onActivate,
  activating,
  compactBack,
}: {
  sheet: TrainingSheet
  name: string
  onNameChange: (name: string) => void
  statusStyle: ReturnType<typeof getSheetStatusStyle>
  titleClassName: string
  canActivate: boolean
  onActivate?: () => void
  activating: boolean
  compactBack?: boolean
}) {
  return (
    <div className="flex flex-col gap-3 py-1 sm:py-0">
      <Link
        to="/trainer/training-sheets"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} />
        {compactBack ? (
          <>
            <span className="sm:hidden">Voltar</span>
            <span className="hidden sm:inline">Fichas de treino</span>
          </>
        ) : (
          'Fichas de treino'
        )}
      </Link>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={() => {
            if (name.trim() && name.trim() !== sheet.name) {
              onNameChange(name.trim())
            }
          }}
          className={cn(titleClassName, 'min-w-[10rem]')}
          placeholder="Nome da ficha"
        />
        <EnumBadge style={statusStyle} size="md" />
        {canActivate && (
          <button
            type="button"
            onClick={onActivate}
            disabled={activating}
            className="ml-auto shrink-0 rounded-lg border border-[var(--s-border)] px-3 py-1.5 text-sm text-foreground/65 transition-colors hover:bg-[var(--s2)] hover:text-foreground disabled:opacity-50"
          >
            {activating ? 'Ativando…' : 'Ativar ficha'}
          </button>
        )}
      </div>
    </div>
  )
}
