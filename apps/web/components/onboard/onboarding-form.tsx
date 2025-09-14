"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SuccessAnimation } from "../shared/SuccessAnimation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getSkillsForFormOptions, validateSkills } from "@/lib/config/skills";
import { useOnboardingStore } from "@/stores/form-store";
import {
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  Settings,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { submitOnboardingForm } from "@/lib/actions/onboarding";

// Import our form field components
import { FormInput } from "@/components/ui/form-fields/form-input";
import { FormSelect } from "@/components/ui/form-fields/form-select";
import { FormDatePicker } from "@/components/ui/form-fields/form-date-picker";
import { FormCommandSelect } from "@/components/ui/form-fields/form-command-select";
import { FormTwoSelect } from "@/components/ui/form-fields/form-two-select";
import { FormSearchMultiSelect } from "@/components/ui/form-fields/form-search-multiselect";
import { FormPrefixInput } from "@/components/ui/form-fields/form-prefix-input";
import { FormProfilePhoto } from "@/components/ui/form-fields";
import { FormTextarea } from "@/components/ui/form-fields/form-textarea";
import { createClient } from "@/lib/client";

// Step 1: Personal Details Schema
const personalDetailsSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  date_of_birth: z.string().optional(),
  university: z.string().min(2, "Please select a university"),
  institute: z.string().min(1, "Please select an institute"),
  department: z.string().min(1, "Please select a department"),
  degree_level: z.enum(
    ["Bachelor", "Master", "Self_taught", "Diploma", "Other"],
    {
      required_error: "Please select a degree level",
    }
  ),
});

// Step 2: Technical Details Schema
const technicalDetailsSchema = z.object({
  skills: z.array(z.string()).min(1, "Please select at least one skill"),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  portfolio: z.string().optional(),
  experience_level: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"], {
    required_error: "Please select your experience level",
  }),
  availability: z.enum(["Full_time", "Part_time", "Contract", "Freelance"], {
    required_error: "Please select your availability",
  }),
});

// Step 3: Profile Details Schema
const profileDetailsSchema = z.object({
  profilePhoto: z.any().optional(),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().optional(),
});

