import { useState, useRef, useEffect } from 'react'
import {
  ShoppingCart,
  Package,
  Settings,
  Truck,
  DollarSign,
  BookOpen,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/lib/auth-context'
import { PAGES } from '@/lib/permissions'

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const mainMenuItems = [
  { id: 'sales', label: 'Sales', icon: ShoppingCart, page: PAGES.SALES },
  { id: 'inventory', label: 'Inventory', icon: Package, page: PAGES.INVENTORY },
  { id: 'suppliers', label: 'Suppliers', icon: Truck, page: PAGES.SUPPLIERS },
  { id: 'expenses', label: 'Expenses', icon: DollarSign, page: PAGES.EXPENSES },
  { id: 'ledger', label: 'Ledger', icon: BookOpen, page: PAGES.LEDGER },
]

const settingsMenuItems = [
  { id: 'settings', label: 'Settings', icon: Settings, page: PAGES.SETTINGS },
]

const staffMenuItems = [
  { id: 'staff', label: 'Staff', icon: Shield, page: PAGES.ADMIN },
]

export default function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const { currentUser, canAccessPage, logout } = useAuth()

  // Handle outside click for profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileMenuOpen])

  // Filter main menu items based on user role
  const accessibleMainItems = mainMenuItems.filter((item) =>
    canAccessPage(item.page)
  )

  // Filter settings items
  const accessibleSettingsItems = settingsMenuItems.filter((item) =>
    canAccessPage(item.page)
  )

  // Only show staff menu if user is admin
  const showStaffMenu = currentUser?.role === 'admin'

  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
      : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
  }

  const renderMenuItems = (items: typeof mainMenuItems) => {
    return items.map((item) => {
      const Icon = item.icon
      const isActive = currentPage === item.id
      return (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          title={isCollapsed ? item.label : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200',
            isActive
              ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
              : 'text-sidebar-foreground hover:bg-sidebar-primary/20'
          )}
        >
          <Icon className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="truncate">{item.label}</span>}
        </button>
      )
    })
  }

  return (
    <aside className={cn(
      'bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300',
      isCollapsed ? 'w-20' : 'w-64'
    )}>
      {/* Logo/Branding with Collapse Toggle */}
      <div className={cn(
        'border-b border-sidebar-border flex items-center justify-between transition-all duration-300',
        isCollapsed ? 'px-3 py-4' : 'px-6 py-6'
      )}>
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">AntoMart</h1>
            <p className="text-xs text-sidebar-foreground/60 mt-0.5">
              {currentUser?.role === 'admin' ? 'Admin' : 'Cashier'}
            </p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-sidebar-primary/20 rounded-lg transition-colors text-sidebar-foreground"
          title={isCollapsed ? 'Expand' : 'Collapse'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {renderMenuItems(accessibleMainItems)}
      </nav>

      {/* Staff Section */}
      {showStaffMenu && (
        <nav className="p-3 space-y-2 border-t border-sidebar-border">
          {!isCollapsed && <p className="text-xs text-sidebar-foreground/50 px-3 py-2 font-semibold uppercase tracking-wider">Management</p>}
          {renderMenuItems(staffMenuItems)}
        </nav>
      )}

      {/* Settings Section */}
      <nav className="p-3 space-y-2 border-t border-sidebar-border">
        {renderMenuItems(accessibleSettingsItems)}
      </nav>

      {/* Profile Section */}
      {currentUser && (
        <div ref={profileMenuRef} className="p-3 border-t border-sidebar-border">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-primary/20 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center text-sidebar-primary-foreground font-semibold text-xs flex-shrink-0">
              {getUserInitials(currentUser.username)}
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-sidebar-foreground truncate">{currentUser.username}</p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">{currentUser.role === 'admin' ? 'Admin' : 'Cashier'}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-sidebar-foreground/50 flex-shrink-0" />
              </>
            )}
          </button>

          {isProfileMenuOpen && !isCollapsed && (
            <div className="absolute left-3 right-3 bottom-20 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-3 border-b border-border">
                <p className="text-sm font-semibold text-foreground">{currentUser.username}</p>
                <p className="text-xs text-muted-foreground mt-1">{currentUser.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRoleBadgeColor(currentUser.role)}`}>
                    {currentUser.role === 'admin' ? 'Administrator' : 'Cashier'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsProfileMenuOpen(false)
                  onNavigate('settings')
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-3 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={() => {
                  logout()
                  setIsProfileMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-3 transition-colors border-t border-border"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </aside>
  )
}
