"use client";

import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormPrefixInputProps {
  prefix: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}

const FormPrefixInput = forwardRef<HTMLInputElement, FormPrefixInputProps>(
  ({ prefix = "https://", placeholder, className, disabled, value, onChange, onBlur, ...props }, ref) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let inputValue = e.target.value;
      
      // Clean up the value by removing the prefix if user types it
      if (inputValue.startsWith(prefix)) {
        inputValue = inputValue.substring(prefix.length);
      }
      
      if (onChange) {
        onChange(inputValue);
      }
    };

    return (
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground z-10 pointer-events-none">
          {prefix}
        </div>
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn("pl-[calc(3rem+0.5rem)]", className)}
          style={{ paddingLeft: `${prefix.length * 0.6 + 0.75}rem` }}
          {...props}
        />
      </div>
    );
  }
);

FormPrefixInput.displayName = "FormPrefixInput";

export { FormPrefixInput };