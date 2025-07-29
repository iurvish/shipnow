import React, { useState } from "react";
import { z } from "zod";
import { SuccessAnimation } from "../shared/SuccessAnimation";
import { Loader } from "lucide-react";



const OnboardingForm = () => {
  const [step, setStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < step) return "done";
    if (stepIndex === step) return "ongoing";
    return "pending";
  };

  //   const next = async () => {
  //     const fields = steps[step].fields;
  //     const output = await form.trigger(
  //       fields as Array<keyof z.infer<typeof formSchema>>,
  //       { shouldFocus: true }
  //     );

  //     if (!output) return;

  //     if (step < steps.length - 1) {
  //       setPreviousStep(step);
  //       setStep(step + 1);
  //     }
  //   };

  //   const prev = () => {
  //     if (step > 0) {
  //       setPreviousStep(step);
  //       setStep(step - 1);
  //     }
  //   };

  //   if (!isLoaded) {
  //     return (
  //       <div className="flex h-screen items-center justify-center">
  //         <Loader className="animate-spin h-5 w-5" />
  //       </div>
  //     );
  //   }

  if (showSuccess) {
    return (
      <div className="mx-auto flex items-center min-h-screen justify-center w-full px-4 md:px-8">
        <div className="rounded-lg flex items-center justify-center w-full ">
          <SuccessAnimation />
        </div>
      </div>
    );
  }
  return <div>OnboardingForm</div>;
};

export default OnboardingForm;
