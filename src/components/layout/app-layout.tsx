import { ReactNode } from 'react'
import { useMatches } from '@tanstack/react-router'
import AppSidebar from './app-sidebar'
import AppHeader from './app-header'

interface AppLayoutProps {
  children: ReactNode
}

const pageNames: Record<string, string> = {
  '/': 'Dashboard',
  '/sales': 'Sales',
  '/inventory': 'Inventory',
  '/customers': 'Customers',
  '/suppliers': 'Suppliers',
  '/expenses': 'Expenses',
  '/ledger': 'Ledger',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function AppLayout({ children }: AppLayoutProps) {
  const matches = useMatches()
  const match = matches[matches.length - 1]
  const pageTitle = pageNames[match.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader currentPageTitle={pageTitle} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
