import { useState } from 'react'
import { useOnboarding } from '@/lib/onboarding-context'
import StepWelcome from './step-welcome'
import StepBusiness from './step-business'
import StepAdmin from './step-admin'
import { BusinessInfoRequest } from '@/bindings/BusinessInfoRequest'
import { OnboardingRequest } from '@/bindings/OnboardingRequest'
import { UserInfoRequest } from '@/bindings/UserInfoRequest'

export default function OnboardingFlow() {
  const { completeOnboarding } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(1)
  const [onboardingRequest, setOnboardingRequest] = useState<OnboardingRequest>({
    business: {
      name: "",
      email: "",
      phone: "",
      county: "",
    },
    admin: {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      phone: "",
      password: "",
    }
  });

  const handleWelcomeNext = () => {
    setCurrentStep(2)
  }

  const handleBusinessNext = (businessInfo: BusinessInfoRequest) => {
    setOnboardingRequest({...onboardingRequest, business: businessInfo});
    setCurrentStep(3);
  }

  const handleBusinessBack = () => {
    setCurrentStep(1)
  }

  const handleAdminBack = () => {
    setCurrentStep(2)
  }

  const handleAdminComplete = (adminData: UserInfoRequest) => {
    setOnboardingRequest({...onboardingRequest, admin: adminData});

    completeOnboarding(onboardingRequest);
  }

  return (
    <>
      {currentStep === 1 && <StepWelcome onNext={handleWelcomeNext} />}
      {currentStep === 2 && <StepBusiness onNext={handleBusinessNext} onBack={handleBusinessBack} />}
      {currentStep === 3 && (
        <StepAdmin businessInfo={onboardingRequest.business} onComplete={handleAdminComplete} onBack={handleAdminBack} />
      )}
    </>
  )
}
