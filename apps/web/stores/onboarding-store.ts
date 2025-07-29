"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface OnboardingData {
  // Step 1: Personal Details
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  university?: string;
  department?: string;
  degree_level?: string;

  // Step 2: Technical Profile
  skills?: string[];
  experience?: string;
  github?: string;
  portfolio?: string;

  // Step 3: Setup Profile
  username?: string;
  bio?: string;
  profilePhoto?: File[];
}

interface OnboardingStore {
  // Data
  formData: OnboardingData;
  currentStep: number;

  // Actions
  updateFormData: (stepData: Partial<OnboardingData>) => void;
  setCurrentStep: (step: number) => void;
  resetForm: () => void;
  getStepData: (stepFields: string[]) => Partial<OnboardingData>;
}

const initialFormData: OnboardingData = {};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      currentStep: 0,

      updateFormData: (stepData: Partial<OnboardingData>) => {
        set((state) => ({
          formData: { ...state.formData, ...stepData },
        }));
      },

      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },

      resetForm: () => {
        set({
          formData: initialFormData,
          currentStep: 0,
        });
      },

      getStepData: (stepFields: string[]) => {
        const { formData } = get();
        const stepData: any = {};

        stepFields.forEach((field) => {
          if (formData[field as keyof OnboardingData] !== undefined) {
            stepData[field] = formData[field as keyof OnboardingData];
          }
        });

        return stepData;
      },
    }),
    {
      name: "onboarding-form-storage", // unique name for localStorage
      storage: createJSONStorage(() => sessionStorage), // use sessionStorage for better UX
      partialize: (state) => ({
        formData: state.formData,
        currentStep: state.currentStep,
      }),
    }
  )
);
