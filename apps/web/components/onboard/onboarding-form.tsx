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
import SelectCommand from "@/components/ui/autoform/custom/select-command";
import ProfilePhotoField from "@/components/ui/autoform/custom/profile-photo";
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
        fieldType: "select-command", // Use SelectCommand instead of input
        inputProps: {
          placeholder: "Search and select your university",
          options: [
            { value: "harvard", label: "Harvard University" },
            { value: "mit", label: "Massachusetts Institute of Technology" },
            { value: "stanford", label: "Stanford University" },
            { value: "berkeley", label: "University of California, Berkeley" },
            { value: "caltech", label: "California Institute of Technology" },
            { value: "princeton", label: "Princeton University" },
            { value: "yale", label: "Yale University" },
            { value: "columbia", label: "Columbia University" },
            { value: "chicago", label: "University of Chicago" },
            { value: "upenn", label: "University of Pennsylvania" },
            { value: "cornell", label: "Cornell University" },
            { value: "northwestern", label: "Northwestern University" },
            { value: "johns-hopkins", label: "Johns Hopkins University" },
            { value: "duke", label: "Duke University" },
            { value: "brown", label: "Brown University" },
            { value: "vanderbilt", label: "Vanderbilt University" },
            { value: "rice", label: "Rice University" },
            { value: "notre-dame", label: "University of Notre Dame" },
            { value: "ucla", label: "University of California, Los Angeles" },
            { value: "michigan", label: "University of Michigan" },
            { value: "virginia", label: "University of Virginia" },
            { value: "emory", label: "Emory University" },
            { value: "carnegie-mellon", label: "Carnegie Mellon University" },
            { value: "georgetown", label: "Georgetown University" },
            { value: "wake-forest", label: "Wake Forest University" },
            { value: "tufts", label: "Tufts University" },
            { value: "boston-college", label: "Boston College" },
            { value: "nyu", label: "New York University" },
            { value: "brandeis", label: "Brandeis University" },
            { value: "case-western", label: "Case Western Reserve University" },
            { value: "other", label: "Other (Please specify in next field)" },
          ],
        },
      })
    ),
  department: z
    .string()
    .min(2)
    .superRefine(
      fieldConfig({
        label: "Department",
        fieldType: "select-command", // Use SelectCommand with conditional options
        inputProps: {
          placeholder: "Select your department",
          conditionalOptions: {
            fieldName: "university",
            fn: async (universityValue: string) => {
              // Simulate API call delay
              await new Promise((resolve) => setTimeout(resolve, 300));

              // Common departments for most universities
              const commonDepartments = [
                { value: "computer-science", label: "Computer Science" },
                { value: "engineering", label: "Engineering" },
                { value: "business", label: "Business Administration" },
                { value: "mathematics", label: "Mathematics" },
                { value: "physics", label: "Physics" },
                { value: "chemistry", label: "Chemistry" },
                { value: "biology", label: "Biology" },
                { value: "psychology", label: "Psychology" },
                { value: "economics", label: "Economics" },
                { value: "english", label: "English Literature" },
                { value: "history", label: "History" },
                { value: "political-science", label: "Political Science" },
                { value: "art", label: "Art & Design" },
                { value: "music", label: "Music" },
                { value: "philosophy", label: "Philosophy" },
                { value: "sociology", label: "Sociology" },
                { value: "anthropology", label: "Anthropology" },
                {
                  value: "environmental-science",
                  label: "Environmental Science",
                },
                { value: "medicine", label: "Medicine" },
                { value: "law", label: "Law" },
              ];

              // Special departments for tech-focused universities
              const techDepartments = [
                { value: "computer-science", label: "Computer Science" },
                {
                  value: "software-engineering",
                  label: "Software Engineering",
                },
                {
                  value: "electrical-engineering",
                  label: "Electrical Engineering",
                },
                {
                  value: "mechanical-engineering",
                  label: "Mechanical Engineering",
                },
                { value: "civil-engineering", label: "Civil Engineering" },
                {
                  value: "aerospace-engineering",
                  label: "Aerospace Engineering",
                },
                {
                  value: "biomedical-engineering",
                  label: "Biomedical Engineering",
                },
                {
                  value: "chemical-engineering",
                  label: "Chemical Engineering",
                },
                { value: "data-science", label: "Data Science" },
                {
                  value: "artificial-intelligence",
                  label: "Artificial Intelligence",
                },
                { value: "cybersecurity", label: "Cybersecurity" },
                { value: "robotics", label: "Robotics" },
                { value: "information-systems", label: "Information Systems" },
                { value: "mathematics", label: "Mathematics" },
                { value: "physics", label: "Physics" },
                { value: "statistics", label: "Statistics" },
              ];

              // Return departments based on university
              switch (universityValue) {
                case "mit":
                case "caltech":
                case "stanford":
                case "carnegie-mellon":
                  return techDepartments;
                case "other":
                  return [
                    ...commonDepartments,
                    { value: "other", label: "Other (Please specify)" },
                  ];
                default:
                  return commonDepartments;
              }
            },
          },
        },
      })
    ),
  degree_level: z.enum(["bachelor", "master", "self_taught"]).superRefine(
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
          className: "url-field-github",
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
          className: "url-field-portfolio",
        },
      })
    ),
});

