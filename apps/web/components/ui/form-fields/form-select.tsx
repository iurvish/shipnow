"use client";

import React, { forwardRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  placeholder?: string;
  options: Option[];
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  className?: string;
}

const FormSelect = forwardRef<HTMLButtonElement, FormSelectProps>(
  (
    {
      placeholder,
      options,
      disabled,
      value,
      onChange,
      onValueChange,
      className,
      ...props
    },
    ref
  ) => {
    const handleValueChange = (newValue: string) => {
      if (onChange) onChange(newValue);
      if (onValueChange) onValueChange(newValue);
    };

    return (
      <Select
        value={value}
        onValueChange={handleValueChange}
        disabled={disabled}
        {...props}
      >
        <SelectTrigger ref={ref} className={cn("w-full ", className)}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="w-full">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
);

FormSelect.displayName = "FormSelect";

export { FormSelect };
