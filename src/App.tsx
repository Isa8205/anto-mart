import { Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import AppLayout from './components/layout/app-layout'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <AppLayout>
        <Outlet />
      </AppLayout>
      <Toaster />
    </div>
  )
}
