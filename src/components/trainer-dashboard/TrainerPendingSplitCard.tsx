import { Link } from 'react-router-dom'
import { FileHeart, Users } from 'lucide-react'

import type { Student } from '@/types/fitness'

import { getInitials } from './tints'

type TrainerPendingSplitCardProps = {
  anamnesisCount: number
  newStudentsCount: number
  students: Student[]
  loading?: boolean
}

export function TrainerPendingSplitCard({
  anamnesisCount,
  newStudentsCount,
  students,
  loading = false,
}: TrainerPendingSplitCardProps) {
  const avatarStudents = students.slice(0, 4)

  return (
    <div className="td-bevel td-bevel--amber h-full">
      <div className="td-bevel__inner flex h-full min-h-[220px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="td-section-label">Atenção</p>
            <h2 className="mt-1 font-display text-lg font-bold text-zinc-50">Pendências</h2>
          </div>
          <Link
            to="/trainer/students"
            className="text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-50"
          >
            Ver todos
          </Link>
        </div>

        <div className="mt-4 grid flex-1 grid-cols-2 divide-x divide-white/[0.06] rounded-2xl border border-white/[0.06] bg-black/20">
          <div className="flex flex-col gap-1 p-4">
            <FileHeart size={16} className="text-[#a3ff12]" />
            <p className="font-display text-2xl font-bold tabular-nums text-[#a3ff12]">
              {loading ? '—' : anamnesisCount}
            </p>
            <p className="text-xs text-zinc-400">Anamneses</p>
          </div>
          <div className="flex flex-col gap-1 p-4">
            <Users size={16} className="text-[#70d7ff]" />
            <p className="font-display text-2xl font-bold tabular-nums text-[#70d7ff]">
              {loading ? '—' : newStudentsCount}
            </p>
            <p className="text-xs text-zinc-400">Novos alunos</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {avatarStudents.length > 0 ? (
            <div className="td-avatar-stack">
              {avatarStudents.map((student) => (
                <span
                  key={student.id}
                  className="inline-flex size-9 items-center justify-center rounded-full bg-[#1c1c1e] text-[10px] font-bold text-[#a3ff12]"
                >
                  {getInitials(student.name)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-500">Nenhuma pendência agora</p>
          )}
          <Link
            to="/trainer/students/new"
            className="rounded-[10px] border border-[#a3ff12]/35 bg-[#a3ff12]/10 px-3 py-1.5 text-xs font-semibold text-[#a3ff12] transition-colors hover:bg-[#a3ff12]/18"
          >
            Adicionar
          </Link>
        </div>
      </div>
    </div>
  )
}
