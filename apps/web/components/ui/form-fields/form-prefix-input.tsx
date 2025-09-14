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
  (
    {
      prefix = "https://",
      placeholder,
      className,
      disabled,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
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
      <div className="flex rounded-md shadow-xs">
        <span
          className={cn(
            "border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm "
          )}
        >
          {prefix}
        </span>
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value || ""}
          onChange={handleInputChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn("-ms-px rounded-s-none shadow-none", className)}
          // style={{ paddingLeft: `${prefix.length * 0.6 + 0.75}rem` }}
          {...props}
        />
      </div>
    );
  }
);

FormPrefixInput.displayName = "FormPrefixInput";

export { FormPrefixInput };
