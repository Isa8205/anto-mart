import {
  BarChart3,
  ShoppingCart,
  Package,
  Settings,
  Truck,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const mainMenuItems = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/inventory', label: 'Inventory', icon: Package },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
]

const settingsMenuItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function AppSidebar() {
  const activeLinkStyle = 'bg-sidebar-primary text-sidebar-primary-foreground'
  const inactiveLinkStyle = 'text-sidebar-foreground hover:bg-primary/20'

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col">
      {/* Logo/Branding */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">AntoMart</h1>
        <p className="text-xs text-sidebar-foreground/60 mt-1">Retail Manager</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {mainMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors')}
              activeProps={{ className: activeLinkStyle }}
              inactiveProps={{ className: inactiveLinkStyle }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Settings Section */}
      <nav className="p-4 space-y-2 border-t border-sidebar-border">
        {settingsMenuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn('w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors')}
              activeProps={{ className: activeLinkStyle }}
              inactiveProps={{ className: inactiveLinkStyle }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
