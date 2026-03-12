import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Settings, Shield } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { useAuth } from '@/contexts/AuthContext'

const mainNavItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/security-dashboard', label: 'Security Dashboard', icon: Shield },
] as const

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { username, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <span className="font-semibold">px2</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map(({ path, label, icon: Icon }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton
                    isActive={location.pathname === path}
                    onClick={() => navigate(path)}
                  >
                    <Icon className="size-4 shrink-0 text-sidebar-foreground" />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === '/settings'}
              onClick={() => navigate('/settings')}
            >
              <Settings className="size-4 shrink-0 text-sidebar-foreground" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator className="my-2" />
        <div className="px-2 py-2">
          <p className="text-xs text-sidebar-foreground truncate" title={username ?? ''}>
            {username ?? '—'}
          </p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex items-center gap-2 text-xs text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="size-3.5" />
            로그아웃
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
