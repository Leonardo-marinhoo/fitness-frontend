import { useEffect, useState } from 'react'
import { AtSign, Copy, Dumbbell, MessageCircle, Phone, Send } from 'lucide-react'

import { createTrainerInvitation, fetchAdminTrainers } from '@/api/super-admin'
import { ApiError } from '@/api/client'
import type { RegistrationInvitation, TrainerProfile } from '@/types/auth/user'
import type { AuthUser } from '@/types/auth/user'

type TrainerRow = TrainerProfile & { students_count: number; user: AuthUser }

const glassCard: React.CSSProperties = {
  background: 'var(--s1)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 16,
  backdropFilter: 'blur(8px)',
}

function initials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function TrainersPage() {
  const [trainers, setTrainers] = useState<TrainerRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inviteName, setInviteName] = useState('')
  const [invite, setInvite] = useState<RegistrationInvitation | null>(null)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [isCreatingInvite, setIsCreatingInvite] = useState(false)

  useEffect(() => {
    void (async () => {
      try {
        const data = await fetchAdminTrainers()
        setTrainers(data)
      } catch {
        setTrainers([])
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
      const created = await createTrainerInvitation({
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
      'Olá! Você recebeu um convite para se cadastrar como personal trainer na FitnessCode.',
      '',
      url,
      '',
      'Este link é único, individual e deve ser usado apenas por você.',
    ].join('\n')

    return `https://wa.me/?text=${encodeURIComponent(text)}`
  }

  return (
    <div style={{ color: '#f7f7f4' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 800,
            fontSize: 26,
            color: '#f7f7f4',
            margin: 0,
          }}
        >
          Personal Trainers
        </h1>
        <p style={{ color: 'rgba(247,247,244,0.5)', fontSize: 14, marginTop: 4 }}>
          {trainers.length} profissional{trainers.length !== 1 ? 'is' : ''} cadastrado
          {trainers.length !== 1 ? 's' : ''}
        </p>
      </div>

      <form
        onSubmit={(event) => void handleCreateInvite(event)}
        style={{
          ...glassCard,
          padding: 18,
          marginBottom: 18,
          display: 'grid',
          gap: 14,
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800 }}>Convidar personal</h2>
          <p style={{ color: 'rgba(247,247,244,0.48)', fontSize: 13, margin: '4px 0 0' }}>
            Gere um link único para o personal preencher dados, foto, contato e concluir o cadastro.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(180px, 0.58fr) auto', gap: 10 }}>
          <input
            value={inviteName}
            onChange={(event) => setInviteName(event.target.value)}
            placeholder="Nome do personal (opcional)"
            style={{
              minWidth: 0,
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.05)',
              color: '#f7f7f4',
              padding: '11px 12px',
              outline: 'none',
            }}
          />
          <div
            style={{
              minWidth: 0,
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.035)',
              color: 'rgba(247,247,244,0.48)',
              padding: '11px 12px',
              fontSize: 13,
            }}
          >
            O personal escolhe o e-mail no cadastro.
          </div>
          <button type="submit" disabled={isCreatingInvite} className="btn-accent px-4">
            <Send size={15} />
            {isCreatingInvite ? 'Gerando...' : 'Gerar convite'}
          </button>
        </div>

        <p style={{ margin: 0, color: 'rgba(247,247,244,0.44)', fontSize: 12, lineHeight: 1.5 }}>
          Observação: o link é único por pessoa e só deve ser compartilhado com quem deve se cadastrar.
          Depois que o cadastro for finalizado, ele não funciona mais.
        </p>

        {inviteError ? (
          <div style={{ color: '#ff8a8a', fontSize: 13 }}>{inviteError}</div>
        ) : null}

        {invite?.invite_url ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) auto auto',
              gap: 8,
              alignItems: 'center',
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 12,
            }}
          >
            <code
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: 'rgba(247,247,244,0.7)',
                fontSize: 12,
              }}
            >
              {invite.invite_url}
            </code>
            <button
              type="button"
              onClick={() => void navigator.clipboard.writeText(invite.invite_url ?? '')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(247,247,244,0.8)',
                padding: '9px 11px',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <Copy size={14} />
              Copiar
            </button>
            <a
              href={buildWhatsAppUrl(invite.invite_url)}
              target="_blank"
              rel="noreferrer"
              className="btn-accent px-3 py-2 text-xs"
            >
              <MessageCircle size={14} />
              Enviar no WhatsApp
            </a>
          </div>
        ) : null}
      </form>

      {/* Content */}
      {isLoading ? (
        <div
          style={{
            ...glassCard,
            padding: '40px 20px',
            textAlign: 'center',
            color: 'rgba(247,247,244,0.4)',
          }}
        >
          Carregando...
        </div>
      ) : trainers.length === 0 ? (
        <div
          style={{
            ...glassCard,
            padding: '48px 20px',
            textAlign: 'center',
          }}
        >
          <Dumbbell
            size={40}
            style={{ color: 'rgba(247,247,244,0.2)', margin: '0 auto 12px' }}
          />
          <p style={{ color: 'rgba(247,247,244,0.5)', fontSize: 14, margin: 0 }}>
            Nenhum personal trainer cadastrado ainda.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
          {trainers.map((trainer) => (
            <div key={trainer.id} style={{ ...glassCard, padding: '20px 22px' }}>
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(223,255,106,0.25), rgba(168,140,255,0.25))',
                    border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--accent-lime)',
                    flexShrink: 0,
                  }}
                >
                  {trainer.photo_url ? (
                    <img
                      src={trainer.photo_url}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                    />
                  ) : (
                    initials(trainer.name)
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                      fontWeight: 700,
                      fontSize: 16,
                      color: '#f7f7f4',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {trainer.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(247,247,244,0.45)', marginTop: 2 }}>
                    {trainer.user?.email}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {trainer.cref && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(247,247,244,0.6)' }}>
                    <Dumbbell size={14} style={{ color: 'rgba(247,247,244,0.35)', flexShrink: 0 }} />
                    CREF: {trainer.cref}
                  </div>
                )}
                {trainer.instagram && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(247,247,244,0.6)' }}>
                    <AtSign size={14} style={{ color: 'rgba(247,247,244,0.35)', flexShrink: 0 }} />
                    {trainer.instagram}
                  </div>
                )}
                {trainer.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(247,247,244,0.6)' }}>
                    <Phone size={14} style={{ color: 'rgba(247,247,244,0.35)', flexShrink: 0 }} />
                    {trainer.phone}
                  </div>
                )}
                {trainer.bio && (
                  <p
                    style={{
                      fontSize: 13,
                      color: 'rgba(247,247,244,0.5)',
                      margin: '4px 0 0',
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {trainer.bio}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div
                style={{
                  marginTop: 16,
                  paddingTop: 12,
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 12, color: 'rgba(247,247,244,0.4)' }}>Alunos</span>
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: 'var(--accent-lime)',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}
                >
                  {trainer.students_count ?? 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
