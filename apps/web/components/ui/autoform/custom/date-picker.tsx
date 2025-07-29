"use client";
import React, { useEffect, useState } from "react";
import { InputFieldProps } from "@/utils/types";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DropdownProps, CaptionProps } from "react-day-picker";

const CustomDatePicker = (props: InputFieldProps) => {
  const CurrentYear = new Date().getFullYear();

  return (
    <FormField
      control={props.control}
      name={props.name as any}
      render={({ field }) => {
        const value = field.value || props.defaultValue;

        return (
          <div
            className={cn(
              "space-y-2 ",
              props.cns?.container,
              props.className
            )}
          >
            <FormItem className={cn("flex flex-col", props.cns?.formItem)}>
              <FormLabel className={cn(props.cns?.label)}>
                {props.label}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal border border-gray-300",
                      !value && "text-muted-foreground",
                      props.cns?.input
                    )}
                  >
                    {value ? (
                      format(value, "PPP")
                    ) : (
                      <span>{props.placeholder}</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="min-w-fit p-0" align="start">
                  <Calendar
                    captionLayout="dropdown"
                    fromYear={CurrentYear - 100}
                    toYear={CurrentYear}
                    mode="single"
                    selected={value}
                    onSelect={field.onChange}
                    month={
                      value
                        ? new Date(value.getFullYear(), value.getMonth())
                        : undefined
                    }
                    initialFocus
                    components={{
                      Caption: ({ displayMonth }: CaptionProps) => {
                        const handleMonthChange = (newMonth: string) => {
                          const month = parseInt(newMonth);
                          const newDate = new Date(
                            displayMonth.getFullYear(),
                            month,
                            Math.min(displayMonth.getDate(), 31)
                          );
                          if (!isNaN(newDate.getTime())) {
                            field.onChange(newDate);
                          }
                        };

                        const handleYearChange = (newYear: string) => {
                          const year = parseInt(newYear);
                          const newDate = new Date(
                            year,
                            displayMonth.getMonth(),
                            Math.min(displayMonth.getDate(), 31)
                          );
                          if (!isNaN(newDate.getTime())) {
                            field.onChange(newDate);
                          }
                        };

                        return (
                          <div className="flex w-full items-center gap-2">
                            {/* Month Select */}

                            <Select
                              value={String(displayMonth.getMonth())}
                              onValueChange={handleMonthChange}
                            >
                              <SelectTrigger className="h-8 w-fit font-medium first:grow  ">
                                <SelectValue>
                                  {displayMonth.toLocaleString("default", {
                                    month: "long",
                                  })}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i} value={String(i)}>
                                    {new Date(0, i).toLocaleString("default", {
                                      month: "long",
                                    })}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Year Select */}
                            <Select
                              value={String(displayMonth.getFullYear())}
                              onValueChange={handleYearChange}
                            >
                              <SelectTrigger className="h-8 w-fit font-medium">
                                <SelectValue>
                                  {displayMonth.getFullYear()}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  {
                                    length:
                                      CurrentYear - (CurrentYear - 100) + 1,
                                  },
                                  (_, i) => CurrentYear - i
                                ).map((year) => (
                                  <SelectItem key={year} value={String(year)}>
                                    {year}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      },
                    }}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </div>
        );
      }}
    />
  );
};

export default CustomDatePicker;
