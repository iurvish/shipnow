"use client";

import React, { useState } from "react";
import { AutoFormFieldProps } from "@autoform/react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../../button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../../calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownNavProps, DropdownProps } from "react-day-picker";

const CustomDatePicker: React.FC<AutoFormFieldProps> = ({
  inputProps,
  error,
  id,
  field,
}) => {
  const { onChange, value, name, ...props } = inputProps;
  const [open, setOpen] = useState(false);

  // Debug logging - remove in production
  console.log("DatePicker Debug:", {
    value,
    name,
    type: typeof value,
    dateObj: value instanceof Date ? value : null,
  });

  // Get custom props from fieldConfig if available
  const placeholder =
    field.fieldConfig?.inputProps?.placeholder || "Pick a date";
  const label = field.fieldConfig?.label;

  const CurrentYear = new Date().getFullYear();

  // Better date parsing - handle both string and Date objects
  let dateValue: Date | undefined = undefined;
  if (value !== undefined && value !== null && value !== "") {
    if (value instanceof Date) {
      dateValue = isNaN(value.getTime()) ? undefined : value;
    } else if (typeof value === "string" && value.trim() !== "") {
      // Handle various date string formats
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        dateValue = parsedDate;
      }
    }
  }

  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    // Try sending both formats to see which one works
    const isoString = date.toISOString();
    const formattedDate = format(date, "yyyy-MM-dd");

    // Create synthetic event
    const syntheticEvent = {
      target: {
        value: isoString, // Try ISO string first
        name: name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    console.log("Sending date to onChange:", {
      date,
      isoString,
      formattedDate,
    });
    onChange?.(syntheticEvent);
    setOpen(false);
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
    <div className="space-y-2">
      <div className="flex flex-col">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id={id}
              variant={"outline"}
              className={cn(
                "w-full pl-3 text-left font-normal border border-gray-300 justify-start",
                !dateValue && "text-muted-foreground",
                error && "border-destructive",
                props.className
              )}
              type="button" // Prevent form submission
            >
              {dateValue ? (
                <span className="text-foreground">
                  {format(dateValue, "PPP")}
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateValue}
              onSelect={handleDateChange}
              className="rounded-md border-0"
              classNames={{
                month_caption: "mx-0 px-3 pt-3",
              }}
              captionLayout="dropdown"
              defaultMonth={dateValue || new Date()}
              startMonth={new Date(CurrentYear - 100, 0)}
              endMonth={new Date(CurrentYear, 11)}
              hideNavigation
              components={{
                DropdownNav: (props: DropdownNavProps) => {
                  const children = React.Children.toArray(props.children);
                  return (
                    <div className="flex w-full items-center gap-2 px-3 pt-3">
                      <div className="flex-1">
                        {children[0]} {/* Month dropdown - full width */}
                      </div>
                      <div className="w-fit">
                        {children[1]} {/* Year dropdown - fit width */}
                      </div>
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
                      <SelectTrigger className="h-8 w-full font-medium">
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
        {error && (
          <p className="text-sm font-medium text-destructive">{error}</p>
        )}
      </div>
    </div>
  );
};

export default CustomDatePicker;
