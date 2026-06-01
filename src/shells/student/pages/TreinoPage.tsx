import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'

import { fetchActiveTrainingSheet } from '@/api/student'
import { ApiError } from '@/api/client'
import { StudentPageHero } from '@/shells/student/components/StudentPageHero'
import { TrainingDayListCard } from '@/shells/student/components/TrainingDayListCard'
import { TreinoSheetHero } from '@/shells/student/components/TreinoSheetHero'
import {
  DOW_KEY_MAP,
  getSheetCoverImage,
  sortTrainingDays,
} from '@/lib/student-training'
import type { TrainingSheet } from '@/types/fitness'

export function TreinoPage() {
  const navigate = useNavigate()
  const [sheet, setSheet] = useState<TrainingSheet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchActiveTrainingSheet()
        setSheet(data)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setSheet(null)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const todayDow = DOW_KEY_MAP[new Date().getDay()]
  const sortedDays = useMemo(
    () => sortTrainingDays(sheet?.training_days ?? []),
    [sheet?.training_days],
  )

  if (isLoading) {
    return <div className="py-12 text-center text-body">Carregando treino...</div>
  }

  if (!sheet) {
    return (
      <div>
        <StudentPageHero
          kicker="Ficha ativa"
          title="Nenhum treino liberado"
          description="Quando seu personal ativar uma ficha, seus treinos aparecem aqui."
          coverImage={getSheetCoverImage(null)}
        />
        <div className="s1 border border-dashed border-[var(--s-border)] px-5 py-10 text-center">
          <Dumbbell size={36} className="mx-auto mb-3 text-[var(--text-tertiary)]" />
          <p className="text-body m-0">Aguarde seu personal configurar sua ficha.</p>
        </div>
      </div>
    )
  }

  const totalExercises = sortedDays.reduce(
    (sum, day) => sum + (day.training_exercises?.length ?? 0),
    0,
  )

  return (
    <div className="treino-page">
      <TreinoSheetHero
        sheet={sheet}
        trainingCount={sortedDays.length}
        exerciseCount={totalExercises}
      />

      <header className="treino-page__list-head">
        <h2 className="treino-page__list-title">Escolha seu treino</h2>
        <p className="treino-page__list-copy">Confira os exercícios e comece quando estiver pronto.</p>
      </header>

      <div className="treino-page__list">
        {sortedDays.map((day) => (
          <TrainingDayListCard
            key={day.id}
            day={day}
            coverFallback={getSheetCoverImage(sheet)}
            isToday={day.day_of_week === todayDow}
            onSelect={() => { void navigate(`/app/treino/${day.id}`) }}
          />
        ))}
      </div>
    </div>
  )
}
