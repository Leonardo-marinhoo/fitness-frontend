import { useState } from 'react'
import { Edit3, LogOut, Save, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { updateAnamnesis } from '@/api/student'
import { useAuth } from '@/contexts/AuthContext'
import { StudentPageHero } from '@/shells/student/components/StudentPageHero'
import { DEFAULT_TRAINING_COVER } from '@/lib/student-training'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.07)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 10,
  padding: '10px 14px',
  color: '#f7f7f4',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Plus Jakarta Sans, sans-serif',
}

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: 'rgba(247,247,244,0.55)',
  display: 'block',
  marginBottom: 5,
}

function InfoRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '10px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <span style={{ fontSize: 13, color: 'rgba(247,247,244,0.5)' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#f7f7f4', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

const levelLabel: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

const genderLabel: Record<string, string> = {
  M: 'Masculino',
  F: 'Feminino',
  other: 'Outro',
}

export function PerfilPage() {
  const { user, refreshUser, logout } = useAuth()
  const navigate = useNavigate()
  const student = user?.student
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState({
    height: String(student?.height ?? ''),
    weight: String(student?.weight ?? ''),
    goal: student?.goal ?? '',
    training_level: student?.training_level ?? '',
    gym_name: student?.gym_name ?? '',
    physical_limitations: student?.physical_limitations ?? '',
    injuries: student?.injuries ?? '',
  })

  const initials = (student?.name ?? user?.name ?? 'AT')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const payload: Record<string, unknown> = {
        goal: form.goal || undefined,
        training_level: form.training_level || undefined,
        gym_name: form.gym_name || undefined,
        physical_limitations: form.physical_limitations || undefined,
        injuries: form.injuries || undefined,
      }
      if (form.height) payload.height = Number(form.height)
      if (form.weight) payload.weight = Number(form.weight)
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k])

      await updateAnamnesis(payload)
      await refreshUser()
      setIsEditing(false)
    } catch {
      // silent
    } finally {
      setIsSaving(false)
    }
  }

  const displayName = student?.name ?? user?.name ?? 'Atleta'

  return (
    <div>
      <StudentPageHero
        kicker="Sua conta"
        title={displayName}
        description={user?.email ?? 'Dados e preferências do seu acompanhamento.'}
        coverImage={DEFAULT_TRAINING_COVER}
        badges={
          <span className="student-hero-chip">
            {student?.has_completed_anamnesis ? 'Anamnese completa' : 'Anamnese pendente'}
          </span>
        }
        footer={
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-lime), #a8ff6a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 800,
                color: 'var(--on-accent)',
              }}
            >
              {initials}
            </div>
            <p className="student-hero-stat m-0">{student?.gym_name ?? 'Perfil do aluno'}</p>
          </div>
        }
      />

      {!isEditing ? (
        <>
          {/* Info card */}
          <div
            style={{
              background:
                'var(--s1)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 16,
              padding: '18px 20px',
              backdropFilter: 'blur(8px)',
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                color: 'rgba(247,247,244,0.5)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                margin: '0 0 8px',
              }}
            >
              Dados Físicos
            </h2>
            <InfoRow label="Altura" value={student?.height ? `${student.height} cm` : null} />
            <InfoRow label="Peso" value={student?.weight ? `${student.weight} kg` : null} />
            <InfoRow label="Gênero" value={student?.gender ? genderLabel[student.gender] ?? student.gender : null} />
            <InfoRow label="Nascimento" value={student?.birth_date} />
            <InfoRow label="Academia" value={student?.gym_name} />
          </div>

          <div
            style={{
              background:
                'var(--s1)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 16,
              padding: '18px 20px',
              backdropFilter: 'blur(8px)',
              marginBottom: 16,
            }}
          >
            <h2
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: 14,
                color: 'rgba(247,247,244,0.5)',
                textTransform: 'uppercase',
                letterSpacing: 1,
                margin: '0 0 8px',
              }}
            >
              Treino
            </h2>
            <InfoRow label="Objetivo" value={student?.goal} />
            <InfoRow label="Nível" value={student?.training_level ? levelLabel[student.training_level] ?? student.training_level : null} />
            <InfoRow label="Limitações" value={student?.physical_limitations} />
            <InfoRow label="Lesões" value={student?.injuries} />
          </div>

          {/* Status */}
          <div
            style={{
              background: student?.has_completed_anamnesis
                ? 'rgba(223,255,106,0.06)'
                : 'rgba(243,187,97,0.06)',
              border: `1px solid ${student?.has_completed_anamnesis ? 'rgba(223,255,106,0.2)' : 'rgba(243,187,97,0.2)'}`,
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>
              {student?.has_completed_anamnesis ? '✅' : '⚠️'}
            </span>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: student?.has_completed_anamnesis ? 'var(--accent-lime)' : '#f3bb61',
                }}
              >
                {student?.has_completed_anamnesis ? 'Anamnese completa' : 'Anamnese pendente'}
              </div>
              {!student?.has_completed_anamnesis && (
                <div style={{ fontSize: 12, color: 'rgba(247,247,244,0.5)' }}>
                  Preencha seus dados para melhorar as recomendações
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => { setIsEditing(true) }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 12,
              padding: '13px',
              color: '#f7f7f4',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
          >
            <Edit3 size={16} />
            Editar Anamnese
          </button>

          <button
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'rgba(255,80,80,0.07)',
              border: '1px solid rgba(255,80,80,0.18)',
              borderRadius: 12,
              padding: '13px',
              color: isLoggingOut ? 'rgba(255,100,100,0.4)' : 'rgba(255,100,100,0.85)',
              fontWeight: 600,
              fontSize: 14,
              cursor: isLoggingOut ? 'default' : 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              marginTop: 10,
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            <LogOut size={16} />
            {isLoggingOut ? 'Saindo...' : 'Sair da conta'}
          </button>
        </>
      ) : (
        <div
          style={{
            background:
              'var(--s1)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 16,
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            <h2
              style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: 17,
                color: '#f7f7f4',
                margin: 0,
              }}
            >
              Editar Perfil
            </h2>
            <button
              onClick={() => { setIsEditing(false) }}
              style={{ background: 'none', border: 'none', color: 'rgba(247,247,244,0.5)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Altura (cm)</label>
                <input
                  style={inputStyle}
                  name="height"
                  type="number"
                  value={form.height}
                  onChange={handleChange}
                  placeholder="170"
                />
              </div>
              <div>
                <label style={labelStyle}>Peso (kg)</label>
                <input
                  style={inputStyle}
                  name="weight"
                  type="number"
                  step="0.1"
                  value={form.weight}
                  onChange={handleChange}
                  placeholder="70"
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Objetivo</label>
              <input
                style={inputStyle}
                name="goal"
                value={form.goal}
                onChange={handleChange}
                placeholder="Ex: Hipertrofia, emagrecimento..."
              />
            </div>
            <div>
              <label style={labelStyle}>Nível de treino</label>
              <select style={inputStyle} name="training_level" value={form.training_level} onChange={handleChange}>
                <option value="">Selecionar</option>
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermediário</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Academia</label>
              <input
                style={inputStyle}
                name="gym_name"
                value={form.gym_name}
                onChange={handleChange}
                placeholder="Nome da academia"
              />
            </div>
            <div>
              <label style={labelStyle}>Limitações físicas</label>
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                name="physical_limitations"
                value={form.physical_limitations}
                onChange={handleChange}
                placeholder="Descreva limitações..."
              />
            </div>
            <div>
              <label style={labelStyle}>Lesões</label>
              <textarea
                style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }}
                name="injuries"
                value={form.injuries}
                onChange={handleChange}
                placeholder="Descreva lesões anteriores ou atuais..."
              />
            </div>

            <button
              onClick={() => void handleSave()}
              disabled={isSaving}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                background: isSaving ? 'rgba(223,255,106,0.6)' : 'var(--accent-lime)',
                color: 'var(--on-accent)',
                fontWeight: 700,
                fontSize: 14,
                border: 'none',
                borderRadius: 12,
                padding: '13px',
                cursor: isSaving ? 'default' : 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            >
              <Save size={16} />
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
