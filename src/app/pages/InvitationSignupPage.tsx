import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Camera,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { ApiError } from '@/api/client'
import { acceptInvitation, fetchInvitation } from '@/api/invitations'
import { ProfilePhotoCropper } from '@/components/media/ProfilePhotoCropper'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/enums/user-role'
import type { RegistrationInvitation } from '@/types/auth/user'

const SPLASH_ART_URL = '/mb-fitness-invite-splash.png'
const LOGO_URL = '/mb-fitness-logo.png'
const TRAINER_PLACEHOLDER_URL = '/mb-fitness-trainer-placeholder.png'

type SignupForm = {
  name: string
  email: string
  password: string
  password_confirmation: string
  cref: string
  phone: string
  instagram: string
  bio: string
}

type InviteStep = 'splash' | 'summary' | 'account' | 'professional'

type StepConfig = {
  id: InviteStep
  label: string
}

const initialForm: SignupForm = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  cref: '',
  phone: '',
  instagram: '',
  bio: '',
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
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [cropperOpen, setCropperOpen] = useState(false)
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

    return shared
  }, [isTrainerInvite])

  const activeIndex = Math.min(stepIndex, steps.length - 1)
  const activeStep = steps[activeIndex]
  const wizardSteps = steps.filter((step) => step.id !== 'splash')
  const wizardIndex = wizardSteps.findIndex((step) => step.id === activeStep.id)
  const ownerName = invitation?.trainer?.name ?? 'Personal MB fitness'
  const ownerFirstName = firstName(ownerName)
  const trainerPhoto = invitation?.trainer?.photo_url || TRAINER_PLACEHOLDER_URL
  const summaryTitle = isTrainerInvite ? 'Ative seu perfil profissional' : 'Crie seu acesso'
  const passwordsMatch =
    form.password.length >= 8 && form.password === form.password_confirmation
  const accountIsValid = form.name.trim() !== '' && form.email.trim() !== '' && passwordsMatch
  const isLastStep = activeIndex === steps.length - 1

  const photoPreview = useMemo(() => (photo ? URL.createObjectURL(photo) : null), [photo])

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  useEffect(() => {
    return () => {
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc)
    }
  }, [cropImageSrc])

  function handlePhotoFileSelect(file: File | null) {
    if (!file) return

    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc)
    }

    setCropImageSrc(URL.createObjectURL(file))
    setCropperOpen(true)
  }

  function handleCropConfirm(file: File) {
    setPhoto(file)
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc)
      setCropImageSrc(null)
    }
  }

  function handleCropCancel() {
    if (cropImageSrc) {
      URL.revokeObjectURL(cropImageSrc)
      setCropImageSrc(null)
    }
  }

  function updateField(field: keyof SignupForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validateStep(step: InviteStep) {
    if (step !== 'account') return true

    if (form.name.trim() === '' || form.email.trim() === '') {
      setError('Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.')
      return false
    }

    if (!passwordsMatch) {
      setError('Confirme a senha usando os mesmos caracteres.')
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

  async function submitInvitation() {
    if (isSubmitting) return
    if (!token || !invitation) return

    if (!accountIsValid) {
      const accountStep = steps.findIndex((step) => step.id === 'account')
      setStepIndex(Math.max(accountStep, 0))
      setError(
        !passwordsMatch
          ? 'Confirme a senha usando os mesmos caracteres.'
          : 'Preencha nome, e-mail e uma senha com pelo menos 8 caracteres.',
      )
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

  function handlePrimaryAction() {
    if (isLastStep) {
      void submitInvitation()
      return
    }

    goToNextStep()
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!isLastStep) {
      goToNextStep()
      return
    }

    await submitInvitation()
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
              onChange={(event) => {
                handlePhotoFileSelect(event.target.files?.[0] ?? null)
                event.target.value = ''
              }}
            />
          </label>

          <ProfilePhotoCropper
            imageSrc={cropImageSrc}
            open={cropperOpen}
            onOpenChange={setCropperOpen}
            onConfirm={handleCropConfirm}
            onCancel={handleCropCancel}
          />

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
            <Field label="Confirmar senha">
              <input
                className="invite-onboarding__input"
                type="password"
                minLength={8}
                value={form.password_confirmation}
                onChange={(event) => updateField('password_confirmation', event.target.value)}
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
            ) : null}
          </div>
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
              type="button"
              className="invite-onboarding__primary"
              onClick={handlePrimaryAction}
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
