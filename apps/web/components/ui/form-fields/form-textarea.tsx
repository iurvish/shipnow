"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface FormTextareaProps extends React.ComponentProps<typeof Textarea> {}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ className, ...props }, ref) => {
  return <Textarea ref={ref} className={cn(className)} {...props} />;
});

FormTextarea.displayName = "FormTextarea";