// Step 3: Setup Profile Schema
const setupProfileSchema = z.object({
  profilePhoto: z
    .string()
    .url("Please provide a valid image URL")
    .optional()
    .or(z.literal(""))
    .superRefine(
      fieldConfig({
        label: "Profile Photo",
        fieldType: "profile-photo", // Use custom profile photo component
        inputProps: {
          accept: "image/*",
          className: "profile-photo-field",
        },
      })
    ),
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
    fields: ["profilePhoto", "username", "bio"],
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

  // Add a ref to track form instances and their current values
  const formRef = useRef<HTMLFormElement>(null);
  const currentFormValues = useRef<Record<string, any>>({});

  // Add a state to track current step's form values in real-time
  const prev = () => {
    if (step > 0) {
      // Force save current form state by gathering data from DOM elements
      const currentForm = document.querySelector("form");
      if (currentForm) {
        const currentStepData: Record<string, any> = {};

        // Get all form inputs and their current values
        const inputs = currentForm.querySelectorAll("input, select, textarea");
        inputs.forEach((input: any) => {
          if (input.name && input.value !== "") {
            if (input.type === "file") {
              if (input.files && input.files.length > 0) {
                currentStepData[input.name] = Array.from(input.files);
              }
            } else {
              currentStepData[input.name] = input.value;
            }
          }
        });

        // Special handling for our custom components that might store data differently
        // Check multiselect values from data attributes
        const formDataAttr = currentForm.getAttribute("data-form-values");
        if (formDataAttr) {
          try {
            const existingFormData = JSON.parse(formDataAttr);
            // Merge any existing values that aren't empty
            Object.keys(existingFormData).forEach((key) => {
              const value = existingFormData[key];
              if (
                value &&
                (typeof value === "string" || Array.isArray(value)) &&
                value.length > 0 &&
                !currentStepData[key]
              ) {
                currentStepData[key] = value;
              }
            });
          } catch (e) {
            // Ignore parse errors
          }
        }

        // Save if we found any data
        if (Object.keys(currentStepData).length > 0) {
          console.log(
            `Saving Step ${step + 1} data before going back:`,
            currentStepData
          );
          setFormData((prev) => ({ ...prev, ...currentStepData }));
        }
      }

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
                      "select-command": SelectCommand, // Register for fieldType: "select-command"
                      "profile-photo": ProfilePhotoField, // Register for fieldType: "profile-photo"
                    }}
                    formProps={{
                      className:
                        step === 0
                          ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                          : step === 1
                            ? "technical-profile-form space-y-6"
                            : step === 2
                              ? "setup-profile-form space-y-6"
                              : "grid grid-cols-1 gap-6",
                      // Pass sanitized form data through data attributes
                      "data-form-values": JSON.stringify(
                        sanitizeFormData(currentStepFormData)
                      ),
                    }}
                    onSubmit={handleStepSubmit}
                    withSubmit={false} // We'll handle submission with custom buttons
                  >
                    <style jsx global>{`
                      /* Step 2: Technical Profile - URL Fields Side by Side */
                      @media (min-width: 768px) {
                        .technical-profile-form {
                          position: relative;
                        }

                        /* Target the last two form fields (GitHub and Portfolio) */
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

                      /* Mobile responsive */
                      @media (max-width: 767px) {
                        .technical-profile-form > div {
                          width: 100% !important;
                          margin-right: 0 !important;
                          display: block !important;
                        }
                      }
                    `}</style>
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
