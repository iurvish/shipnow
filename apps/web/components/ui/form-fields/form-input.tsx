"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  isTextarea?: boolean;
  rows?: number;
}

export const FormInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FormInputProps
>(({ isTextarea = false, rows, className, ...props }, ref) => {
  if (isTextarea) {
    return (
      <Textarea
        ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        className={cn(className)}
        rows={rows}
        {...(props as React.ComponentProps<typeof Textarea>)}
      />
    );
  }

  return (
    <Input
      ref={ref as React.ForwardedRef<HTMLInputElement>}
      className={cn(className)}
      {...props}
    />
  );
});

FormInput.displayName = "FormInput";
