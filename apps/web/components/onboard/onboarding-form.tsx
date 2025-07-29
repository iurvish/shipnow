"use client";

import React, { useState } from "react";
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
import { StringField } from "@/components/ui/autoform/components/StringField";
import { SelectField } from "@/components/ui/autoform/components/SelectField";
import { TextareaField } from "@/components/ui/autoform/components/TextareaField";

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
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      // Handle both date string and Date object
      if (val instanceof Date) return val;
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    })
    .superRefine(
      fieldConfig({
        label: "Date of Birth",
        inputProps: {
          type: "date",
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
    .array(z.instanceof(File))
    .optional()
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

  const handleStepSubmit = (data: any) => {
    console.log(`Step ${step + 1} data:`, data);

    // Merge current step data with existing form data
    const updatedFormData = { ...formData, ...data };
    setFormData(updatedFormData);

    // Also update the current step data immediately for the form
    Object.keys(data).forEach((key) => {
      formData[key] = data[key];
    });

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
        <div className="grid md:grid-cols-[300px_1fr] h-full w-full  rounded-lg">
          {/* Left sidebar */}
          <div className="w-full p-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
              <p className="text-sm ">
                Make your profile complete by filling out all the necessary
                information. Please verify all details before proceeding.
              </p>
            </div>

            <div className="mt-8 space-y-2">
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
          <div className=" border m-3 rounded-md">
            <div className="flex items-center justify-between border-b p-6 pb-4">
              <h2 className="text-lg font-medium">{currentStepData.name}</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm ">
                  {step + 1}/{steps.length} completed
                </span>
                <Progress
                  value={((step + 1) / steps.length) * 100}
                  className="w-[100px]"
                />
              </div>
            </div>

            <div className="w-full p-6">
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
                    key={step} // Force re-render when step changes
                    schema={currentStepData.schema}
                    defaultValues={formData} // Use defaultValues with key for re-rendering
                    formComponents={{
                      // Use built-in components and custom where needed
                      string: StringField,
                      select: SelectField,
                      textarea: TextareaField, // Register for fieldType: "textarea"
                      input: CustomInput, // Register for fieldType: "input" (with icon support)
                      number: CustomInput, // Use custom input for numbers (with beforeInput/afterInput support)
                      multiselect: CustomMultiSelect, // Register for fieldType: "multiselect"
                    }}
                    formProps={{
                      className:
                        step === 0
                          ? "grid grid-cols-2 gap-6"
                          : step === 1
                            ? "space-y-6 technical-profile-form" // Use space-y for technical profile
                            : "grid gap-6",
                      style:
                        step === 1
                          ? ({
                              "--url-fields-layout": "grid",
                              "--url-fields-columns": "1fr 1fr",
                              "--url-fields-gap": "1rem",
                            } as React.CSSProperties)
                          : undefined,
                    }}
                    onSubmit={handleStepSubmit}
                    withSubmit={false} // We'll handle submission with custom buttons
                  >
                    {step === 1 && (
                      <style jsx>{`
                        .technical-profile-form {
                          position: relative;
                        }
                        .technical-profile-form > div:nth-last-child(3),
                        .technical-profile-form > div:nth-last-child(2) {
                          display: inline-block;
                          width: calc(50% - 0.5rem);
                          vertical-align: top;
                        }
                        .technical-profile-form > div:nth-last-child(3) {
                          margin-right: 1rem;
                        }
                      `}</style>
                    )}
                    <div className="flex gap-2 pt-4 col-span-full">
                      {step > 0 && (
                        <Button type="button" onClick={prev} variant="outline">
                          <ChevronLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                      )}
                      {step < steps.length - 1 && (
                        <Button
                          type="button"
                          onClick={next}
                          className="ml-auto"
                        >
                          Next Step
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {step === steps.length - 1 && (
                        <Button type="submit" className="ml-auto">
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
