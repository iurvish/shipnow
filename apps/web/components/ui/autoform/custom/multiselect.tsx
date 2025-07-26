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
  const { key, onChange, value, ...props } = inputProps;

  // Get custom props from fieldConfig
  const options = field.fieldConfig?.inputProps?.options || [];
  const placeholder =
    field.fieldConfig?.inputProps?.placeholder || "Select options...";
  const maxSelections = field.fieldConfig?.inputProps?.maxSelections;

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<OptionType[]>([]);
  const selectedContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState("100%");

  useEffect(() => {
    // Set initial selected values
    const initialValues = value || [];
    const initialSelected = options.filter((option: OptionType) =>
      initialValues.includes(option.value)
    );
    setSelected(initialSelected);
  }, [value, options]);

  useEffect(() => {
    if (selectedContainerRef.current) {
      selectedContainerRef.current.scrollTo({
        left: selectedContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  }, [selected]);

  useEffect(() => {
    if (open && selectedContainerRef.current) {
      setContainerWidth(`${selectedContainerRef.current.offsetWidth}px`);
    }
  }, [open]);

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
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild className="w-full">
          <div
            className={cn(
              "w-full flex items-center justify-start gap-1.5 h-10 rounded-md border border-input bg-background p-1 text-base ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm no-scrollbar cursor-pointer",
              "overflow-x-auto no-scrollbar",
              error ? "border-destructive" : ""
            )}
            style={{ borderRadius: 8 }}
            ref={selectedContainerRef}
          >
            {selected.length === 0 && (
              <span className="text-muted-foreground pl-2">{placeholder}</span>
            )}
            {selected.map((item) => (
              <div
                key={item.value}
                className="flex items-center gap-1 pl-3 pr-1 py-1 bg-white shadow-sm border h-full shrink-0"
                style={{ borderRadius: 6 }}
              >
                <span className="text-gray-700 font-medium">{item.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item);
                  }}
                  className="p-1 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </PopoverTrigger>

        <PopoverContent
          forceMount
          className="w-full custom-popover-content p-0"
          align="start"
          style={{
            width: containerWidth,
            maxWidth: "none",
          }}
        >
          <div
            className="bg-white shadow-sm p-2 border w-full"
            style={{ borderRadius: 8 }}
          >
            <div className="flex flex-wrap gap-2 w-full">
              {options.length === 0 ? (
                <div className="w-full flex p-3 justify-center items-center">
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
                      className="flex items-center gap-1 px-4 py-2.5 bg-gray-100/60 rounded-full shrink-0"
                      onClick={() => handleSelect(option)}
                      style={{ borderRadius: 14 }}
                    >
                      <span className="text-gray-700 font-medium">
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
