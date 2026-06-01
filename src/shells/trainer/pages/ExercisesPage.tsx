import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Dumbbell,
  ImageIcon,
  Link2,
  Pencil,
  Play,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import {
  createExercise,
  deleteExercise,
  fetchMuscleGroups,
  fetchTrainerExercises,
  updateExercise,
  uploadExercisePhoto,
} from '@/api/trainer'
import { ApiError } from '@/api/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { TrainerButton, TrainerPageHeader } from '@/components/trainer-ui'
import {
  EXERCISE_CATEGORIES,
  formSelectClass,
  getExerciseCategoryLabel,
} from '@/lib/exercise-category'
import type { Exercise, MuscleGroup } from '@/types/fitness'

interface FormState {
  name: string
  description: string
  muscle_group_id: string
  category: string
  equipment: string
  instructions: string
  video_url: string
}

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  muscle_group_id: '',
  category: '',
  equipment: '',
  instructions: '',
  video_url: '',
}

function getYoutubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([A-Za-z0-9_-]{11})/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null
}

function ExerciseCard({
  exercise,
  onEdit,
  onDelete,
}: {
  exercise: Exercise
  onEdit: (ex: Exercise) => void
  onDelete: (ex: Exercise) => void
}) {
  const youtubeThumbnail = exercise.video_url ? getYoutubeThumbnail(exercise.video_url) : null
  const coverImage = exercise.image_url ?? youtubeThumbnail

  return (
    <div className="s1 rounded-2xl overflow-hidden flex flex-col group transition-all duration-200 hover:scale-[1.015]">
      <div className="relative h-36 bg-white/5 flex items-center justify-center flex-shrink-0">
        {coverImage ? (
          <img src={coverImage} alt={exercise.name} className="w-full h-full object-cover" />
        ) : (
          <Dumbbell size={32} className="text-white/20" />
        )}

        {exercise.video_url && (
          <a
            href={exercise.video_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 flex items-center justify-center bg-[var(--bg-subtle)]/70 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="size-10 rounded-full bg-primary/90 flex items-center justify-center">
              <Play size={16} fill="currentColor" className="text-primary-foreground ml-0.5" />
            </div>
          </a>
        )}

        <div className="absolute top-2 right-2 flex gap-1">
          {exercise.is_global && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Global
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 flex flex-col gap-2 flex-1">
        <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">{exercise.name}</p>

        <div className="flex flex-wrap gap-1.5">
          {exercise.muscle_group && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/25">
              {exercise.muscle_group.name}
            </span>
          )}
          {exercise.equipment && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-muted-foreground border border-white/10">
              {exercise.equipment}
            </span>
          )}
          {getExerciseCategoryLabel(exercise.category) && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/8 text-muted-foreground border border-white/10">
              {getExerciseCategoryLabel(exercise.category)}
            </span>
          )}
        </div>

        {exercise.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{exercise.description}</p>
        )}

        {!exercise.is_global && (
          <div className="flex gap-2 mt-auto pt-1">
            <button
              onClick={() => onEdit(exercise)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-white/8"
            >
              <Pencil size={12} />
              Editar
            </button>
            <button
              onClick={() => onDelete(exercise)}
              className="flex items-center gap-1.5 text-xs text-red-400/60 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/8 ml-auto"
            >
              <Trash2 size={12} />
              Remover
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ImageUploadField({
  previewUrl,
  onChange,
  onClear,
}: {
  previewUrl: string | null
  onChange: (file: File) => void
  onClear: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <p className="text-xs text-muted-foreground mb-2">Foto de capa (upload)</p>
      {previewUrl ? (
        <div className="relative rounded-xl overflow-hidden h-32">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 size-6 rounded-full bg-[var(--bg-subtle)]/80 flex items-center justify-center hover:bg-[var(--bg-subtle)]/90 transition-colors"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full h-24 rounded-xl border border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
        >
          <ImageIcon size={20} />
          <span className="text-xs">Selecionar imagem</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onChange(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

function ExerciseFormModal({
  open,
  editingExercise,
  muscleGroups,
  onClose,
  onSaved,
}: {
  open: boolean
  editingExercise: Exercise | null
  muscleGroups: MuscleGroup[]
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = editingExercise !== null

  useEffect(() => {
    if (open) {
      if (editingExercise) {
        setForm({
          name: editingExercise.name,
          description: editingExercise.description ?? '',
          muscle_group_id: editingExercise.muscle_group?.id?.toString() ?? '',
          category: editingExercise.category ?? '',
          equipment: editingExercise.equipment ?? '',
          instructions: editingExercise.instructions ?? '',
          video_url: editingExercise.video_url ?? '',
        })
        setPhotoPreview(editingExercise.image_url ?? null)
      } else {
        setForm(EMPTY_FORM)
        setPhotoPreview(null)
      }
      setPhotoFile(null)
      setError(null)
    }
  }, [open, editingExercise])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePhotoChange(file: File) {
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  function handlePhotoClear() {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const payload: Record<string, unknown> = { ...form }
      if (!payload.description) delete payload.description
      if (!payload.muscle_group_id) delete payload.muscle_group_id
      else payload.muscle_group_id = Number(payload.muscle_group_id)
      if (!payload.category) delete payload.category
      if (!payload.equipment) delete payload.equipment
      if (!payload.instructions) delete payload.instructions
      if (!payload.video_url) delete payload.video_url

      let savedId: number

      if (isEditing && editingExercise) {
        const updated = await updateExercise(editingExercise.id, payload)
        savedId = updated.id
      } else {
        const created = await createExercise(payload)
        savedId = created.id
      }

      if (photoFile) {
        await uploadExercisePhoto(savedId, photoFile)
      }

      onSaved()
      onClose()
    } catch (err) {
      if (err instanceof ApiError) {
        const firstError = Object.values(err.payload?.errors ?? {})[0]?.[0]
        setError(firstError ?? err.message)
      } else {
        setError('Erro ao salvar exercício.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isSubmitting) {
          onClose()
        }
      }}
    >
      <DialogContent className="gap-0 p-0">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar exercício' : 'Novo exercício'}</DialogTitle>
          <DialogDescription>
            Envie a foto de capa e informe o link do vídeo. Eles aparecem no app do aluno.
          </DialogDescription>
        </DialogHeader>

        <form
          id="exercise-form-inner"
          onSubmit={(e) => void handleSubmit(e)}
          className="flex flex-col gap-4 overflow-y-auto px-5 py-4 max-h-[min(55vh,480px)]"
        >
          {error && (
            <div className="rounded-xl p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20">
              {error}
            </div>
          )}

          <ImageUploadField
            previewUrl={photoPreview}
            onChange={handlePhotoChange}
            onClear={handlePhotoClear}
          />

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Nome <span className="text-primary">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Ex: Supino reto"
              className="w-full bg-white/6 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Grupo muscular</label>
            <select
              name="muscle_group_id"
              value={form.muscle_group_id}
              onChange={handleChange}
              className={formSelectClass}
            >
              <option value="">Selecionar grupo muscular</option>
              {muscleGroups.map((mg) => (
                <option key={mg.id} value={mg.id}>
                  {mg.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={formSelectClass}
              >
                <option value="">Selecionar categoria</option>
                {EXERCISE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Equipamento</label>
              <input
                name="equipment"
                value={form.equipment}
                onChange={handleChange}
                placeholder="Barra, Haltere..."
                className="w-full bg-white/6 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Descrição</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Breve descrição do exercício"
              className="w-full bg-white/6 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Instruções de execução</label>
            <textarea
              name="instructions"
              value={form.instructions}
              onChange={handleChange}
              rows={4}
              placeholder="Descreva o passo a passo de execução do exercício..."
              className="w-full bg-white/6 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-colors resize-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5 block">
              <Link2 size={11} />
              Link do vídeo (YouTube, Vimeo...)
            </label>
            <input
              name="video_url"
              value={form.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/watch?v=..."
              type="url"
              className="w-full bg-white/6 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/60 transition-colors"
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              O vídeo é adicionado por link. Upload de arquivo de vídeo ainda não está disponível.
            </p>
            {form.video_url && getYoutubeThumbnail(form.video_url) && (
              <div className="mt-2 rounded-lg overflow-hidden h-24 relative">
                <img
                  src={getYoutubeThumbnail(form.video_url)!}
                  alt="Preview do vídeo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-subtle)]/60">
                  <div className="size-8 rounded-full bg-primary/90 flex items-center justify-center">
                    <Play size={13} fill="currentColor" className="text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        <DialogFooter>
          <button
            type="submit"
            form="exercise-form-inner"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-sm rounded-xl py-2.5 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              'Salvando...'
            ) : (
              <>
                {isEditing ? 'Salvar alterações' : 'Criar exercício'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'global' | 'mine'>('global')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null)

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    setIsLoading(true)
    try {
      setExercises(await fetchTrainerExercises())
    } catch {
      setExercises([])
    }
    try {
      setMuscleGroups(await fetchMuscleGroups())
    } catch {
      setMuscleGroups([])
    } finally {
      setIsLoading(false)
    }
  }

  function handleNew() {
    setEditingExercise(null)
    setModalOpen(true)
  }

  function handleEdit(exercise: Exercise) {
    setEditingExercise(exercise)
    setModalOpen(true)
  }

  async function handleDelete(exercise: Exercise) {
    if (!confirm(`Remover "${exercise.name}"?`)) return
    try {
      await deleteExercise(exercise.id)
      await loadData()
    } catch {
      // silent
    }
  }

  const globalExercises = exercises.filter((e) => e.is_global)
  const myExercises = exercises.filter((e) => !e.is_global)
  const displayed = activeTab === 'global' ? globalExercises : myExercises

  return (
    <>
      <div className="flex flex-col gap-6 text-foreground">
        <TrainerPageHeader
          eyebrow="Biblioteca"
          title="Exercícios"
          description="Biblioteca global e seus exercícios personalizados"
          actions={
            <TrainerButton onClick={handleNew}>
              <Plus size={15} />
              Novo Exercício
            </TrainerButton>
          }
        />

        <div className="flex gap-1 mb-5 p-1 bg-white/5 rounded-xl w-fit">
          {(['global', 'mine'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-white/12 text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'global'
                ? `Biblioteca Global (${globalExercises.length})`
                : `Meus Exercícios (${myExercises.length})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="s1 rounded-2xl p-10 text-center text-muted-foreground text-sm">
            Carregando exercícios...
          </div>
        ) : displayed.length === 0 ? (
          <div className="s1 rounded-2xl p-12 text-center flex flex-col items-center gap-3">
            <Dumbbell size={40} className="text-white/15" />
            <p className="text-muted-foreground text-sm">
              {activeTab === 'global'
                ? 'Nenhum exercício na biblioteca global.'
                : 'Você ainda não criou exercícios personalizados.'}
            </p>
            {activeTab === 'mine' && (
              <button
                onClick={handleNew}
                className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:underline"
              >
                <Plus size={14} />
                Criar primeiro exercício
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayed.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ExerciseFormModal
        open={modalOpen}
        editingExercise={editingExercise}
        muscleGroups={muscleGroups}
        onClose={() => setModalOpen(false)}
        onSaved={() => void loadData()}
      />
    </>
  )
}
