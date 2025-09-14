"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getSkillByValue } from "@/lib/config/skills";

interface OptionType {
  label: string;
  value: string;
  category?: string;
}

interface FormSearchMultiSelectProps {
  placeholder?: string;
  options: OptionType[];
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  maxSelections?: number;
}

const FormSearchMultiSelect = forwardRef<
  HTMLDivElement,
  FormSearchMultiSelectProps
>(
  (
    {
      placeholder = "Select options...",
      options,
      disabled,
      value = [],
      onChange,
      className,
      maxSelections,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const selectedContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selected = options.filter((option) => value.includes(option.value));

    const handleSelect = (item: OptionType) => {
      if (maxSelections && selected.length >= maxSelections) {
        return;
      }
      const updatedValues = [...value, item.value];
      onChange?.(updatedValues);
      setSearchValue("");
    };

    const handleRemove = (item: OptionType) => {
      const updatedValues = value.filter((v) => v !== item.value);
      onChange?.(updatedValues);

      if (updatedValues.length === 0) {
        setOpen(false);
      }
    };

    const filteredOptions = options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchValue.toLowerCase()) &&
        !value.includes(option.value)
    );

    const groupedOptions = filteredOptions.reduce(
      (acc, option) => {
        const category = option.category || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(option);
        return acc;
      },
      {} as Record<string, OptionType[]>
    );

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            ref={ref}
            className={cn(
              "flex min-h-10 w-full flex-wrap items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            {...props}
          >
            <div className="flex flex-wrap gap-1.5 flex-grow">
              {selected.map((item) => (
                <Badge
                  key={item.value}
                  variant="secondary"
                  className="h-6 px-2 py-4 text-base flex items-center gap-0.5 "
                >
                  {item.label}
                  {!disabled && (
                    <button
                      type="button"
                      className=" rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
              {selected.length === 0 && (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>

            {selected.length === 0 && (
              <ChevronDown className="h-4 w-4 opacity-50" />
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <div className="p-2 border-b">
            <Input
              ref={searchInputRef}
              placeholder="Search options..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-8"
            />
          </div>
          <ScrollArea className="max-h-60">
            <div className="p-3 space-y-4">
              {Object.entries(groupedOptions).map(
                ([category, categoryOptions]) => (
                  <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      {category}
                    </p>
                    <ScrollArea className="max-h-32">
                      <div className="flex flex-wrap gap-3 py-1.5 ">
                        {categoryOptions.map((option) => (
                          <Badge
                            key={option.value}
                            variant="outline"
                            className={cn(
                              "h-9 px-4 py-2 text-base cursor-pointer transition-all duration-200",
                              "bg-muted hover:bg-accent text-foreground border-border",
                              "hover:border-ring hover:shadow-sm  ",
                              maxSelections && selected.length >= maxSelections
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            )}
                            onClick={() => {
                              if (
                                !(
                                  maxSelections &&
                                  selected.length >= maxSelections
                                )
                              ) {
                                handleSelect(option);
                              }
                            }}
                          >
                            {option.label}
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )
              )}
              {Object.keys(groupedOptions).length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No options found
                </div>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    );
  }
);

FormSearchMultiSelect.displayName = "FormSearchMultiSelect";

export default FormSearchMultiSelect;
export { FormSearchMultiSelect };
