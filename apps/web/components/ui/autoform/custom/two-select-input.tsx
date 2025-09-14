"use client";

import React, { useState, useEffect } from "react";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";
import SelectCommand from "./select-command";
import { SelectField } from "../components/SelectField";

// Local types for this component
interface OptionType {
  label: string;
  value: string;
}

interface TwoSelectConfig {
  firstSelectLabel?: string;
  secondSelectLabel?: string;
  firstSelectPlaceholder?: string;
  secondSelectPlaceholder?: string;
  firstSelectOptions?: OptionType[] | (() => Promise<OptionType[]>);
  getSecondOptions?: (
    firstValue: string
  ) => OptionType[] | Promise<OptionType[]>;
  disabled?: boolean;
  separateFields?: boolean; // New option to handle fields separately
  firstFieldName?: string; // Custom name for first field
  secondFieldName?: string; // Custom name for second field
}

const TwoSelectInput: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  // Destructure inputProps to separate DOM-safe props from custom props
  const {
    key,
    onChange,
    value,
    className,
    // Filter out custom props that shouldn't go to DOM
    separateFields: _separateFields,
    firstFieldName: _firstFieldName,
    secondFieldName: _secondFieldName,
    firstSelectLabel: _firstSelectLabel,
    secondSelectLabel: _secondSelectLabel,
    firstSelectPlaceholder: _firstSelectPlaceholder,
    secondSelectPlaceholder: _secondSelectPlaceholder,
    firstSelectOptions: _firstSelectOptions,
    getSecondOptions: _getSecondOptions,
    ...domSafeProps
  } = inputProps;

  // Get configuration from fieldConfig
  const config: TwoSelectConfig = field.fieldConfig?.inputProps || {};
  const {
    firstSelectLabel = "Select Category",
    secondSelectLabel = "Select Option",
    firstSelectPlaceholder = "Choose category...",
    secondSelectPlaceholder = "Choose option...",
    firstSelectOptions = [],
    getSecondOptions,
    disabled = false,
    separateFields = false,
    firstFieldName = `${field.key}_first`,
    secondFieldName = `${field.key}_second`,
  } = config;

  // State for both select values
  const [firstValue, setFirstValue] = useState<string>("");
  const [secondValue, setSecondValue] = useState<string>("");
  const [secondOptions, setSecondOptions] = useState<OptionType[]>([]);
  const [isLoadingSecond, setIsLoadingSecond] = useState(false);

  // Initialize values from props or field default
  useEffect(() => {
    console.log("TwoSelectInput - inputProps:", inputProps);
    console.log("TwoSelectInput - value prop:", value);
    console.log("TwoSelectInput - field:", field);
    console.log(
      "TwoSelectInput - firstFieldName:",
      firstFieldName,
      "secondFieldName:",
      secondFieldName
    );

    // Try different sources for the initial value
    let sourceValue = null;

    // 1. Check inputProps.value (most common in AutoForm)
    if (value && typeof value === "object") {
      sourceValue = value;
      console.log("TwoSelectInput - using inputProps.value");
    }
    // 2. Check field.default
    else if (field.default && typeof field.default === "object") {
      sourceValue = field.default;
      console.log("TwoSelectInput - using field.default");
    }
    // 3. Check if there's a defaultValue in inputProps
    else if (
      inputProps.defaultValue &&
      typeof inputProps.defaultValue === "object"
    ) {
      sourceValue = inputProps.defaultValue;
      console.log("TwoSelectInput - using inputProps.defaultValue");
    }

    if (sourceValue) {
      const firstVal = sourceValue[firstFieldName] || "";
      const secondVal = sourceValue[secondFieldName] || "";
      console.log("TwoSelectInput - setting values:", { firstVal, secondVal });
      setFirstValue(firstVal);
      setSecondValue(secondVal);
    } else {
      console.log("TwoSelectInput - no source value found, resetting to empty");
      setFirstValue("");
      setSecondValue("");
    }
  }, [value, field.default, firstFieldName, secondFieldName, inputProps]);

  // Load second options when first value changes
  useEffect(() => {
    if (!firstValue || !getSecondOptions) {
      setSecondOptions([]);
      setSecondValue(""); // Clear second value when first changes
      return;
    }

    const loadSecondOptions = async () => {
      setIsLoadingSecond(true);
      try {
        const options = await getSecondOptions(firstValue);
        setSecondOptions(Array.isArray(options) ? options : []);
      } catch (error) {
        console.error("Error loading second options:", error);
        setSecondOptions([]);
      } finally {
        setIsLoadingSecond(false);
      }
    };

    loadSecondOptions();
  }, [firstValue, getSecondOptions]);

  // Update parent form when values change
  useEffect(() => {
    // Always create a combined object for this field
    // Even with separateFields=true, we still need the main field to have the full object
    const combinedValue = {
      [firstFieldName]: firstValue,
      [secondFieldName]: secondValue,
    };

    if (onChange) {
      const syntheticEvent = {
        target: {
          value: combinedValue,
          name: field.key,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  }, [
    firstValue,
    secondValue,
    onChange,
    field.key,
    firstFieldName,
    secondFieldName,
  ]);

  const handleFirstChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setFirstValue(newValue);
    setSecondValue(""); // Reset second value when first changes
  };

  const handleSecondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSecondValue(newValue);
  };

  // Create mock AutoFormFieldProps for the child components
  const firstSelectProps: AutoFormFieldProps = {
    field: {
      ...field,
      key: `${field.key}_first`,
      fieldConfig: {
        ...field.fieldConfig,
        label: firstSelectLabel,
        inputProps: {
          options: firstSelectOptions,
          placeholder: firstSelectPlaceholder,
          disabled,
          className:
            "rounded-r-none border-r-[0.5px] border-r-border focus:border-r-ring focus-visible:ring-offset-0",
        },
      },
    },
    inputProps: {
      ...domSafeProps, // Use filtered props instead of all inputProps
      key: `${key}_first`,
      value: firstValue,
      onChange: handleFirstChange,
      className:
        "rounded-r-none border-r-[0.5px] border-r-border focus:border-r-ring focus-visible:ring-offset-0",
    },
    error: error,
    id: `${id}_first`,
    label: firstSelectLabel,
    value: firstValue,
    path: [`${field.key}_first`],
  };

  const secondSelectProps: AutoFormFieldProps = {
    field: {
      ...field,
      key: `${field.key}_second`,
      options: secondOptions.map((opt) => [opt.value, opt.label]),
      fieldConfig: {
        ...field.fieldConfig,
        label: secondSelectLabel,
        inputProps: {
          className: cn(
            "rounded-l-none border-l-[0.5px] border-l-border focus:border-l-ring focus-visible:ring-offset-0",
            (!firstValue || disabled || isLoadingSecond) &&
              "opacity-30 cursor-not-allowed bg-input/30"
          ),
        },
      },
    },
    inputProps: {
      ...domSafeProps, // Use filtered props instead of all inputProps
      key: `${key}_second`,
      value: secondValue,
      onChange: handleSecondChange,
      placeholder: !firstValue
        ? `First select ${firstSelectLabel.toLowerCase()}`
        : secondSelectPlaceholder,
      disabled: disabled || !firstValue || isLoadingSecond,
      className: cn(
        "rounded-l-none border-l-[0.5px] border-l-border focus:border-l-ring focus-visible:ring-offset-0",
        (!firstValue || disabled || isLoadingSecond) &&
          "opacity-30 cursor-not-allowed bg-input/30"
      ),
    },
    error: undefined, // Don't show error for second select
    id: `${id}_second`,
    label: secondSelectLabel,
    value: secondValue,
    path: [`${field.key}_second`],
  };

  return (
    <div className={cn("space-y-2 w-full", className)}>
      {/* Combined Label */}
      {/* <label className="text-sm font-medium block">
        <span className="truncate">
          {firstSelectLabel} & {secondSelectLabel}
        </span>
      </label> */}

      <div className="flex w-full">
        {/* First Select - using SelectCommand */}
        <div className="flex-1 min-w-0">
          <SelectCommand {...firstSelectProps} />
        </div>

        {/* Second Select - always shown but disabled when first not selected */}
        <div className="flex-1 min-w-0">
          {isLoadingSecond ? (
            <div className="h-10 bg-input/30 animate-pulse rounded-l-none border border-l-[0.5px] border-l-border flex items-center justify-center opacity-30 cursor-not-allowed">
              <span className="text-sm text-muted-foreground truncate px-3">
                Loading...
              </span>
            </div>
          ) : (
            <SelectField {...secondSelectProps} />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm font-medium text-destructive truncate">{error}</p>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={field.key}
        value={JSON.stringify({
          [firstFieldName]: firstValue,
          [secondFieldName]: secondValue,
        })}
      />
    </div>
  );
};

export default TwoSelectInput;
