"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { z } from "zod";
import { ZodProvider, fieldConfig } from "@autoform/zod";
import { AutoForm } from "@/components/ui/autoform";
import { SuccessAnimation } from "../shared/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Settings,
  AtSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/shared/StepIndicator";
import CustomInput from "@/components/ui/autoform/custom/input";
import CustomMultiSelect from "@/components/ui/autoform/custom/multiselect";
import CustomDatePicker from "@/components/ui/autoform/custom/date-picker";
import { StringField } from "@/components/ui/autoform/components/StringField";
import { SelectField } from "@/components/ui/autoform/components/SelectField";

// Step 1: Personal Details
const personalDetailsSchema = z.object({
  first_name: z
    .string()
    .min(2)
    .superRefine(
      fieldConfig({
        label: "First Name",
        inputProps: {
          placeholder: "Enter your first name",
        },
      })
    ),
  last_name: z
    .string()
    .min(2)
    .superRefine(
      fieldConfig({
        label: "Last Name",
        inputProps: {
          placeholder: "Enter your last name",
        },
      })
    ),
  date_of_birth: z
    .string()
    .optional()
    .superRefine(
      fieldConfig({
        label: "Date of Birth",
        fieldType: "date", // Use custom date picker
        inputProps: {
          placeholder: "Select your birth date",
        },
      })
    ),

  university: z
    .string()
    .min(2)
    .superRefine(
      fieldConfig({
        label: "University",
        inputProps: {
          placeholder: "Enter your university name",
        },
      })
    ),
  department: z
    .string()
    .min(2)
    .superRefine(
      fieldConfig({
        label: "Department",
        inputProps: {
          placeholder: "e.g., Computer Science, Engineering",
        },
      })
    ),
  degree_level: z
    .enum([
      "associate",
      "bachelor",
      "master",
      "doctorate",
      "bootcamp",
      "self_taught",
    ])
    .superRefine(
      fieldConfig({
        label: "Degree Level",
        inputProps: {
          placeholder: "Select your degree level",
        },
      })
    ),
});

// Step 2: Technical Profile Schema
const technicalProfileSchema = z.object({
  skills: z
    .array(z.string())
    .min(1, "Select at least one skill")
    .superRefine(
      fieldConfig({
        label: "Technical Skills",
        fieldType: "multiselect", // Add fieldType to specify component
        inputProps: {
          placeholder: "Select skills...",
          className: "w-full",
          options: [
            { value: "react", label: "React" },
            { value: "typescript", label: "TypeScript" },
            { value: "node", label: "Node.js" },
            { value: "graphql", label: "GraphQL" },
            { value: "next", label: "Next.js" },
            { value: "vue", label: "Vue" },
            { value: "svelte", label: "Svelte" },
            { value: "angular", label: "Angular" },
            { value: "tailwind", label: "Tailwind CSS" },
            { value: "bootstrap", label: "Bootstrap" },
            { value: "chakra", label: "Chakra UI" },
            { value: "material", label: "Material UI" },
            { value: "ant", label: "Ant Design" },
          ],
        },
      })
    ),
  experience: z.enum(["Beginner", "Intermediate", "Advanced"]).superRefine(
    fieldConfig({
      label: "Experience Level",
      inputProps: {
        placeholder: "Select your experience level",
      },
    })
  ),
  github: z
    .string()
    .url()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      // Add https:// if not present
      if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
        return `https://${val}`;
      }
      return val;
    })
    .superRefine(
      fieldConfig({
        label: "Github/Twitter Profile",
        fieldType: "input", // Use custom input for beforeInput support
        inputProps: {
          placeholder: "github.com/username",
          beforeInput: <span className="text-muted-foreground">https://</span>,
          className: "github-field col-span-1",
        },
      })
    ),
  portfolio: z
    .string()
    .url()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return undefined;
      // Add https:// if not present
      if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
        return `https://${val}`;
      }
      return val;
    })
    .superRefine(
      fieldConfig({
        label: "Portfolio Link",
        fieldType: "input", // Use custom input for beforeInput support
        inputProps: {
          placeholder: "portfolio.com",
          beforeInput: <span className="text-muted-foreground">https://</span>,
          className: "portfolio-field col-span-1",
        },
      })
    ),
});

