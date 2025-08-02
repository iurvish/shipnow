import React, { useState, useEffect } from "react";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";

// Local types for this component
interface OptionType {
  label: string;
  value: string;
}

interface ConditionalOptions {
  fieldName: string;
  fn: (value: any) => Promise<OptionType[]>;
}

const SelectCommand: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { key, onChange, value, className, ...props } = inputProps;

  // Get custom props from fieldConfig
  const optionsFromConfig = field.fieldConfig?.inputProps?.options;
  const conditionalOptionsFromConfig =
    field.fieldConfig?.inputProps?.conditionalOptions;
  const label = field.fieldConfig?.label || field.key;
  const placeholderFromConfig =
    field.fieldConfig?.inputProps?.placeholder || `Select ${label}...`;
  const disabledFromConfig = field.fieldConfig?.inputProps?.disabled || false;

  // Filter out custom props that shouldn't be passed to DOM elements
  const { options, conditionalOptions, placeholder, disabled, ...domProps } =
    props;

  const [data, setData] = useState<OptionType[]>([]);
  const [open, setOpen] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState<boolean>(true);
  const [selectValue, setSelectValue] = useState<string>("");

  // Initialize value from props or from form data
  useEffect(() => {
    let initialValue = value || field.default || "";

    // If no value from props, try to get it from form data in DOM
    if (!initialValue) {
      const formElement = document.querySelector("form");
      if (formElement) {
        const formDataAttr = formElement.getAttribute("data-form-values");
        if (formDataAttr) {
          try {
            const formData = JSON.parse(formDataAttr);
            if (formData[field.key]) {
              initialValue = formData[field.key];
            }
          } catch (e) {
            // Ignore JSON parse errors
          }
        }
      }
    }

    // Only update if we have a valid value and it's different from current
    if (initialValue && initialValue !== selectValue) {
      setSelectValue(initialValue);

      // Immediately sync with form state by triggering onChange
      if (onChange) {
        const syntheticEvent = {
          target: {
            value: initialValue,
            name: field.key,
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    }
  }, [value, field.default, field.key, selectValue, onChange]);

  // Load initial options
  useEffect(() => {
    (async () => {
      if (!optionsFromConfig) return;

      setIsFetchingData(true);
      let optionsList: OptionType[] = [];

      try {
        if (typeof optionsFromConfig === "function") {
          optionsList = await optionsFromConfig();
        } else if (Array.isArray(optionsFromConfig)) {
          optionsList = optionsFromConfig;
        }
      } catch (error) {
        console.error("Error loading options:", error);
      }

      if (optionsList.length === 0) {
        setData([{ label: `No ${label} Found`, value: " " }]);
      } else {
        setData(optionsList);
      }
      setIsFetchingData(false);
    })();
  }, [optionsFromConfig, label]);

  // Handle conditional options with better change detection
  const [conditionalValue, setConditionalValue] = useState<string>("");

  // Watch for changes in conditional field
  useEffect(() => {
    if (
      !conditionalOptionsFromConfig?.fieldName ||
      typeof window === "undefined"
    )
      return;

    const updateConditionalValue = () => {
      const formElement = document.querySelector("form");
      if (formElement) {
        const input = formElement.querySelector(
          `[name="${conditionalOptionsFromConfig.fieldName}"]`
        ) as HTMLInputElement;
        const newValue = input?.value || "";
        setConditionalValue(newValue);
      }
    };

    // Initial value
    updateConditionalValue();

    // Set up observer for form changes
    const formElement = document.querySelector("form");
    if (formElement) {
      const observer = new MutationObserver(() => {
        updateConditionalValue();
      });

      observer.observe(formElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["value"],
      });

      // Also listen for input events
      const handleInput = () => updateConditionalValue();
      formElement.addEventListener("input", handleInput);
      formElement.addEventListener("change", handleInput);

      return () => {
        observer.disconnect();
        formElement.removeEventListener("input", handleInput);
        formElement.removeEventListener("change", handleInput);
      };
    }
  }, [conditionalOptionsFromConfig?.fieldName]);

  useEffect(() => {
    (async () => {
      if (!conditionalOptionsFromConfig) return;

      setIsFetchingData(true);

      try {
        const optionsList =
          await conditionalOptionsFromConfig.fn(conditionalValue);

        // Check if current value is still valid
        if (
          selectValue &&
          !optionsList.find(
            (option: OptionType) => option.value === selectValue
          )
        ) {
          setSelectValue("");
          if (onChange) {
            const syntheticEvent = {
              target: {
                value: "",
                name: field.key,
              },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
          }
        }

        if (!Array.isArray(optionsList)) {
          console.error("Conditional options function did not return an array");
          setData([{ label: `No ${label} Found`, value: " " }]);
        } else if (optionsList.length === 0) {
          setData([{ label: `No ${label} Found`, value: " " }]);
        } else {
          setData(optionsList);
        }
      } catch (error) {
        console.error("Error loading conditional options:", error);
        setData([{ label: `No ${label} Found`, value: " " }]);
      }

      setIsFetchingData(false);
    })();
  }, [
    conditionalValue,
    conditionalOptionsFromConfig,
    selectValue,
    onChange,
    field.key,
    label,
  ]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === selectValue ? "" : currentValue;
    setSelectValue(newValue);

    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue,
          name: field.key,
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }

    setOpen(false);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="w-full" asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabledFromConfig}
            className={cn(
              "w-full justify-between bg-background px-3 font-normal outline-offset-0 hover:bg-background focus-visible:border-ring focus-visible:outline-[3px] focus-visible:outline-ring/20",
              className
            )}
          >
            <span
              className={cn(
                "truncate",
                !selectValue && "text-muted-foreground"
              )}
            >
              {selectValue
                ? data.find((item) => item.value === selectValue)?.label
                : placeholderFromConfig}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popper-anchor-width)] border-input p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={`Search ${label}...`} />
            <CommandList>
              <CommandEmpty>No {label} found.</CommandEmpty>
              <CommandGroup>
                {isFetchingData ? (
                  <CommandItem>Loading...</CommandItem>
                ) : (
                  data.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.value}
                      onSelect={handleSelect}
                    >
                      {item.label}
                      {selectValue === item.value && (
                        <Check size={16} strokeWidth={2} className="ml-auto" />
                      )}
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}

      {/* Hidden input for form submission */}
      <input type="hidden" name={field.key} value={selectValue} {...domProps} />
    </div>
  );
};

export default SelectCommand;
