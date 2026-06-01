import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Copy, MessageCircle, Plus, Send, UserRound } from 'lucide-react'

import { createStudentInvitation, fetchTrainerStudents } from '@/api/trainer'
import { ApiError } from '@/api/client'
import { ProgressThin } from '@/components/design-system'
import { EnumBadge } from '@/components/ui/enum-badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TrainerAvatar,
  TrainerButton,
  TrainerEmptyState,
  TrainerListRow,
  TrainerPageHeader,
  getInitials,
} from '@/components/trainer-ui'
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
        className="rounded-2xl border border-white/8 bg-white/[0.025] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="m-0 text-base font-bold text-zinc-100">Convidar aluno</h2>
            <p className="mt-1 max-w-2xl text-sm text-zinc-500">
              Gere um link único para o aluno preencher os dados e criar o próprio acesso.
            </p>
          </div>
          <button
            type="submit"
            disabled={isCreatingInvite}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-trainer-accent px-4 py-2.5 text-sm font-medium text-trainer-on-accent transition-all hover:brightness-110 disabled:opacity-60"
          >
            <Send size={15} />
            {isCreatingInvite ? 'Gerando...' : 'Gerar convite'}
          </button>
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
          <input
            value={inviteName}
            onChange={(event) => setInviteName(event.target.value)}
            placeholder="Nome do aluno (opcional)"
            className="min-h-11 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
          />
          <span className="hidden items-center rounded-xl border border-white/8 bg-white/[0.03] px-3 text-xs text-zinc-500 md:inline-flex">
            O aluno escolhe o e-mail no cadastro.
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          Observação: o link é único por pessoa e só deve ser compartilhado com quem deve se cadastrar.
          Depois que o cadastro for finalizado, ele não funciona mais.
        </p>

        {inviteError ? <p className="mt-3 text-sm text-red-300">{inviteError}</p> : null}

        {invite?.invite_url ? (
          <div className="mt-4 grid items-center gap-2 border-t border-white/8 pt-3 md:grid-cols-[minmax(0,1fr)_auto_auto]">
            <code className="truncate text-xs text-zinc-400">{invite.invite_url}</code>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(invite.invite_url ?? '')}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-xs font-bold text-zinc-200"
            >
              <Copy size={14} />
              Copiar
            </button>
            <a
              href={buildWhatsAppUrl(invite.invite_url)}
              target="_blank"
              rel="noreferrer"
              className="btn-accent inline-flex min-h-10 items-center justify-center gap-2 px-3 text-xs"
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
              leading={<TrainerAvatar initials={getInitials(student.name)} />}
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
