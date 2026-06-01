import { Link, useLocation } from 'react-router-dom'
import { CirclePlusIcon, MailIcon } from 'lucide-react'

import { IconTile } from '@/components/design-system'
import type { ShellNavItem } from '@/components/layout/shell/types'
import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type NavMainProps = {
  items: ShellNavItem[]
  showQuickCreate?: boolean
}

export function NavMain({ items, showQuickCreate = false }: NavMainProps) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        {showQuickCreate && (
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <button
                className="flex flex-1 items-center gap-3 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <CirclePlusIcon className="size-4" />
                </span>
                Quick Create
              </button>
              <Button
                size="icon"
                className="size-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
                variant="outline"
              >
                <MailIcon className="size-4" />
                <span className="sr-only">Inbox</span>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        )}

        {items.map((item) => {
          const isActive = item.match
            ? item.match(pathname)
            : pathname === item.url

          return (
            <SidebarMenuItem key={item.title} className="list-none">
              <Link
                to={item.url}
                className={[
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-border/40 hover:text-sidebar-foreground',
                ].join(' ')}
              >
                <IconTile size="sm" active={isActive} className="!size-8 !rounded-lg">
                  {item.icon}
                </IconTile>
                <span className="truncate">{item.title}</span>
              </Link>
            </SidebarMenuItem>
          )
        })}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
