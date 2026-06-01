import { SidebarTrigger } from '@/components/ui/sidebar'

/** Barra mínima só no mobile (menu); desktop usa sidebar fixa sem header extra */
export function SiteHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center border-b border-trainer-border bg-trainer-bg md:hidden [.dashboard-bg:not([data-shell=trainer])_&]:border-[var(--s-border)]">
      <div className="flex w-full items-center px-4">
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  )
}
