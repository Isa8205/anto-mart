import { ReactNode } from 'react'
import AppSidebar from './app-sidebar'

interface AppLayoutProps {
  currentPage: string
  onNavigate: (page: string) => void
  children: ReactNode
}

export default function AppLayout({ currentPage, onNavigate, children }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
