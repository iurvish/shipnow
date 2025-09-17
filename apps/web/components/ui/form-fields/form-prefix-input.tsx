"use client";

import React, { forwardRef, useState, useEffect } from "react";
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
  // Optional: Custom cleaning function for specific prefix types
  customCleanFunction?: (value: string, prefix: string) => string;
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
      customCleanFunction,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value || "");

    // Update local state when external value changes
    useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    // Generic cleaning function that works with any prefix
    const cleanPrefixInput = (
      inputValue: string,
      prefixToRemove: string
    ): string => {
      // Use custom clean function if provided
      if (customCleanFunction) {
        return customCleanFunction(inputValue, prefixToRemove);
      }

      // Handle URL prefixes (https://, http://)
      if (prefixToRemove.includes("://")) {
        // Remove common URL prefixes including www
        let cleaned = inputValue.replace(/^https?:\/\//, "");
        cleaned = cleaned.replace(/^www\./, "");
        return cleaned;
      }

      // Handle @ symbol prefix
      if (prefixToRemove === "@") {
        return inputValue.replace(/^@+/, "");
      }

      // Handle any other prefix by removing it from the beginning
      if (inputValue.startsWith(prefixToRemove)) {
        return inputValue.substring(prefixToRemove.length);
      }

      return inputValue;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanedValue = cleanPrefixInput(e.target.value, prefix);
      setInputValue(cleanedValue);

      // Always return the full value with prefix
      const fullValue = cleanedValue ? `${prefix}${cleanedValue}` : "";
      onChange?.(fullValue);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const cleanedValue = cleanPrefixInput(pastedText, prefix);
      setInputValue(cleanedValue);

      // Always return the full value with prefix
      const fullValue = cleanedValue ? `${prefix}${cleanedValue}` : "";
      onChange?.(fullValue);
    };

    // Get the display value (without prefix for the input)
    const getDisplayValue = () => {
      if (!value) return inputValue;
      return cleanPrefixInput(value, prefix);
    };

    return (
      <div className="flex rounded-md shadow-xs">
        <span
          className={cn(
            "border-input select-none bg-background text-muted-foreground  inline-flex items-center rounded-s-md border px-3 text-sm"
          )}
        >
          {prefix}
        </span>
        <Input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={getDisplayValue()}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onBlur={onBlur}
          disabled={disabled}
          className={cn("-ms-px rounded-s-none shadow-none", className)}
          {...props}
        />
      </div>
    );
  }
);

FormPrefixInput.displayName = "FormPrefixInput";

export { FormPrefixInput };
