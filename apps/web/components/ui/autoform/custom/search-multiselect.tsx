"use client";

import type * as React from "react";
import { useEffect, useRef, useState } from "react";
import { X, Search } from "lucide-react";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { getSkillByValue, SkillCategory } from "@/lib/config/skills";

interface OptionType {
  label: string;
  value: string;
  category?: string;
}

const CustomSearchMultiSelect: React.FC<AutoFormFieldProps> = ({
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
  const [searchValue, setSearchValue] = useState<string>("");
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Set initial selected values from current value (for form persistence)
    let currentValues = Array.isArray(value) ? value : [];

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

      // Immediately sync with form state by triggering onChange
      if (currentValues.length > 0) {
        const syntheticEvent = {
          target: {
            value: currentValues,
            name: field.key,
          },
        } as any;
        onChange?.(syntheticEvent);
      }

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

    // Clear search when item is selected
    setSearchValue("");
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

  // Filter and group options
  const filteredAndGroupedOptions = () => {
    // First filter by search
    const availableOptions = options.filter(
      (option: OptionType) =>
        !selected.some((s) => s.value === option.value) &&
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    // Check if we should group by categories (for skills)
    const shouldGroupByCategory =
      field.key === "skills" ||
      (field.fieldConfig?.label &&
        typeof field.fieldConfig.label === "string" &&
        field.fieldConfig.label.toLowerCase().includes("skill"));

    if (shouldGroupByCategory) {
      // Group by categories
      const categorizedOptions: { [key: string]: OptionType[] } = {};
      const uncategorizedOptions: OptionType[] = [];

      availableOptions.forEach((option: OptionType) => {
        const skill = getSkillByValue(option.value);
        if (skill) {
          const categoryName = skill.category.replace("_", " ").toUpperCase();
          if (!categorizedOptions[categoryName]) {
            categorizedOptions[categoryName] = [];
          }
          categorizedOptions[categoryName].push({
            ...option,
            category: skill.category,
          });
        } else {
          uncategorizedOptions.push(option);
        }
      });

      return { categorizedOptions, uncategorizedOptions, shouldGroup: true };
    }

    return { availableOptions, shouldGroup: false };
  };

  // Focus search input when popover opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Reset search when popover closes
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

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
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder={`Search ${field.fieldConfig?.label || "options"}...`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>

          <ScrollArea className="h-[280px] md:h-[360px]">
            <div className="p-2">
              {(() => {
                const {
                  categorizedOptions,
                  uncategorizedOptions,
                  availableOptions,
                  shouldGroup,
                } = filteredAndGroupedOptions();

                if (shouldGroup && categorizedOptions) {
                  // Render categorized groups
                  const hasResults =
                    Object.keys(categorizedOptions).length > 0 ||
                    uncategorizedOptions!.length > 0;

                  if (!hasResults) {
                    return (
                      <div className="text-center p-8 text-muted-foreground">
                        No options found matching "{searchValue}"
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {Object.entries(categorizedOptions).map(
                        ([category, items]) => (
                          <div key={category}>
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                              {category}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {items.map((option: OptionType) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  className="flex items-center gap-1 px-3 py-2 bg-secondary/60 hover:bg-secondary rounded-full text-sm transition-colors"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSelect(option);
                                  }}
                                >
                                  <span className="text-foreground font-medium">
                                    {option.label}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                      {uncategorizedOptions!.length > 0 && (
                        <div>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
                            OTHER
                          </div>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {uncategorizedOptions!.map((option: OptionType) => (
                              <button
                                key={option.value}
                                type="button"
                                className="flex items-center gap-1 px-3 py-2 bg-secondary/60 hover:bg-secondary rounded-full text-sm transition-colors"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSelect(option);
                                }}
                              >
                                <span className="text-foreground font-medium">
                                  {option.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Render ungrouped options
                  const filtered = availableOptions as OptionType[];

                  if (filtered.length === 0) {
                    return (
                      <div className="text-center p-8 text-muted-foreground">
                        {searchValue
                          ? `No options found matching "${searchValue}"`
                          : "No options available"}
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-wrap gap-2">
                      {filtered.map((option: OptionType) => (
                        <button
                          key={option.value}
                          type="button"
                          className="flex items-center gap-1 px-3 py-2 bg-secondary/60 hover:bg-secondary rounded-full text-sm transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSelect(option);
                          }}
                        >
                          <span className="text-foreground font-medium">
                            {option.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                }
              })()}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CustomSearchMultiSelect;
