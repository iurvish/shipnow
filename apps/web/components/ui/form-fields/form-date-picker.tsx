"use client";

import React, { forwardRef, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DropdownNavProps, DropdownProps } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormDatePickerProps {
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const FormDatePicker = forwardRef<HTMLButtonElement, FormDatePickerProps>(
  (
    {
      placeholder = "Pick a date",
      disabled,
      value,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const selectedDate = value ? new Date(value) : undefined;

    const handleDateSelect = (date: Date | undefined) => {
      if (date && onChange) {
        onChange(format(date, "yyyy-MM-dd"));
      }
    };

    const handleCalendarChange = (
      _value: string | number,
      _e: React.ChangeEventHandler<HTMLSelectElement>
    ) => {
      const _event = {
        target: {
          value: String(_value),
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      _e(_event);
    };

    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-full justify-between text-left font-normal",
              !selectedDate && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            {...props}
          >
            {selectedDate ? format(selectedDate, "PPP") : placeholder}

            <CalendarIcon className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border p-2"
            classNames={{
              month_caption: "mx-0",
            }}
            captionLayout="dropdown"
            defaultMonth={selectedDate || new Date()}
            startMonth={new Date(1980, 6)}
            hideNavigation
            components={{
              DropdownNav: (props: DropdownNavProps) => {
                return (
                  <div className="flex w-full items-center gap-2">
                    {props.children}
                  </div>
                );
              },
              Dropdown: (props: DropdownProps) => {
                return (
                  <Select
                    value={String(props.value)}
                    onValueChange={(value) => {
                      if (props.onChange) {
                        handleCalendarChange(value, props.onChange);
                      }
                    }}
                  >
                    <SelectTrigger className="h-8 w-fit font-medium first:grow">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                      {props.options?.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              },
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

FormDatePicker.displayName = "FormDatePicker";

export { FormDatePicker };
