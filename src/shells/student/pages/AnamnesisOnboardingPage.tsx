import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Dumbbell,
  HeartPulse,
  ImageIcon,
  Lightbulb,
  Ruler,
  Scale,
  ShieldCheck,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react'

import { updateAnamnesis, uploadAnamnesisPhoto } from '@/api/student'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { useAuth } from '@/contexts/AuthContext'

const GOAL_SUGGESTIONS = [
  'Hipertrofia',
  'Emagrecimento',
  'Força',
  'Condicionamento',
  'Reabilitação',
  'Manutenção',
  'Definição',
  'Performance',
]

const LEVELS: Array<{
  value: string
  label: string
  description: string
  icon: LucideIcon
}> = [
  { value: 'beginner', label: 'Iniciante', description: 'Menos de 6 meses treinando', icon: Sparkles },
  { value: 'intermediate', label: 'Intermediário', description: '6 meses a 2 anos', icon: Dumbbell },
  { value: 'advanced', label: 'Avançado', description: 'Mais de 2 anos', icon: Scale },
  { value: 'athlete', label: 'Atleta', description: 'Treino competitivo', icon: HeartPulse },
]

const STEP_LABELS = ['Objetivo', 'Nível', 'Medidas', 'Saúde', 'Fotos']
const TOTAL_STEPS = STEP_LABELS.length

const GENDERS = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Feminino' },
  { value: 'other', label: 'Outro' },
] as const

const PHOTO_POSITIONS = [
  { key: 'front', label: 'Frente' },
  { key: 'left_side', label: 'Lado esquerdo' },
  { key: 'right_side', label: 'Lado direito' },
  { key: 'back', label: 'Costas' },
] as const

type PhotoKey = (typeof PHOTO_POSITIONS)[number]['key']

type FormData = {
  goal: string
  training_level: string
  height: string
  weight: string
  gender: string
  birth_date: string
  gym_name: string
  physical_limitations: string
  injuries: string
}

const empty: FormData = {
  goal: '',
  training_level: '',
  height: '',
  weight: '',
  gender: '',
  birth_date: '',
  gym_name: '',
  physical_limitations: '',
  injuries: '',
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function getCameraInputId(key: PhotoKey) {
  return `anamnesis-photo-camera-${key}`
}

function getGalleryInputId(key: PhotoKey) {
  return `anamnesis-photo-gallery-${key}`
}

function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cx('anamnesis-surface', className)}>{children}</section>
}

function StepTitle({ children }: { children: ReactNode }) {
  return <h1 className="anamnesis-step-title">{children}</h1>
}

function StepSubtitle({ children }: { children: ReactNode }) {
  return <p className="anamnesis-step-subtitle">{children}</p>
}

function Field({
  label,
  required,
  invalid,
  children,
  className,
}: {
  label: string
  required?: boolean
  invalid?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cx('anamnesis-field', invalid && 'is-invalid', className)}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  )
}

