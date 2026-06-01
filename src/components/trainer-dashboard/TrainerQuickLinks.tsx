import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clock,
  Dumbbell,
  FileHeart,
  FileText,
  Users,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import type { TintKey } from './tints'
import { TINT } from './tints'

function QuickLink({
  label,
  desc,
  icon: Icon,
  to,
  tintKey,
}: {
  label: string
  desc: string
  icon: React.ElementType
  to: string
  tintKey: TintKey
}) {
  const tint = TINT[tintKey]

  return (
    <Link to={to} className={cn('td-bevel group block', tint.bevel)}>
      <div className="td-bevel__inner flex items-center gap-3.5 px-4 py-3.5">
        <span
          className="td-icon-well size-10 shrink-0"
          style={
            {
              '--td-icon-bg-top': tint.iconTop,
              '--td-icon-bg-bottom': tint.iconBottom,
              '--td-icon-border': tint.iconBorder,
            } as React.CSSProperties
          }
        >
          <Icon size={18} strokeWidth={2.25} style={{ color: tint.color }} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-zinc-50">{label}</p>
          <p className="text-xs text-zinc-400">{desc}</p>
        </div>
        <ArrowRight
          size={14}
          className="shrink-0 text-zinc-600 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-zinc-300"
        />
      </div>
    </Link>
  )
}

export function TrainerQuickLinks() {
  return (
    <div className="flex flex-col gap-3">
      <p className="td-section-label">Atalhos</p>
      <div className="flex flex-col gap-2.5">
        <QuickLink
          label="Alunos"
          desc="Gerenciar e cadastrar"
          icon={Users}
          to="/trainer/students"
          tintKey="lime"
        />
        <QuickLink
          label="Fichas de Treino"
          desc="Criar e editar fichas"
          icon={FileText}
          to="/trainer/training-sheets"
          tintKey="cyan"
        />
        <QuickLink
          label="Avaliações"
          desc="Histórico físico"
          icon={FileHeart}
          to="/trainer/students"
          tintKey="violet"
        />
        <QuickLink
          label="Exercícios"
          desc="Biblioteca de exercícios"
          icon={Dumbbell}
          to="/trainer/exercises"
          tintKey="amber"
        />
        <QuickLink
          label="Sessões"
          desc="Registros de treino"
          icon={Clock}
          to="/trainer/sessions"
          tintKey="red"
        />
      </div>
    </div>
  )
}
