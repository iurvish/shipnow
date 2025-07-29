"use client";

import OnboardingForm from "@/components/onboard/onboarding-form";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Shipyard
            </h1>
            <p className="text-xl text-gray-600">
              Let's get your profile set up in just a few steps
            </p>
          </div>
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