export function AnamnesisOnboardingPage() {
  const { user, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [stepKey, setStepKey] = useState(1)
  const [form, setForm] = useState<FormData>(empty)
  const [photos, setPhotos] = useState<Partial<Record<PhotoKey, File>>>({})
  const [photoPreviews, setPhotoPreviews] = useState<Partial<Record<PhotoKey, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step3Touched, setStep3Touched] = useState(false)
  const [activePhotoKey, setActivePhotoKey] = useState<PhotoKey | null>(null)
  const [photoSourceDrawerOpen, setPhotoSourceDrawerOpen] = useState(false)
  const previewUrlRefs = useRef<Partial<Record<PhotoKey, string>>>({})

  useEffect(() => {
    const previewUrls = previewUrlRefs.current

    return () => {
      Object.values(previewUrls).forEach((url) => {
        if (url) URL.revokeObjectURL(url)
      })
    }
  }, [])

  function handlePhotoSelect(key: PhotoKey, file: File) {
    if (previewUrlRefs.current[key]) {
      URL.revokeObjectURL(previewUrlRefs.current[key])
    }

    const url = URL.createObjectURL(file)
    previewUrlRefs.current[key] = url
    setPhotos((prev) => ({ ...prev, [key]: file }))
    setPhotoPreviews((prev) => ({ ...prev, [key]: url }))
    setPhotoSourceDrawerOpen(false)
    setActivePhotoKey(null)
  }

  function handlePhotoInputChange(key: PhotoKey, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      handlePhotoSelect(key, file)
    }
    event.target.value = ''
  }

  function openPhotoSourcePicker(key: PhotoKey) {
    setActivePhotoKey(key)
    setPhotoSourceDrawerOpen(true)
  }

  const activePhotoLabel =
    PHOTO_POSITIONS.find((position) => position.key === activePhotoKey)?.label ?? 'foto'
  const activeCameraInputId = activePhotoKey ? getCameraInputId(activePhotoKey) : null
  const activeGalleryInputId = activePhotoKey ? getGalleryInputId(activePhotoKey) : null

  const studentName = user?.student?.name?.split(' ')[0] ?? user?.name?.split(' ')[0] ?? 'Atleta'

  const step3Valid =
    form.height.trim().length > 0 &&
    form.weight.trim().length > 0 &&
    form.gender.trim().length > 0 &&
    form.birth_date.trim().length > 0

  const canAdvance =
    (step === 1 && form.goal.trim().length > 0) ||
    (step === 3 && step3Valid) ||
    (step !== 1 && step !== 3)

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function goToStep(nextStep: number) {
    setStep(nextStep)
    setStepKey(nextStep)
    if (nextStep !== 3) setStep3Touched(false)
  }

  async function handleFinish() {
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: Record<string, unknown> = {}
      if (form.goal) payload.goal = form.goal
      if (form.training_level) payload.training_level = form.training_level
      if (form.height) payload.height = Number(form.height)
      if (form.weight) payload.weight = Number(form.weight)
      if (form.gender) payload.gender = form.gender
      if (form.birth_date) payload.birth_date = form.birth_date
      if (form.gym_name) payload.gym_name = form.gym_name
      if (form.physical_limitations) payload.physical_limitations = form.physical_limitations
      if (form.injuries) payload.injuries = form.injuries

      await updateAnamnesis(payload)

      for (const [key, file] of Object.entries(photos) as [PhotoKey, File][]) {
        if (file) await uploadAnamnesisPhoto(key, file).catch(() => null)
      }

      await refreshUser()
      navigate('/app', { replace: true })
    } catch {
      setError('Não foi possível salvar. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  return (
    <main className="anamnesis-page">
      <div className="anamnesis-shell">
        <header className="anamnesis-top">
          <div className="anamnesis-brand" aria-label="MB Fitness">
            <img src="/mb-fitness-logo.png" alt="MB Fitness" />
          </div>

          <div className="anamnesis-status">
            <ShieldCheck size={14} />
            <span>Anamnese</span>
          </div>
        </header>

        <section className="anamnesis-card">
          <div className="anamnesis-progress" aria-label={`Passo ${step} de ${TOTAL_STEPS}`}>
            {STEP_LABELS.map((label, index) => (
              <span
                key={label}
                aria-label={label}
                data-active={index + 1 === step}
                data-complete={index + 1 < step}
              />
            ))}
          </div>

          <p className="anamnesis-eyebrow">
            Passo {step} de {TOTAL_STEPS} / {STEP_LABELS[step - 1]}
          </p>

          <div key={stepKey} className="anamnesis-step">
            {step === 1 && (
              <>
                <StepTitle>Olá, {studentName}. Vamos começar.</StepTitle>
                <StepSubtitle>
                  Essas respostas ajudam seu personal a montar um treino mais seguro e preciso.
                </StepSubtitle>

                <Surface className="anamnesis-surface--spotlight">
                  <div className="anamnesis-section-heading">
                    <Sparkles size={15} />
                    <span>Objetivo principal</span>
                  </div>

                  <div className="anamnesis-goal-input">
                    <input
                      className="anamnesis-input anamnesis-input--goal"
                      data-filled={form.goal.trim().length > 0}
                      name="goal"
                      value={form.goal}
                      onChange={handleChange}
                      placeholder="Ex: ganhar massa magra e melhorar condicionamento"
                      maxLength={100}
                      autoFocus
                    />
                    <span>{form.goal.length}/100</span>
                  </div>

                  <div className="anamnesis-chip-row" aria-label="Sugestões de objetivo">
                    {GOAL_SUGGESTIONS.map((goal) => {
                      const active = form.goal === goal

                      return (
                        <button
                          key={goal}
                          type="button"
                          className="anamnesis-chip"
                          data-active={active}
                          onClick={() => setForm((prev) => ({ ...prev, goal: active ? '' : goal }))}
                        >
                          {goal}
                        </button>
                      )
                    })}
                  </div>
                </Surface>
              </>
            )}

            {step === 2 && (
              <>
                <StepTitle>Qual é o seu nível hoje?</StepTitle>
                <StepSubtitle>
                  Escolha a opção mais próxima da sua rotina atual. O personal pode ajustar depois.
                </StepSubtitle>

                <div className="anamnesis-level-list">
                  {LEVELS.map((level) => {
                    const Icon = level.icon
                    const active = form.training_level === level.value

                    return (
                      <button
                        key={level.value}
                        type="button"
                        className="anamnesis-level"
                        data-active={active}
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            training_level: active ? '' : level.value,
                          }))
                        }
                      >
                        <span className="anamnesis-level__icon">
                          <Icon size={18} />
                        </span>
                        <span className="anamnesis-level__copy">
                          <strong>{level.label}</strong>
                          <small>{level.description}</small>
                        </span>
                        <span className="anamnesis-level__check">{active && <Check size={13} />}</span>
                      </button>
                    )
                  })}
                </div>

                <p className="anamnesis-soft-caption">Campo opcional. Pode avançar se não souber.</p>
              </>
            )}

            {step === 3 && (
              <>
                <StepTitle>Suas medidas</StepTitle>
                <StepSubtitle>
                  Dados básicos para calcular indicadores e acompanhar sua evolução com mais precisão.
                </StepSubtitle>

                {step3Touched && !step3Valid && (
                  <div className="anamnesis-alert" role="alert">
                    <span />
                    <p>Preencha os campos obrigatórios para continuar.</p>
                  </div>
                )}

                <Surface>
                  <div className="anamnesis-section-heading">
                    <Ruler size={15} />
                    <span>Composição corporal</span>
                  </div>

                  <div className="anamnesis-field-grid">
                    <Field label="Altura (cm)" required invalid={step3Touched && !form.height}>
                      <input
                        className="anamnesis-input"
                        name="height"
                        type="number"
                        inputMode="numeric"
                        min={100}
                        max={250}
                        value={form.height}
                        onChange={handleChange}
                        placeholder="175"
                      />
                    </Field>

                    <Field label="Peso (kg)" required invalid={step3Touched && !form.weight}>
                      <input
                        className="anamnesis-input"
                        name="weight"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        min={30}
                        max={300}
                        value={form.weight}
                        onChange={handleChange}
                        placeholder="70"
                      />
                    </Field>
                  </div>

                  <div className="anamnesis-section-heading anamnesis-section-heading--spaced">
                    <UserRound size={15} />
                    <span>Perfil</span>
                  </div>

                  <div className="anamnesis-field-grid">
                    <Field label="Gênero" required invalid={step3Touched && !form.gender}>
                      <div className="anamnesis-segmented" role="group" aria-label="Gênero">
                        {GENDERS.map((gender) => (
                          <button
                            key={gender.value}
                            type="button"
                            data-active={form.gender === gender.value}
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                gender: prev.gender === gender.value ? '' : gender.value,
                              }))
                            }
                          >
                            {gender.label}
                          </button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Nascimento" required invalid={step3Touched && !form.birth_date}>
                      <input
                        className="anamnesis-input"
                        name="birth_date"
                        type="date"
                        value={form.birth_date}
                        onChange={handleChange}
                      />
                    </Field>

                    <Field label="Academia onde treina" className="anamnesis-field--full">
                      <input
                        className="anamnesis-input"
                        name="gym_name"
                        value={form.gym_name}
                        onChange={handleChange}
                        placeholder="Nome da academia (opcional)"
                      />
                    </Field>
                  </div>

                  <p className="anamnesis-required">* Campos obrigatórios</p>
                </Surface>
              </>
            )}

            {step === 4 && (
              <>
                <StepTitle>Histórico de saúde</StepTitle>
                <StepSubtitle>
                  Limitações e lesões ajudam seu personal a ajustar cargas, exercícios e amplitude.
                </StepSubtitle>

                <Surface>
                  <div className="anamnesis-field-stack">
                    <Field label="Limitações físicas">
                      <textarea
                        className="anamnesis-input anamnesis-textarea"
                        name="physical_limitations"
                        value={form.physical_limitations}
                        onChange={handleChange}
                        placeholder="Ex: dor no joelho, escoliose, hérnia de disco..."
                      />
                    </Field>

                    <Field label="Lesões anteriores ou em tratamento">
                      <textarea
                        className="anamnesis-input anamnesis-textarea"
                        name="injuries"
                        value={form.injuries}
                        onChange={handleChange}
                        placeholder="Ex: ombro operado em 2022, tendinite no cotovelo..."
                      />
                    </Field>
                  </div>

                  <div className="anamnesis-note">
                    <Lightbulb size={16} />
                    <p>Campos opcionais. Você pode complementar essas informações depois.</p>
                  </div>
                </Surface>
              </>
            )}

            {step === 5 && (
              <>
                <StepTitle>Fotos iniciais</StepTitle>
                <StepSubtitle>
                  Registre um ponto de partida visual para acompanhar sua evolução. Todas são opcionais.
                </StepSubtitle>

                <div className="anamnesis-photo-guide">
                  <Camera size={18} />
                  <p>Boa luz, corpo inteiro, fundo neutro e câmera na altura do tronco.</p>
                </div>

                <div className="anamnesis-photo-grid">
                  {PHOTO_POSITIONS.map(({ key, label }) => {
                    const preview = photoPreviews[key]

                    return (
                      <div key={key}>
                        <input
                          id={getCameraInputId(key)}
                          type="file"
                          accept="image/*,image/heic,image/heif"
                          capture="environment"
                          className="sr-only"
                          onChange={(event) => handlePhotoInputChange(key, event)}
                        />
                        <input
                          id={getGalleryInputId(key)}
                          type="file"
                          accept="image/*,image/heic,image/heif"
                          className="sr-only"
                          onChange={(event) => handlePhotoInputChange(key, event)}
                        />
                        <button
                          type="button"
                          className="anamnesis-photo-tile"
                          data-filled={Boolean(preview)}
                          style={preview ? { backgroundImage: `url(${preview})` } : undefined}
                          onClick={() => openPhotoSourcePicker(key)}
                        >
                          {preview ? (
                            <span className="anamnesis-photo-tile__done">
                              <Check size={13} />
                              {label}
                            </span>
                          ) : (
                            <span className="anamnesis-photo-tile__empty">
                              <Camera size={20} />
                              <strong>{label}</strong>
                              <small>Adicionar</small>
                            </span>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>

                <Drawer open={photoSourceDrawerOpen} onOpenChange={setPhotoSourceDrawerOpen}>
                  <DrawerContent className="anamnesis-photo-source-drawer">
                    <DrawerHeader>
                      <DrawerTitle>Adicionar foto — {activePhotoLabel}</DrawerTitle>
                      <DrawerDescription>
                        Escolha tirar uma foto agora ou usar uma imagem da galeria.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="anamnesis-photo-source-actions">
                      <label
                        className="anamnesis-photo-source-btn"
                        htmlFor={activeCameraInputId ?? undefined}
                        aria-disabled={!activeCameraInputId}
                      >
                        <Camera size={20} />
                        Tirar foto
                      </label>
                      <label
                        className="anamnesis-photo-source-btn"
                        htmlFor={activeGalleryInputId ?? undefined}
                        aria-disabled={!activeGalleryInputId}
                      >
                        <ImageIcon size={20} />
                        Escolher da galeria
                      </label>
                      <button
                        type="button"
                        className="anamnesis-photo-source-btn anamnesis-photo-source-btn--ghost"
                        onClick={() => setPhotoSourceDrawerOpen(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </div>

          {error && <div className="anamnesis-error">{error}</div>}

          <nav className="anamnesis-actions" aria-label="Navegação da anamnese">
            {step > 1 && (
              <button
                type="button"
                className="anamnesis-action anamnesis-action--secondary"
                onClick={() => goToStep(step - 1)}
              >
                <ArrowLeft size={16} />
                Voltar
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                className="anamnesis-action anamnesis-action--primary"
                data-disabled={!canAdvance}
                onClick={() => {
                  if (step === 3) setStep3Touched(true)
                  if (canAdvance) goToStep(step + 1)
                }}
              >
                Continuar
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="anamnesis-action anamnesis-action--primary"
                disabled={isSubmitting}
                onClick={() => void handleFinish()}
              >
                {isSubmitting ? 'Salvando...' : 'Concluir e entrar'}
                {!isSubmitting && <Check size={16} />}
              </button>
            )}
          </nav>

          {(step === 4 || step === TOTAL_STEPS) && !isSubmitting && (
            <button type="button" className="anamnesis-skip" onClick={() => void handleFinish()}>
              Pular e preencher depois
            </button>
          )}
        </section>
      </div>
    </main>
  )
}
