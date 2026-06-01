import { Activity, ClipboardList, Dumbbell, LayoutDashboard, Users } from 'lucide-react'

const iconClass = 'size-4'

import type { ShellSidebarConfig } from '@/components/layout/shell/types'

const dashboardItem = {
  title: 'Dashboard',
  url: '/trainer',
  icon: <LayoutDashboard className={iconClass} />,
  match: (path: string) => path === '/trainer',
}

export const trainerSidebarConfig: ShellSidebarConfig = {
  brand: {
    title: 'FitnessCode',
    subtitle: 'Personal Trainer',
    url: '/trainer',
    icon: <Dumbbell className="size-5!" />,
  },
  navMain: [dashboardItem],
  navGroups: [
    {
      label: 'Gestão',
      items: [
        dashboardItem,
        {
          title: 'Alunos',
          url: '/trainer/students',
          icon: <Users className={iconClass} />,
          match: (path) => path.startsWith('/trainer/students'),
        },
        {
          title: 'Sessões',
          url: '/trainer/sessions',
          icon: <Activity className={iconClass} />,
          match: (path) => path.startsWith('/trainer/sessions'),
        },
      ],
    },
    {
      label: 'Conteúdo',
      items: [
        {
          title: 'Fichas de Treino',
          url: '/trainer/training-sheets',
          icon: <ClipboardList className={iconClass} />,
          match: (path) => path.startsWith('/trainer/training-sheets'),
        },
        {
          title: 'Exercícios',
          url: '/trainer/exercises',
          icon: <Dumbbell className={iconClass} />,
          match: (path) => path.startsWith('/trainer/exercises'),
        },
      ],
    },
  ],
  promo: {
    title: 'Novo aluno na turma',
    description: 'Cadastre e envie a anamnese em poucos cliques.',
    ctaLabel: 'Cadastrar aluno',
    ctaUrl: '/trainer/students/new',
  },
}

export function getTrainerPageTitle(pathname: string): string {
  if (pathname === '/trainer') return 'Dashboard'
  if (pathname.startsWith('/trainer/students')) return 'Alunos'
  if (pathname.startsWith('/trainer/training-sheets')) return 'Fichas de Treino'
  if (pathname.startsWith('/trainer/exercises')) return 'Exercícios'
  if (pathname.startsWith('/trainer/sessions')) return 'Sessões'
  return 'Trainer'
}
