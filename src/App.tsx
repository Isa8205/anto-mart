import { Outlet } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import AppLayout from './components/layout/app-layout'
import { useAuth } from './lib/auth-context'
import LoginScreen from './components/auth/login-screen'
import OnboardingFlow from './components/onboarding/onboarding-flow'
import { useOnboarding } from './lib/onboarding-context'

function AppContent() {
  const { isAuthenticated } = useAuth()
  const { isOnboarded } = useOnboarding()

  if (!isOnboarded) {
    return <OnboardingFlow />
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <AppContent />
      <Toaster />
    </div>
  )
}
