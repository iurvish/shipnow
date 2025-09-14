"use client";

import React, { useState, forwardRef } from "react";
import { X, Search, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OptionType {
  label: string;
  value: string;
}

interface FormSearchMultiSelectProps {
  placeholder?: string;
  options: OptionType[];
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
}

const FormSearchMultiSelect = forwardRef<HTMLButtonElement, FormSearchMultiSelectProps>(
  ({ placeholder = "Select options...", options, disabled, value = [], onChange, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const selectedOptions = options.filter((option) =>
      value.includes(option.value)
    );

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !value.includes(option.value)
    );

    const handleSelect = (optionValue: string) => {
      if (onChange) {
        const newValue = [...value, optionValue];
        onChange(newValue);
      }
      setSearchTerm("");
    };

    const handleRemove = (optionValue: string) => {
      if (onChange) {
        const newValue = value.filter((v) => v !== optionValue);
        onChange(newValue);
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
            disabled={disabled}
            {...props}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedOptions.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : (
                selectedOptions.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                  >
                    {option.label}
                    <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 p-0 focus-visible:ring-0"
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No options found.
              </div>
            ) : (
              <div className="p-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

FormSearchMultiSelect.displayName = "FormSearchMultiSelect";

export { FormSearchMultiSelect };