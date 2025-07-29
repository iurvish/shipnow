import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutoFormFieldProps } from "@autoform/react";
import React from "react";

// Mapping for enum values to display labels
const enumLabels: Record<string, Record<string, string>> = {
  degree_level: {
    associate: "Associate Degree",
    bachelor: "Bachelor's Degree",
    master: "Master's Degree",
    doctorate: "Doctorate/PhD",
    bootcamp: "Bootcamp",
    self_taught: "Self-Taught",
  },
  experience_level: {
    beginner: "Beginner (0-1 years)",
    intermediate: "Intermediate (1-3 years)",
    advanced: "Advanced (3-5 years)",
    expert: "Expert (5+ years)",
  },
};

export const CustomSelectField: React.FC<AutoFormFieldProps> = ({
  field,
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;

  // Get enum options or fallback to field.options
  const getOptions = (): [string, string][] => {
    if (field.options) {
      return field.options as [string, string][];
    }

    // For enum fields, create options from known mappings
    const labelMap = enumLabels[field.key] || {};

    // If we have a label mapping, use it
    if (Object.keys(labelMap).length > 0) {
      return Object.entries(labelMap);
    }

    return [];
  };

  const options = getOptions();

  return (
    <Select
      {...props}
      onValueChange={(value) => {
        const syntheticEvent = {
          target: {
            value,
            name: field.key,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        props.onChange(syntheticEvent);
      }}
      defaultValue={field.default}
    >
      <SelectTrigger id={id} className={error ? "border-destructive" : ""}>
        <SelectValue
          placeholder={inputProps.placeholder || "Select an option"}
        />
      </SelectTrigger>
      <SelectContent>
        {options.map(([key, label]: [string, string]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
