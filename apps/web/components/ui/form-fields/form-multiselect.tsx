"use client";

import React, { useState, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface OptionType {
  label: string;
  value: string;
}

interface FormMultiSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options: OptionType[];
  className?: string;
  required?: boolean;
  disabled?: boolean;
  maxSelections?: number;
}

export const FormMultiSelect: React.FC<FormMultiSelectProps> = ({
  name,
  label,
  placeholder = "Select options...",
  options,
  className,
  required = false,
  disabled = false,
  maxSelections,
}) => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const selectedValues = field.value || [];
        const selectedOptions = options.filter((option) =>
          selectedValues.includes(option.value)
        );

        const handleSelect = (option: OptionType) => {
          if (maxSelections && selectedValues.length >= maxSelections) {
            return;
          }
          const newValues = [...selectedValues, option.value];
          field.onChange(newValues);
        };

        const handleRemove = (option: OptionType) => {
          const newValues = selectedValues.filter(
            (value: string) => value !== option.value
          );
          field.onChange(newValues);

          if (newValues.length === 0) {
            setOpen(false);
          }
        };

        return (
          <FormItem className={className}>
            <FormLabel
              className={
                required
                  ? "after:content-['*'] after:ml-0.5 after:text-red-500"
                  : ""
              }
            >
              {label}
            </FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "w-full min-w-0 flex items-center justify-start gap-1.5 min-h-10 rounded-md border border-input bg-input/30 p-1 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm cursor-pointer",
                      "overflow-hidden",
                      error ? "border-destructive" : "",
                      disabled && "opacity-50 cursor-not-allowed"
                    )}
                    ref={selectedContainerRef}
                    role="button"
                    tabIndex={0}
                  >
                    {selectedOptions.length === 0 && (
                      <span className="text-muted-foreground pl-2 w-full">
                        {placeholder}
                      </span>
                    )}

                    {selectedOptions.map((item) => (
                      <div
                        key={item.value}
                        className="flex items-center gap-1.5 bg-secondary text-secondary-foreground rounded px-2 py-1 text-xs font-medium shrink-0 max-w-32"
                      >
                        <span className="truncate">{item.label}</span>
                        {!disabled && (
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item);
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full p-0"
                  style={{ width: selectedContainerRef.current?.offsetWidth }}
                  onOpenAutoFocus={(e) => {
                    if (isMobile) {
                      e.preventDefault();
                    }
                  }}
                >
                  <div className="max-h-60 overflow-auto">
                    {options
                      .filter(
                        (option) => !selectedValues.includes(option.value)
                      )
                      .map((option) => (
                        <div
                          key={option.value}
                          className="flex items-center space-x-2 p-2 hover:bg-accent cursor-pointer"
                          onClick={() => handleSelect(option)}
                        >
                          <span>{option.label}</span>
                        </div>
                      ))}

                    {options.filter(
                      (option) => !selectedValues.includes(option.value)
                    ).length === 0 && (
                      <div className="p-4 text-center text-muted-foreground">
                        {selectedOptions.length === 0
                          ? "No options available"
                          : "All options selected"}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
