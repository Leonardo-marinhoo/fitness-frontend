import { Link } from 'react-router-dom'
import { ArrowRight, Dumbbell } from 'lucide-react'

import { cn } from '@/lib/utils'

export function SuperAdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="trainer-eyebrow">Plataforma</p>
        <h1 className="trainer-page-title mt-1">Dashboard</h1>
        <p className="trainer-body mt-1.5">Visão geral da plataforma FitnessCode.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className={cn('td-bevel td-bevel--lime h-full')}>
          <div className="td-bevel__inner flex h-full flex-col gap-4 p-6">
            <div className="flex items-center gap-3">
              <span
                className="td-icon-well size-11"
                style={
                  {
                    '--td-icon-bg-top': 'rgba(163, 255, 18, 0.22)',
                    '--td-icon-bg-bottom': 'rgba(163, 255, 18, 0.04)',
                    '--td-icon-border': 'rgba(163, 255, 18, 0.35)',
                  } as React.CSSProperties
                }
              >
                <Dumbbell size={20} style={{ color: '#a3ff12' }} strokeWidth={2.25} />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold text-zinc-50">Personal Trainers</h2>
                <p className="text-sm text-zinc-400">Profissionais cadastrados na plataforma</p>
              </div>
            </div>
            <Link
              to="/admin/trainers"
              className="mt-auto inline-flex w-fit items-center gap-2 rounded-[10px] border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-zinc-50 transition-colors hover:bg-white/[0.08]"
            >
              Ver trainers
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
