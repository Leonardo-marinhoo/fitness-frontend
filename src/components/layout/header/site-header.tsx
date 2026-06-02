import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SidebarTrigger } from '@/components/ui/sidebar'

/** Barra mínima só no mobile (menu); desktop usa sidebar fixa sem header extra */
export function SiteHeader({ shell }: { shell?: 'trainer' }) {
  if (shell === 'trainer') {
    return (
      <header className="flex h-14 shrink-0 items-center border-b border-trainer-border bg-trainer-bg/95 px-4 backdrop-blur md:hidden">
        <div className="flex w-full items-center justify-between gap-3">
          <Link to="/trainer" className="flex min-w-0 items-center" aria-label="MB fitness">
            <img src="/mb-fitness-logo.png" alt="MB fitness" className="h-8 w-auto object-contain" />
          </Link>

          <SidebarTrigger
            aria-label="Abrir menu"
            className="size-10 shrink-0 rounded-xl border border-white/10 bg-white/5 text-trainer-text shadow-sm backdrop-blur transition-colors hover:bg-white/10"
          >
            <Menu size={20} />
          </SidebarTrigger>
        </div>
      </header>
    )
  }

  return (
    <header className="flex h-12 shrink-0 items-center border-b border-trainer-border bg-trainer-bg md:hidden [.dashboard-bg:not([data-shell=trainer])_&]:border-[var(--s-border)]">
      <div className="flex w-full items-center px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  )
}
