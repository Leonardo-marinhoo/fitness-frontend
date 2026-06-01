import { CalendarDays } from 'lucide-react'

type TrainerDashboardTopBarProps = {
  greeting: string
  firstName: string
  dateLabel: string
}

export function TrainerDashboardTopBar({
  greeting,
  firstName,
  dateLabel,
}: TrainerDashboardTopBarProps) {
  return (
    <div className="td-order-topbar trainer-lux-topbar">
      <div className="trainer-lux-topbar-copy">
        <p className="trainer-lux-topbar-greeting">
          {greeting}, {firstName}
          <span aria-hidden />
        </p>
        <h1 className="trainer-lux-topbar-title">Painel de performance</h1>
      </div>

      <div className="trainer-lux-date-pill">
        <CalendarDays size={15} strokeWidth={1.9} />
        <span>{dateLabel}</span>
      </div>
    </div>
  )
}
