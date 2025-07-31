"use client";

import React, { useState, useEffect } from "react";
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
  const [date, setDate] = useState<Date | undefined>(undefined);

  // Get custom props from fieldConfig if available
  const placeholder =
    field.fieldConfig?.inputProps?.placeholder || "Pick a date";

  const CurrentYear = new Date().getFullYear();

  // Sync local state with form value
  useEffect(() => {
    let initialValue = value;

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

    if (initialValue) {
      let dateToSet: Date | undefined;

      if (initialValue instanceof Date) {
        dateToSet = initialValue;
      } else if (
        typeof initialValue === "string" &&
        initialValue.trim() !== ""
      ) {
        const parsedDate = new Date(initialValue);
        if (!isNaN(parsedDate.getTime())) {
          dateToSet = parsedDate;
        }
      }

      if (dateToSet) {
        setDate(dateToSet);

        // Immediately sync with form state by triggering onChange
        const syntheticEvent = {
          target: {
            value: dateToSet.toISOString(),
            name: name,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
      }
    } else {
      setDate(undefined);
    }

    // Debug logging
    if (field.key === "date_of_birth" && initialValue) {
      console.log(`DatePicker ${field.key} initialized with:`, {
        propsValue: value,
        formDataValue: initialValue,
        parsedDate: new Date(initialValue),
      });
    }
  }, [value, field.key]);

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    // Update local state
    setDate(selectedDate);

    // Create synthetic event for the form
    const syntheticEvent = {
      target: {
        value: selectedDate.toISOString(), // Send as ISO string
        name: name,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    // Notify form of the change
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
                "w-full pl-3 pr-3 text-left font-normal border border-gray-300 justify-between",
                !date && "text-muted-foreground",
                error && "border-destructive",
                props.className
              )}
              type="button"
            >
              <span className="truncate flex-1 mr-2">
                {date ? (
                  <span className="text-foreground">{format(date, "PPP")}</span>
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </span>
              <CalendarIcon className="h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border-0"
              classNames={{
                month_caption: "mx-0 ",
              }}
              captionLayout="dropdown"
              defaultMonth={date || new Date()}
              startMonth={new Date(CurrentYear - 100, 0)}
              endMonth={new Date(CurrentYear, 11)}
              hideNavigation
              components={{
                DropdownNav: (props: DropdownNavProps) => {
                  const children = React.Children.toArray(props.children);
                  return (
                    <div className="flex w-full items-center gap-2">
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
