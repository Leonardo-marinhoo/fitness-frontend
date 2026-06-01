import { Link, useLocation } from 'react-router-dom'

import { IconTile } from '@/components/design-system'
import type { ShellNavGroup } from '@/components/layout/shell/types'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

type NavGroupedProps = {
  groups: ShellNavGroup[]
}

export function NavGrouped({ groups }: NavGroupedProps) {
  const { pathname } = useLocation()

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <p className="nav-group-label">{group.label}</p>
          <SidebarGroupContent className="flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = item.match ? item.match(pathname) : pathname === item.url

              return (
                <SidebarMenuItem key={item.title} className="list-none">
                  <Link
                    to={item.url}
                    data-active={isActive ? 'true' : undefined}
                    className={[
                      'trainer-sidebar-link flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-border/40 hover:text-sidebar-foreground',
                    ].join(' ')}
                  >
                    <IconTile
                      size="sm"
                      active={isActive}
                      className="trainer-sidebar-link__icon !size-8 !rounded-lg"
                    >
                      {item.icon}
                    </IconTile>
                    <span className="trainer-sidebar-link__title truncate">{item.title}</span>
                  </Link>
                </SidebarMenuItem>
              )
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}
