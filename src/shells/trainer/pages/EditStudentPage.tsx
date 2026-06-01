import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { fetchStudent } from '@/api/trainer'
import { StudentForm } from '@/shells/trainer/components/StudentForm'
import type { Student } from '@/types/fitness'

export function EditStudentPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const navigate = useNavigate()
  const [student, setStudent] = useState<Student | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!studentId) return
    void (async () => {
      try {
        const data = await fetchStudent(Number(studentId))
        setStudent(data)
      } catch {
        navigate('/trainer/students', { replace: true })
      } finally {
        setIsLoading(false)
      }
    })()
  }, [studentId, navigate])

  function handleSuccess(updated: Student) {
    navigate(`/trainer/students/${updated.id}`, { replace: true })
  }

  if (isLoading) {
    return (
      <div style={{ color: 'rgba(247,247,244,0.4)', padding: '60px 0', textAlign: 'center' }}>
        Carregando...
      </div>
    )
  }

  return (
    <div style={{ color: '#f7f7f4', maxWidth: 640 }}>
      {/* Back */}
      <button
        onClick={() => navigate(`/trainer/students/${studentId ?? ''}`)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          color: 'rgba(247,247,244,0.5)',
          fontSize: 14,
          cursor: 'pointer',
          padding: 0,
          marginBottom: 28,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
        }}
      >
        <ArrowLeft size={16} />
        Voltar para {student?.name ?? 'Aluno'}
      </button>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontWeight: 800,
            fontSize: 26,
            color: '#f7f7f4',
            margin: '0 0 6px',
          }}
        >
          Editar Aluno
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(247,247,244,0.45)', margin: 0 }}>
          Atualize os dados de {student?.name ?? 'aluno'}.
        </p>
      </div>

      <StudentForm student={student} onSuccess={handleSuccess} />
    </div>
  )
}
