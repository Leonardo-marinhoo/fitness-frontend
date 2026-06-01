import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import {
  activateTrainingSheet,
  createTrainingDay,
  createTrainingExercise,
  deleteTrainingDay,
  deleteTrainingExercise,
  fetchStudent,
  fetchStudentAssessments,
  fetchTrainerExercises,
  fetchTrainingSheet,
  updateTrainingDay,
  updateTrainingExercise,
  updateTrainingSheet,
} from '@/api/trainer'
import {
  AddDivisionDialog,
  type DivisionFormPayload,
} from '@/shells/trainer/components/training-sheet/AddDivisionDialog'
import { AddExerciseDialog } from '@/shells/trainer/components/training-sheet/AddExerciseDialog'
import { builderPage } from '@/shells/trainer/components/training-sheet/builder/styles'
import { computeDayStats } from '@/shells/trainer/components/training-sheet/builder/compute-sheet-stats'
import { ExerciseSection } from '@/shells/trainer/components/training-sheet/builder/ExerciseSection'
import { StudentSummaryCard } from '@/shells/trainer/components/training-sheet/builder/StudentSummaryCard'
import { WorkoutSheetPageHeader } from '@/shells/trainer/components/training-sheet/builder/WorkoutSheetPageHeader'
import { WorkoutSplitTabs } from '@/shells/trainer/components/training-sheet/builder/WorkoutSplitTabs'
import { WorkoutSummaryPanel } from '@/shells/trainer/components/training-sheet/builder/WorkoutSummaryPanel'
import type {
  PhysicalAssessment,
  Student,
  TrainingDay,
  TrainingExercise,
  TrainingSheet,
} from '@/types/fitness'