// Combined Schema
const onboardingSchema = z.object({
  ...personalDetailsSchema.shape,
  ...technicalDetailsSchema.shape,
  ...profileDetailsSchema.shape,
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const steps = [
  { id: 0, title: "Personal Details", icon: User },
  { id: 1, title: "Technical Profile", icon: GraduationCap },
  { id: 2, title: "Profile Setup", icon: Settings },
];

const OnboardingForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    saveStepData,
    getStepData,
    getAllFormData,
    clearAllData,
    setCurrentStep,
  } = useOnboardingStore();

  // Create separate forms for each step
  const personalDetailsForm = useForm<z.infer<typeof personalDetailsSchema>>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      first_name: getStepData(0).first_name || "",
      last_name: getStepData(0).last_name || "",
      date_of_birth: getStepData(0).date_of_birth || "",
      university: getStepData(0).university || "",
      institute: getStepData(0).institute || "",
      department: getStepData(0).department || "",
      degree_level: getStepData(0).degree_level || undefined,
    },
  });

  // Combined institute/department state
  const [instituteDepartment, setInstituteDepartment] = useState({
    first: getStepData(0).institute || "",
    second: getStepData(0).department || "",
  });

  // Institute and department options
  const instituteOptions = [
    { label: "CSPIT (Computer Science)", value: "cspit" },
    { label: "DEPSTAR (Engineering)", value: "depstar" },
    { label: "Other Institute", value: "other" },
  ];

  const getDepartmentOptions = (institute: string) => {
    const departmentMap: Record<
      string,
      Array<{ label: string; value: string }>
    > = {
      cspit: [
        { label: "Computer Science & Engineering", value: "cse" },
        { label: "Information Technology", value: "it" },
        { label: "Computer Engineering", value: "ce" },
        { label: "Data Science", value: "ds" },
        { label: "Artificial Intelligence", value: "ai" },
        { label: "Cyber Security", value: "cs" },
      ],
      depstar: [
        { label: "Mechanical Engineering", value: "me" },
        { label: "Civil Engineering", value: "civil" },
        { label: "Electrical Engineering", value: "ee" },
        { label: "Chemical Engineering", value: "che" },
      ],
      other: [{ label: "Other Department", value: "other" }],
    };
    return departmentMap[institute] || [];
  };

  // Update form when combined field changes
  const handleInstituteDepartmentChange = (value: {
    first: string;
    second: string;
  }) => {
    setInstituteDepartment(value);
    personalDetailsForm.setValue("institute", value.first);
    personalDetailsForm.setValue("department", value.second);
  };

  const technicalDetailsForm = useForm<z.infer<typeof technicalDetailsSchema>>({
    resolver: zodResolver(technicalDetailsSchema),
    defaultValues: {
      skills: getStepData(1).skills || [],
      github: getStepData(1).github || "",
      linkedin: getStepData(1).linkedin || "",
      portfolio: getStepData(1).portfolio || "",
      experience_level: getStepData(1).experience_level || undefined,
      availability: getStepData(1).availability || undefined,
    },
  });

  const profileDetailsForm = useForm<z.infer<typeof profileDetailsSchema>>({
    resolver: zodResolver(profileDetailsSchema),
    defaultValues: {
      profilePhoto: getStepData(2).profilePhoto || null,
      username: getStepData(2).username || "",
      bio: getStepData(2).bio || "",
    },
  });

  const currentForm = useMemo(() => {
    switch (step) {
      case 0:
        return personalDetailsForm;
      case 1:
        return technicalDetailsForm;
      case 2:
        return profileDetailsForm;
      default:
        return personalDetailsForm;
    }
  }, [step, personalDetailsForm, technicalDetailsForm, profileDetailsForm]);

  // Helper functions for step management
  const getStepStatus = (stepIndex: number): "done" | "ongoing" | "pending" => {
    if (stepIndex < step) {
      return "done";
    } else if (stepIndex === step) {
      return "ongoing";
    } else {
      return "pending";
    }
  };

  const getCurrentStepData = () => {
    return {
      title: steps[step]?.title || "",
      id: steps[step]?.id || 0,
    };
  };

  const currentStepData = getCurrentStepData();

  const next = async () => {
    const form = currentForm;
    const isValid = await form.trigger();

    if (isValid) {
      const stepData = form.getValues();
      saveStepData(step, stepData);

      if (step < steps.length - 1) {
        setStep(step + 1);
        setCurrentStep(step + 1);
      }
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
      setCurrentStep(step - 1);
    }
  };

  const onSubmit = async () => {
    setIsLoading(true);

    try {
      // Get all form data from store
      const allData = getAllFormData();

      // Validate the complete form
      const validatedData = onboardingSchema.parse(allData);

      // Submit the form
      await submitOnboardingForm(validatedData);

      setShowSuccess(true);
      clearAllData();

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (error) {
      console.error("Onboarding submission error:", error);
      toast.error("Failed to submit onboarding form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: any) => {
    if (step === steps.length - 1) {
      // Last step - save data and submit all
      saveStepData(step, data);
      await onSubmit();
    } else {
      // Continue to next step
      saveStepData(step, data);
      if (step < steps.length - 1) {
        setStep(step + 1);
        setCurrentStep(step + 1);
      }
    }
  };

  const progressPercentage = ((step + 1) / steps.length) * 100;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <SuccessAnimation />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen items-center justify-center max-w-6xl px-4 md:px-8 md:border-l md:border-r lg:px-0">
      <div className=" w-full border lg:border-l-0 lg:border-r-0  h-full ">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] h-full w-full rounded-lg">
          {/* Left sidebar */}
          <div className="w-full p-4 md:p-6 border-b lg:border-b-0 lg:border-r">
            <div className="space-y-2">
              <h1 className="text-xl md:text-2xl font-semibold">
                Let’s Get You Set Up!
              </h1>
              <p className="text-sm">
                Just a few details to unlock your profile. Double-check before
                you go!
              </p>
            </div>

            <div className="mt-6 md:mt-8 space-y-2 md:space-y-0 md:flex md:space-x-2 lg:block lg:space-x-0 lg:space-y-2">
              {steps.map((s, i) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md p-3 transition-colors md:flex-1 lg:flex-none",
                    step === i && "bg-secondary"
                  )}
                >
                  <StepIndicator status={getStepStatus(i)} />
                  <div className="text-sm font-medium">
                    <p className="align-middle">{s.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-6 gap-4">
              <h2 className="text-lg font-medium">{currentStepData.title}</h2>
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

            {/* Form Content */}
            <AnimatePresence mode="wait">
              <div className="space-y-6">
                {step === 0 && (
                  <Form {...personalDetailsForm}>
                    <form
                      onSubmit={personalDetailsForm.handleSubmit(
                        handleFormSubmit
                      )}
                      className="space-y-6"
                    >
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <FormField
                          control={personalDetailsForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <FormInput
                                  placeholder="Enter your first name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalDetailsForm.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <FormInput
                                  placeholder="Enter your last name"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalDetailsForm.control}
                          name="date_of_birth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <FormDatePicker
                                  placeholder="Select your birth date"
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalDetailsForm.control}
                          name="university"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>University</FormLabel>
                              <FormControl>
                                <FormCommandSelect
                                  placeholder="Search and select your university"
                                  options={[
                                    {
                                      value: "charusat",
                                      label: "Charusat University",
                                    },
                                  ]}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalDetailsForm.control}
                          name="institute"
                          render={({ field }) => (
                            <FormItem className="col-span-full">
                              <FormLabel>Institute & Department</FormLabel>
                              <FormControl>
                                <FormTwoSelect
                                  firstSelectLabel="Institute"
                                  secondSelectLabel="Department"
                                  firstSelectPlaceholder="Choose institute..."
                                  secondSelectPlaceholder="Choose department..."
                                  firstSelectOptions={instituteOptions}
                                  getSecondOptions={getDepartmentOptions}
                                  value={instituteDepartment}
                                  onChange={handleInstituteDepartmentChange}
                                  layout="inline"
                                  showCombinedLabel={false}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={personalDetailsForm.control}
                          name="degree_level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree Level</FormLabel>
                              <FormControl>
                                <FormSelect
                                  placeholder="Select your degree level"
                                  options={[
                                    { label: "Bachelor", value: "Bachelor" },
                                    { label: "Master", value: "Master" },
                                    {
                                      label: "Self-taught",
                                      value: "Self_taught",
                                    },
                                    { label: "Diploma", value: "Diploma" },
                                    { label: "Other", value: "Other" },
                                  ]}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Navigation Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <div className="flex-1" />
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 1 && (
                  <Form {...technicalDetailsForm}>
                    <form
                      onSubmit={technicalDetailsForm.handleSubmit(
                        handleFormSubmit
                      )}
                      className="space-y-6"
                    >
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <FormField
                          control={technicalDetailsForm.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem className="col-span-full">
                              <FormLabel>Technical Skills</FormLabel>
                              <FormControl>
                                <FormSearchMultiSelect
                                  placeholder="Search and select skills..."
                                  options={getSkillsForFormOptions()}
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={technicalDetailsForm.control}
                          name="github"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Github Profile</FormLabel>
                              <FormControl>
                                <FormPrefixInput
                                  prefix="https://"
                                  placeholder="github.com/username"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={technicalDetailsForm.control}
                          name="linkedin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>LinkedIn Profile</FormLabel>
                              <FormControl>
                                <FormPrefixInput
                                  prefix="https://"
                                  placeholder="linkedin.com/in/username"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={technicalDetailsForm.control}
                          name="portfolio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Portfolio Website</FormLabel>
                              <FormControl>
                                <FormPrefixInput
                                  prefix="https://"
                                  placeholder="yourportfolio.com"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={technicalDetailsForm.control}
                          name="experience_level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level</FormLabel>
                              <FormControl>
                                <FormSelect
                                  placeholder="Select your experience level"
                                  options={[
                                    { label: "Beginner", value: "Beginner" },
                                    {
                                      label: "Intermediate",
                                      value: "Intermediate",
                                    },
                                    { label: "Advanced", value: "Advanced" },
                                    { label: "Expert", value: "Expert" },
                                  ]}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={technicalDetailsForm.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <FormSelect
                                  placeholder="Select your availability"
                                  options={[
                                    { label: "Full-time", value: "Full_time" },
                                    { label: "Part-time", value: "Part_time" },
                                    { label: "Contract", value: "Contract" },
                                    { label: "Freelance", value: "Freelance" },
                                  ]}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Navigation Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                          type="button"
                          onClick={prev}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                        <div className="flex-1" />
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {step === 2 && (
                  <Form {...profileDetailsForm}>
                    <form
                      onSubmit={profileDetailsForm.handleSubmit(
                        handleFormSubmit
                      )}
                      className="space-y-6"
                    >
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <FormField
                          control={profileDetailsForm.control}
                          name="profilePhoto"
                          render={({ field }) => (
                            <FormItem className="col-span-full">
                              <FormLabel>Profile Photo</FormLabel>
                              <FormControl>
                                <FormProfilePhoto
                                  accept="image/*"
                                  className="profile-photo-field"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileDetailsForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <FormPrefixInput
                                  prefix="@"
                                  placeholder="username"
                                  value={field.value}
                                  onChange={field.onChange}
                                  onBlur={field.onBlur}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileDetailsForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem className="col-span-full">
                              <FormLabel>Bio (Optional)</FormLabel>
                              <FormControl>
                                <FormTextarea
                                  placeholder="Tell us about yourself..."
                                  rows={3}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>

                      {/* Navigation Buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-4">
                        <Button
                          type="button"
                          onClick={prev}
                          variant="outline"
                          className="w-full sm:w-auto"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                        <div className="flex-1" />
                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full sm:w-auto"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            "Complete Setup"
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
