import { useNavigate } from 'react-router-dom'
import { ChevronDown, Zap } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getSheetStatusStyle } from '@/lib/enum-colors'
import { cn } from '@/lib/utils'
import type { TrainingSheet } from '@/types/fitness'

import { btnBuilderGhost, btnBuilderSecondary } from './styles'

const STATUS_PILL: Record<string, string> = {
  draft: 'border-white/10 bg-white/[0.04] text-zinc-400',
  active: 'border-[var(--builder-accent)]/25 bg-[var(--builder-accent)]/10 text-[var(--builder-accent)]',
  paused: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  finished: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
  replaced: 'border-zinc-500/20 bg-zinc-500/10 text-zinc-400',
  archived: 'border-zinc-600/20 bg-zinc-600/10 text-zinc-500',
}

type WorkoutSheetPageHeaderProps = {
  sheet: TrainingSheet
  sheetName: string
  onActivate: () => void
  activating: boolean
  studentId: number
  onDeleteDivision?: () => void
}

export function WorkoutSheetPageHeader({
  sheet,
  sheetName,
  onActivate,
  activating,
  studentId,
  onDeleteDivision,
}: WorkoutSheetPageHeaderProps) {
  const navigate = useNavigate()
  const statusStyle = getSheetStatusStyle(sheet.status)
  const canActivate = sheet.status !== 'active'
  const statusPill = STATUS_PILL[sheet.status] ?? STATUS_PILL.draft

  return (
    <header className="shrink-0">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5 lg:gap-3">
            <h1 className="type-page-title">{sheetName || 'Ficha de treino'}</h1>
            <span
              className={cn(
                'type-caption inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-medium',
                statusPill,
              )}
            >
              <span className="size-1.5 rounded-full bg-current opacity-80" />
              {statusStyle.label}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className={btnBuilderGhost}>
              Mais ações
              <ChevronDown size={14} className="opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-white/10 bg-[var(--s2)] text-zinc-200">
              <DropdownMenuItem onClick={() => navigate(`/trainer/students/${studentId}`)}>
                Ver perfil do aluno
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/trainer/training-sheets')}>
                Voltar à lista
              </DropdownMenuItem>
              {onDeleteDivision && (
                <DropdownMenuItem
                  onClick={onDeleteDivision}
                  className="text-red-400 focus:text-red-400"
                >
                  Remover divisão atual
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {canActivate && (
            <button
              type="button"
              onClick={onActivate}
              disabled={activating}
              className={btnBuilderSecondary}
            >
              <Zap size={16} strokeWidth={2.25} />
              {activating ? 'Ativando…' : 'Ativar ficha'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
