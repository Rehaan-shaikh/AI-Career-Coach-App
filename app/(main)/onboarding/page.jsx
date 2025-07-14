import React from 'react'
import { industries } from '@/data/industries'
import { redirect } from 'next/navigation'
import OnboardingForm from './_components/onboarding-form'
import { getUserOnboardingStatus } from '@/actions/user'

const OnboardingPage = async () => {
    const {isOnboarded} =await getUserOnboardingStatus();

    if(isOnboarded){
        redirect('/dashboard');
    }
  return (
    <div>
      <OnboardingForm industries={industries} />
    </div>
  )
}

export default OnboardingPage
