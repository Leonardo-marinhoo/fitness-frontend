import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchActiveTrainingSheet } from '@/api/student'
import { ApiError } from '@/api/client'
import type { TrainingDay, TrainingSheet } from '@/types/fitness'
import { useAuth } from '@/contexts/AuthContext'

const DOW_MAP = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function StudentHomePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeSheet, setActiveSheet] = useState<TrainingSheet | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchActiveTrainingSheet()
        setActiveSheet(data)
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setActiveSheet(null)
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const today = DOW_MAP[new Date().getDay()]
  const suggestedDay: TrainingDay | undefined =
    activeSheet?.training_days?.find((d) => d.day_of_week === today)
  const firstDay: TrainingDay | undefined = activeSheet?.training_days?.[0]
  const todayDay = suggestedDay ?? firstDay

  const firstName = user?.student?.name?.split(' ')[0] ?? user?.name?.split(' ')[0] ?? 'Atleta'
  const leadText = todayDay
    ? 'Seu treino de hoje já está pronto. Confira a ficha e os exercícios antes de começar.'
    : 'Sua ficha vai aparecer aqui com contexto, foco do dia e o caminho mais rápido para iniciar.'

  return (
    <div className="student-home">
      <header className="student-shell__page-intro">
        <p className="text-eyebrow mb-3">{getGreeting()}</p>
        <h1 className="text-display m-0">Olá, {firstName}</h1>
        <p className="text-body student-shell__page-copy">{leadText}</p>
      </header>

      {isLoading ? (
        <div className="s1 px-5 py-10 text-center text-body">Carregando seu treino...</div>
      ) : (
        <>
          {todayDay && (
            <button
              type="button"
              onClick={() => { void navigate(`/app/treino/${todayDay.id}`) }}
              className="student-card student-shell__hero-card mb-5 block w-full cursor-pointer border-0 p-0 text-left"
            >
              <div
                className="student-shell__hero-media"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80')`,
                }}
              >
                <div className="student-shell__hero-content">
                  <span className="student-shell__hero-kicker">Hoje • {todayDay.name}</span>
                  <h2 className="text-heading m-0 mb-1 text-left text-[2rem]">
                    {todayDay.description ?? todayDay.name}
                  </h2>
                  <p className="text-caption mb-4 text-left">
                    {todayDay.training_exercises?.length ?? 0} exercícios
                  </p>
                  <span className="btn-accent block w-full py-3 text-center text-[15px]">
                    Iniciar treino
                  </span>
                </div>
              </div>
            </button>
          )}

          {activeSheet && (
            <div className="student-card-secondary student-shell__summary-card">
              <p className="text-eyebrow mb-1.5">Plano atual</p>
              <h3 className="text-heading m-0 mb-1 text-[17px]">{activeSheet.name}</h3>
              <p className="text-body m-0">
                {activeSheet.training_days?.length ?? 0} divisões ·{' '}
                {activeSheet.end_date
                  ? `até ${new Intl.DateTimeFormat('pt-BR').format(new Date(activeSheet.end_date))}`
                  : 'sem data de término'}
              </p>
            </div>
          )}

          {!activeSheet && (
            <div className="s1 border-dashed px-5 py-8 text-center">
              <p className="text-body m-0">
                Nenhuma ficha ativa. Aguarde seu personal criar uma ficha para você.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
