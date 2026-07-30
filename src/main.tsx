import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routes'
import './styles/globals.css'
import { AuthProvider } from './lib/auth-context'
import { OnboardingProvider } from './lib/onboarding-context'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  context: {
    auth: undefined!,
  },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <OnboardingProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </OnboardingProvider>
  </React.StrictMode>,
)
