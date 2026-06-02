import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, MessageCircle, Plus, Send, UserRound } from 'lucide-react'

import { createStudentInvitation, fetchTrainerStudents } from '@/api/trainer'
import { ApiError } from '@/api/client'
import { ProgressThin } from '@/components/design-system'
import { EnumBadge } from '@/components/ui/enum-badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrainerButton,
  TrainerEmptyState,
  TrainerListRow,
  TrainerPageHeader,
} from '@/components/trainer-ui'
import { StudentPortrait } from '@/shells/trainer/components/student/StudentPortrait'
import { getLevelStyle } from '@/lib/enum-colors'
import type { RegistrationInvitation } from '@/types/auth/user'
import type { Student } from '@/types/fitness'

export function StudentsPage() {
  const navigate = useNavigate()
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inviteName, setInviteName] = useState('')
  const [invite, setInvite] = useState<RegistrationInvitation | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [isCreatingInvite, setIsCreatingInvite] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        setIsLoading(true)
        const data = await fetchTrainerStudents()
        setStudents(data)
      } catch {
        setStudents([])
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  async function handleCreateInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setInviteError(null)
    setIsCreatingInvite(true)

    try {
      const created = await createStudentInvitation({
        invited_name: inviteName || undefined,
      })
      setInvite(created)
      setInviteName('')
    } catch (err) {
      if (err instanceof ApiError) {
        const firstError = Object.values(err.payload?.errors ?? {})[0]?.[0]
        setInviteError(firstError ?? err.message)
      } else {
        setInviteError('Erro ao gerar convite.')
      }
    } finally {
      setIsCreatingInvite(false)
    }
  }

  function buildWhatsAppUrl(url: string) {
    const text = [
      'Olá! Seu personal enviou um convite para você se cadastrar na FitnessCode.',
      '',
      url,
      '',
      'Este link é único, individual e deve ser usado apenas por você.',
    ].join('\n')

    return `https://wa.me/?text=${encodeURIComponent(text)}`
  }

  const countLabel = isLoading
    ? '...'
    : `${students.length} aluno${students.length !== 1 ? 's' : ''} cadastrado${students.length !== 1 ? 's' : ''}`

  return (
    <div className="flex flex-col gap-6">
      <TrainerPageHeader
        title="Alunos"
        description={countLabel}
        actions={
          <div className="flex flex-wrap gap-2">
            <TrainerButton variant="secondary" onClick={() => navigate('/trainer/students/new')}>
              <Plus size={15} />
              Cadastro manual
            </TrainerButton>
          </div>
        }
      />

      <form
        onSubmit={(event) => void handleCreateInvite(event)}
        className="trainer-invite-panel"
      >
        <div className="trainer-invite-panel__head">
          <div className="trainer-invite-panel__title-row">
            <span className="trainer-invite-panel__icon">
              <Send size={16} />
            </span>
            <div>
              <h2>Convidar aluno</h2>
              <p>Gere um link individual para o aluno criar o próprio acesso.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={isCreatingInvite}
            className="trainer-invite-panel__submit"
          >
            <Send size={15} />
            {isCreatingInvite ? 'Gerando...' : 'Gerar convite'}
          </button>
        </div>

        <div className="trainer-invite-panel__body">
          <input
            value={inviteName}
            onChange={(event) => setInviteName(event.target.value)}
            placeholder="Nome do aluno (opcional)"
            className="trainer-invite-panel__input"
          />
          <span className="trainer-invite-panel__hint">
            O aluno escolhe o e-mail no cadastro.
          </span>
        </div>

        <p className="trainer-invite-panel__notice">
          Observação: o link é único por pessoa e só deve ser compartilhado com quem deve se cadastrar.
          Depois que o cadastro for finalizado, ele não funciona mais.
        </p>

        {inviteError ? <p className="trainer-invite-panel__error">{inviteError}</p> : null}

        {invite?.invite_url ? (
          <div className="trainer-invite-panel__result">
            <code>{invite.invite_url}</code>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(invite.invite_url ?? '')}
              className="trainer-invite-panel__copy"
            >
              <Copy size={14} />
              Copiar
            </button>
            <a
              href={buildWhatsAppUrl(invite.invite_url)}
              target="_blank"
              rel="noreferrer"
              className="trainer-invite-panel__whatsapp"
            >
              <MessageCircle size={14} />
              Enviar no WhatsApp
            </a>
          </div>
        ) : null}
      </form>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl bg-trainer-surface" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <TrainerEmptyState
          icon={UserRound}
          title="Nenhum aluno cadastrado ainda."
          action={
            <TrainerButton onClick={() => navigate('/trainer/students/new')}>
              <Plus size={14} />
              Cadastrar primeiro aluno
            </TrainerButton>
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {students.map((student) => (
            <TrainerListRow
              key={student.id}
              onClick={() => navigate(`/trainer/students/${student.id}`)}
              leading={<StudentPortrait student={student} size="sm" />}
              title={student.name}
              meta={
                <span className="flex flex-col gap-1.5">
                  <span className="flex flex-wrap items-center gap-1.5">
                    {student.training_level ? (
                      <EnumBadge size="sm" style={getLevelStyle(student.training_level)} />
                    ) : null}
                    {student.goal ? <span className="truncate">{student.goal}</span> : null}
                    {student.gym_name ? <span>· {student.gym_name}</span> : null}
                  </span>
                  <ProgressThin
                    value={student.has_completed_anamnesis ? 100 : 25}
                    className="max-w-[120px]"
                  />
                </span>
              }
              trailing={
                <EnumBadge
                  size="sm"
                  style={
                    student.has_completed_anamnesis
                      ? {
                          label: 'Anamnese OK',
                          text: 'var(--trainer-accent)',
                          bg: 'color-mix(in oklab, var(--trainer-accent) 14%, transparent)',
                          border: 'color-mix(in oklab, var(--trainer-accent) 28%, transparent)',
                          solid: 'var(--trainer-accent)',
                        }
                      : {
                          label: 'Sem anamnese',
                          text: 'var(--trainer-amber)',
                          bg: 'color-mix(in oklab, var(--trainer-amber) 15%, transparent)',
                          border: 'color-mix(in oklab, var(--trainer-amber) 28%, transparent)',
                          solid: 'var(--trainer-amber)',
                        }
                  }
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
