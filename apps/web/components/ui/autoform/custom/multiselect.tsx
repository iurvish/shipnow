"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface OptionType {
  label: string;
  value: string;
}

const CustomMultiSelect: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { key, onChange, value, className, ...props } = inputProps;

  // Get custom props from fieldConfig
  const options = field.fieldConfig?.inputProps?.options || [];
  const placeholder =
    field.fieldConfig?.inputProps?.placeholder || "Select options...";
  const maxSelections = field.fieldConfig?.inputProps?.maxSelections;
  const fieldClassName = field.fieldConfig?.inputProps?.className || "";

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<OptionType[]>([]);
  const selectedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set initial selected values from current value (for form persistence)
    let currentValues = Array.isArray(value) ? value : [];

    // If no value from props, try to get it from form data in DOM
    if (currentValues.length === 0) {
      const formElement = document.querySelector("form");
      if (formElement) {
        const formDataAttr = formElement.getAttribute("data-form-values");
        if (formDataAttr) {
          try {
            const formData = JSON.parse(formDataAttr);
            if (formData[field.key] && Array.isArray(formData[field.key])) {
              currentValues = formData[field.key];
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }
    }

    // Only update if the values have actually changed to prevent unnecessary re-renders
    const currentValueStrings = currentValues.sort().join(",");
    const selectedValueStrings = selected
      .map((s) => s.value)
      .sort()
      .join(",");

    if (currentValueStrings !== selectedValueStrings) {
      const currentSelected = options.filter((option: OptionType) =>
        currentValues.includes(option.value)
      );
      setSelected(currentSelected);

      // Debug logging
      if (field.key === "skills" && currentValues.length > 0) {
        console.log(`MultiSelect ${field.key} initialized with:`, {
          propsValue: value,
          formDataValue: currentValues,
          selectedOptions: currentSelected,
        });
      }
    }
  }, [value, options, field.key]); // Remove selected from dependencies to prevent infinite loops

  const handleSelect = (item: OptionType) => {
    if (maxSelections && selected.length >= maxSelections) {
      return;
    }
    const updatedSelected = [...selected, item];
    setSelected(updatedSelected);
    const updatedValues = updatedSelected.map((s) => s.value);

    // Create synthetic event for AutoForm
    const syntheticEvent = {
      target: {
        value: updatedValues,
        name: id,
      },
    } as any;
    onChange?.(syntheticEvent);
  };

  const handleRemove = (item: OptionType) => {
    const updatedSelected = selected.filter((i) => i.value !== item.value);
    setSelected(updatedSelected);
    const updatedValues = updatedSelected.map((s) => s.value);

    // Create synthetic event for AutoForm
    const syntheticEvent = {
      target: {
        value: updatedValues,
        name: id,
      },
    } as any;
    onChange?.(syntheticEvent);

    if (updatedSelected.length === 0) {
      setOpen(false);
    }
  };

  return (
    <div className={cn("w-full min-w-0", fieldClassName, className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "w-full min-w-0 flex items-center justify-start gap-1.5 min-h-10 rounded-md border border-input bg-input/30 p-1 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer",
              "overflow-hidden", // Change from overflow-x-auto to overflow-hidden
              error ? "border-destructive" : ""
            )}
            ref={selectedContainerRef}
            role="button"
            tabIndex={0}
          >
            {selected.length === 0 && (
              <span className="text-muted-foreground pl-2 w-full">
                {placeholder}
              </span>
            )}
            <div className="flex flex-wrap gap-1 w-full min-w-0">
              {selected.map((item) => (
                <div
                  key={item.value}
                  className="flex items-center gap-1 pl-3 pr-1 py-1 bg-secondary border border-border h-8 shrink-0 max-w-full rounded-md"
                >
                  <span className="text-foreground font-medium text-sm truncate max-w-24">
                    {item.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // Prevent form submission
                      e.stopPropagation();
                      handleRemove(item);
                    }}
                    onKeyDown={(e) => {
                      // Prevent Enter key from triggering form submission
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(item);
                      }
                    }}
                    type="button" // Explicitly set type to button to prevent form submission
                    className="p-1 rounded-full hover:bg-muted flex-shrink-0"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-full p-0 border border-border bg-popover"
          align="start"
          style={{
            width: "var(--radix-popover-trigger-width)",
            maxWidth: "var(--radix-popover-trigger-width)",
          }}
        >
          <div className="p-2 w-full rounded-md">
            <div className="flex flex-wrap gap-2 w-full">
              {options.length === 0 ? (
                <div className="w-full flex p-3 justify-center items-center text-muted-foreground">
                  No options available
                </div>
              ) : (
                options
                  .filter(
                    (option: OptionType) =>
                      !selected.some((s) => s.value === option.value)
                  )
                  .map((option: OptionType) => (
                    <button
                      key={option.value}
                      type="button" // Prevent form submission
                      className="flex items-center gap-1 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-full shrink-0 transition-colors"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent form submission
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      onKeyDown={(e) => {
                        // Prevent Enter key from triggering form submission
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSelect(option);
                        }
                      }}
                    >
                      <span className="text-foreground font-medium">
                        {option.label}
                      </span>
                    </button>
                  ))
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomMultiSelect;
