import { ChevronRight } from 'lucide-react'

import {
  countDayExercises,
  DOW_LABELS,
  getDayCoverImage,
} from '@/lib/student-training'
import type { TrainingDay } from '@/types/fitness'
import { cn } from '@/lib/utils'

type TrainingDayListCardProps = {
  day: TrainingDay
  coverFallback?: string
  isToday?: boolean
  onSelect: () => void
}

export function TrainingDayListCard({
  day,
  coverFallback,
  isToday = false,
  onSelect,
}: TrainingDayListCardProps) {
  const exerciseCount = countDayExercises(day)
  const hasExercises = exerciseCount > 0
  const cover = getDayCoverImage(day, coverFallback)
  const dayLabel = day.day_of_week ? DOW_LABELS[day.day_of_week] ?? day.day_of_week : null

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'training-day-card',
        isToday && 'training-day-card--today',
        !hasExercises && 'training-day-card--empty',
      )}
    >
      <div className="training-day-card__thumb" aria-hidden>
        <img src={cover} alt="" loading="lazy" />
      </div>

      <div className="training-day-card__body">
        <div className="training-day-card__header">
          <h3 className="training-day-card__title">{day.name}</h3>
          <div className="training-day-card__badges">
            {dayLabel ? (
              <span className="training-day-card__mini-badge training-day-card__mini-badge--day">
                {dayLabel}
              </span>
            ) : null}
            <span className="training-day-card__mini-badge training-day-card__mini-badge--muted">
              {hasExercises ? `${exerciseCount} ex` : '0 ex'}
            </span>
            {isToday ? (
              <span className="training-day-card__mini-badge training-day-card__mini-badge--today">
                Hoje
              </span>
            ) : null}
          </div>
        </div>

        {day.description ? <p className="training-day-card__desc">{day.description}</p> : null}
      </div>

      <ChevronRight size={18} className="training-day-card__chevron" aria-hidden />
    </button>
  )
}
