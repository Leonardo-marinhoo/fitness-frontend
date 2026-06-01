import { useEffect, useMemo, useState } from 'react'
import { Activity } from 'lucide-react'

import { fetchStudentWorkoutSessions } from '@/api/student'
import { StudentPageHero } from '@/shells/student/components/StudentPageHero'
import { DEFAULT_TRAINING_COVER } from '@/lib/student-training'
import type { WorkoutSession } from '@/types/fitness'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  started: { label: 'Em andamento', color: '#70d7ff', bg: 'rgba(112,215,255,0.12)' },
  completed: { label: 'Concluído', color: 'var(--accent-lime)', bg: 'rgba(223,255,106,0.12)' },
  skipped: { label: 'Pulado', color: 'rgba(247,247,244,0.5)', bg: 'rgba(255,255,255,0.06)' },
  cancelled: { label: 'Cancelado', color: 'rgba(247,247,244,0.35)', bg: 'rgba(255,255,255,0.04)' },
}

const allStatuses = ['all', 'completed', 'started', 'skipped', 'cancelled'] as const
type StatusFilter = (typeof allStatuses)[number]

export function SessionsHistoryPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchStudentWorkoutSessions()
        setSessions(data)
      } catch {
        setSessions([])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const filtered = filter === 'all' ? sessions : sessions.filter((s) => s.status === filter)
  const completedCount = useMemo(
    () => sessions.filter((session) => session.status === 'completed').length,
    [sessions],
  )

  return (
    <div>
      <StudentPageHero
        kicker="Histórico"
        title="Suas sessões"
        description="Tudo o que você já registrou — em andamento, concluído ou interrompido."
        coverImage={DEFAULT_TRAINING_COVER}
        badges={
          <span className="student-hero-chip student-hero-chip--muted">
            {sessions.length} registro{sessions.length === 1 ? '' : 's'}
          </span>
        }
        footer={
          <p className="student-hero-stat m-0">
            {completedCount} concluída{completedCount === 1 ? '' : 's'}
          </p>
        }
      />

      {/* Filter tabs */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 20,
          overflowX: 'auto',
          paddingBottom: 2,
        }}
      >
        {allStatuses.map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s) }}
            style={{
              background: filter === s ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)',
              border: filter === s ? '1px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: 600,
              color: filter === s ? '#f7f7f4' : 'rgba(247,247,244,0.45)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {s === 'all' ? 'Todos' : (statusConfig[s]?.label ?? s)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: '40px 20px',
            textAlign: 'center',
            color: 'rgba(247,247,244,0.4)',
          }}
        >
          Carregando sessões...
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: 16,
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          <Activity size={36} style={{ color: 'rgba(247,247,244,0.2)', margin: '0 auto 10px' }} />
          <p style={{ color: 'rgba(247,247,244,0.45)', fontSize: 14, margin: 0 }}>
            Nenhuma sessão encontrada.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map((s) => {
            const sc = statusConfig[s.status] ?? statusConfig.cancelled
            return (
              <div
                key={s.id}
                style={{
                  background:
                    'var(--s1)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#f7f7f4',
                      marginBottom: 4,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.training_day?.name ?? `Treino #${s.training_day_id}`}
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(247,247,244,0.4)', display: 'flex', gap: 8 }}>
                    <span>
                      {s.started_at
                        ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' }).format(new Date(s.started_at))
                        : '—'}
                    </span>
                    {s.duration_in_minutes && <span>{s.duration_in_minutes} min</span>}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: sc.color,
                    background: sc.bg,
                    borderRadius: 6,
                    padding: '3px 9px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sc.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
