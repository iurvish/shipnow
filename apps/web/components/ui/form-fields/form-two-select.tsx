"use client";

import { useState, useEffect, forwardRef } from "react";
import { FormCommandSelect } from "./form-command-select";
import { cn } from "@/lib/utils";

interface OptionType {
  label: string;
  value: string;
}

interface FormTwoSelectProps {
  firstSelectLabel?: string;
  secondSelectLabel?: string;
  firstSelectPlaceholder?: string;
  secondSelectPlaceholder?: string;
  firstSelectOptions: OptionType[] | (() => Promise<OptionType[]>);
  getSecondOptions?: (
    firstValue: string
  ) => Promise<OptionType[]> | OptionType[];
  className?: string;
  disabled?: boolean;
  value?: {
    first: string;
    second: string;
  };
  onChange?: (value: { first: string; second: string }) => void;
  error?: string;
  layout?: "stacked" | "inline"; // New prop for layout control
  showCombinedLabel?: boolean; // Control whether to show combined label
}

const FormTwoSelect = forwardRef<HTMLDivElement, FormTwoSelectProps>(
  (
    {
      firstSelectLabel = "Select Category",
      secondSelectLabel = "Select Option",
      firstSelectPlaceholder = "Choose category...",
      secondSelectPlaceholder = "Choose option...",
      firstSelectOptions,
      getSecondOptions,
      className,
      disabled = false,
      value,
      onChange,
      error,
      layout = "inline", // Default to inline layout like your original
      showCombinedLabel = false,
      ...props
    },
    ref
  ) => {
    const [firstOptions, setFirstOptions] = useState<OptionType[]>([]);
    const [secondOptions, setSecondOptions] = useState<OptionType[]>([]);
    const [loadingFirst, setLoadingFirst] = useState(false);
    const [loadingSecond, setLoadingSecond] = useState(false);

    const firstValue = value?.first || "";
    const secondValue = value?.second || "";

    // Load first options if they're provided as a function
    useEffect(() => {
      if (typeof firstSelectOptions === "function") {
        setLoadingFirst(true);
        Promise.resolve(firstSelectOptions())
          .then((options) => {
            setFirstOptions(options);
          })
          .catch((error) => {
            console.error("Error loading first options:", error);
            setFirstOptions([]);
          })
          .finally(() => {
            setLoadingFirst(false);
          });
      } else {
        setFirstOptions(firstSelectOptions || []);
      }
    }, [firstSelectOptions]);

    // Load second options when first value changes
    useEffect(() => {
      if (firstValue && getSecondOptions) {
        setLoadingSecond(true);
        Promise.resolve(getSecondOptions(firstValue))
          .then((options) => {
            setSecondOptions(options);
            // Reset second field when first changes if current second value is not in new options
            if (
              secondValue &&
              !options.find((opt) => opt.value === secondValue)
            ) {
              onChange?.({
                first: firstValue,
                second: "",
              });
            }
          })
          .catch((error) => {
            console.error("Error loading second options:", error);
            setSecondOptions([]);
          })
          .finally(() => {
            setLoadingSecond(false);
          });
      } else {
        setSecondOptions([]);
        // Reset second field when first is empty
        if (secondValue) {
          onChange?.({
            first: firstValue,
            second: "",
          });
        }
      }
    }, [firstValue, getSecondOptions, secondValue, onChange]);

    const handleFirstChange = (newFirstValue: string) => {
      onChange?.({
        first: newFirstValue,
        second: "", // Reset second value when first changes
      });
    };

    const handleSecondChange = (newSecondValue: string) => {
      onChange?.({
        first: firstValue,
        second: newSecondValue,
      });
    };

    // Inline layout (side by side)
    if (layout === "inline") {
      return (
        <div ref={ref} className={cn("space-y-2 w-full", className)} {...props}>
          {/* Combined Label */}
          {showCombinedLabel && (
            <label className="text-sm font-medium block">
              <span className="truncate">
                {firstSelectLabel} & {secondSelectLabel}
              </span>
            </label>
          )}

          <div className="grid grid-cols-2 overflow-hidden">
            {/* First Select */}
            <div className="flex-1 min-w-0 overflow-hidden">
              {loadingFirst ? (
                <div className="h-10 bg-input/30 animate-pulse rounded-r-none border border-r-[0.5px] border-r-border flex items-center justify-center opacity-30 cursor-not-allowed">
                  <span className="text-sm text-muted-foreground truncate px-3">
                    Loading...
                  </span>
                </div>
              ) : (
                <FormCommandSelect
                  placeholder={firstSelectPlaceholder}
                  options={firstOptions}
                  disabled={disabled || loadingFirst}
                  value={firstValue}
                  onValueChange={handleFirstChange}
                  className="rounded-r-none border-r-[0.5px] border-r-border focus:border-r-ring focus-visible:ring-offset-0"
                />
              )}
            </div>

            {/* Second Select */}
            <div className=" min-w-0 overflow-hidden">
              {loadingSecond ? (
                <div className="h-10 bg-input/30 animate-pulse rounded-l-none border border-l-[0.5px] border-l-border flex items-center justify-center opacity-30 cursor-not-allowed">
                  <span className="text-sm text-muted-foreground truncate px-3">
                    Loading...
                  </span>
                </div>
              ) : (
                <FormCommandSelect
                  placeholder={
                    !firstValue
                      ? `First select ${firstSelectLabel.toLowerCase()}`
                      : secondSelectPlaceholder
                  }
                  options={secondOptions}
                  disabled={disabled || loadingSecond || !firstValue}
                  value={secondValue}
                  onValueChange={handleSecondChange}
                  className={cn(
                    "rounded-l-none border-l-[0.5px] border-l-border focus:border-l-ring focus-visible:ring-offset-0",
                    (!firstValue || disabled || loadingSecond) &&
                      "opacity-30 cursor-not-allowed bg-input/30"
                  )}
                />
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm font-medium text-destructive truncate">
              {error}
            </p>
          )}
        </div>
      );
    }

    // Stacked layout (vertical)
    return (
      <div ref={ref} className={cn("space-y-4 w-full", className)} {...props}>
        <div className="space-y-2">
          {firstSelectLabel && (
            <label className="text-sm font-medium">{firstSelectLabel}</label>
          )}
          {loadingFirst ? (
            <div className="h-10 bg-input/30 animate-pulse rounded border flex items-center justify-center opacity-30 cursor-not-allowed">
              <span className="text-sm text-muted-foreground truncate px-3">
                Loading...
              </span>
            </div>
          ) : (
            <FormCommandSelect
              placeholder={firstSelectPlaceholder}
              options={firstOptions}
              disabled={disabled || loadingFirst}
              value={firstValue}
              onValueChange={handleFirstChange}
            />
          )}
        </div>

        <div className="space-y-2">
          {secondSelectLabel && (
            <label className="text-sm font-medium">{secondSelectLabel}</label>
          )}
          {loadingSecond ? (
            <div className="h-10 bg-input/30 animate-pulse rounded border flex items-center justify-center opacity-30 cursor-not-allowed">
              <span className="text-sm text-muted-foreground truncate px-3">
                Loading...
              </span>
            </div>
          ) : (
            <FormCommandSelect
              placeholder={
                !firstValue
                  ? `First select ${firstSelectLabel.toLowerCase()}`
                  : secondSelectPlaceholder
              }
              options={secondOptions}
              disabled={disabled || loadingSecond || !firstValue}
              value={secondValue}
              onValueChange={handleSecondChange}
              className={cn(
                (!firstValue || disabled || loadingSecond) &&
                  "opacity-30 cursor-not-allowed bg-input/30"
              )}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm font-medium text-destructive truncate">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormTwoSelect.displayName = "FormTwoSelect";

export { FormTwoSelect, type OptionType };
