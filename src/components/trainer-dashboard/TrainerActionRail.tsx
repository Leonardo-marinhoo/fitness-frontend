import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CircleAlert, Sparkles } from 'lucide-react'

import { StudentPortrait } from '@/shells/trainer/components/student/StudentPortrait'
import type { Student } from '@/types/fitness'

type PriorityItem = {
  key: string
  student: Student
  type: 'anamnesis' | 'new'
  title: string
  description: string
  meta: string
  to: string
}

type TrainerActionRailProps = {
  pendingAnamneses: Student[]
  newStudents: Student[]
  loading?: boolean
}

export function TrainerActionRail({
  pendingAnamneses,
  newStudents,
  loading = false,
}: TrainerActionRailProps) {
  const navigate = useNavigate()

  const items = useMemo<PriorityItem[]>(() => {
    const list: PriorityItem[] = [
      ...pendingAnamneses.map((student) => ({
        key: `anamnesis-${student.id}`,
        student,
        type: 'anamnesis' as const,
        title: student.name,
        description: 'Anamnese pronta para revisão antes da ficha.',
        meta: student.anamnesis_completed_at
          ? `Preenchida em ${new Date(student.anamnesis_completed_at).toLocaleDateString('pt-BR')}`
          : 'Aguardando revisão',
        to: `/trainer/students/${student.id}/anamnesis`,
      })),
      ...newStudents.map((student) => ({
        key: `new-${student.id}`,
        student,
        type: 'new' as const,
        title: student.name,
        description: 'Novo perfil cadastrado. Vale revisar objetivo e onboarding.',
        meta: student.created_at
          ? `Entrou em ${new Date(student.created_at).toLocaleDateString('pt-BR')}`
          : 'Novo neste mês',
        to: `/trainer/students/${student.id}`,
      })),
    ]
    return list.slice(0, 4)
  }, [pendingAnamneses, newStudents])

  const totalOpen = pendingAnamneses.length + newStudents.length
  const latestStudents = newStudents.slice(0, 4)

  return (
    <aside className="trainer-lux-rail td-order-rail">
      <div className="trainer-lux-rail-stack">
        <section className="trainer-lux-panel trainer-lux-panel--rail">
          <div className="trainer-lux-panel-header">
            <div>
              <p className="trainer-lux-panel-kicker">Ações</p>
              <h2 className="trainer-lux-panel-title">Agenda prioritária</h2>
            </div>
          </div>

          {loading ? (
            <div className="trainer-lux-rail-skeletons">
              {Array.from({ length: 3 }).map((_, index) => (
                <span key={index} className="block h-24 animate-pulse rounded-[1.5rem] bg-white/[0.035]" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="trainer-lux-quiet-state">
              <Sparkles size={18} />
              <div>
                <p>Tudo em dia</p>
                <span>Nenhuma ação urgente aberta nesta leitura.</span>
              </div>
            </div>
          ) : (
            <div className="trainer-lux-priority-list">
              {items.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className="trainer-lux-priority-row"
                  data-tone={item.type === 'anamnesis' ? 'gold' : 'emerald'}
                  onClick={() => navigate(item.to)}
                >
                  <div className="trainer-lux-priority-main">
                    <p>{item.title}</p>
                    <span>{item.description}</span>
                    <small>{item.meta}</small>
                  </div>
                  <em>{item.type === 'anamnesis' ? 'Avaliação' : 'Novo aluno'}</em>
                </button>
              ))}
            </div>
          )}

          <Link to="/trainer/students" className="trainer-lux-rail-link">
            Ver todos os alunos
            <ArrowRight size={15} />
          </Link>
        </section>

        <section className="trainer-lux-panel trainer-lux-panel--rail">
          <div className="trainer-lux-panel-header">
            <div>
              <p className="trainer-lux-panel-kicker">Monitoramento</p>
              <h2 className="trainer-lux-panel-title">Pendências</h2>
            </div>
            <span className="trainer-lux-count-pill">{totalOpen}</span>
          </div>

          <div className="trainer-lux-summary-rows">
            <div>
              <span>Anamneses para revisar</span>
              <strong>{pendingAnamneses.length}</strong>
            </div>
            <div>
              <span>Novos alunos do mês</span>
              <strong>{newStudents.length}</strong>
            </div>
            <div>
              <span>Prioridades abertas</span>
              <strong>{totalOpen}</strong>
            </div>
          </div>
        </section>

        <section className="trainer-lux-panel trainer-lux-panel--rail">
          <div className="trainer-lux-panel-header">
            <div>
              <p className="trainer-lux-panel-kicker">Captação</p>
              <h2 className="trainer-lux-panel-title">Novos alunos do mês</h2>
            </div>
            <Link to="/trainer/students" className="trainer-lux-panel-inline-link">
              Ver todos
            </Link>
          </div>

          {latestStudents.length === 0 ? (
            <div className="trainer-lux-empty-copy">Nenhum novo cadastro neste recorte.</div>
          ) : (
            <div className="trainer-lux-student-list">
              {latestStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  className="trainer-lux-student-row"
                  onClick={() => navigate(`/trainer/students/${student.id}`)}
                >
                  <StudentPortrait student={student} size="sm" className="trainer-lux-student-avatar" />
                  <div className="trainer-lux-student-copy">
                    <p>{student.name}</p>
                    <span>
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString('pt-BR')
                        : 'Novo este mês'}
                    </span>
                  </div>
                  <CircleAlert size={14} className="trainer-lux-student-arrow" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </aside>
  )
}
