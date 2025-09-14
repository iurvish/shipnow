"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";

const CustomPrefixInput: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  // Destructure inputProps to separate DOM-safe props from custom props
  const {
    key,
    onChange,
    value: propValue,
    // Filter out custom props that shouldn't go to DOM
    prefix: _prefix,
    cleanPatterns: _cleanPatterns,
    ...domSafeProps
  } = inputProps;

  // Get custom props from fieldConfig
  const prefix = field.fieldConfig?.inputProps?.prefix || "https://";
  const placeholder = field.fieldConfig?.inputProps?.placeholder;
  const cleanPatterns = field.fieldConfig?.inputProps?.cleanPatterns || [
    /^https?:\/\//,
    /^www\./,
  ];

  const cleanInput = (value: string) => {
    let cleaned = value;
    // Apply all clean patterns
    cleanPatterns.forEach((pattern: RegExp) => {
      cleaned = cleaned.replace(pattern, "");
    });
    return cleaned;
  };

  const [inputValue, setInputValue] = useState(() => {
    // Check for initial value from props or field default
    if (propValue) {
      const cleanedValue = cleanInput(propValue.toString());
      return cleanedValue;
    }
    if (field.default) {
      const cleanedValue = cleanInput(field.default.toString());
      return cleanedValue;
    }
    return "";
  });

  // Update parent when inputValue changes
  useEffect(() => {
    const cleanedValue = cleanInput(inputValue);
    const fullValue = cleanedValue ? `${prefix}${cleanedValue}` : "";

    if (onChange) {
      onChange(fullValue);
    }
  }, [inputValue, onChange, prefix, cleanPatterns]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = cleanInput(e.target.value);
    setInputValue(cleanedValue);

    // Create the full value with prefix for form submission
    const fullValue = cleanedValue ? `${prefix}${cleanedValue}` : "";

    // Trigger onChange with the full value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: fullValue,
        name: field.key,
      },
    };
    onChange(syntheticEvent);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanedValue = cleanInput(pastedText);
    setInputValue(cleanedValue);

    // Create the full value with prefix for form submission
    const fullValue = cleanedValue ? `${prefix}${cleanedValue}` : "";

    // Trigger onChange with the full value
    const syntheticEvent = {
      target: {
        value: fullValue,
        name: field.key,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="flex rounded-md shadow-xs">
      <span
        className={cn(
          "border-input bg-background text-muted-foreground -z-10 inline-flex items-center rounded-s-md border px-3 text-sm",
          error ? "border-destructive" : ""
        )}
      >
        {prefix}
      </span>
      <Input
        key={key}
        id={id}
        {...domSafeProps}
        className={cn(
          "-ms-px rounded-s-none shadow-none",
          error ? "border-destructive" : "",
          domSafeProps.className
        )}
        placeholder={placeholder || domSafeProps.placeholder || "example.com"}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onPaste={handlePaste}
      />
    </div>
  );
};

export default CustomPrefixInput;
