import React, { createContext, useContext, useState } from 'react'
import type { BusinessInfo, OnboardingState } from './types'

interface OnboardingContextType {
  isOnboarded: boolean
  businessInfo: BusinessInfo | null
  completeOnboarding: (businessInfo: BusinessInfo, adminUsername: string, adminEmail: string, adminPassword: string) => Promise<void>
  getOnboardingState: () => OnboardingState
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    const stored = localStorage.getItem('onboarded')
    return stored === 'true'
  })

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(() => {
    const stored = localStorage.getItem('businessInfo')
    return stored ? JSON.parse(stored) : null
  })

  const completeOnboarding = async (
    businessInfo: BusinessInfo,
    adminUsername: string,
    adminEmail: string,
    adminPassword: string
  ) => {
    // Store business info
    localStorage.setItem('businessInfo', JSON.stringify(businessInfo))
    setBusinessInfo(businessInfo)

    // Create initial admin user
    const adminUser = {
      id: 'user-1',
      username: adminUsername,
      email: adminEmail,
      password: adminPassword,
      role: 'admin' as const,
      createdDate: new Date().toISOString().split('T')[0],
      isActive: true,
      lastLogin: null,
    }

    // Store admin user in localStorage
    const users = [adminUser]
    localStorage.setItem('users', JSON.stringify(users))

    // Mark as onboarded
    localStorage.setItem('onboarded', 'true')
    setIsOnboarded(true)
  }

  const getOnboardingState = (): OnboardingState => ({
    isOnboarded,
    businessInfo: businessInfo || undefined,
    adminCreated: isOnboarded,
  })

  return (
    <OnboardingContext.Provider
      value={{
        isOnboarded,
        businessInfo,
        completeOnboarding,
        getOnboardingState,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error('useOnboarding must be used within OnboardingProvider')
  }
  return context
}
