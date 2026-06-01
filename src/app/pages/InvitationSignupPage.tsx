import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { ApiError } from '@/api/client'
import { acceptInvitation, fetchInvitation } from '@/api/invitations'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/enums/user-role'
import type { RegistrationInvitation } from '@/types/auth/user'

const SPLASH_ART_URL = '/mb-fitness-invite-splash.png'
const LOGO_URL = '/mb-fitness-logo.png'
const TRAINER_PLACEHOLDER_URL = '/mb-fitness-trainer-placeholder.png'

const LEVELS = [
  { value: 'beginner', label: 'Iniciante', description: 'Menos de 6 meses' },
  { value: 'intermediate', label: 'Intermediário', description: '6 meses a 2 anos' },
  { value: 'advanced', label: 'Avançado', description: 'Mais de 2 anos' },
  { value: 'athlete', label: 'Atleta', description: 'Competitivo' },
] as const

const GENDERS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
] as const

type SignupForm = {
  name: string
  email: string
  password: string
  cref: string
  phone: string
  instagram: string
  bio: string
  birth_date: string
  gender: string
  training_level: string
  gym_name: string
  physical_limitations: string
  injuries: string
}

type InviteStep = 'splash' | 'summary' | 'account' | 'training' | 'health' | 'professional'

type StepConfig = {
  id: InviteStep
  label: string
}

const initialForm: SignupForm = {
  name: '',
  email: '',
  password: '',
  cref: '',
  phone: '',
  instagram: '',
  bio: '',
  birth_date: '',
  gender: '',
  training_level: '',
  gym_name: '',
  physical_limitations: '',
  injuries: '',
}

function firstName(name: string) {
  return name.trim().split(' ').filter(Boolean)[0] ?? name
}

function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="invite-onboarding__field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

function Brand() {
  return (
    <Link to="/login" className="invite-onboarding__brand" aria-label="MB fitness">
      <img src={LOGO_URL} alt="MB fitness" />
    </Link>
  )
}

function StepHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string
  title: string
  description: string
  icon?: ReactNode
}) {
  return (
    <div className="invite-onboarding__step-head">
      <span className="invite-onboarding__eyebrow">
        {icon}
        {eyebrow}
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}

export function InvitationSignupPage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const [invitation, setInvitation] = useState<RegistrationInvitation | null>(null)
  const [form, setForm] = useState<SignupForm>(initialForm)
  const [photo, setPhoto] = useState<File | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    if (!token) return

    void (async () => {
      try {
        const data = await fetchInvitation(token)
        setInvitation(data)
        setForm((prev) => ({
          ...prev,
          name: data.invited_name ?? '',
        }))
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.status === 410 ? 'Este convite já foi utilizado.' : err.message)
        } else {
          setError('Convite inválido ou indisponível.')
        }
      } finally {
        setIsLoading(false)
      }
    })()
  }, [token])

  const isTrainerInvite = invitation?.type === 'trainer'
  const steps = useMemo<StepConfig[]>(() => {
    const shared: StepConfig[] = [
      { id: 'splash', label: 'Boas-vindas' },
      { id: 'summary', label: 'Resumo' },
      { id: 'account', label: 'Acesso' },
    ]

    if (isTrainerInvite) {
      return [...shared, { id: 'professional', label: 'Perfil' }]
    }

    return [...shared, { id: 'training', label: 'Treino' }, { id: 'health', label: 'Saúde' }]
  }, [isTrainerInvite])

  const activeIndex = Math.min(stepIndex, steps.length - 1)
  const activeStep = steps[activeIndex]
  const wizardSteps = steps.filter((step) => step.id !== 'splash')
  const wizardIndex = wizardSteps.findIndex((step) => step.id === activeStep.id)
  const ownerName = invitation?.trainer?.name ?? 'Personal MB fitness'
  const ownerFirstName = firstName(ownerName)
  const trainerPhoto = invitation?.trainer?.photo_url || TRAINER_PLACEHOLDER_URL
  const summaryTitle = isTrainerInvite ? 'Ative seu perfil profissional' : 'Crie seu acesso'
  const accountIsValid = form.name.trim() !== '' && form.email.trim() !== '' && form.password.length >= 8
  const isLastStep = activeIndex === steps.length - 1

  const photoPreview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo])

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  function updateField(field: keyof SignupForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleField(field: 'gender' | 'training_level', value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field] === value ? '' : value,
    }))
  }

  function validateStep(step: InviteStep) {
    if (step !== 'account') return true

    if (!accountIsValid) {
      setError('Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.')
      return false
    }

    return true
  }

  function goToNextStep() {
    if (!validateStep(activeStep.id)) return
    setError(null)
    setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }

  function goToPreviousStep() {
    setError(null)
    setStepIndex((current) => Math.max(current - 1, 0))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isLastStep) {
      goToNextStep()
      return
    }

    if (!token || !invitation) return

    if (!accountIsValid) {
      const accountStep = steps.findIndex((step) => step.id === 'account')
      setStepIndex(Math.max(accountStep, 0))
      setError('Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      const payload = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value) payload.append(key, value)
      })
      if (photo) {
        payload.append('photo', photo)
      }

      const user = await acceptInvitation(token, payload)
      await refreshUser()

      if (user.role === UserRole.Student) {
        navigate('/app/anamnese', { replace: true })
        return
      }

      if (user.role === UserRole.Trainer) {
        navigate('/trainer', { replace: true })
        return
      }

      setIsDone(true)
    } catch (err) {
      if (err instanceof ApiError) {
        const firstError = Object.values(err.payload?.errors ?? {})[0]?.[0]
        setError(firstError ?? err.message)
      } else {
        setError('Erro ao finalizar cadastro.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderStage() {
    if (activeStep.id === 'splash') {
      return (
        <div className="invite-onboarding__hero-copy">
          <span className="invite-onboarding__eyebrow">
            <Sparkles size={15} />
            MB fitness
          </span>
          <h1>Bem-vindo ao seu novo ritmo.</h1>
          <p>
            Seu convite está pronto. Em poucos passos, você entra na experiência MB fitness.
          </p>
        </div>
      )
    }

    if (activeStep.id === 'summary') {
      return (
        <>
          <StepHeader
            eyebrow="Convite individual"
            title={summaryTitle}
            description={
              isTrainerInvite
                ? 'A MB fitness convidou você para configurar seu perfil e receber alunos na plataforma.'
                : `${ownerFirstName} convidou você para iniciar sua experiência de treino na MB fitness.`
            }
            icon={<ShieldCheck size={15} />}
          />

          <div className="invite-onboarding__trainer-card">
            <img
              src={trainerPhoto}
              alt=""
              onError={(event) => {
                event.currentTarget.src = TRAINER_PLACEHOLDER_URL
              }}
            />
            <div>
              <span>{isTrainerInvite ? 'Convite enviado por' : 'Seu personal'}</span>
              <strong>{isTrainerInvite ? 'MB fitness' : ownerName}</strong>
              <small>{isTrainerInvite ? 'Equipe da plataforma' : 'Personal trainer'}</small>
            </div>
          </div>

          <p className="invite-onboarding__security">
            <LockKeyhole size={16} />
            Este link é único por pessoa. Use apenas se ele foi enviado diretamente para você.
            Depois do cadastro, o convite deixa de funcionar.
          </p>
        </>
      )
    }

    if (activeStep.id === 'account') {
      return (
        <>
          <StepHeader
            eyebrow="Acesso"
            title="Dados essenciais"
            description="Só o necessário para criar sua conta. O restante vem aos poucos."
            icon={<UserRound size={15} />}
          />

          <label className="invite-onboarding__photo">
            <span className="invite-onboarding__photo-frame">
              {photoPreview ? <img src={photoPreview} alt="" /> : <Camera size={24} />}
            </span>
            <span>
              <strong>Foto de perfil</strong>
              <small>
                {isTrainerInvite
                  ? 'Opcional. Ajuda os alunos a reconhecerem seu perfil.'
                  : 'Opcional. Ajuda seu personal a reconhecer você dentro da plataforma.'}
              </small>
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
            />
          </label>

          <div className="invite-onboarding__field-grid">
            <Field label="Nome completo">
              <input
                className="invite-onboarding__input"
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Seu nome completo"
                autoComplete="name"
              />
            </Field>
            <Field label="E-mail">
              <input
                className="invite-onboarding__input"
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="email@exemplo.com"
                autoComplete="email"
              />
            </Field>
            <Field label="Senha" hint="Mínimo de 8 caracteres.">
              <input
                className="invite-onboarding__input"
                type="password"
                minLength={8}
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                autoComplete="new-password"
              />
            </Field>
            {isTrainerInvite ? (
              <Field label="Telefone">
                <input
                  className="invite-onboarding__input"
                  value={form.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  placeholder="(11) 99999-9999"
                  autoComplete="tel"
                />
              </Field>
            ) : (
              <Field label="Data de nascimento">
                <input
                  className="invite-onboarding__input"
                  type="date"
                  value={form.birth_date}
                  onChange={(event) => updateField('birth_date', event.target.value)}
                />
              </Field>
            )}
          </div>
        </>
      )
    }

    if (activeStep.id === 'training') {
      return (
        <>
          <StepHeader
            eyebrow="Treino"
            title="Contexto inicial"
            description="Essas informações ajudam o personal a entender o ponto de partida."
            icon={<Dumbbell size={15} />}
          />

          <div className="invite-onboarding__field-grid">
            <Field label="Academia">
              <input
                className="invite-onboarding__input"
                value={form.gym_name}
                onChange={(event) => updateField('gym_name', event.target.value)}
                placeholder="Nome da academia"
              />
            </Field>
            <div className="invite-onboarding__field">
              <span>Gênero</span>
              <div className="invite-onboarding__segmented" role="group" aria-label="Gênero">
                {GENDERS.map((gender) => (
                  <button
                    key={gender.value}
                    type="button"
                    data-active={form.gender === gender.value}
                    onClick={() => toggleField('gender', gender.value)}
                  >
                    {gender.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="invite-onboarding__level-grid" aria-label="Nível de treino">
            {LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                className="invite-onboarding__level"
                data-active={form.training_level === level.value}
                onClick={() => toggleField('training_level', level.value)}
              >
                <span>
                  <strong>{level.label}</strong>
                  <small>{level.description}</small>
                </span>
                <i aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      )
    }

    if (activeStep.id === 'health') {
      return (
        <>
          <StepHeader
            eyebrow="Saúde"
            title="Observações rápidas"
            description="Preencha se já souber. A anamnese completa continuará obrigatória no primeiro acesso."
            icon={<HeartPulse size={15} />}
          />

          <div className="invite-onboarding__field-grid">
            <Field label="Limitações físicas">
              <textarea
                className="invite-onboarding__input invite-onboarding__textarea"
                value={form.physical_limitations}
                onChange={(event) => updateField('physical_limitations', event.target.value)}
                placeholder="Ex: dor no joelho, escoliose..."
              />
            </Field>
            <Field label="Lesões">
              <textarea
                className="invite-onboarding__input invite-onboarding__textarea"
                value={form.injuries}
                onChange={(event) => updateField('injuries', event.target.value)}
                placeholder="Ex: ombro operado, tendinite..."
              />
            </Field>
          </div>

          <p className="invite-onboarding__security invite-onboarding__security--soft">
            <Sparkles size={16} /> A anamnese completa será aberta automaticamente antes do uso do
            app do aluno.
          </p>
        </>
      )
    }

    return (
      <>
        <StepHeader
          eyebrow="Perfil profissional"
          title="Presença do personal"
          description="Foto, redes e bio deixam seu perfil mais reconhecível para os alunos."
          icon={<BadgeCheck size={15} />}
        />

        <div className="invite-onboarding__field-grid">
          <Field label="Instagram">
            <input
              className="invite-onboarding__input"
              value={form.instagram}
              onChange={(event) => updateField('instagram', event.target.value)}
              placeholder="@seuperfil"
            />
          </Field>
          <Field label="CREF opcional">
            <input
              className="invite-onboarding__input"
              value={form.cref}
              onChange={(event) => updateField('cref', event.target.value)}
              placeholder="Pode preencher depois"
            />
          </Field>
        </div>
        <Field label="Bio profissional">
          <textarea
            className="invite-onboarding__input invite-onboarding__textarea"
            value={form.bio}
            onChange={(event) => updateField('bio', event.target.value)}
            placeholder="Conte brevemente sua especialidade, experiência ou abordagem."
          />
        </Field>
      </>
    )
  }

  if (isLoading) {
    return (
      <main className="invite-onboarding invite-onboarding--state">
        <div className="invite-onboarding__media" aria-hidden="true">
          <img src={SPLASH_ART_URL} alt="" />
        </div>
        <div className="invite-onboarding__state">Carregando convite...</div>
      </main>
    )
  }

  if (error && !invitation) {
    return (
      <main className="invite-onboarding invite-onboarding--state">
        <div className="invite-onboarding__media" aria-hidden="true">
          <img src={SPLASH_ART_URL} alt="" />
        </div>
        <div className="invite-onboarding__state invite-onboarding__state--error">
          <strong>{error}</strong>
          <Link to="/login" className="invite-onboarding__primary invite-onboarding__primary--inline">
            Ir para login
          </Link>
        </div>
      </main>
    )
  }

  if (isDone) {
    return (
      <main className="invite-onboarding invite-onboarding--state">
        <div className="invite-onboarding__media" aria-hidden="true">
          <img src={SPLASH_ART_URL} alt="" />
        </div>
        <div className="invite-onboarding__state">
          <CheckCircle2 size={44} />
          <strong>Cadastro finalizado</strong>
          <p>Seu acesso foi criado. Este link de convite não funciona mais.</p>
          <Link to="/login" className="invite-onboarding__primary invite-onboarding__primary--inline">
            Entrar na plataforma
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className={`invite-onboarding invite-onboarding--${activeStep.id}`}>
      <div className="invite-onboarding__media" aria-hidden="true">
        <img src={SPLASH_ART_URL} alt="" />
      </div>

      <div className="invite-onboarding__shell">
        <header className="invite-onboarding__top">
          {activeIndex > 0 ? (
            <button
              type="button"
              className="invite-onboarding__icon-button"
              onClick={goToPreviousStep}
              aria-label="Voltar"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <span aria-hidden="true" />
          )}

          <Brand />

          {activeStep.id !== 'splash' ? (
            <span className="invite-onboarding__counter">
              {wizardIndex + 1}/{wizardSteps.length}
            </span>
          ) : (
            <span aria-hidden="true" />
          )}
        </header>

        <div className="invite-onboarding__progress" aria-hidden="true">
          {steps.map((step, index) => (
            <span
              key={step.id}
              data-active={index === activeIndex}
              data-complete={index < activeIndex}
            />
          ))}
        </div>

        <form onSubmit={(event) => void handleSubmit(event)} className="invite-onboarding__content">
          <section key={activeStep.id} className="invite-onboarding__stage">
            {renderStage()}
          </section>

          {error ? <p className="invite-onboarding__error">{error}</p> : null}

          <footer className="invite-onboarding__actions">
            {activeStep.id !== 'splash' ? (
              <button
                type="button"
                className="invite-onboarding__secondary"
                onClick={goToPreviousStep}
                disabled={isSubmitting}
              >
                Voltar
              </button>
            ) : null}

            <button
              type={isLastStep ? 'submit' : 'button'}
              className="invite-onboarding__primary"
              onClick={isLastStep ? undefined : goToNextStep}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Finalizando...'
                : activeStep.id === 'splash'
                  ? 'Próximo'
                  : activeStep.id === 'summary'
                    ? 'Começar'
                    : isLastStep
                      ? 'Finalizar cadastro'
                      : 'Continuar'}
              {activeStep.id === 'account' ? <Mail size={17} /> : <ArrowRight size={17} />}
            </button>
          </footer>
        </form>
      </div>
    </main>
  )
}
