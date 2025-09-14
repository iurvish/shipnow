"use client";

import React, { useState, forwardRef } from "react";
import { Check, ChevronDown } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface OptionType {
  label: string;
  value: string;
}

interface FormCommandSelectProps {
  placeholder?: string;
  options: OptionType[];
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onValueChange?: (value: string) => void;
  className?: string;
}

const FormCommandSelect = forwardRef<HTMLButtonElement, FormCommandSelectProps>(
  (
    {
      placeholder = "Select option...",
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
    const [open, setOpen] = useState(false);

    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (selectedValue: string) => {
      const newValue = selectedValue === value ? "" : selectedValue;
      if (onChange) onChange(newValue);
      if (onValueChange) onValueChange(newValue);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
            {...props}
          >
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-full w-auto p-0"
          align="start"
          side="bottom"
          sideOffset={4}
          style={{
            width: "var(--radix-popover-trigger-width)",
            maxWidth: "var(--radix-popover-trigger-width)",
          }}
        >
          <Command className="min-w-full">
            <CommandInput placeholder="Search..." />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    className="flex items-center justify-between"
                  >
                    <span>{option.label}</span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

FormCommandSelect.displayName = "FormCommandSelect";

export { FormCommandSelect };
