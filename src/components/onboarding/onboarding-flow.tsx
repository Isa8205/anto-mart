import { useState } from 'react'
import { useOnboarding } from '@/lib/onboarding-context'
import StepWelcome from './step-welcome'
import StepBusiness from './step-business'
import StepAdmin from './step-admin'
import type { BusinessInfo } from '@/lib/types'
import { toast } from 'sonner'

export default function OnboardingFlow() {
  const { completeOnboarding } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(1)
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null)

  const handleWelcomeNext = () => {
    setCurrentStep(2)
  }

  const handleBusinessNext = (info: BusinessInfo) => {
    setBusinessInfo(info)
    setCurrentStep(3)
  }

  const handleBusinessBack = () => {
    setCurrentStep(1)
  }

  const handleAdminBack = () => {
    setCurrentStep(2)
  }

  const handleAdminComplete = async (
    username: string,
    email: string,
    password: string
  ) => {
    if (!businessInfo) {
      toast.error('Business information missing')
      return
    }

    try {
      await completeOnboarding(businessInfo, username, email, password)

      toast.success('Setup completed successfully!')
      toast.info(`Welcome ${username}! Please login with your credentials.`)

      // Delay to allow user to see the message
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Trigger a page reload to reset to login screen
      window.location.reload()
    } catch (error) {
      console.error('Error completing onboarding:', error)
      toast.error('Failed to complete setup. Please try again.')
    }
  }

  return (
    <>
      {currentStep === 1 && <StepWelcome onNext={handleWelcomeNext} />}
      {currentStep === 2 && <StepBusiness onNext={handleBusinessNext} onBack={handleBusinessBack} />}
      {currentStep === 3 && businessInfo && (
        <StepAdmin businessInfo={businessInfo} onComplete={handleAdminComplete} onBack={handleAdminBack} />
      )}
    </>
  )
}
