import React, { createContext, useContext, useState } from 'react'
import type { BusinessInfo, OnboardingState } from './types'
import { OnboardingRequest } from '@/bindings/OnboardingRequest'
import { invoke } from "@tauri-apps/api/core"
import { Response } from '@/bindings/Response'

interface OnboardingContextType {
  isOnboarded: boolean
  businessInfo: BusinessInfo | null
  completeOnboarding: (onboardinData: OnboardingRequest) => Promise<void>
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

  const completeOnboarding = async (onboardinData: OnboardingRequest) => {
    const res = await invoke("complete_onboarding", { data: onboardinData });
    console.log(res);
    // setIsOnboarded(true)
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