// Step 3: Setup Profile Schema
const setupProfileSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .superRefine(
      fieldConfig({
        label: "Username",
        fieldType: "input", // Use custom input for icon support
        inputProps: {
          placeholder: "username",
          beforeInput: <AtSign className="h-4 w-4" />,
        },
      })
    ),
  bio: z
    .string()
    .min(10, { message: "Minimum 10 characters" })
    .max(200, { message: "Maximum 200 characters" })
    .optional()
    .superRefine(
      fieldConfig({
        label: "Bio (Optional)",
        fieldType: "textarea", // Add fieldType to specify textarea component
        inputProps: {
          placeholder: "Tell us about yourself...",
          rows: 1,
          cols: 10,
          className: "col-span-full",
        },
      })
    ),
  profilePhoto: z
    .any()
    .optional()
    .transform((val) => {
      // Handle file input: if no file selected, return empty array
      if (!val || val === null || val === undefined) {
        return [];
      }
      // If it's already an array, return as is
      if (Array.isArray(val)) {
        return val;
      }
      // If it's a FileList or single file, convert to array
      if (val instanceof FileList) {
        return Array.from(val);
      }
      if (val instanceof File) {
        return [val];
      }
      // Default to empty array for any other case
      return [];
    })
    .pipe(z.array(z.instanceof(File)))
    .superRefine(
      fieldConfig({
        label: "Profile Photo",
        fieldType: "input", // Use custom input for file upload
        inputProps: {
          type: "file",
          placeholder: "Upload your Profile Photo",
        },
      })
    ),
});

const steps = [
  {
    id: "step-1",
    name: "Personal Details",
    title: "Personal Details",
    icon: User,
    schema: new ZodProvider(personalDetailsSchema),
    fields: [
      "first_name",
      "last_name",
      "date_of_birth",
      "university",
      "department",
      "degree_level",
    ],
  },
  {
    id: "step-2",
    name: "Technical Profile",
    title: "Technical Profile",
    icon: GraduationCap,
    schema: new ZodProvider(technicalProfileSchema),
    fields: ["skills", "experience", "github", "portfolio"],
  },
  {
    id: "step-3",
    name: "Setup Profile",
    title: "Setup Profile",
    icon: Settings,
    schema: new ZodProvider(setupProfileSchema),
    fields: ["username", "bio", "profilePhoto"],
  },
];

const OnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < step) return "done";
    if (stepIndex === step) return "ongoing";
    return "pending";
  };

  // Get current step's data from formData for defaultValues
  const getCurrentStepData = () => {
    const currentStepData = steps[step];
    if (!currentStepData) return {};

    const currentFields = currentStepData.fields;
    const stepData: Record<string, any> = {};

    currentFields.forEach((field) => {
      if (formData[field] !== undefined) {
        let value = formData[field];

        // Handle type conversions for specific fields
        if (field === "date_of_birth" && typeof value === "string") {
          // Keep as string since the date picker expects ISO string
          stepData[field] = value;
        } else if (field === "skills" && Array.isArray(value)) {
          // Ensure skills array is properly formatted
          stepData[field] = value;
        } else {
          stepData[field] = value;
        }
      }
    });

    console.log(`Step ${step + 1} current data:`, stepData);
    return stepData;
  };

  // Sanitize form data before passing to DOM
  const sanitizeFormData = (data: Record<string, any>) => {
    const sanitized: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      // Only include safe, expected fields
      if (
        typeof value === "string" ||
        typeof value === "number" ||
        Array.isArray(value)
      ) {
        sanitized[key] = value;
      }
    });
    return sanitized;
  };

  // Get current step form data
  const currentStepFormData = useMemo(() => {
    return getCurrentStepData();
  }, [step, formData]);

  // Get a stable key for the form that forces re-render when data changes
  const formKey = useMemo(() => {
    const dataString = JSON.stringify(currentStepFormData);
    return `form-step-${step}-${dataString}`;
  }, [step, currentStepFormData]);

  const handleStepSubmit = (data: any) => {
    console.log(`Step ${step + 1} data:`, data);

    // Merge current step data with existing form data
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    console.log("Updated form data:", updatedFormData);

    if (step < steps.length - 1) {
      setPreviousStep(step);
      setStep(step + 1);
    } else {
      // Final submission
      console.log("Complete form data:", updatedFormData);
      handleFinalSubmit(updatedFormData);
    }
  };

  const handleFinalSubmit = async (completeData: any) => {
    try {
      console.log("Submitting complete onboarding data:", completeData);
      // Here you would make your API call to save the data
      // await submitOnboardingData(completeData);

      setShowSuccess(true);
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
    }
  };

  const next = async () => {
    // Trigger form submission for current step
    const currentForm = document.querySelector("form");
    if (currentForm) {
      currentForm.requestSubmit();
    }
  };

  const prev = () => {
    if (step > 0) {
      setPreviousStep(step);
      setStep(step - 1);
    }
  };

  const currentStepData = steps[step];

  if (!currentStepData) {
    return null; // Handle edge case
  }

  if (showSuccess) {
    return (
      <div className="mx-auto flex items-center min-h-screen justify-center w-full px-4 md:px-8">
        <div className="rounded-lg flex items-center justify-center w-full">
          <SuccessAnimation />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center max-w-6xl px-4 md:px-8">
      <div className="rounded-lg w-full border h-full shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] h-full w-full rounded-lg">
          {/* Left sidebar */}
          <div className="w-full p-4 md:p-6 border-b lg:border-b-0 lg:border-r">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-semibold">
                Complete Your Profile
              </h1>
              <p className="text-sm">
                Make your profile complete by filling out all the necessary
                information. Please verify all details before proceeding.
              </p>
            </div>

            <div className="mt-6 md:mt-8 space-y-2">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md p-3 transition-colors",
                    step === i && "bg-secondary"
                  )}
                >
                  <StepIndicator status={getStepStatus(i)} />
                  <div className="text-sm font-medium">
                    <p className="align-middle">{s.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="border-0 lg:border lg:m-3 lg:rounded-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b p-4 md:p-6 pb-4 gap-4">
              <h2 className="text-lg font-medium">{currentStepData.name}</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  {step + 1}/{steps.length} completed
                </span>
                <Progress
                  value={((step + 1) / steps.length) * 100}
                  className="w-[100px]"
                />
              </div>
            </div>

            <div className="w-full p-4 md:p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6 pt-6"
                >
                  <AutoForm
                    key={formKey} // Force complete re-render when step or data changes
                    schema={currentStepData.schema}
                    defaultValues={currentStepFormData} // Get data for current step
                    formComponents={{
                      // Use built-in components and custom where needed
                      string: StringField,
                      select: SelectField,
                      textarea: StringField, // Use StringField for textareas
                      input: CustomInput, // Register for fieldType: "input" (with icon support)
                      number: CustomInput, // Use custom input for numbers (with beforeInput/afterInput support)
                      multiselect: CustomMultiSelect, // Register for fieldType: "multiselect"
                      date: CustomDatePicker, // Register for fieldType: "date"
                    }}
                    formProps={{
                      className:
                        step === 0
                          ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                          : step === 1
                            ? "space-y-6 technical-profile-form" // Use space-y for technical profile
                            : "grid grid-cols-1 gap-6",
                      style:
                        step === 1
                          ? ({
                              "--url-fields-layout": "grid",
                              "--url-fields-columns": "1fr 1fr",
                              "--url-fields-gap": "1rem",
                            } as React.CSSProperties)
                          : undefined,
                      // Pass sanitized form data through data attributes
                      "data-form-values": JSON.stringify(
                        sanitizeFormData(currentStepFormData)
                      ),
                    }}
                    onSubmit={handleStepSubmit}
                    withSubmit={false} // We'll handle submission with custom buttons
                  >
                    {step === 1 && (
                      <style jsx>{`
                        .technical-profile-form {
                          position: relative;
                        }

                        /* Desktop layout for URL fields */
                        @media (min-width: 768px) {
                          .technical-profile-form > div:nth-last-child(3),
                          .technical-profile-form > div:nth-last-child(2) {
                            display: inline-block;
                            width: calc(50% - 0.5rem);
                            vertical-align: top;
                          }
                          .technical-profile-form > div:nth-last-child(3) {
                            margin-right: 1rem;
                          }
                        }

                        /* Mobile layout - full width */
                        @media (max-width: 767px) {
                          .technical-profile-form > div {
                            width: 100% !important;
                            margin-right: 0 !important;
                            display: block !important;
                          }
                        }
                      `}</style>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2 pt-4 col-span-full">
                      {step > 0 && (
                        <Button
                          type="button"
                          onClick={prev}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      )}
                      {step < steps.length - 1 && (
                        <Button
                          type="button"
                          onClick={next}
                          className="ml-auto w-full sm:w-auto"
                        >
                          Next Step
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {step === steps.length - 1 && (
                        <Button
                          type="submit"
                          className="ml-auto w-full sm:w-auto"
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </AutoForm>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