export function TrainingSheetBuilderPage() {
  const { sheetId } = useParams<{ sheetId: string }>()
  const [sheet, setSheet] = useState<TrainingSheet | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [assessments, setAssessments] = useState<PhysicalAssessment[]>([])
  const [libraryExercises, setLibraryExercises] = useState<Awaited<ReturnType<typeof fetchTrainerExercises>>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDayId, setSelectedDayId] = useState<number | null>(null)
  const [sheetName, setSheetName] = useState('')
  const [activating, setActivating] = useState(false)

  const [divisionDialogOpen, setDivisionDialogOpen] = useState(false)
  const [editingDivision, setEditingDivision] = useState<TrainingDay | null>(null)
  const [exerciseDialogOpen, setExerciseDialogOpen] = useState(false)
  const [editingExercise, setEditingExercise] = useState<TrainingExercise | null>(null)

  const loadSheet = useCallback(async () => {
    if (!sheetId) return
    const data = await fetchTrainingSheet(Number(sheetId))
    setSheet(data)
    setSheetName(data.name)
    try {
      const studentData = await fetchStudent(data.student_id)
      setStudent(studentData)
      const assess = await fetchStudentAssessments(data.student_id)
      setAssessments(assess)
    } catch {
      setStudent(null)
      setAssessments([])
    }
    const days = data.training_days ?? []
    setSelectedDayId((prev) => {
      if (prev && days.some((d) => d.id === prev)) return prev
      return days[0]?.id ?? null
    })
  }, [sheetId])

  useEffect(() => {
    if (!sheetId) return
    void (async () => {
      try {
        setIsLoading(true)
        const [, ex] = await Promise.all([loadSheet(), fetchTrainerExercises()])
        setLibraryExercises(ex)
      } catch {
        setSheet(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [sheetId, loadSheet])

  const days = useMemo(
    () => [...(sheet?.training_days ?? [])].sort((a, b) => a.order - b.order),
    [sheet],
  )

  const selectedDay = useMemo(
    () => days.find((d) => d.id === selectedDayId) ?? null,
    [days, selectedDayId],
  )

  const dayExercises = useMemo(
    () =>
      [...(selectedDay?.training_exercises ?? [])].sort((a, b) => a.order - b.order),
    [selectedDay],
  )

  const dayStats = useMemo(() => computeDayStats(dayExercises), [dayExercises])

  async function handleMetadataSave(fields: Record<string, unknown>) {
    if (!sheetId) return
    await updateTrainingSheet(Number(sheetId), fields)
    await loadSheet()
  }

  async function handleActivate() {
    if (!sheetId) return
    if (!confirm('Ativar esta ficha? A ficha ativa atual do aluno será substituída.')) return
    setActivating(true)
    try {
      await activateTrainingSheet(Number(sheetId))
      await loadSheet()
    } finally {
      setActivating(false)
    }
  }

  function openAddDivisionDialog() {
    setEditingDivision(null)
    setDivisionDialogOpen(true)
  }

  function openEditDivisionDialog(day: TrainingDay) {
    setEditingDivision(day)
    setDivisionDialogOpen(true)
  }

  function handleDivisionDialogOpenChange(open: boolean) {
    setDivisionDialogOpen(open)
    if (!open) {
      setEditingDivision(null)
    }
  }

  async function handleDivisionSubmit(payload: DivisionFormPayload) {
    if (editingDivision) {
      await updateTrainingDay(editingDivision.id, payload)
    } else if (sheetId) {
      await createTrainingDay(Number(sheetId), {
        ...payload,
        order: days.length + 1,
      })
    }
    await loadSheet()
  }

  async function handleDeleteDivision(dayId: number) {
    if (!confirm('Remover esta divisão e todos os exercícios?')) return
    await deleteTrainingDay(dayId)
    if (selectedDayId === dayId) setSelectedDayId(null)
    await loadSheet()
  }

  async function handleExerciseSubmit(payload: Record<string, unknown>) {
    if (editingExercise) {
      await updateTrainingExercise(editingExercise.id, payload)
    } else if (selectedDayId) {
      await createTrainingExercise(selectedDayId, payload)
    }
    await loadSheet()
    setEditingExercise(null)
  }

  async function handleDeleteExercise(exerciseId: number) {
    await deleteTrainingExercise(exerciseId)
    await loadSheet()
  }

  if (isLoading) {
    return (
      <div className={`${builderPage} flex items-center justify-center py-24`}>
        <p className="text-sm text-zinc-500">Carregando ficha de treino…</p>
      </div>
    )
  }

  if (!sheet) {
    return (
      <div className={`${builderPage} flex items-center justify-center py-24`}>
        <p className="text-sm text-zinc-500">Ficha não encontrada.</p>
      </div>
    )
  }

  return (
    <div className={`${builderPage} workout-builder-root flex flex-col gap-5`}>
      <WorkoutSheetPageHeader
        sheet={sheet}
        sheetName={sheetName}
        onActivate={() => void handleActivate()}
        activating={activating}
        studentId={sheet.student_id}
        onDeleteDivision={
          selectedDayId != null
            ? () => void handleDeleteDivision(selectedDayId)
            : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-7">
        <div className="min-w-0 space-y-5">
          {student && <StudentSummaryCard student={student} />}

          {days.length > 0 ? (
            <>
              <div className="overflow-visible">
                <WorkoutSplitTabs
                  days={days}
                  selectedDayId={selectedDayId}
                  onSelect={setSelectedDayId}
                  onAdd={openAddDivisionDialog}
                  onEdit={openEditDivisionDialog}
                />
              </div>

              {selectedDay ? (
                <ExerciseSection
                  day={selectedDay}
                  exercises={dayExercises}
                  onAddExercise={() => {
                    setEditingExercise(null)
                    setExerciseDialogOpen(true)
                  }}
                  onEditExercise={(id) => {
                    const te = dayExercises.find((e) => e.id === id) ?? null
                    setEditingExercise(te)
                    setExerciseDialogOpen(true)
                  }}
                  onDeleteExercise={(id) => void handleDeleteExercise(id)}
                />
              ) : (
                <p className="py-12 text-center text-sm text-zinc-500">
                  Selecione uma divisão nas abas acima.
                </p>
              )}
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-white/10 py-16 text-center">
              <p className="text-sm text-zinc-500">Nenhuma divisão na ficha.</p>
              <button
                type="button"
                onClick={openAddDivisionDialog}
                className="mt-4 rounded-xl border border-white/10 px-5 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/5"
              >
                Adicionar primeira divisão
              </button>
            </div>
          )}
        </div>

        <WorkoutSummaryPanel
          sheet={sheet}
          dayStats={dayStats}
          exercises={dayExercises}
          assessments={assessments}
          studentWeight={student?.weight ?? null}
          onSaveNotes={(notes) => void handleMetadataSave({ general_notes: notes || undefined })}
        />
      </div>

      <AddDivisionDialog
        open={divisionDialogOpen}
        onOpenChange={handleDivisionDialogOpenChange}
        editing={editingDivision}
        onSubmit={handleDivisionSubmit}
      />

      <AddExerciseDialog
        open={exerciseDialogOpen}
        onOpenChange={setExerciseDialogOpen}
        exercises={libraryExercises}
        editing={editingExercise}
        onSubmit={handleExerciseSubmit}
      />
    </div>
  )
}
