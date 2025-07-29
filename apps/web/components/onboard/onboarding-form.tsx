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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/shared/StepIndicator";
import CustomInput from "@/components/ui/autoform/custom/input";
import CustomMultiSelect from "@/components/ui/autoform/custom/multiselect";
import { StringField } from "@/components/ui/autoform/components/StringField";
import { SelectField } from "@/components/ui/autoform/components/SelectField";

// Step 1: Personal Details Schema
const personalDetailsSchema = z.object({
  first_name: z
    .string()
    .min(2)
    .superRefine(
      fieldConfig({
        label: "First Name",
        description: "Your first name",
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
        description: "Your last name",
        inputProps: {
          placeholder: "Enter your last name",
        },
      })
    ),
  phone: z
    .string()
    .optional()
    .transform((val) => {
      // Clean up empty strings to undefined
      if (!val || val.trim() === "") return undefined;
      return val;
    })
    .superRefine(
      fieldConfig({
        label: "Phone Number",
        description: "Your phone number (optional)",
        inputProps: {
          type: "tel",
          placeholder: "+1 (555) 000-0000",
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
        description: "Your birth date (optional)",
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
        description: "Your university or institution",
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
        description: "Your department or field of study",
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
        description: "Your education level",
        inputProps: {
          placeholder: "Select your degree level",
        },
      })
    ),
});

// Step 2: Technical Profile Schema
const technicalProfileSchema = z.object({
  primary_skills: z
    .array(z.string())
    .min(1)
    .superRefine(
      fieldConfig({
        label: "Primary Skills", 
        description: "Your main technical skills",
        inputProps: {
          placeholder: "Select your primary skills",
          options: [
            { label: "JavaScript", value: "javascript" },
            { label: "TypeScript", value: "typescript" },
            { label: "React", value: "react" },
            { label: "Node.js", value: "nodejs" },
            { label: "Python", value: "python" },
            { label: "Java", value: "java" },
            { label: "C++", value: "cpp" },
            { label: "Go", value: "go" },
            { label: "Rust", value: "rust" },
            { label: "PHP", value: "php" },
          ],
        },
      })
    ),
  experience_level: z
    .enum(["beginner", "intermediate", "advanced", "expert"])
    .superRefine(
      fieldConfig({
        label: "Experience Level",
        description: "Your overall experience level",
        inputProps: {
          placeholder: "Select your experience level",
        },
      })
    ),
  interests: z
    .array(z.string())
    .min(1)
    .superRefine(
      fieldConfig({
        label: "Interests",
        description: "Areas you're interested in",
        inputProps: {
          placeholder: "Select your interests",
          options: [
            { label: "Web Development", value: "web_dev" },
            { label: "Mobile Development", value: "mobile_dev" },
            { label: "Data Science", value: "data_science" },
            { label: "Machine Learning", value: "ml" },
            { label: "DevOps", value: "devops" },
            { label: "Cybersecurity", value: "security" },
            { label: "Game Development", value: "game_dev" },
            { label: "UI/UX Design", value: "design" },
          ],
        },
      })
    ),
  preferred_roles: z
    .array(z.string())
    .min(1)
    .superRefine(
      fieldConfig({
        label: "Preferred Roles",
        description: "Roles you're interested in",
        inputProps: {
          placeholder: "Select preferred roles",
          options: [
            { label: "Frontend Developer", value: "frontend" },
            { label: "Backend Developer", value: "backend" },
            { label: "Full Stack Developer", value: "fullstack" },
            { label: "Data Scientist", value: "data_scientist" },
            { label: "DevOps Engineer", value: "devops_engineer" },
            { label: "Product Manager", value: "pm" },
            { label: "Designer", value: "designer" },
            { label: "QA Engineer", value: "qa" },
          ],
        },
      })
    ),
  tools_proficiency: z
    .array(z.string())
    .optional()
    .superRefine(
      fieldConfig({
        label: "Tools & Technologies",
        description: "Tools and technologies you're proficient with",
        inputProps: {
          placeholder: "Select tools you're familiar with",
          options: [
            { label: "Git", value: "git" },
            { label: "Docker", value: "docker" },
            { label: "AWS", value: "aws" },
            { label: "Firebase", value: "firebase" },
            { label: "MongoDB", value: "mongodb" },
            { label: "PostgreSQL", value: "postgresql" },
            { label: "Redis", value: "redis" },
            { label: "Kubernetes", value: "k8s" },
          ],
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
        description: "Choose a unique username",
        inputProps: {
          placeholder: "Enter your username",
        },
      })
    ),
  bio: z
    .string()
    .min(10)
    .max(500)
    .optional()
    .superRefine(
      fieldConfig({
        label: "Bio",
        description: "Tell us about yourself",
        inputProps: {
          placeholder: "Write a short bio about yourself...",
          rows: 4,
        },
      })
    ),
  github_url: z
    .string()
    .url()
    .optional()
    .superRefine(
      fieldConfig({
        label: "GitHub URL",
        description: "Your GitHub profile (optional)",
        inputProps: {
          placeholder: "https://github.com/yourusername",
        },
      })
    ),
  linkedin_url: z
    .string()
    .url()
    .optional()
    .superRefine(
      fieldConfig({
        label: "LinkedIn URL",
        description: "Your LinkedIn profile (optional)",
        inputProps: {
          placeholder: "https://linkedin.com/in/yourusername",
        },
      })
    ),
  portfolio_url: z
    .string()
    .url()
    .optional()
    .superRefine(
      fieldConfig({
        label: "Portfolio URL",
        description: "Your portfolio website (optional)",
        inputProps: {
          placeholder: "https://yourportfolio.com",
        },
      })
    ),
});

const steps = [
  {
    id: "step-1",
    name: "Personal Details",
    title: "Personal Details",
    description: "Tell us about yourself",
    icon: User,
    schema: new ZodProvider(personalDetailsSchema),
    fields: ["first_name", "last_name", "phone", "date_of_birth", "university", "department", "degree_level"],
  },
  {
    id: "step-2", 
    name: "Technical Profile",
    title: "Technical Profile",
    description: "Your skills and experience",
    icon: GraduationCap,
    schema: new ZodProvider(technicalProfileSchema),
    fields: ["primary_skills", "experience_level", "interests", "preferred_roles", "tools_proficiency"],
  },
  {
    id: "step-3",
    name: "Setup Profile", 
    title: "Setup Profile",
    description: "Complete your profile",
    icon: Settings,
    schema: new ZodProvider(setupProfileSchema),
    fields: ["username", "bio", "github_url", "linkedin_url", "portfolio_url"],
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
    const currentForm = document.querySelector('form');
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
        <div className="grid md:grid-cols-[300px_1fr] h-full w-full bg-primary-foreground rounded-lg">
          {/* Left sidebar */}
          <div className="w-full p-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold">Complete Your Profile</h1>
              <p className="text-sm text-muted-foreground">
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
          <div className="bg-background border m-3 rounded-md">
            <div className="flex items-center justify-between border-b p-6 pb-4">
              <h2 className="text-lg font-medium">{currentStepData.name}</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
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
                    schema={currentStepData.schema}
                    formComponents={{
                      // Use built-in components and custom where needed
                      string: StringField,
                      select: SelectField,
                      multiselect: CustomMultiSelect,
                      input: CustomInput, // Use custom input only where needed
                    }}
                    onSubmit={handleStepSubmit}
                    withSubmit={false} // We'll handle submission with custom buttons
                  >
                    <div className="flex gap-2 pt-4">
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
