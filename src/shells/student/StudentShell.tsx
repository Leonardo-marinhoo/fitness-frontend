import { Link, Outlet, useLocation } from 'react-router-dom'
import { Activity, Dumbbell, Home, TrendingUp, User } from 'lucide-react'

import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: Home, label: 'Início', href: '/app' },
  { icon: Dumbbell, label: 'Treino', href: '/app/treino' },
  { icon: TrendingUp, label: 'Evolução', href: '/app/evolucao' },
  { icon: Activity, label: 'Sessões', href: '/app/sessions' },
  { icon: User, label: 'Perfil', href: '/app/perfil' },
]

export function StudentShell() {
  const { pathname } = useLocation()
  const { user } = useAuth()
  const isActiveWorkout = pathname.startsWith('/app/workout/')
  const isHome = pathname === '/app' || pathname === '/app/'
  const firstName = user?.student?.name?.split(' ')[0] ?? user?.name?.split(' ')[0] ?? 'Atleta'
  const initials = (user?.student?.name ?? user?.name ?? 'AT')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="dark shell-bg student-shell min-h-svh">
      <div className="student-shell__ambient student-shell__ambient--primary" aria-hidden />
      <div className="student-shell__ambient student-shell__ambient--secondary" aria-hidden />

      <div
        className={cn(
          'student-shell__container relative z-10 mx-auto w-full max-w-[430px] px-[10px] pt-6',
          isActiveWorkout ? 'student-shell__container--workout' : 'student-shell__container--nav',
        )}
      >
        {!isActiveWorkout && isHome ? (
          <header className="student-shell__topbar">
            <Link to="/app" className="student-shell__brand" aria-label="MB Fitness">
              <span>mb</span>
              <i className="student-shell__brand-dot" aria-hidden />
            </Link>

            <div className="student-shell__profile-pill">
              <div className="student-shell__avatar">{initials}</div>
              <div className="student-shell__profile-copy">
                <span className="student-shell__profile-label">Aluno</span>
                <strong className="student-shell__profile-name">{firstName}</strong>
              </div>
            </div>
          </header>
        ) : null}

        <div className="student-shell__page">
          <Outlet />
        </div>
      </div>

      {!isActiveWorkout ? (
        <nav className="nav-student fixed bottom-0 left-0 right-0 z-50">
          <div className="mx-auto flex w-full max-w-[430px] items-center justify-around px-2 py-2">
            {navItems.map(({ icon: Icon, label, href }) => {
              const isActive =
                pathname === href || (href !== '/app' && pathname.startsWith(href))
              return (
                <Link
                  key={href}
                  to={href}
                  className={cn(
                    'student-shell__nav-link flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 transition-all font-sans',
                    isActive ? 'text-accent-lime' : 'text-[var(--text-secondary)]',
                  )}
                >
                  <span className={cn('student-shell__nav-icon', isActive && 'student-shell__nav-icon--active')}>
                    <Icon size={20} strokeWidth={isActive ? 2.4 : 1.75} />
                  </span>
                  <span className="text-[10px] font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      ) : null}
    </div>
  )
}
