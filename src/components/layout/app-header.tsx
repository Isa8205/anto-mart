import { useState, useRef, useEffect } from 'react'
import { Clock, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

interface AppHeaderProps {
  currentPageTitle: string
}

export default function AppHeader({ currentPageTitle }: AppHeaderProps) {
  const { currentUser, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Handle outside click for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isUserMenuOpen])

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase()
  }

  const getRoleBadgeColor = (role: string) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
      : 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300'
  }

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-8 shadow-sm">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-foreground">{currentPageTitle}</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4 text-primary" />
          <span>{currentTime}</span>
        </div>

        {/* User Menu */}
        {currentUser && (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-semibold text-sm shadow-sm">
                {getUserInitials(currentUser.username)}
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-semibold text-foreground capitalize">{currentUser.username}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getRoleBadgeColor(currentUser.role)}`}>
                      {currentUser.role === 'admin' ? 'Administrator' : 'Cashier'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    // Navigate to settings
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted flex items-center gap-3 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    logout()
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted flex items-center gap-3 transition-colors border-t border-border"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
