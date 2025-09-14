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
  const { key, onChange, value, className, ...props } = inputProps;

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
    if (value && typeof value === "object") {
      setFirstValue(value.first || "");
      setSecondValue(value.second || "");
    } else if (field.default && typeof field.default === "object") {
      setFirstValue(field.default.first || "");
      setSecondValue(field.default.second || "");
    }
  }, [value, field.default]);

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
    if (separateFields) {
      // Handle separate fields - trigger two separate onChange events
      if (onChange && firstValue !== "") {
        const firstEvent = {
          target: {
            value: firstValue,
            name: firstFieldName,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(firstEvent);
      }

      if (onChange && secondValue !== "") {
        const secondEvent = {
          target: {
            value: secondValue,
            name: secondFieldName,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        onChange(secondEvent);
      }
    } else {
      // Handle combined object
      const combinedValue = {
        first: firstValue,
        second: secondValue,
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
    }
  }, [
    firstValue,
    secondValue,
    onChange,
    field.key,
    separateFields,
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
        },
      },
    },
    inputProps: {
      ...inputProps,
      key: `${key}_first`,
      value: firstValue,
      onChange: handleFirstChange,
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
      },
    },
    inputProps: {
      ...inputProps,
      key: `${key}_second`,
      value: secondValue,
      onChange: handleSecondChange,
      placeholder: secondSelectPlaceholder,
      disabled: disabled || !firstValue || isLoadingSecond,
    },
    error: undefined, // Don't show error for second select
    id: `${id}_second`,
    label: secondSelectLabel,
    value: secondValue,
    path: [`${field.key}_second`],
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      <div className="flex">
        {/* First Select - using SelectCommand */}
        <div className="flex-1">
          {/* <label className="text-sm font-medium mb-2 block">
            {firstSelectLabel}
          </label> */}
          <SelectCommand {...firstSelectProps} />
        </div>

        {/* Second Select - conditionally rendered */}
        <div className="flex-1">
          {isLoadingSecond ? (
            <div className="h-10 bg-muted animate-pulse rounded-md flex items-center justify-center">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : (
            <SelectField {...secondSelectProps} />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}

        {/* Hidden inputs for form submission */}
        {separateFields ? (
          <>
            <input type="hidden" name={firstFieldName} value={firstValue} />
            <input type="hidden" name={secondFieldName} value={secondValue} />
          </>
        ) : (
          <input
            type="hidden"
            name={field.key}
            value={JSON.stringify({ first: firstValue, second: secondValue })}
          />
        )}
      </div>
    </div>
  );
};

export default TwoSelectInput;
