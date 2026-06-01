import { useNavigate } from 'react-router-dom'
import { EllipsisVerticalIcon, LogOutIcon } from 'lucide-react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { getInitials } from '@/lib/string/get-initials'

type NavUserProps = {
  user: {
    name: string
    email: string
    avatar?: string
  }
  onLogout: () => void | Promise<void>
}

export function NavUser({ user, onLogout }: NavUserProps) {
  const { isMobile } = useSidebar()
  const navigate = useNavigate()

  async function handleLogout() {
    await onLogout()
    navigate('/login', { replace: true })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="trainer-sidebar-user-trigger aria-expanded:bg-muted"
              />
            }
          >
            <Avatar className="trainer-sidebar-user-avatar size-8 rounded-lg">
              {user.avatar ? (
                <AvatarImage src={user.avatar} alt={user.name} />
              ) : null}
              <AvatarFallback className="trainer-sidebar-user-fallback rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="trainer-sidebar-user-copy grid flex-1 text-left text-sm leading-tight">
              <span className="trainer-sidebar-user-name truncate font-medium">{user.name}</span>
              <span className="trainer-sidebar-user-email truncate text-xs text-foreground/70">
                {user.email}
              </span>
            </div>
            <EllipsisVerticalIcon className="trainer-sidebar-user-more ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="trainer-sidebar-user-menu min-w-56"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="trainer-sidebar-user-avatar size-8 rounded-lg">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="trainer-sidebar-user-fallback rounded-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="trainer-sidebar-user-name truncate font-medium">{user.name}</span>
                    <span className="trainer-sidebar-user-email truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => void handleLogout()}>
                <LogOutIcon />
                Sair
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
