import { useState, useRef, useEffect } from 'react'
import { Clock, LogOut, Settings, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AppHeaderProps {
  currentPageTitle: string
}

export default function AppHeader({ currentPageTitle }: AppHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
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

  return (
    <header className="bg-card border-b border-border h-16 flex items-center justify-between px-8">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-foreground">{currentPageTitle}</h2>
      </div>

      <div className="flex items-center gap-4">
        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground border-l border-border pl-4">
          <Clock className="w-4 h-4" />
          <span>{currentTime}</span>
        </div>

        {/* User Menu */}
        {isLoggedIn ? (
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
                JD
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-border">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    // Navigate to settings
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    setIsLoggedIn(false)
                    setIsUserMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted flex items-center gap-2 transition-colors border-t border-border"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLoggedIn(true)}
            >
              Login
            </Button>
            <Button
              variant="ghost"
              size="sm"
            >
              Settings
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
