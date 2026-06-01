import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

import { StudentForm } from '@/shells/trainer/components/StudentForm'
import type { Student } from '@/types/fitness'

export function CreateStudentPage() {
  const navigate = useNavigate()

  function handleSuccess(student: Student) {
    navigate(`/trainer/students/${student.id}`, { replace: true })
  }

  return (
    <div style={{ color: '#f7f7f4', maxWidth: 640 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/trainer/students')}
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
        Voltar para Alunos
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
          Novo Aluno
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(247,247,244,0.45)', margin: 0 }}>
          Preencha os dados de acesso e as informações iniciais do aluno.
        </p>
      </div>

      <StudentForm onSuccess={handleSuccess} />
    </div>
  )
}
