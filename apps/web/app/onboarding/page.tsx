"use client";

import OnboardingForm from "@/components/onboard/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen  py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
