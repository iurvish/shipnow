import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface StepData {
  [fieldName: string]: any;
}

interface OnboardingFormState {
  // Step-based data storage
  steps: {
    [stepIndex: number]: StepData;
  };
  currentStep: number;
  
  // Actions for step management
  saveStepData: (stepIndex: number, data: StepData) => void;
  getStepData: (stepIndex: number) => StepData;
  getAllFormData: () => StepData; // Flattened data from all steps
  clearAllData: () => void;
  setCurrentStep: (step: number) => void;
}

export const useOnboardingStore = create<OnboardingFormState>()(
  persist(
    (set, get) => ({
      steps: {},
      currentStep: 0,
      
      saveStepData: (stepIndex: number, data: StepData) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [stepIndex]: data,
          },
        }));
      },
      
      getStepData: (stepIndex: number) => {
        const state = get();
        return state.steps[stepIndex] || {};
      },
      
      getAllFormData: () => {
        const state = get();
        // Flatten all step data into a single object
        return Object.values(state.steps).reduce((acc, stepData) => {
          return { ...acc, ...stepData };
        }, {});
      },
      
      clearAllData: () => {
        set({ steps: {}, currentStep: 0 });
      },
      
      setCurrentStep: (step: number) => {
        set({ currentStep: step });
      },
    }),
    {
      name: 'shipnow-onboarding-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ steps: state.steps, currentStep: state.currentStep }), // only persist steps and currentStep
    }
  )
);

// Legacy form store - keep for backward compatibility but deprecate individual field methods
interface FormState {
  formData: Record<string, any>;
  setFieldValue: (fieldName: string, value: any) => void;
  getFieldValue: (fieldName: string) => any;
  clearForm: () => void;
  clearField: (fieldName: string) => void;
  updateFormData: (data: Record<string, any>) => void;
}

export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      formData: {},
      
      setFieldValue: (fieldName: string, value: any) => {
        // Deprecated - use onboarding store instead
        set((state) => ({
          formData: {
            ...state.formData,
            [fieldName]: value,
          },
        }));
      },
      
      getFieldValue: (fieldName: string) => {
        const state = get();
        return state.formData[fieldName];
      },
      
      clearForm: () => {
        set({ formData: {} });
      },
      
      clearField: (fieldName: string) => {
        set((state) => {
          const newFormData = { ...state.formData };
          delete newFormData[fieldName];
          return { formData: newFormData };
        });
      },
      
      updateFormData: (data: Record<string, any>) => {
        set((state) => ({
          formData: {
            ...state.formData,
            ...data,
          },
        }));
      },
    }),
    {
      name: 'shipnow-form-storage-legacy', // legacy storage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ formData: state.formData }),
    }
  )
);

// Helper hooks for step-based form management
export const useStepFormData = (stepIndex: number) => {
  const { getStepData, saveStepData } = useOnboardingStore();
  
  return {
    stepData: getStepData(stepIndex),
    saveStep: (data: StepData) => saveStepData(stepIndex, data),
  };
};

// Deprecated - use onboarding store instead
export const useFormField = (fieldName: string) => {
  const { formData, setFieldValue } = useFormStore();
  
  return {
    value: formData[fieldName],
    setValue: (value: any) => setFieldValue(fieldName, value),
  };
};

export const useFormFieldValue = (fieldName: string) => {
  return useFormStore((state) => state.formData[fieldName]);
};