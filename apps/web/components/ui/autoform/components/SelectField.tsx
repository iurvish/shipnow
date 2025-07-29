import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutoFormFieldProps } from "@autoform/react";
import React from "react";

export const SelectField: React.FC<AutoFormFieldProps> = ({
  field,
  inputProps,
  error,
  id,
}) => {
  const { key, ...props } = inputProps;

  // Get options from field.options or create from enum values
  const getOptions = (): [string, string][] => {
    if (field.options && Array.isArray(field.options)) {
      return field.options as [string, string][];
    }
    
    // For enum fields, create proper labels
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

    const labelMap = enumLabels[field.key];
    if (labelMap) {
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
        <SelectValue placeholder={inputProps.placeholder || "Select an option"} />
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
