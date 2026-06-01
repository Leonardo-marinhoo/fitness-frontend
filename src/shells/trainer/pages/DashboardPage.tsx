import { useEffect, useState } from 'react'
import { ClipboardList, Users } from 'lucide-react'

import { fetchTrainerDashboard } from '@/api/trainer'
import {
  TrainerActionRail,
  TrainerDashboardTopBar,
  TrainerEngagementPanel,
  TrainerMetricCard,
  TrainerMonthlyChart,
  TrainerSessionsOverviewCard,
} from '@/components/trainer-dashboard'
import { STAT_SERIES, metricSeries } from '@/components/trainer-dashboard/tints'
import { useAuth } from '@/contexts/AuthContext'
import type { TrainerDashboard } from '@/types/fitness'

export function TrainerDashboardPage() {
  const { user } = useAuth()
  const [dashboard, setDashboard] = useState<TrainerDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTrainerDashboard()
      .then(setDashboard)
      .catch(() => setDashboard(null))
      .finally(() => setIsLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = user?.trainer?.name?.split(' ')[0] ?? user?.name?.split(' ')[0] ?? 'Trainer'

  const pendingAnamneses = dashboard?.pending_anamneses ?? []
  const newStudents = dashboard?.new_students_this_month ?? []
  const activeCoverage =
    (dashboard?.total_students ?? 0) > 0
      ? Math.round(((dashboard?.active_sheets ?? 0) / (dashboard?.total_students ?? 1)) * 100)
      : 0
  const longDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="trainer-dashboard-page trainer-lux-dashboard relative z-10 pb-2">
      <div className="trainer-lux-grid">
        <div className="trainer-lux-main">
          <TrainerDashboardTopBar greeting={greeting} firstName={firstName} dateLabel={longDate} />

          <div className="trainer-lux-kpi-grid td-order-metrics">
            <TrainerMetricCard
              label="Total de Alunos"
              value={dashboard?.total_students ?? 0}
              icon={Users}
              tintKey="lime"
              chartData={metricSeries(dashboard?.total_students, STAT_SERIES.students)}
              loading={isLoading}
              hint={`${newStudents.length} novo${newStudents.length === 1 ? '' : 's'} neste mês`}
              spotlight
            />
            <TrainerMetricCard
              label="Fichas Ativas"
              value={dashboard?.active_sheets ?? 0}
              icon={ClipboardList}
              tintKey="cyan"
              chartData={metricSeries(dashboard?.active_sheets, STAT_SERIES.sheets)}
              loading={isLoading}
              hint={`${activeCoverage}% da base com ficha ativa`}
            />
            <TrainerSessionsOverviewCard
              sessionsToday={dashboard?.sessions_today ?? 0}
              sessionsThisWeek={dashboard?.sessions_this_week ?? 0}
              loading={isLoading}
            />
          </div>

          <TrainerMonthlyChart
            sessionsThisWeek={dashboard?.sessions_this_week ?? 0}
            loading={isLoading}
          />

          <TrainerEngagementPanel
            sessionsToday={dashboard?.sessions_today ?? 0}
            sessionsThisWeek={dashboard?.sessions_this_week ?? 0}
            totalStudents={dashboard?.total_students ?? 0}
            activeSheets={dashboard?.active_sheets ?? 0}
            loading={isLoading}
          />
        </div>

        <TrainerActionRail
          pendingAnamneses={pendingAnamneses}
          newStudents={newStudents}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
