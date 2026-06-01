import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react'

import { EnumBadge } from '@/components/ui/enum-badge'

type TrainerHeroGradientCardProps = {
  greeting: string
  firstName: string
  today: string
  sessionsThisWeek: number
  sessionsToday: number
  totalAlerts: number
  isLoading: boolean
  subtitle: string
}

export function TrainerHeroGradientCard({
  greeting,
  firstName,
  today,
  sessionsThisWeek,
  sessionsToday,
  totalAlerts,
  isLoading,
  subtitle,
}: TrainerHeroGradientCardProps) {
  return (
    <div className="td-hero-gradient td-order-hero h-full min-h-[168px] lg:min-h-[168px]">
      <span className="td-hero-gradient__glow" aria-hidden />
      <div className="td-hero-gradient__content">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-black/25 backdrop-blur-sm">
              <Sparkles size={14} className="text-white" strokeWidth={2.5} />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
              Engajamento · Semana
            </span>
          </div>
          <div>
            <p className="mb-1 text-xs font-medium capitalize text-white/65">{today}</p>
            <p className="text-sm font-medium text-white/75">
              {greeting},{' '}
              <span className="font-semibold text-white">{firstName}</span>
            </p>
            <p className="mt-3 font-display text-4xl font-bold tabular-nums tracking-tight text-white sm:text-5xl">
              {isLoading ? '—' : sessionsThisWeek}
            </p>
            <p className="mt-1 text-sm font-medium text-white/80">sessões na semana</p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-white/65">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/trainer/students/new"
              className="hero-cta group/cta inline-flex items-center gap-2 rounded-[10px] bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 shadow-lg"
            >
              Cadastrar aluno
              <span className="hero-cta-arrow inline-flex size-7 items-center justify-center rounded-md bg-[#a3ff12] text-zinc-900">
                <ArrowRight size={14} />
              </span>
            </Link>
            <Link
              to="/trainer/training-sheets/new"
              className="inline-flex items-center rounded-[10px] border border-white/25 bg-black/20 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/30"
            >
              Nova ficha
            </Link>
          </div>
          {!isLoading ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/20 px-3 py-2 backdrop-blur-sm">
                <TrendingUp size={16} className="text-white" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">Hoje</p>
                  <p className="font-display text-lg font-bold tabular-nums text-white">{sessionsToday}</p>
                </div>
              </div>
              {totalAlerts > 0 ? (
                <EnumBadge
                  style={{
                    label: `${totalAlerts} pendência${totalAlerts !== 1 ? 's' : ''}`,
                    text: '#fcd34d',
                    bg: 'rgba(252, 211, 77, 0.2)',
                    border: 'rgba(252, 211, 77, 0.4)',
                    solid: '#fbbf24',
                  }}
                  size="md"
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
